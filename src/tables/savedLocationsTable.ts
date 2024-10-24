import pool from '../config/db'; // Import the database connection

// Function to create the 'users' table
export const createSavedLocationsTable = async (): Promise<void> => {
    const query = `
        CREATE TABLE IF NOT EXIST saved_locations (
            id SERIAL PRIMARY KEY,  -- Auto-incrementing ID for saved locations
            user_id INT NOT NULL,   -- Foreign key referencing the users table
            location_id INT NOT NULL, -- Foreign key referencing the locations table
            saved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Optional, to track when the location was saved
            CONSTRAINT fk_user
                FOREIGN KEY(user_id) 
                REFERENCES users(id)
                ON DELETE CASCADE,   -- If the user is deleted, their saved locations are also deleted
            CONSTRAINT fk_location
                FOREIGN KEY(location_id)
                REFERENCES locations(id)
                ON DELETE CASCADE    -- If the location is deleted, its saved records are deleted
        );
    `;
    try {
        await pool.query(query);
        console.log('saved_locations table created successfully.');
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error creating saved_locations table:', error.message);
        } else {
            console.error('Unexpected error:', error);
        }
    }
};
