import { Router } from 'express';
import { fetchAllLocationsController, fetchSavedLocationsController, removeSavedLocationController, addSavedLocationController } from '../controllers/locationController';
// import { verify } from "../Middleware/verify.js";

const router = Router();

// Define the routes
router.get('/get-locations', fetchAllLocationsController);
router.post('/get-saved-locations', fetchSavedLocationsController);
router.post('/add-saved-location', addSavedLocationController)
router.post('/remove-saved-location', removeSavedLocationController);

export default router;