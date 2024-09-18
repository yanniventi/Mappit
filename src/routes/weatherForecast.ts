import { Router } from 'express';
import { getWeatherForecast } from '../controllers/weatherForecastController';

const router = Router();

// Define the routes
router.post('/forecast', getWeatherForecast);   // Handle user signup

export default router;