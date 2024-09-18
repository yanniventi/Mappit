import { PoolClient, QueryResult } from 'pg';
import {
    commit,
    getTransaction,
    rollback,
    sqlExecSingleRow,
    sqlToDB,
} from './../utils/dbUtil';
import { logger } from './../utils/logger';
import { User } from '../types';

import bcrypt from 'bcrypt';
const SALT_ROUNDS = 10;

/**
 * Registers a new user in the database
 * @returns { Promise<User> } transaction success
 */
export const createUser = async (user: User): Promise<User> => {
    const hashedPassword = await bcrypt.hash(user.password, SALT_ROUNDS);
    const insertUserSql = `
        INSERT INTO users (first_name, last_name, email, password, age, phone_number) 
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING first_name, last_name, email, age, phone_number;
    `;
    const userData = [user.firstName, user.lastName, user.email, hashedPassword, user.age, user.phoneNumber];
    const client: PoolClient = await getTransaction();

    try {
        const result = await sqlExecSingleRow(client, insertUserSql, userData);
        await commit(client);
        const createdUser = result.rows[0];
        return {
            firstName: createdUser.first_name,
            lastName: createdUser.last_name,
            email: createdUser.email,
            age: user.age,
            phoneNumber: user.phoneNumber,
            password: '', // Omit password from return for security
        };
    } catch (error) {
        await rollback(client);
        if (error instanceof Error) {
            logger.error(`createUser error: ${error.message}`);
            throw new Error('Signup failed: ' + error.message);
        } else {
            logger.error('Unexpected error type during createUser');
            throw new Error('Signup failed due to unexpected error');
        }
    }
};

export const loginUser = async (email: string, password: string): Promise<User> => {
    const findUserSql = `
        SELECT first_name, last_name, email, password, age, phone_number
        FROM users 
        WHERE email = $1;
    `;
    const userData = [email];
    const client: PoolClient = await getTransaction();

    try {
        const result = await sqlExecSingleRow(client, findUserSql, userData);
        await client.release(); // Ensure the client is released after use

        if (result.rowCount === 0) {
            throw new Error('User not found');
        }

        const user = result.rows[0];
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            throw new Error('Invalid credentials');
        }

        return {
            firstName: user.first_name,
            lastName: user.last_name,
            email: user.email,
            age: user.age,
            phoneNumber: user.phone_number,
            password: '', // Omit password from return for security
        };
    } catch (error) {
        await rollback(client);
        if (error instanceof Error) {
            logger.error(`loginUser error: ${error.message}`);
            throw new Error('Login failed: ' + error.message);
        } else {
            logger.error('Unexpected error type during loginUser');
            throw new Error('Login failed due to unexpected error');
        }
    } finally {
        await client.release();
    }
};

/**
 * Check if a user exists in the database by email.
 * @param {string} email The email of the user to check.
 * @returns {Promise<boolean>} Returns the user object if the user exists, null otherwise.
 */
export const checkUserExists = async (email: string): Promise<boolean> => {
    const getUserSql = `SELECT * FROM users WHERE email = $1;`;
    const userData = [email];

    try {
        const result: QueryResult = await sqlToDB(getUserSql, userData);
        return result.rows.length > 0;
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(`Failed to check if user exists: ${error.message}`);
        } else {
            throw new Error('Failed to check if user exists due to unexpected error');
        }
    }
};
