import { QueryResult } from 'pg';
import {
    sqlToDB,
} from './../utils/dbUtil';
import { Location } from '../types';

import { logger } from './../utils/logger';

// Function to safely extract error message
function getErrorMessage(error: unknown): string {
    return error instanceof Error ? error.message : 'An unknown error occurred';
}

export const getLocations = async (): Promise<Location[]> => {
    const getLocationSql = `SELECT id, location_name FROM locations;`;

    try {
        const result: QueryResult = await sqlToDB(getLocationSql); // Execute the correct SQL query
        return result.rows; // Return the list of locations
    } catch (error) {
        logger.error(`getLocationModel error: ${getErrorMessage(error)}`);
        throw new Error(`Failed to fetch locations: ${getErrorMessage(error)}`);
    }
};