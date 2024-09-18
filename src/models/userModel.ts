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

// Function to safely extract error message
function getErrorMessage(error: unknown): string {
    return error instanceof Error ? error.message : 'An unknown error occurred';
}

/**
 * Registers a new user in the database
 * @returns { Promise<User> } Newly created user
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
            age: createdUser.age,
            phoneNumber: createdUser.phone_number,
            password: '',  // Do not return the hashed password
        };
    } catch (error) {
        await rollback(client);
        logger.error(`signupModel error: ${getErrorMessage(error)}`);
        throw new Error(`Signup failed: ${getErrorMessage(error)}`);
    }
};

/**
 * Authenticates a user
 * @returns { Promise<User> } Authenticated user
 */
export const loginUser = async (email: string, password: string): Promise<User> => {
    const findUserSql = `SELECT first_name, last_name, email, password, age, phone_number FROM users WHERE email = $1;`;
    const userData = [email];
    const client: PoolClient = await getTransaction();

    try {
        const result = await sqlExecSingleRow(client, findUserSql, userData);

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
            password: '',  // Do not return the hashed password
        };
    } catch (error) {
        await rollback(client);
        logger.error(`loginModel error: ${getErrorMessage(error)}`);
        throw new Error(`Login failed: ${getErrorMessage(error)}`);
    }
};

/**
 * Checks if a user exists in the database by email.
 * @param {string} email The email of the user to check.
 * @returns {Promise<boolean>} True if user exists, false otherwise.
 */
export const checkUserExists = async (email: string): Promise<boolean> => {
    const getUserSql = `SELECT * FROM users WHERE email = $1;`;
    const userData = [email];

    try {
        const result: QueryResult = await sqlToDB(getUserSql, userData);
        return result.rows.length > 0;
    } catch (error) {
        throw new Error(`Failed to check if user exists: ${getErrorMessage(error)}`);
    }
};
