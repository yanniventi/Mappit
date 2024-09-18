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
 * Sample query to get the current time from the database
 * @returns { Promise<QueryResult> }
 */
export const getTimeModel = async (): Promise<QueryResult> => {
    const sql = 'SELECT NOW() as now;';
    try {
        return await sqlToDB(sql);
    } catch (error) {
        if (error instanceof Error) {
            logger.error(`getTimeModel error: ${error.message}`);
            throw new Error(error.message);
        } else {
            logger.error('getTimeModel encountered a non-Error object');
            throw new Error('An unknown error occurred');
        }
    }
};

/**
 * Sample transaction query
 * @returns { Promise<string> } Transaction success
 */
export const sampleTransactionModel = async (): Promise<string> => {
    const singleSql = 'DELETE FROM TEST;';
    const singleData = undefined; // No data is needed for the DELETE query, so it's set to undefined.
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
            logger.error('sampleTransactionModel encountered a non-Error object');
            throw new Error('An unknown error occurred during the transaction');
        }
    }
};
