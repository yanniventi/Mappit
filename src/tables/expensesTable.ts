import pool from '../config/db';

export const createExpensesTable = async (): Promise<void> => {
    const query = `
        CREATE TABLE IF NOT EXISTS expenses (
            id SERIAL PRIMARY KEY,
            user_id INT NOT NULL,
            trips_id INT NOT NULL,
            name TEXT NOT NULL,
            category TEXT NOT NULL,
            amount REAL NOT NULL,
            date DATE NOT NULL,
            payment_type TEXT NOT NULL,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
            FOREIGN KEY (trips_id) REFERENCES trips(id) ON DELETE CASCADE
        );
    `;
    try {
        await pool.query(query);
        console.log('Expenses table created successfully.');
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error creating Expenses table:', error.message);
        } else {
            console.error('Unexpected error:', error);
        }
    }
};
