// controllers/placeController.ts
import axios from 'axios';
import { Request, Response, NextFunction } from 'express';
import { config } from '../config';
import { logger } from '../utils/logger';

interface TextSearchPlace {
  name: string;
  formatted_address: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
  photos?: Array<{
    photo_reference: string;
    width: number;
    height: number;
  }>;
}

interface DirectionRoute {
  legs: Array<{
    start_address: string;
    end_address: string;
    steps: Array<{
      distance: { text: string; value: number };
      duration: { text: string; value: number };
    }>;
  }>;
}

function isError(error: any): error is Error {
  return error instanceof Error;
}

export const searchPlacesByText = async (req: Request, res: Response, next: NextFunction) => {
  const { query, location, radius } = req.query;

  if (!query) {
    return res.status(400).json({ error: 'Query is required for text search' });
  }

  try {
    const response = await axios.get<{ results: TextSearchPlace[] }>(
      'https://maps.googleapis.com/maps/api/place/textsearch/json',
      {
        params: {
          query,  // e.g., "restaurants in New York"
          location, // Optional, e.g., "1.283366,103.860718"
          radius,  // Optional, e.g., 1500 (radius in meters)
          key: config.db.googleMapsApiKey,
        },
      }
    );

    res.json(response.data.results); // Return the search results
  } catch (error) {
    logger.error(`Failed to search places by text: ${error.message}`);
    res.status(500).json({ error: 'Failed to search places' });
  }
};

export const getPlacePhoto = async (req: Request, res: Response, next: NextFunction) => {
  const { photo_reference, maxwidth, maxheight } = req.query;

  if (!photo_reference) {
    return res.status(400).json({ error: 'Photo reference is required' });
  }

  try {
    // Construct the URL for the place photo
    const photoUrl = 'https://maps.googleapis.com/maps/api/place/photo';

    const response = await axios.get(photoUrl, {
      responseType: 'arraybuffer',  // To handle image binary data
      params: {
        photoreference: photo_reference, // Get from textsearch api
        maxwidth: maxwidth || 400,  // Default to 400px if not provided
        maxheight: maxheight || 400, // Default to 400px if not provided
        key: config.db.googleMapsApiKey,
      },
    });

    // Set appropriate headers for the image response
    res.set('Content-Type', 'image/jpeg');
    res.send(response.data);  // Send the binary image data
  } catch (error) {
    logger.error(`Failed to fetch place photo: ${error.message}`);
    res.status(500).json({ error: 'Failed to fetch place photo' });
  }
};

export const getDirections = async (req: Request, res: Response, next: NextFunction) => {
  const { origin, destination } = req.query;

  if (!origin || !destination) {
    return res.status(400).json({ error: 'Origin and destination are required parameters.' });
  }

  try {
    const response = await axios.get<{ routes: DirectionRoute[] }>('https://maps.googleapis.com/maps/api/directions/json', {
      params: {
        origin,
        destination,
        key: config.db.googleMapsApiKey,
      },
    });

    res.json({ directions: response.data.routes });
  } catch (error) {
    const message = isError(error) ? error.message : 'Unknown error occurred';
    logger.error(`Failed to fetch directions: ${message}`);
    res.status(500).json({ error: 'Failed to fetch directions due to an internal error.' });
  }
};
