import { Request, Response } from 'express';
import { getLocations } from '../models/locationModel';
import { logger } from '../utils/logger';

// Helper function to get error message from unknown type
const getErrorMessage = (error: unknown): string => {
    if (error instanceof Error) {
      return error.message;
    }
    return String(error);
  };

// Controller to handle fetching locations
export const fetchLocationsController = async (req: Request, res: Response): Promise<void> => {
    try {
      // Fetch the list of locations
      const locations = await getLocations();
      
      // Respond with the list of locations
      res.status(200).json({
        success: true,
        data: locations,
      });
    } catch (error) {
      // Handle any errors\
      const errorMessage = getErrorMessage(error);
      logger.error(`Error fetching locations: ${errorMessage}`);
      
      res.status(500).json({
        success: false,
        message: 'Failed to fetch locations',
        error: errorMessage ,
      });
    }
  };