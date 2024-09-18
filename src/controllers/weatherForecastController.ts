import { Request, Response } from 'express';
import { logger } from './../utils/logger';

import { findClosestArea } from '../utils/distanceUtil';
import axios from 'axios';

export const getWeatherForecast = async (req: Request, res: Response): Promise<void> => {
    const { latitude, longitude } = req.body;

    if (!latitude || !longitude) {
        res.status(400).json({
            status: 'error',
            message: 'Latitude and Longitude are required',
            statusCode: 400,
        });
        return;
    }

    try {
        // Fetch the weather data from the API
        const weatherResponse = await axios.get('https://api.data.gov.sg/v2/environment/2-hour-weather-forecast');
        const { data } = weatherResponse.data;

        // Find the closest area to the provided latitude and longitude
        const closestArea = findClosestArea(latitude, longitude, data.area_metadata);

        // Find the forecast for the closest area
        const forecast = data.items[0].forecasts.find((f: any) => f.area === closestArea.name);

    } catch (error) {
        logger.error(`getWeatherForecast error: ${error.message}`);
        res.status(500).json({
            status: 'error',
            message: error.message,
            statusCode: 500,
        });
    }

};




