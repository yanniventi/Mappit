import { Request, Response } from 'express';
import { createUser, loginUser } from './../models/userModel';
import { logger } from './../utils/logger';

export const signup = async (req: Request, res: Response): Promise<void> => {
    const { firstName, lastName, password, email } = req.body;

    try {
        // console.log("start");
        // const existingUser = await checkUserExists(email);
        // console.log("end");
        // if (existingUser) {
        //     res.status(400).json({ message: 'Username already taken' });
        //     return;
        // }
        

        const newUser = await createUser({ firstName, lastName, password, email });
        res.status(201).json({
            message: 'User created successfully',
            user: { firstName: newUser.firstName, lastName: newUser.lastName, email: newUser.email },
        });
    } catch (error) {
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
        // Call the loginUser function to authenticate the user
        const user = await loginUser(email, password);

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
        // Log the error and return an appropriate error response
        logger.error(`loginController error: ${error.message}`);

        // For security reasons, avoid exposing specific error details (e.g., invalid credentials)
        res.status(401).json({ message: 'Invalid email or password' });
    }
};