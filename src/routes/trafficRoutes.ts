import { Router } from 'express';
import { getDensityData } from '../controllers/trafficController';

const router = Router();

router.get('/density', getDensityData);

export default router;
