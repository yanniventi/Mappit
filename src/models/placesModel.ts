import { QueryResult } from 'pg';
import { sqlToDB } from './../utils/dbUtil';
import { Places } from '../types';
import { logger } from './../utils/logger';

// Function to get all places  by user ID
export const getPlacesinTripsByUserId = async (userId: string): Promise<Places[]> => {
    const getTripsSql = `SELECT * FROM placesInTrip WHERE user_id = $1;`;

    try {
        const result: QueryResult = await sqlToDB(getTripsSql, [userId]);
        return result.rows;
    } catch (error) {
        logger.error(`getPlacesinTripsByUserId error: ${getErrorMessage(error)}`);
        throw new Error(`Failed to fetch placesInTrip for user: ${getErrorMessage(error)}`);
    }
};

// Function to add a new trip
export const addPlacesInTrip = async (userId: string, tripData: Places): Promise<Places> => {
    const {trips_id,places_id} = tripData;
    const addTripSql = `
        INSERT INTO trips (user_id, trips_id, places_id)
        VALUES ($1, $2, $3)
        RETURNING *;
    `;

    try {
        const result: QueryResult = await sqlToDB(addTripSql, [userId,trips_id ,places_id]);
        return result.rows[0];
    } catch (error) {
        logger.error(`addTrip error: ${getErrorMessage(error)}`);
        throw new Error(`Failed to add trip: ${getErrorMessage(error)}`);
    }
};

// Function to get a places by Places ID
export const getPlacesInTripId = async (tripId: string): Promise<Places | null> => {
    const getTripSql = `SELECT * FROM trips WHERE places_id = $1;`;

    try {
        const result: QueryResult = await sqlToDB(getTripSql, [tripId]);
        return result.rows.length ? result.rows[0] : null;
    } catch (error) {
        logger.error(`getPlacesInTripId error: ${getErrorMessage(error)}`);
        throw new Error(`Failed to fetch Places : ${getErrorMessage(error)}`);
    }
};

// Helper function to extract error messages
function getErrorMessage(error: unknown): string {
    return error instanceof Error ? error.message : 'An unknown error occurred';
}
