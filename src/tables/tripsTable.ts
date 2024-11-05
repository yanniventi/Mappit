import pool from '../config/db'; // Import the database connection

// Function to create the 'users' table
export const createTripsTable = async (): Promise<void> => {
    const query = `
        CREATE TABLE IF NOT EXISTS trips (
            id SERIAL PRIMARY KEY, 
            user_id INT NOT NULL,
            places_id VARCHAR(255) NOT NULL,
            location_name VARCHAR(255),
            start_date DATE NOT NULL, 
            end_date DATE,             
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        );
    `;
    try {
        await pool.query(query);
        console.log('trips table created successfully.');
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error creating trips table:', error.message);
        } else {
            console.error('Unexpected error:', error);
        }
    }
};
