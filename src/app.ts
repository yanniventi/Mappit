import express from 'express';

import cluster from 'cluster';
import { logger } from './utils/logger';
import { cpus } from 'os';
//import controllers
import { healthcheck } from './controllers/controller-healthcheck';
import { getTime, sampleTransaction } from './controllers/controller-sample';
import { signup, login } from './controllers/authController';


const app = express();

// Middleware to parse JSON request bodies
app.use(express.json());

// Use the user routes
app.use('/api', usersRoutes);


    //healthcheck routes
    router.get('/', healthcheck);
    router.get('/healthcheck', healthcheck);

    // sampleController routes
    router.get('/servertime', getTime);
    router.get('/transaction', sampleTransaction);

    //auth routes
    router.post('/signup', signup);
    router.post('/login', login);

    app.listen(config.port, function () {
        const workerId =
            cluster.worker && cluster.worker.id ? cluster.worker.id : undefined;
        logger.info(
            `worker started: ${workerId} | server listening on port: ${config.port}`
        );
    });
}

export default app;

