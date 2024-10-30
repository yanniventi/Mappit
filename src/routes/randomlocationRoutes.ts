// routes/locationRoutes.ts
import { Router } from 'express';
import { getRandomLocationNameController } from '../controllers/randomlocationController';

const router = Router();

// Route to get a random location name
router.get('/locations/random', getRandomLocationNameController);

export default router;
