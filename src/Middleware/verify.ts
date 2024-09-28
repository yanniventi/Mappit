import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { findUserByEmail } from '../models/userModel';

// Define the structure of the decoded JWT token
interface DecodedToken {
    email: string;
}



export async function verify(req: Request, res: Response, next: NextFunction) {
    try {
        const authHeader = req.headers["cookie"]; // get the session cookie from request header

        if (!authHeader) return res.sendStatus(401); // if there is no cookie from request header, send an unauthorized response.
        const cookie = authHeader.split("=")[1]; // If there is, split the cookie string to get the actual jwt

        // Verify using jwt to see if token has been tampered with or if it has expired.
        // that's like checking the integrity of the cookie
        jwt.verify(cookie, process.env.SECRET_ACCESS_TOKEN as string, async (err, decoded) => {
            if (err) {
                // if token has been altered or has expired, return an unauthorized error
                return res
                    .status(401)
                    .json({ message: "This session has expired. Please login" });
            }

            const { email } = decoded as DecodedToken; // get user id from the decoded token
            const user = await findUserByEmail(email); // find user by that email
            req.user = user; // put the data object into req.user
            next();
        });
    } catch (err) {
        res.status(500).json({
            status: "error",
            code: 500,
            data: [],
            message: "Internal Server Error",
        });
    }
}