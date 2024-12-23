import { Request, Response } from 'express';
import { getLocations, getSavedLocationsByUser, addSavedLocation, removeSavedLocation } from '../models/locationModel';
import { logger } from '../utils/logger';

// Helper function to get error message from unknown type
const getErrorMessage = (error: unknown): string => {
    if (error instanceof Error) {
      return error.message;
    }
    return String(error);
  };

// Controller to handle fetching locations
export const fetchAllLocationsController = async (req: Request, res: Response): Promise<void> => {
    try {
      // Fetch the list of locations
      const locations = await getLocations();
      
      // Respond with the list of locations
      res.status(200).json({
        success: true,
        locations: locations,
      });
    } catch (error) {
      // Handle any errors
      const errorMessage = getErrorMessage(error);
      logger.error(`Error fetching locations: ${errorMessage}`);
      
      res.status(500).json({
        success: false,
        message: 'Failed to fetch locations',
        error: errorMessage ,
      });
    }
  };


 // Controller function to get saved locations for a user
export const fetchSavedLocationsController = async (req: Request, res: Response) => {
  const { id } = req.body; // Extract the id from the request parameters

  // Validate that user_id is a number
  const userIdNumber = Number(id);
      
  if (isNaN(userIdNumber) || userIdNumber <= 0) {
      console.log(userIdNumber);
      // If user_id is not a valid number, return a 400 Bad Request
      return res.status(400).json({ message: 'Invalid user_id. It must be a positive integer.' });
  }

  try {
      // Fetch saved locations using the user_id
      const savedLocations = await getSavedLocationsByUser(Number(id));

      // If no locations found, return a 404
      if (!savedLocations || savedLocations.length === 0) {
          return res.status(200).json({ message: 'No saved locations found for this user.', savedLocations: [] });
      }

      // Return the saved locations as a JSON response
      return res.status(200).json({ savedLocations });
  } catch (error) {
      // Handle any errors
      const errorMessage = getErrorMessage(error);
      logger.error(`Error fetching saved locations: ${errorMessage}`);
      return res.status(500).json({ message: 'Failed to fetch saved locations.' });
  }
};


export const addSavedLocationController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { user_id, location_id } = req.body;

    if (!user_id || !location_id) {
      res.status(400).json({ message: "Missing user_id or location_id" });
      return;
    }

    await addSavedLocation(user_id, location_id);

    res.status(200).json({ message: `Location with ID ${location_id} added to table for user ID ${user_id}` });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    res.status(500).json({ message: `Failed to add saved location: ${errorMessage}` });
  }
};


export const removeSavedLocationController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { user_id, location_id } = req.body;

    if (!user_id || !location_id) {
      res.status(400).json({ message: "Missing user_id or location_id" });
      return;
    }

    await removeSavedLocation(user_id, location_id);

    res.status(200).json({ message: `Location with ID ${location_id} removed from saved locations for user ID ${user_id}` });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    res.status(500).json({ message: `Failed to remove saved location: ${errorMessage}` });
  }
};

