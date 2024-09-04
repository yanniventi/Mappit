import { Pool } from 'pg';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Create a connection pool
const pool = new Pool({
    user: process.env.DB_USER as string,
    host: process.env.DB_HOST as string,
    database: process.env.DB as string,
    password: process.env.DB_PASS as string,
    port: parseInt(process.env.DB_PORT as string, 10),
    max: 10,              // Max number of clients in the pool
    idleTimeoutMillis: 30000, // How long a client is allowed to remain idle before being closed
});

// Handle errors with the connection pool
pool.on('error', (err: Error) => {
    console.error('Unexpected error on idle client', err);
    process.exit(-1); // Exit the application on error
});

// Export the pool to use in other parts of the application
export default pool;
