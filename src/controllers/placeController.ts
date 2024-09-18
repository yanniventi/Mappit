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
  // Add other necessary fields based on the Google API response structure
}

interface PlaceDetails {
  name: string;
  address: string;
  reviews: Array<{
    author_name: string;
    rating: number;
    text: string;
  }>;
  // Add other necessary fields based on the Google API response structure
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

// Controller to search for nearby places
export const getNearbyPlaces = async (req: Request, res: Response, next: NextFunction) => {
  const { location, radius, type } = req.query;

  if (!location || !radius || !type) {
    return res.status(400).json({ error: 'Location, radius, and type are required' });
  }

  try {
    const response = await axios.get<{ results: NearbyPlace[] }>(
      'https://maps.googleapis.com/maps/api/place/nearbysearch/json',
      {
        params: {
          location, // e.g., "1.283366,103.860718" for Marina Bay Sands
          radius, // e.g., 1500 (radius in meters)
          type, // e.g., "restaurant", "hotel", etc.
          key: config.db.googleMapsApiKey,
        },
      }
    );

    res.json(response.data.results); // Return the places found
  } catch (error) {
    logger.error(`Failed to fetch places: ${error.message}`);
    res.status(500).json({ error: 'Failed to fetch places' });
  }
};

// Controller to get detailed place information including reviews
export const getPlaceDetails = async (req: Request, res: Response, next: NextFunction) => {
  const { place_id } = req.query;

  if (!place_id) {
    return res.status(400).json({ error: 'Place ID is required' });
  }

  try {
    const response = await axios.get<{ result: PlaceDetails }>(
      'https://maps.googleapis.com/maps/api/place/details/json',
      {
        params: {
          place_id, // The place_id returned from the Places API
          key: config.db.googleMapsApiKey,
        },
      }
    );

    res.json(response.data.result); // Return the place details including reviews
  } catch (error) {
    logger.error(`Failed to fetch place details: ${error.message}`);
    res.status(500).json({ error: 'Failed to fetch place details' });
  }
};

// Controller to get directions between two locations
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
