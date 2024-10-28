import { sqlToDB } from './../utils/dbUtil';
import { logger } from './../utils/logger';

// Function to get a random location name
export const getRandomLocationName = async (): Promise<string | null> => {
    const query = `
        SELECT location_name FROM locations
        ORDER BY RANDOM()
        LIMIT 1;
    `;

    try {
        const result = await sqlToDB(query);
        return result.rows.length ? result.rows[0].location_name : null;
    } catch (error) {
        logger.error(`getRandomLocationName error: ${error instanceof Error ? error.message : 'Unknown error'}`);
        throw new Error('Failed to fetch random location name');
    }
};