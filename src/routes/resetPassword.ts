import { Router } from 'express';
import { requestPasswordReset, resetPassword } from '../controllers/resetPasswordController';

const router = Router();

// Define the route for requesting a password reset
router.post('/request-password-reset', requestPasswordReset);

// Define the route for resetting the password using the token
router.post('/reset-password/:token', resetPassword);

export default router;
