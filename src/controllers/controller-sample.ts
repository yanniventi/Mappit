import { Request, Response } from 'express';
import { logger } from './../utils/logger';
import { getTimeModel, sampleTransactionModel } from './../models/model-sample';
import { QueryResult } from 'pg';

/**
 * Retrieves the current time from the database.
 * @param { Request } req
 * @param { Response } res
 * @returns { Promise<void> }
 */
export const getTime = async (req: Request, res: Response): Promise<void> => {
    try {
        const result: QueryResult = await getTimeModel();
        res.status(200).json({
            status: 'ok',
            message: result.rows,  // Assuming this contains meaningful data to return
            statusCode: 200,
        });
    } catch (error) {
        if (error instanceof Error) {
            logger.error(`getTime error: ${error.message}`);
            res.status(500).json({
                status: 'error',
                message: 'Internal server error',
                statusCode: 500,
            });
        } else {
            logger.error('Unexpected error type during getTime');
            res.status(500).json({
                status: 'error',
                message: 'Internal server error due to unexpected condition',
                statusCode: 500,
            });
        }
    }
};

/**
 * Performs a database transaction as a sample process.
 * @param { Request } req
 * @param { Response } res
 * @returns { Promise<void> }
 */
export const sampleTransaction = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const result: string = await sampleTransactionModel();
        res.status(200).json({
            status: 'ok',
            message: result,  // Message returned from the transaction process
            statusCode: 200,
        });
    } catch (error) {
        const errMsg = error instanceof Error ? error.message : 'Unknown error occurred';
        logger.error(`sampleTransaction error: ${errMsg}`);
        res.status(500).json({
            status: 'error',
            message: 'Transaction failed',
            statusCode: 500,
        });
    }
};
