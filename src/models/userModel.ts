import { PoolClient, QueryResult } from 'pg';
import {
    commit,
    getTransaction,
    rollback,
    // sqlExecMultipleRows,
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
        INSERT INTO users (first_name, last_name, email, password) 
        VALUES ($1, $2, $3, $4)
        RETURNING first_name, last_name, email;
    `;
    const userData = [user.firstName, user.lastName, user.email, hashedPassword];
    const client: PoolClient = await getTransaction();

    try {
        const result = await sqlExecSingleRow(client, insertUserSql, userData);
        await commit(client);
        
        // Return the newly created user data
        const createdUser = result.rows[0];
        return {
            firstName: createdUser.first_name,
            lastName: createdUser.last_name,
            email: createdUser.email,
            password: user.password, // Do not return the hashed password here for security reasons
        };
    } catch (error) {
        await rollback(client);
        logger.error(`signupModel error: ${error.message}`);
        throw new Error('Signup failed: ' + error.message);
    }
};



export const loginUser = async (email: string, password: string): Promise<User> => {
    const findUserSql = `
        SELECT first_name, last_name, email, password 
        FROM users 
        WHERE email = $1
    `;
    const userData = [email];
    const client: PoolClient = await getTransaction();

    try {
        // Fetch the user based on the provided email
        const result = await sqlExecSingleRow(client, findUserSql, userData);

        if (result.rowCount === 0) {
            throw new Error('User not found');
        }

        const user = result.rows[0];

        // Compare the provided password with the hashed password stored in the database
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            throw new Error('Invalid credentials');
        }

        // If password matches, return the user object without the password field
        return {
            firstName: user.first_name,
            lastName: user.last_name,
            email: user.email,
            password: password
        };
    } catch (error) {
        await rollback(client);
        logger.error(`loginModel error: ${error.message}`);
        throw new Error('Login failed: ' + error.message);
    } finally {
        await client.release();
    }
};

/**
 * Check if a user exists in the database by email.
 * @param {string} email The email of the user to check.
 * @returns {Promise<User | null>} Returns the user object if the user exists, null otherwise.
 */
export const checkUserExists = async (email: string): Promise<User | null> => {
    const getUserSql = `SELECT * FROM users WHERE email = $1;`;
    const userData = [[email]];  // Adjusted to remove extra array nesting

    try {
        const result: QueryResult = await sqlToDB(getUserSql, userData);

        if (result.rows.length > 0) {
            const user: User = result.rows[0];
            return user; // Return the user object if exists
        } else {
            return null; // Return null if the user does not exist
        }
    } catch (error) {
        throw new Error(`Failed to check if user exists: ${error.message}`);
    }
};