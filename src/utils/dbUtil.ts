import { Pool, PoolClient, QueryResult } from 'pg';
import { config } from './../config';
import { logger } from './../utils/logger';
import { PgConfig } from '../types';

// Configurations for the PostgreSQL connection pool
const pgconfig: PgConfig = {
    user: config.db.user,
    database: config.db.database,
    password: config.db.password,
    host: config.db.host,
    port: config.db.port,
    max: config.db.max,
    idleTimeoutMillis: config.db.idleTimeoutMillis,
    googleMapsApiKey: config.db.googleMapsApiKey
};

// Creating a pool of database connections
const pool = new Pool(pgconfig);

// Log database connection settings (Sensitive information should be excluded in production logs)
logger.info(`DB Connection Settings: ${JSON.stringify(pgconfig)}`);

// Global error handler for any idle client errors in the pool
pool.on('error', (err: Error) => {
    logger.error(`idle client error, ${err.message} | ${err.stack}`);
});

// Function to help with extracting error message safely
const getErrorMessage = (error: unknown): string => error instanceof Error ? error.message : 'Unknown error occurred';

/**
 * Executes a single SQL query on the database
 * @param sql The SQL query string
 * @param data The parameters for the SQL query
 * @returns The result of the query
 */
export const sqlToDB = async (sql: string, data?: any[]): Promise<QueryResult> => {
    logger.debug(`Executing SQL: ${sql} | Data: ${data}`);
    try {
        const result = await pool.query(sql, data);
        return result;
    } catch (error) {
        logger.error(`sqlToDB error: ${getErrorMessage(error)}`);
        throw new Error(getErrorMessage(error));
    }
};

/**
 * Initializes a transaction, returning a client with a started transaction
 * @returns A client with an open transaction
 */
export const getTransaction = async (): Promise<PoolClient> => {
    logger.debug(`Starting transaction`);
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        return client;
    } catch (error) {
        client.release();
        throw new Error(getErrorMessage(error));
    }
};

/**
 * Executes an SQL statement affecting a single row
 * @param client The database client
 * @param sql The SQL query string
 * @param data The parameters for the SQL query
 * @returns The result of the query
 */
export const sqlExecSingleRow = async (client: PoolClient, sql: string, data?: any[]): Promise<QueryResult> => {
    logger.debug(`sqlExecSingleRow() SQL: ${sql} | Data: ${data}`);
    try {
        const result = await client.query(sql, data);
        logger.debug(`Query successful: Command: ${result.command} | Rows affected: ${result.rowCount}`);
        return result;
    } catch (error) {
        logger.error(`sqlExecSingleRow error: ${getErrorMessage(error)} | SQL: ${sql}`);
        throw new Error(getErrorMessage(error));
    }
};

/**
 * Executes an SQL statement affecting multiple rows
 * @param client The database client
 * @param sql The SQL query string
 * @param data Array of parameters for the SQL query
 */
export const sqlExecMultipleRows = async (client: PoolClient, sql: string, data: any[][]): Promise<void> => {
    logger.debug(`Executing multiple row SQL operation`);
    if (data.length === 0) {
        throw new Error('No data provided for sqlExecMultipleRows operation.');
    }
    for (const item of data) {
        try {
            await client.query(sql, item);
        } catch (error) {
            logger.error(`sqlExecMultipleRows error: ${getErrorMessage(error)} | SQL: ${sql}`);
            throw new Error(getErrorMessage(error));
        }
    }
};

/**
 * Rolls back a transaction
 * @param client The database client
 */
export const rollback = async (client: PoolClient): Promise<void> => {
    logger.info(`Rolling back transaction`);
    try {
        await client.query('ROLLBACK');
    } catch (error) {
        throw new Error(getErrorMessage(error));
    } finally {
        client.release();
    }
};

/**
 * Commits a transaction
 * @param client The database client
 */
export const commit = async (client: PoolClient): Promise<void> => {
    logger.info(`Committing transaction`);
    try {
        await client.query('COMMIT');
    } catch (error) {
        throw new Error(getErrorMessage(error));
    } finally {
        client.release();
    }
};
