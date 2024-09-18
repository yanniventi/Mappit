import { Request, Response } from 'express';
import { createUser, loginUser, checkUserExists } from './../models/userModel';
import { logger } from './../utils/logger';

export const signup = async (req: Request, res: Response): Promise<void> => {
    const { firstName, lastName, password, email, age, phoneNumber } = req.body;

    // Basic validation for incoming request data
    if (!email || !password || !firstName || !lastName) {
        res.status(400).json({ message: 'Missing required fields' });
        return;
    }

    try {
        const existingUser = await checkUserExists(email);
        if (existingUser) {
            res.status(409).json({ message: 'Email already exists' });
            return;
        }

        const newUser = await createUser({ firstName, lastName, password, email, age, phoneNumber });
        res.status(201).json({
            message: 'User created successfully',
            user: { firstName: newUser.firstName, lastName: newUser.lastName, email: newUser.email },
        });
    } catch (error) {
        if (error instanceof Error) {
            logger.error(`signup error: ${error.message}`);
        } else {
            logger.error('Unexpected error type during signup');
        }
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const login = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;

    // Basic validation for incoming request data
    if (!email || !password) {
        res.status(400).json({ message: 'Email and password are required' });
        return;
    }

    try {
        const user = await loginUser(email, password);
        res.status(200).json({
            message: 'Login successful',
            user: {
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
            },
        });
    } catch (error) {
        if (error instanceof Error) {
            logger.error(`login error: ${error.message}`);
            res.status(401).json({ message: 'Invalid email or password' });
        } else {
            logger.error('Unexpected error type during login');
            res.status(500).json({ message: 'Internal server error' });
        }
    }
};
