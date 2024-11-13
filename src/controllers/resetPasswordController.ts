import { Request, Response } from 'express';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import pool from '../config/db';
import bcrypt from 'bcrypt';

// Nodemailer configuration
const transporter = nodemailer.createTransport({
    service: 'gmail',  // or your email provider
    auth: {
        user: process.env.EMAIL_USER,  // your email address
        pass: process.env.EMAIL_PASS,  // your email password or app-specific password
    },
    tls: {
        rejectUnauthorized: false,  // Ignore invalid/self-signed certificates
    },
});

// Request password reset (send email with reset link)
export const requestPasswordReset = async (req: Request, res: Response): Promise<Response> => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ error: 'Email is required' });
    }

    try {
        // Check if the user exists
        const userQuery = 'SELECT * FROM users WHERE email = $1';
        const userResult = await pool.query(userQuery, [email]);

        if (userResult.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Generate a reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenExpires = new Date(Date.now() + 3600000); // Token valid for 1 hour

        // Store the reset token and expiration in the database
        const updateQuery = 'UPDATE users SET reset_token = $1, reset_token_expires = $2 WHERE email = $3';
        await pool.query(updateQuery, [resetToken, resetTokenExpires, email]);

        // Send email with the reset link
        const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Password Reset',
            text: `Click the following link to reset your password: ${resetLink}`,
        };

        await transporter.sendMail(mailOptions);

        return res.status(200).json({ message: 'Password reset link sent to your email.' });
    } catch (error) {
        console.error('Error requesting password reset:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

// Reset password using the token
export const resetPassword = async (req: Request, res: Response): Promise<Response> => {
    const { token } = req.params;
    const { newPassword } = req.body;

    if (!newPassword) {
        return res.status(400).json({ error: 'New password is required' });
    }

    try {
        // Check if the token is valid and not expired
        const query = 'SELECT * FROM users WHERE reset_token = $1 AND reset_token_expires > NOW()';
        const result = await pool.query(query, [token]);

        if (result.rows.length === 0) {
            return res.status(400).json({ error: 'Invalid or expired token' });
        }

        const email = result.rows[0].email;

        // Hash the new password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

        // Update the user's password in the database and clear the reset token
        const updateQuery = 'UPDATE users SET password = $1, reset_token = NULL, reset_token_expires = NULL WHERE email = $2';
        await pool.query(updateQuery, [hashedPassword, email]);

        return res.status(200).json({ message: 'Password has been reset successfully' });
    } catch (error) {
        console.error('Error resetting password:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};
