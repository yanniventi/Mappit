// subLocationModel.ts

import { QueryResult } from 'pg';
import { sqlToDB } from '../utils/dbUtil';
import { logger } from '../utils/logger';

function getErrorMessage(error: unknown): string {
    return error instanceof Error ? error.message : 'An unknown error occurred';
}

export const getSublocationsByLocationId = async (location_id: number): Promise<any[]> => {
    const getSublocationsSql = `
        SELECT id, location_id, location_name, about, additional_info, img_url
        FROM sublocations
        WHERE location_id = $1;
    `;

    try {
        const result: QueryResult = await sqlToDB(getSublocationsSql, [location_id]);
        return result.rows;
    } catch (error) {
        logger.error(`getSublocationsByLocationId error: ${getErrorMessage(error)}`);
        throw new Error(`Failed to fetch sublocations: ${getErrorMessage(error)}`);
    }
};
