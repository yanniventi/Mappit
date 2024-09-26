import { Request, Response } from 'express';
import { createUser, loginUser, checkUserExists } from './../models/userModel';
import { logger } from './../utils/logger';

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

        // If successful, return the user data (without the password)
        res.status(200).json({
            message: 'Login successful',
            user: {
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
            },
        });
    } catch (error) {
        logger.error(`Login error: ${error instanceof Error ? error.message : 'Unknown error'}`);
        // Avoid sending the specific error message to the client for security
        res.status(401).json({ message: 'Invalid email or password' });
    }
};
