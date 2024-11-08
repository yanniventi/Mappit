import { Router } from 'express';
import { getTrips, createTrip, getTrip, deleteTrip, updateTrip, getBudget, setBudget } from '../controllers/tripcontroller';

const router = Router();

// Route to get all trips for a user
router.get('/users/:userId/trips', getTrips);

// Route to create a new trip for a user
router.post('/users/:userId/trips', createTrip);

// Route to get a specific trip by trip ID
router.get('/trips/:tripId', getTrip);

// Route to delete a specific trip by trip ID
router.delete('/trips/:tripId', deleteTrip);

// Route to update a specific trip by trip ID
router.put('/trips/:tripId', updateTrip);

// Route to get the budget for a specific trip
router.get('/trips/:tripId/budget', getBudget);

// Route to set or update the budget for a specific trip
router.put('/trips/:tripId/budget', setBudget);


export default router;
