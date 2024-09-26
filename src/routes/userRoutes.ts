import { Router } from 'express';
import { signup, login } from '../controllers/userController';

const router = Router();

// Define the routes
router.post('/signup', signup);   // Handle user signup
router.post('/login', login);     // Handle user login

export default router;