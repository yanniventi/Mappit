import pool from '../config/db'; // Database connection
import { createUsersTable } from '../tables/usersTable'; // Import the createUsersTable function
import { createLocationsTable, 
    // insertLocations 
} from '../tables/locationsTable';
import {createTripsTable } from '../tables/tripsTable';
import { createExpensesTable } from '../tables/expensesTable';
import { createSavedLocationsTable } from '../tables/savedLocationsTable';
import { createplacesInTripTable } from '../tables/placesTable';
import { createSublocationsTable } from '../tables/subLocationsTable';
// import { insertSublocations } from '../tables/subLocationsTable';

// Main function to create all tables
const createAllTables = async () => {
    try {
        await createUsersTable();  // Create the users table
        await createLocationsTable(); // Create the locations table
        // await insertLocations(); // Insert placeholder data
        await createTripsTable();
        await createExpensesTable(); // Create Expenses table
        await createSavedLocationsTable(); // Create Saved-locations table
        await createplacesInTripTable(); // Create PLavesIntrip table 
        await createSublocationsTable(); // Create SubLocations table
        // await insertSublocations(); // Insert Sublocations data

    } catch (error) {
        console.error('Error creating tables:', error);
    } finally {
        await pool.end();  // Close the pool
    }

    console.log('All tables created successfully.');
};

// Execute the table creation
createAllTables();
