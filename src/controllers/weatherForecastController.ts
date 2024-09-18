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
        const weatherResponse = await axios.get('https://api-open.data.gov.sg/v2/real-time/api/two-hr-forecast');
        console.log("i m running");
        const { data } = weatherResponse.data;

        // Find the closest area to the provided latitude and longitude
        const closestArea = findClosestArea(latitude, longitude, data.area_metadata);
        
        // Handle case when no closest area is found
        if (!closestArea) {
            res.status(404).json({
                status: 'error',
                message: 'No nearby weather area found for the provided coordinates',
                statusCode: 404,
            });
            return;
        }

        // Find the forecast for the closest area
        const forecast = data.items[0].forecasts.find((f: any) => f.area === closestArea.name);

        // Handle case when forecast for the area is not available
        if (!forecast) {
            res.status(404).json({
                status: 'error',
                message: `No forecast available for the area: ${closestArea.name}`,
                statusCode: 404,
            });
            return;
        }

        // Return the weather forecast
        res.status(200).json({
            status: 'success',
            data: {
                area: closestArea.name,
                forecast: forecast.forecast,
                timestamp: data.items[0].timestamp
            },
            statusCode: 200,
        });

    } catch (error) {
        logger.error(`getWeatherForecast error: ${error.message}`);
        res.status(500).json({
            status: 'error',
            message: error.message,
            statusCode: 500,
        });
    }

};




