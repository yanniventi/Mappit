import pool from '../config/db';
import { QueryResult } from 'pg';

interface Expense {
    user_id: number;
    trips_id: number;
    name: string;
    category: string;
    amount: number;
    date: string; // Ensure this is passed in a valid `YYYY-MM-DD` format
    payment_type: string;
}

/**
 * Inserts a new expense into the expenses table.
 * @param { Expense } expense
 * @returns { Promise<string> }
 */
export const insertExpenseModel = async (expense: Expense): Promise<string> => {
    const query = `
        INSERT INTO expenses (user_id, trips_id, name, category, amount, date, payment_type)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING id;
    `;
    const values = [expense.user_id, expense.trips_id, expense.name, expense.category, expense.amount, expense.date, expense.payment_type];

    try {
        const result: QueryResult = await pool.query(query, values);
        return `Expense inserted with ID: ${result.rows[0].id}`;
    } catch (error) {
        console.error('Error inserting expense:', error);
        throw new Error('Failed to insert expense. Please try again later.');
    }
};

/**
 * Retrieves all expenses for a given user.
 * @param { number } userId
 * @returns { Promise<Expense[]> }
 */
export const getExpensesModel = async (userId: number): Promise<Expense[]> => {
    const query = `
        SELECT id, trips_id, name, category, amount, date, payment_type
        FROM expenses
        WHERE user_id = $1
        ORDER BY date DESC;
    `;
    
    try {
        const result: QueryResult = await pool.query(query, [userId]);
        return result.rows as Expense[];
    } catch (error) {
        console.error('Error retrieving expenses by user ID:', error);
        throw new Error('Failed to retrieve expenses for the specified user.');
    }
};

/**
 * Retrieves all expenses for a given trip ID.
 * @param { number } tripsId
 * @returns { Promise<Expense[]> }
 */
export const getExpensesByTripIdModel = async (tripsId: number): Promise<Expense[]> => {
    const query = `
        SELECT id, user_id, name, category, amount, date, payment_type
        FROM expenses
        WHERE trips_id = $1
        ORDER BY date DESC;
    `;
    
    try {
        const result: QueryResult = await pool.query(query, [tripsId]);
        return result.rows as Expense[];
    } catch (error) {
        console.error('Error retrieving expenses by trip ID:', error);
        throw new Error('Failed to retrieve expenses for the specified trip.');
    }
};

/**
 * Deletes an expense by user_id and expense_id.
 * @param { number } user_id
 * @param { number } expense_id
 * @returns { Promise<string> }
 */
export const deleteExpenseModel = async (expense_id: number): Promise<string> => {
    const query = 'DELETE FROM expenses WHERE id = $1';
    const values = [expense_id];

    try {
        const result: QueryResult = await pool.query(query, values);
        if (result.rowCount === 0) {
            throw new Error('No expense found with the specified IDs.');
        }
        return 'Expense deleted successfully.';
    } catch (error) {
        console.error('Error deleting expense:', error);
        throw new Error('Failed to delete expense. Please try again later.');
    }
};
