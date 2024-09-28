import { Request, Response } from 'express';
import { createUser, loginUser, checkUserExists, generateAccessJWT, updateUserProfile } from '../models/userModel';
import { logger } from '../utils/logger';

export const signup = async (req: Request, res: Response): Promise<void> => {
    const { firstName, lastName, password, email, dob, phoneNumber } = req.body;

    // Basic validation for incoming request data
    if (!email || !password || !firstName || !lastName) {
        res.status(400).json({ message: 'Missing required fields: email, password, firstName, lastName are all required.' });
        return;
    }

    try {
        const existingUser = await checkUserExists(email);
        if (existingUser) {
            res.status(409).json({ message: 'Email already exists.' }); // 409 Conflict for already existing resource
            return;
        }

        // Setting up cookie
        const options: import('express').CookieOptions = {
            maxAge: 20 * 60 * 1000, // 20 minutes
            httpOnly: true,         // Only accessible by the web server
            secure: true,
            sameSite: 'none',       // Ensure cross-site cookie works
        };
        const token = generateAccessJWT(email); // generate session token for user

        res.cookie("SessionID", token, options); // set the token to response header, so that the client sends it back on each subsequent request

        const newUser = await createUser({ firstName, lastName, password, email, dob, phoneNumber });
        res.status(201).json({
            message: 'User created successfully',
            user: { firstName: newUser.firstName, lastName: newUser.lastName, email: newUser.email },
        });
    } catch (error) {
        logger.error(`Signup error: ${error instanceof Error ? error.message : 'Unknown error'}`);
        res.status(500).json({ message: 'Internal server error during signup.' });
    }
};

export const login = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;

    // Basic validation for incoming request data
    if (!email || !password) {
        res.status(400).json({ message: 'Both email and password are required.' });
        return;
    }

    try {
        const user = await loginUser(email, password);

        if (!user) { // Assuming loginUser returns null or undefined if authentication fails
            throw new Error('Invalid credentials provided.'); // Throw to catch block to handle as unauthorized access
        }
        
        // Setting up cookie
        const options: import('express').CookieOptions = {
            maxAge: 20 * 60 * 1000, // 20 minutes
            httpOnly: true,         // Only accessible by the web server
            secure: true,
            sameSite: 'none',       // Ensure cross-site cookie works
        };
        const token = generateAccessJWT(user.email); // generate session token for user

        res.cookie("SessionID", token, options); // set the token to response header, so that the client sends it back on each subsequent request
        res.status(200).json({ // If successful, return the user data (without the password)
            message: 'Login successful',
            user: {
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
            },
        });
    } catch (error) {
        logger.error(`Login error: ${error instanceof Error ? error.message : 'Unknown error'}`);
        res.status(401).json({ message: 'Invalid email or password' });
    }
};


export const updateProfile = async (req: Request, res: Response): Promise<void> => {
    const userEmail = req.user.email; // Assuming the user ID is attached to req.user from JWT middleware
    const { firstName, lastName, dob, gender, phoneNumber } = req.body; // New profile data from request body

    // Validate input (ensure at least one field is provided)
    if (!firstName && !lastName && !dob && !gender && !phoneNumber) {
        res.status(400).json({ message: 'At least one field is required to update the profile.' });
        return;
    }

    try {
        // Check if the user exists by their ID
        const existingUser = await checkUserExists(userEmail);
        if (!existingUser) {
            res.status(404).json({ message: 'User not found.' });
            return;
        }

        // Update user profile
        const updatedUser = await updateUserProfile(userEmail, {
            firstName,
            lastName,
            dob,
            gender,
            phoneNumber,
        });

        // Return updated user data
        res.status(200).json({
            message: 'Profile updated successfully',
            user: updatedUser,
        });
    } catch (error) {
        logger.error(`Update profile error: ${error instanceof Error ? error.message : 'Unknown error'}`);
        res.status(500).json({ message: 'Internal server error during profile update.' });
    }
};


