import pool from '../config/db'; // Import the database connection

// Function to create the 'placesInTrip' table
export const createplacesInTripTable = async (): Promise<void> => {
    const query = `
        CREATE TABLE IF NOT EXISTS placesInTrip (
            id SERIAL PRIMARY KEY,
            user_id INT NOT NULL,
            trips_id INT NOT NULL,     
            places_id VARCHAR(255),
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
            FOREIGN KEY (trips_id) REFERENCES trips(id) ON DELETE CASCADE
        );
    `;
    try {
        await pool.query(query);
        console.log('placesInTrip table created successfully.');
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error creating placesInTrip table:', error.message);
        } else {
            console.error('Unexpected error:', error);
        }
    }
};
