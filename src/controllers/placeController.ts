import axios from 'axios';
import { Request, Response, NextFunction } from 'express';
import { config } from '../config';
import { logger } from '../utils/logger';

// Interface for the text search results
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
  // Add other necessary fields based on the Google API response structure
}

// Controller to perform text search for places
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

// Controller to get a place photo
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
        photoreference: photo_reference,
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
    return res.status(400).json({ error: 'Origin and destination are required' });
  }

  try {
    const response = await axios.get<{ routes: DirectionRoute[] }>(
      'https://maps.googleapis.com/maps/api/directions/json',
      {
        params: {
          origin, // e.g., "1.283366,103.860718" (Marina Bay Sands)
          destination, // e.g., "1.364917,103.991531" (Changi Airport)
          key: config.db.googleMapsApiKey,
        },
      }
    );

    res.json(response.data.routes); // Return the directions
  } catch (error) {
    logger.error(`Failed to fetch directions: ${error.message}`);
    res.status(500).json({ error: 'Failed to fetch directions' });
  }
};
