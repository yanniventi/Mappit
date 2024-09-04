import express from 'express';
import usersRoutes from './routes/usersRoutes';

const app = express();

// Middleware to parse JSON request bodies
app.use(express.json());

// Use the user routes
app.use('/api', usersRoutes);

export default app;
