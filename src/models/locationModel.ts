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
    const getLocationSql = `SELECT * FROM locations;`;

    try {
        const result: QueryResult = await sqlToDB(getLocationSql); // Execute the correct SQL query
        return result.rows; // Return the list of locations
    } catch (error) {
        logger.error(`getLocationModel error: ${getErrorMessage(error)}`);
        throw new Error(`Failed to fetch locations: ${getErrorMessage(error)}`);
    }
};



export const getSavedLocationsByUser = async (user_id: number): Promise<Location[]> => {
    const getSavedLocationsSql = `
        SELECT loc.id, loc.location_name, loc.country, loc.about, loc.additional_info, loc.location, loc.phone, loc.web_address, loc.opening_closing_hours, loc.img_url
        FROM saved_locations sl
        JOIN locations loc ON sl.location_id = loc.id
        WHERE sl.user_id = $1;`; // $1 is a placeholder for the user_id

    try {
        const result: QueryResult = await sqlToDB(getSavedLocationsSql, [user_id]); // Execute SQL query, passing user_id as a parameter
        return result.rows; // Return the list of saved locations for the user
    } catch (error) {
        logger.error(`getSavedLocationsByUser error: ${getErrorMessage(error)}`);
        throw new Error(`Failed to fetch saved locations for user: ${getErrorMessage(error)}`);
    }
};