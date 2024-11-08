import { Request, Response } from 'express';
import { getTripsByUserId, addTrip, getTripById, deleteTripById, updateTripModel, getBudgetByTripIdModel, setBudgetByTripIdModel } from '../models/tripsmodel';
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

// Controller to update a trip by trip ID
export const updateTrip = async (req: Request, res: Response): Promise<void> => {
    const { tripId } = req.params;
    const { start_date, end_date } = req.body;

    if (!tripId) {
        res.status(400).json({
            status: 'error',
            message: 'Trip ID is required',
            statusCode: 400,
        });
        return;
    }

    if (!start_date && !end_date) {
        res.status(400).json({
            status: 'error',
            message: 'At least one of start_date or end_date is required',
            statusCode: 400,
        });
        return;
    }

    try {
        const fieldsToUpdate: { [key: string]: string } = {};
        if (start_date) fieldsToUpdate.start_date = start_date;
        if (end_date) fieldsToUpdate.end_date = end_date;

        const updateResult = await updateTripModel(tripId, fieldsToUpdate);

        if (updateResult.rowCount === 0) {
            res.status(404).json({
                status: 'error',
                message: 'Trip not found or not updated',
                statusCode: 404,
            });
        } else {
            res.status(200).json({
                status: 'ok',
                message: 'Trip updated successfully',
                statusCode: 200,
            });
        }
    } catch (error) {
        const errMsg = error instanceof Error ? error.message : 'Unknown error occurred';
        logger.error(`updateTrip error: ${errMsg}`);
        res.status(500).json({
            status: 'error',
            message: 'Failed to update trip',
            statusCode: 500,
        });
    }
};

// Controller to get the budget by trip ID
export const getBudget = async (req: Request, res: Response): Promise<void> => {
    const { tripId } = req.params;

    try {
        // Fetch the budget by trip ID
        const budget = await getBudgetByTripIdModel(tripId);

        if (budget === null) {
            res.status(404).json({ message: 'Trip not found or budget not set' });
            return;
        }

        // Respond with the budget
        res.status(200).json({ budget });
    } catch (error) {
        logger.error(`getBudgetController error: ${error instanceof Error ? error.message : 'Unknown error'}`);
        res.status(500).json({
            status: 'error',
            message: 'Failed to fetch budget for trip',
            statusCode: 500,
        });
    }
};

// Controller to set the budget for a specific trip
export const setBudget = async (req: Request, res: Response): Promise<void> => {
    const { tripId } = req.params;
    const { budget } = req.body;

    // Validate the input
    if (!tripId || budget === undefined || isNaN(budget)) {
        res.status(400).json({ error: 'Invalid trip ID or budget value' });
        return;
    }

    try {
        // Call the model function to update the budget
        await setBudgetByTripIdModel(tripId, Number(budget));
        res.status(200).json({ message: 'Budget updated successfully' });
    } catch (error) {
        logger.error(`getBudgetController error: ${error instanceof Error ? error.message : 'Unknown error'}`);
        res.status(500).json({ error: 'Failed to update budget' });
    }
};

