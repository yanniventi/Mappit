import { PoolClient, QueryResult } from 'pg';
import {
    commit,
    getTransaction,
    rollback,
    sqlExecSingleRow,
    sqlToDB,
} from './../utils/dbUtil';
import { JWTpayload } from '../types';
import jwt from 'jsonwebtoken';

import { logger } from './../utils/logger';
import { User, UpdateProfileData } from '../types';
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
export const createUser = async (first_name: string, last_name: string, email: string, password: string, gender: string, dob: string, phoneNumber: string): Promise<User> => {
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const insertUserSql = `
        INSERT INTO users (first_name, last_name, email, password, date_of_birth, phone_number) 
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id, first_name, last_name, email, date_of_birth, phone_number, gender;
    `;
    const userData = [first_name, last_name, email, hashedPassword, dob, phoneNumber];
    const client: PoolClient = await getTransaction();

    try {
        const result = await sqlExecSingleRow(client, insertUserSql, userData);
        await commit(client);
        
        const createdUser = result.rows[0];

        return {
            id: createdUser.id,
            firstName: createdUser.first_name,
            lastName: createdUser.last_name,
            email: createdUser.email,
            gender: createdUser.gender,
            dob: createdUser.date_of_birth,
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
    const findUserSql = `SELECT id, first_name, last_name, email, password, date_of_birth::TEXT, phone_number, gender FROM users WHERE email = $1;`;
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
            id: user.id,
            firstName: user.first_name,
            lastName: user.last_name,
            email: user.email,
            gender: user.gender,
            dob: user.date_of_birth,
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
    const findUserSql = `SELECT id, first_name, last_name, email, date_of_birth::TEXT, gender, phone_number FROM users WHERE email = $1;`;
    const userData = [email];

    try {
        const result = await sqlToDB(findUserSql, userData);

        if (result.rowCount === 0) {
            return null;  // User not found
        }

        const user = result.rows[0];

        console.log(user.date_of_birth);
        // Format the date_of_birth as YYYY-MM-DD, ensuring no time zone info
        // const dob = user.date_of_birth ? user.date_of_birth.toISOString().split('T')[0] : "";

        return {
            id: user.id,
            firstName: user.first_name,
            lastName: user.last_name,
            email: user.email,
            gender: user.gender,
            dob: user.date_of_birth,
            phoneNumber: user.phone_number,
            password: '',  // No need to return the password here
        };
    } catch (error) {
        logger.error(`findUserByEmail error: ${getErrorMessage(error)}`);
        throw new Error(`Failed to find user by email: ${getErrorMessage(error)}`);
    }
};


export const generateAccessJWT = (email: string) => {
    const payload: JWTpayload = { email };
    return jwt.sign(payload, process.env.SECRET_ACCESS_TOKEN as string, { expiresIn: '1h' });
};

/**
 * Updates a user's profile in the database
 * @param userId The ID of the user to update
 * @param updateData An object containing the fields to update
 * @returns The updated user data or an error if the update fails
 */
export const updateUserProfile = async (userEmail: string, updateData: UpdateProfileData): Promise<UpdateProfileData> => {
    // Build the SQL query dynamically based on the provided fields
    const fields: string[] = [];
    const values: any[] = [];
    const client: PoolClient = await getTransaction();
    let index = 1;

    if (updateData.firstName) {
        fields.push(`first_name = $${index++}`);
        values.push(updateData.firstName);
    }
    if (updateData.lastName) {
        fields.push(`last_name = $${index++}`);
        values.push(updateData.lastName);
    }
    if (updateData.dob) {
        fields.push(`date_of_birth = $${index++}`);
        values.push(updateData.dob);
    }
    if (updateData.gender) {
        fields.push(`gender = $${index++}`);
        values.push(updateData.gender);
    }
    if (updateData.phoneNumber) {
        fields.push(`phone_number = $${index++}`);
        values.push(updateData.phoneNumber);
    }

    // If no fields were provided, throw an error
    if (fields.length === 0) {
        throw new Error('No fields provided to update.');
    }

    // Add the user ID as the last parameter
    values.push(userEmail);

    // The SQL update query
    const sql = `
        UPDATE users
        SET ${fields.join(', ')}
        WHERE email = $${index}
        RETURNING email, first_name, last_name, date_of_birth::TEXT, gender, phone_number;
    `;

    try {
        // Execute the SQL query to update the user's profile
        const result = await sqlExecSingleRow(client, sql, values);

        // Commit the transaction
        await commit(client);

        // Log the successful update
        logger.info(`User profile updated successfully for email: ${userEmail}`);

        // Return the updated user data
        const user = result.rows[0];

        return {
            firstName: user.first_name,
            lastName: user.last_name,
            dob: user.date_of_birth,
            gender: user.gender,
            phoneNumber: user.phone_number,
        };
    } catch (error) {
        // Rollback the transaction in case of any failure
        if (client) {
            await rollback(client);
        }
        logger.error(`Error updating user profile for email: ${userEmail} | ${getErrorMessage(error)}`);
        throw new Error(`Error updating user profile: ${getErrorMessage(error)}`);
    }
};
