import pool from '../config/db'; // Database connection
import { createUsersTable } from '../tables/usersTable'; // Import the createUsersTable function

// Main function to create all tables
const createAllTables = async () => {
    try {
        await createUsersTable();  // Create the users table
    } catch (error) {
        console.error('Error creating tables:', error);
    } finally {
        await pool.end();  // Close the pool
    }

    console.log('All tables created successfully.');
};

// Execute the table creation
createAllTables();
