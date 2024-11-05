import { Request, Response } from 'express';
import { getTripsByUserId, addTrip, getTripById, deleteTripById } from '../models/tripsmodel';
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

// Controller to delete a trip by trip ID
export const deleteTrip = async (req: Request, res: Response): Promise<void> => {
    const { tripId } = req.params;

    try {
        const deleteResult = await deleteTripById(tripId);

        if (deleteResult.rowCount === 0) {
            res.status(404).json({
                status: 'error',
                message: 'Trip not found or not deleted',
                statusCode: 404,
            });
        } else {
            res.status(200).json({
                status: 'ok',
                message: 'Trip deleted successfully',
                statusCode: 200,
            });
        }
    } catch (error) {
        const errMsg = error instanceof Error ? error.message : 'Unknown error occurred';
        logger.error(`deleteTrip error: ${errMsg}`);
        res.status(500).json({
            status: 'error',
            message: 'Failed to delete trip',
            statusCode: 500,
        });
    }
};
