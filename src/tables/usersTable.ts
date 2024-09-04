import pool from '../config/db'; // Import the database connection

// Function to create the 'users' table
export const createUsersTable = async (): Promise<void> => {
    const query = `
        CREATE TABLE IF NOT EXISTS users (
            email VARCHAR(255) PRIMARY KEY,
            password VARCHAR(255) NOT NULL,
            first_name VARCHAR(100),
            last_name VARCHAR(100),
            age INT,
            phone_number VARCHAR(15),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `;
    try {
        await pool.query(query);
        console.log('Users table created successfully.');
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error creating Users table:', error.message);
        } else {
            console.error('Unexpected error:', error);
        }
    }
};
