import { QueryResult } from 'pg';
import { sqlToDB } from './../utils/dbUtil';
import { Trip } from '../types';
import { logger } from './../utils/logger';

// Function to get all trips by user ID
export const getTripsByUserId = async (userId: string): Promise<Trip[]> => {
    const getTripsSql = `SELECT * FROM trips WHERE user_id = $1;`;

    try {
        const result: QueryResult = await sqlToDB(getTripsSql, [userId]);
        return result.rows;
    } catch (error) {
        logger.error(`getTripsByUserId error: ${getErrorMessage(error)}`);
        throw new Error(`Failed to fetch trips for user: ${getErrorMessage(error)}`);
    }
};

// Function to add a new trip
export const addTrip = async (userId: string, tripData: Trip): Promise<Trip> => {
    const {location_id ,start_date, end_date } = tripData;
    const addTripSql = `
        INSERT INTO trips (user_id, location_id, start_date, end_date)
        VALUES ($1, $2, $3,$4)
        RETURNING *;
    `;

    try {
        const result: QueryResult = await sqlToDB(addTripSql, [userId,location_id,start_date, end_date]);
        return result.rows[0];
    } catch (error) {
        logger.error(`addTrip error: ${getErrorMessage(error)}`);
        throw new Error(`Failed to add trip: ${getErrorMessage(error)}`);
    }
};

// Function to get a trip by trip ID
export const getTripById = async (tripId: string): Promise<Trip | null> => {
    const getTripSql = `SELECT * FROM trips WHERE id = $1;`;

    try {
        const result: QueryResult = await sqlToDB(getTripSql, [tripId]);
        return result.rows.length ? result.rows[0] : null;
    } catch (error) {
        logger.error(`getTripById error: ${getErrorMessage(error)}`);
        throw new Error(`Failed to fetch trip: ${getErrorMessage(error)}`);
    }
};

// Helper function to extract error messages
function getErrorMessage(error: unknown): string {
    return error instanceof Error ? error.message : 'An unknown error occurred';
}
