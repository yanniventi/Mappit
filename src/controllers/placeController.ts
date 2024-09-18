// controllers/placeController.ts
import axios from 'axios';
import { Request, Response, NextFunction } from 'express';
import { config } from '../config';
import { logger } from '../utils/logger';

// Interface to define the structure of API response data for better type safety
interface NearbyPlace {
  name: string;
  vicinity: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
}

interface PlaceDetails {
  name: string;
  address: string;
  reviews: Array<{
    author_name: string;
    rating: number;
    text: string;
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

export const getNearbyPlaces = async (req: Request, res: Response, next: NextFunction) => {
  const { location, radius, type } = req.query;

  if (!location || !radius || !type) {
    return res.status(400).json({ error: 'Location, radius, and type are required parameters.' });
  }

  try {
    const response = await axios.get<{ results: NearbyPlace[] }>('https://maps.googleapis.com/maps/api/place/nearbysearch/json', {
      params: {
        location,
        radius,
        type,
        key: config.db.googleMapsApiKey,
      },
    });

    res.json({ places: response.data.results });
  } catch (error) {
    const message = isError(error) ? error.message : 'Unknown error occurred';
    logger.error(`Failed to fetch places: ${message}`);
    res.status(500).json({ error: 'Failed to fetch places due to an internal error.' });
  }
};

export const getPlaceDetails = async (req: Request, res: Response, next: NextFunction) => {
  const { place_id } = req.query;

  if (!place_id) {
    return res.status(400).json({ error: 'Place ID is a required parameter.' });
  }

  try {
    const response = await axios.get<{ result: PlaceDetails }>('https://maps.googleapis.com/maps/api/place/details/json', {
      params: {
        place_id,
        key: config.db.googleMapsApiKey,
      },
    });

    res.json({ details: response.data.result });
  } catch (error) {
    const message = isError(error) ? error.message : 'Unknown error occurred';
    logger.error(`Failed to fetch place details: ${message}`);
    res.status(500).json({ error: 'Failed to fetch place details due to an internal error.' });
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
