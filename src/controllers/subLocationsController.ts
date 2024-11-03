// subLocationsController.ts

import { Request, Response } from 'express';
import { getSublocationsByLocationId as getSublocationsByLocationIdModel } from '../models/subLocationModel';

export const getSublocationsByLocationId = async (req: Request, res: Response): Promise<void> => {
    const { location_id } = req.params;

    if (!location_id) {
        res.status(400).json({ error: 'location_id is required' });
        return;
    }

    try {
        const sublocations = await getSublocationsByLocationIdModel(parseInt(location_id, 10));
        
        if (sublocations.length === 0) {
            res.status(404).json({ message: 'No sublocations found for the given location_id' });
            return;
        }

        res.status(200).json(sublocations);
    } catch (error) {
        console.error('Error fetching sublocations:', error);
        res.status(500).json({ error: 'An error occurred while fetching sublocations' });
    }
};
