import express from 'express';
import cluster from 'cluster';
import { config } from './config';
import { logger } from './utils/logger';
import cors from 'cors';
import trafficRoutes from './routes/trafficRoutes';
import userRoutes from './routes/userRoutes';
import resetPasswordRoutes from './routes/resetPassword';
import weatherForecastRoutes from './routes/weatherForecast';
import placeRoutes from './routes/placeRoutes';
import locationRoutes from './routes/locationRoutes';
import tripRoutes from './routes/tripRoutes';
import randomlocationRoutes from './routes/randomlocationRoutes';
import expensesRoutes from './routes/expensesRoutes';
import placesRoutes from './routes/placesRoutes';
import subLocationsRoutes from './routes/subLocationsRoutes';

import path from 'path'; // For resolving directory paths

const app = express();

app.disable("x-powered-by"); // Reduce fingerprinting


// Enable CORS for all requests from your frontend URL
app.use(cors({
    origin: 'http://localhost:3001',  // Replace with your frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],  // Allowed HTTP methods
    credentials: true,  // If you're dealing with cookies or authentication
}));

// Manually handle preflight requests for all routes
app.use((req, res, next) => {
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Origin', 'http://localhost:3001');
        res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
        res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        return res.status(200).json({});
    }
    next();
});


// Middleware to parse JSON request bodies
app.use(express.json());

// Use the user routes
app.use('/api', userRoutes);
app.use('/api', resetPasswordRoutes);
app.use('/api', trafficRoutes);
app.use('/api', weatherForecastRoutes);
app.use('/api', placeRoutes); 
app.use('/api', locationRoutes);
app.use('/api', tripRoutes);
app.use('/api', randomlocationRoutes);
app.use('/api', expensesRoutes);
app.use('/api', placesRoutes);
app.use('/api', subLocationsRoutes);
app.use('/api/assets/locations', express.static(path.join(__dirname, '../src/assets/locations'))); // serve the static files (images) to the client

app.listen(config.port, function () {
    const workerId =
        cluster.worker && cluster.worker.id ? cluster.worker.id : undefined;
    logger.info(
        `worker started: ${workerId} | server listening on port: ${config.port}`
    );
});

export default app;
