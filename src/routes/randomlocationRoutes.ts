// routes/locationRoutes.ts
import { Router } from 'express';
import { getRandomLocationController } from '../controllers/randomlocationController';

const router = Router();

// Route to get a random location name
router.get('/locations/random', getRandomLocationController);

export default router;
