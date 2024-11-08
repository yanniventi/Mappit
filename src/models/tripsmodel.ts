import { QueryResult } from 'pg';
import { sqlToDB } from './../utils/dbUtil';
import { Trip } from '../types';
import { logger } from './../utils/logger';
import pool from '../config/db';

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
    const {places_id,location_name,start_date, end_date } = tripData;
    const addTripSql = `
        INSERT INTO trips (user_id, places_id, location_name, start_date, end_date)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *;
    `;

    try {
        const result: QueryResult = await sqlToDB(addTripSql, [userId,places_id ,location_name,start_date, end_date]);
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

// Function to delete a trip by trip ID
export const deleteTripById = async (tripId: string): Promise<QueryResult> => {
    const query = 'DELETE FROM trips WHERE id = $1';
    const values = [tripId];
    return pool.query(query, values);
};

 // Updates a trip in the database.
 export const updateTripModel = async (tripId: string, fieldsToUpdate: { [key: string]: string }): Promise<QueryResult> => {
     const keys = Object.keys(fieldsToUpdate);
     const values = Object.values(fieldsToUpdate);
 
     if (keys.length === 0) {
         throw new Error('No fields provided for update');
     }
 
     const setClause = keys.map((key, index) => `${key} = $${index + 1}`).join(', ');
 
     const updateTripSql = `
         UPDATE trips
         SET ${setClause}
         WHERE id = $${keys.length + 1}
     `;
 
     try {
         return await sqlToDB(updateTripSql, [...values, tripId]);
     } catch (error) {
         logger.error(`updateTripModel error: ${error instanceof Error ? error.message : 'Unknown error'}`);
         throw new Error('Failed to update trip');
     }
 };

 // Function to get the budget by trip ID
export const getBudgetByTripIdModel = async (tripId: string): Promise<number | null> => {
    const getBudgetSql = `SELECT budget FROM trips WHERE id = $1;`;

    try {
        const result: QueryResult = await sqlToDB(getBudgetSql, [tripId]);
        return result.rows.length ? result.rows[0].budget : null;
    } catch (error) {
        logger.error(`getBudgetByTripId error: ${getErrorMessage(error)}`);
        throw new Error(`Failed to fetch budget for trip: ${getErrorMessage(error)}`);
    }
};

 