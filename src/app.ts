import express from 'express';
import cluster from 'cluster';
import { config } from './config';
import { logger } from './utils/logger';

import authRoutes from './routes/authRoutes';

const app = express();

// Middleware to parse JSON request bodies
app.use(express.json());

// Use the user routes
app.use('/api', authRoutes);

app.listen(config.port, function () {
    const workerId =
        cluster.worker && cluster.worker.id ? cluster.worker.id : undefined;
    logger.info(
        `worker started: ${workerId} | server listening on port: ${config.port}`
    );
});


export default app;

