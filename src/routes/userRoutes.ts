import { Router } from 'express';
import { signup, login, updateProfile } from '../controllers/userController';
import { verify } from "../Middleware/verify.js";

const router = Router();

// Define the routes
router.post('/signup', signup);   // Handle user signup
router.post('/login', login);     // Handle user login
router.post('/update-profile', verify, updateProfile);     // Handle user login

export default router;