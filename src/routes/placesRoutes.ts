import { Router } from 'express';
import { getPlaces, createPlaceInTrip, getPlaceInTrip } from '../controllers/placescontroller';

const router = Router();

// Route to get all places for a user's trips
router.get('/users/:userId/places', getPlaces);

// Route to create a new place in a trip for a user
router.post('/users/:userId/places', createPlaceInTrip);

// Route to get a specific place in a trip by place ID
router.get('/places/:tripId', getPlaceInTrip);

export default router;