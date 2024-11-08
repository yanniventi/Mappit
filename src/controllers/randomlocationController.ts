// controllers/locationController.ts
import { Request, Response } from 'express';
import { getRandomLocation } from '../models/randomlocationModel';
import { logger } from '../utils/logger';

export const getRandomLocationController = async (req: Request, res: Response): Promise<void> => {
    try {
        const location = await getRandomLocation();
        if (location) {
            res.status(200).json(location); // Return both id and location_name
        } else {
            res.status(404).json({ error: 'No location found' });
        }
    } catch (error) {
        logger.error(`getRandomLocationController error: ${error instanceof Error ? error.message : 'Unknown error'}`);
        res.status(500).json({ error: 'Failed to fetch random location' });
    }
};
