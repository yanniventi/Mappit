import { Request, Response } from 'express';
import { getTripsByUserId, addTrip, getTripById } from '../models/tripsmodel';
import { logger } from './../utils/logger';

// Controller to get all trips by user ID
export const getTrips = async (req: Request, res: Response): Promise<void> => {
    const { userId } = req.params;

    try {
        const trips = await getTripsByUserId(userId);
        res.status(200).json(trips);
    } catch (error) {
        logger.error(`createTrip error: ${(error as Error).message}`);
        res.status(500).json({ error: 'Failed to fetch trips' });
    }
};

// Controller to add a new trip
export const createTrip = async (req: Request, res: Response): Promise<void> => {
    const { userId } = req.params;
    const tripData = req.body;

    try {
        const newTrip = await addTrip(userId, tripData);
        res.status(201).json(newTrip);
    } catch (error) {
        logger.error(`createTrip error: ${(error as Error).message}`);
        res.status(500).json({ error: 'Failed to add trip' });
    }
};

// Controller to get a specific trip by trip ID
export const getTrip = async (req: Request, res: Response): Promise<void> => {
    const { tripId } = req.params;

    try {
        const trip = await getTripById(tripId);
        if (trip) {
            res.status(200).json(trip);
        } else {
            res.status(404).json({ error: 'Trip not found' });
        }
    } catch (error) {
        logger.error(`createTrip error: ${(error as Error).message}`);
        res.status(500).json({ error: 'Failed to fetch trip' });
    }
};