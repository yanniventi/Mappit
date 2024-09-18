import { Request, Response } from 'express';
import { getPlaceDensity } from '../utils/googleMapsService';

export const getDensityData = async (req: Request, res: Response): Promise<void> => {
    const { latitude, longitude } = req.query;

    if (typeof latitude !== 'string' || typeof longitude !== 'string') {
        res.status(400).json({
            success: false,
            message: 'Latitude and longitude must be provided as query parameters.'
        });
        return;
    }

    try {
        const density = await getPlaceDensity(Number(latitude), Number(longitude));
        res.status(200).json({
            success: true,
            density: density,
            message: `The area is ${density}.`
        });
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({
                success: false,
                message: 'Failed to retrieve density data',
                error: error.message,
            });
        } else {
            res.status(500).json({
                success: false,
                message: 'Failed to retrieve density data due to an unknown error',
            });
        }
    }
};
