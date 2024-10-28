import { Router } from 'express';
import { getTrips, createTrip, getTrip } from '../controllers/tripcontroller';

const router = Router();

// Route to get all trips for a user
router.get('/users/:userId/trips', getTrips);

// Route to create a new trip for a user
router.post('/users/:userId/trips', createTrip);

// Route to get a specific trip by trip ID
router.get('/trips/:tripId', getTrip);

export default router;
