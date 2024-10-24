import pool from '../config/db'; // Database connection
import { createUsersTable } from '../tables/usersTable'; // Import the createUsersTable function
import { createLocationsTable, insertLocations } from '../tables/locationsTable';
import { createExpensesTable } from '../tables/expensesTable';
import { createSavedLocationsTable } from '../tables/savedLocationsTable';

// Main function to create all tables
const createAllTables = async () => {
    try {
        await createUsersTable();  // Create the users table
        await createLocationsTable(); // Create the locations table
        await insertLocations(); // Insert placeholder data
        await createExpensesTable(); // Create Expenses table
        await createSavedLocationsTable(); // Create Saved-locations table
    } catch (error) {
        console.error('Error creating tables:', error);
    } finally {
        await pool.end();  // Close the pool
    }

    console.log('All tables created successfully.');
};

// Execute the table creation
createAllTables();
