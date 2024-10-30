// controllers/locationController.ts
import { Request, Response } from 'express';
import { getRandomLocationName } from '../models/randomlocationModel';
import { logger } from '../utils/logger';

// Controller to get a random location name
export const getRandomLocationNameController = async (req: Request, res: Response): Promise<void> => {
    try {
        const locationName = await getRandomLocationName();
        if (locationName) {
            res.status(200).json({ location_name: locationName });
        } else {
            res.status(404).json({ error: 'No location found' });
        }
    } catch (error) {
        logger.error(`getRandomLocationNameController error: ${error instanceof Error ? error.message : 'Unknown error'}`);
        res.status(500).json({ error: 'Failed to fetch random location name' });
    }
};
