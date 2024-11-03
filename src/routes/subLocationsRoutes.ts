import { Router } from 'express';
import { getSublocationsByLocationId } from '../controllers/subLocationsController';

const router = Router();

// Define the routes
router.get('/sublocations/:location_id', getSublocationsByLocationId);

export default router;