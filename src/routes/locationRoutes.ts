import { Router } from 'express';
import { fetchLocationsController } from '../controllers/locationController';
// import { verify } from "../Middleware/verify.js";

const router = Router();

// Define the routes
router.post('/get-locations', fetchLocationsController);  

export default router;