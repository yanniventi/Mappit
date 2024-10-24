import { Router } from 'express';
import { fetchAllLocationsController, fetchSavedLocationsController } from '../controllers/locationController';
// import { verify } from "../Middleware/verify.js";

const router = Router();

// Define the routes
router.get('/get-locations', fetchAllLocationsController);
router.post('/get-saved-locations', fetchSavedLocationsController);
// get saved locoation (ID), remove saved location (ID, SAVEDLOCATIONID)

export default router;