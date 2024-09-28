import { PoolClient, QueryResult } from 'pg';
import {
    commit,
    getTransaction,
    rollback,
    sqlExecSingleRow,
    sqlToDB,
} from './../utils/dbUtil';
import jwt from 'jsonwebtoken';

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
        INSERT INTO users (first_name, last_name, email, password, date_of_birth, phone_number) 
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING first_name, last_name, email, date_of_birth, phone_number;
    `;
    const userData = [user.firstName, user.lastName, user.email, hashedPassword, user.dob, user.phoneNumber];
    const client: PoolClient = await getTransaction();

    try {
        const result = await sqlExecSingleRow(client, insertUserSql, userData);
        await commit(client);
        
        const createdUser = result.rows[0];

        return {
            firstName: createdUser.first_name,
            lastName: createdUser.last_name,
            email: createdUser.email,
            dob: createdUser.dob,
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
    const findUserSql = `SELECT first_name, last_name, email, password, date_of_birth, phone_number FROM users WHERE email = $1;`;
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
            dob: user.dob,
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

/**
 * Finds a user by their email
 * @param {string} email The email of the user to find.
 * @returns {Promise<User | null>} User object if found, null otherwise.
 */
export const findUserByEmail = async (email: string): Promise<User | null> => {
    const findUserSql = `SELECT first_name, last_name, email, date_of_birth, phone_number FROM users WHERE email = $1;`;
    const userData = [email];
    const client: PoolClient = await getTransaction();

    try {
        const result = await sqlExecSingleRow(client, findUserSql, userData);

        if (result.rowCount === 0) {
            return null;  // User not found
        }

        const user = result.rows[0];

        return {
            firstName: user.first_name,
            lastName: user.last_name,
            email: user.email,
            dob: user.date_of_birth,
            phoneNumber: user.phone_number,
            password: '',  // No need to return the password here
        };
    } catch (error) {
        await rollback(client);
        logger.error(`findUserByEmail error: ${getErrorMessage(error)}`);
        throw new Error(`Failed to find user by email: ${getErrorMessage(error)}`);
    }
};


export const generateAccessJWT = (email: string) => {
  const payload = { email: email };
  return jwt.sign(payload, process.env.SECRET_ACCESS_TOKEN as string, { expiresIn: '20m' });
};