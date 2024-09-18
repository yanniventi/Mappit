import { Pool, PoolClient, QueryResult } from 'pg';
import { config } from './../config';
import { logger } from './../utils/logger';
import { PgConfig } from '../types';

const pgconfig: PgConfig = {
    user: config.db.user,
    database: config.db.database,
    password: config.db.password,
    host: config.db.host,
    port: config.db.port,
    max: config.db.max,
    idleTimeoutMillis: config.db.idleTimeoutMillis,
};

const pool = new Pool(pgconfig);

logger.info(`DB Connection Settings: ${JSON.stringify(pgconfig)}`);

pool.on('error', function (err: Error) {
    logger.error(`idle client error, ${err.message} | ${err.stack}`);
});

export const sqlToDB = async (
    sql: string,
    data: any[] | undefined = undefined
): Promise<QueryResult> => {
    logger.debug(`sqlToDB() sql: ${sql} | data: ${data}`);
    try {
        const result = await pool.query(sql, data);
        return result;
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message);
        } else {
            throw new Error('An unknown error occurred');
        }
    }
};

export const getTransaction = async (): Promise<PoolClient> => {
    logger.debug(`getTransaction()`);
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        return client;
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message);
        } else {
            throw new Error('An unknown error occurred');
        }
    }
};

export const sqlExecSingleRow = async (
    client: PoolClient,
    sql: string,
    data: any[] | undefined = undefined
): Promise<QueryResult> => {
    logger.debug(`sqlExecSingleRow() sql: ${sql} | data: ${data}`);
    try {
        const result = await client.query(sql, data);
        logger.debug(`sqlExecSingleRow(): ${result.command} | ${result.rowCount}`);
        return result;
    } catch (error) {
        if (error instanceof Error) {
            logger.error(
                `sqlExecSingleRow() error: ${error.message} | sql: ${sql} | data: ${data}`
            );
            throw new Error(error.message);
        } else {
            logger.error('Unexpected error type during sqlExecSingleRow');
            throw new Error('An unexpected error occurred');
        }
    }
};

export const sqlExecMultipleRows = async (
    client: PoolClient,
    sql: string,
    data: string[][]
): Promise<void> => {
    logger.debug(`inside sqlExecMultipleRows()`);
    if (data.length !== 0) {
        for (const item of data) {
            try {
                logger.debug(`sqlExecMultipleRows() item: ${item}`);
                await client.query(sql, item);
            } catch (error) {
                if (error instanceof Error) {
                    logger.error(`sqlExecMultipleRows() error: ${error.message}`);
                    throw new Error(error.message);
                } else {
                    logger.error('Unexpected error type during sqlExecMultipleRows');
                    throw new Error('An unexpected error occurred');
                }
            }
        }
    } else {
        logger.error('sqlExecMultipleRows(): No data available');
        throw new Error('No data available');
    }
};

export const rollback = async (client: PoolClient): Promise<void> => {
    logger.info(`sql transaction rollback`);
    if (client) {
        try {
            await client.query('ROLLBACK');
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(error.message);
            } else {
                throw new Error('An unexpected error occurred during rollback');
            }
        } finally {
            client.release();
        }
    } else {
        logger.warn(`rollback() not executed. client is not set`);
    }
};

export const commit = async (client: PoolClient): Promise<void> => {
    logger.debug(`sql transaction committed`);
    try {
        await client.query('COMMIT');
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message);
        } else {
            throw new Error('An unexpected error occurred during commit');
        }
    } finally {
        client.release();
    }
};
