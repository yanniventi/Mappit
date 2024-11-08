// models/randomLocationModel.ts
import { sqlToDB } from './../utils/dbUtil';
import { logger } from './../utils/logger';

// Function to get a random location with both ID and name
export const getRandomLocation = async (): Promise<{ id: number, location_name: string } | null> => {
    const query = `
        SELECT id, location_name FROM locations
        ORDER BY RANDOM()
        LIMIT 1;
    `;

    try {
        const result = await sqlToDB(query);
        return result.rows.length ? { id: result.rows[0].id, location_name: result.rows[0].location_name } : null;
    } catch (error) {
        logger.error(`getRandomLocation error: ${error instanceof Error ? error.message : 'Unknown error'}`);
        throw new Error('Failed to fetch random location');
    }
};
