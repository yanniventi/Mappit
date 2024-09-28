import { Router } from 'express';
import { signup, login } from '../controllers/userController';
import { verify } from "../Middleware/verify.js";

const router = Router();

// Define the routes
router.post('/signup', signup);   // Handle user signup
router.post('/login', login);     // Handle user login
router.get("/verify", verify, (req, res) => { // fn order matters
    res.status(200).json({
        status: "success",
        message: "Verify (Middleware) test passed",
    });
});

export default router;