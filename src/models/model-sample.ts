import { PoolClient, QueryResult } from 'pg';
import {
    commit,
    getTransaction,
    rollback,
    sqlExecMultipleRows,
    sqlExecSingleRow,
    sqlToDB,
} from './../utils/dbUtil';
import { logger } from './../utils/logger';
const transactionSuccess = 'transaction success';

/**
 * Sample query
 * @returns { Promise<QueryResult> }
 */
export const getTimeModel = async (): Promise<QueryResult> => {
    const sql = 'SELECT NOW() as now;';
    try {
        return await sqlToDB(sql);
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message);
        } else {
            throw new Error('An unknown error occurred in getTimeModel');
        }
    }
};

/**
 * Sample query using transactions
 * @returns { Promise<string> } transaction success
 */
export const sampleTransactionModel = async (): Promise<string> => {
    const singleSql = 'DELETE FROM TEST;';
    const singleData = undefined;  // No data is needed for the DELETE query.
    const multiSql = 'INSERT INTO TEST (testcolumn) VALUES ($1);';
    const multiData: string[][] = [['typescript'], ['is'], ['fun']];
    const client: PoolClient = await getTransaction();
    try {
        await sqlExecSingleRow(client, singleSql, singleData);
        await sqlExecMultipleRows(client, multiSql, multiData);
        await commit(client);
        return transactionSuccess;
    } catch (error) {
        await rollback(client);
        if (error instanceof Error) {
            logger.error(`sampleTransactionModel error: ${error.message}`);
            throw new Error(error.message);
        } else {
            logger.error('Unexpected error type during sampleTransactionModel');
            throw new Error('An unexpected error occurred');
        }
    }
};
