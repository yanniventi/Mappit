import express from 'express';
import cluster from 'cluster';
import { config } from './config';
import { logger } from './utils/logger';
import trafficRoutes from './routes/trafficRoutes';
import authRoutes from './routes/authRoutes';
import resetPasswordRoutes from './routes/resetPassword';
import placeRoutes from './routes/placeRoutes';

const app = express();

// Middleware to parse JSON request bodies
app.use(express.json());

// Use the user routes
app.use('/api', authRoutes);
app.use('/api', resetPasswordRoutes);
app.use('/api', trafficRoutes);
app.use('/api', placeRoutes); 

app.listen(config.port, function () {
    const workerId =
        cluster.worker && cluster.worker.id ? cluster.worker.id : undefined;
    logger.info(
        `worker started: ${workerId} | server listening on port: ${config.port}`
    );
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

export default app;
