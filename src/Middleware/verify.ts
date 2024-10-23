import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { findUserByEmail } from '../models/userModel';
import { JWTpayload } from '../types';

export async function verify(req: Request, res: Response, next: NextFunction) {
    try {
        // Get the Authorization header
        const authHeader = req.headers['authorization'];

        // Check if Authorization header is present and properly formatted
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Unauthorized. Token missing or malformed.' });
        }

        // Extract the token from the Authorization header
        const token = authHeader.split(' ')[1];

        // Verify the JWT token using your secret key
        jwt.verify(token, process.env.SECRET_ACCESS_TOKEN as string, async (err, decoded) => {
            if (err) {
                return res.status(401).json({ message: 'Invalid or expired token. Please log in again.' });
            }

            const { email } = decoded as JWTpayload; // Get the email (or user id) from the decoded token

            // Find the user by email
            const user = await findUserByEmail(email);
            if (!user) {
                return res.status(404).json({ message: 'User not found.' });
            }

            // Attach user data to the request object
            req.user = user;
            next(); // Proceed to the next middleware or route handler
        });
    } catch (err) {
        res.status(500).json({
            status: "error",
            code: 500,
            message: "Internal Server Error",
        });
    }
}