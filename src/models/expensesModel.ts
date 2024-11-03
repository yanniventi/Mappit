import pool from '../config/db';
import { QueryResult } from 'pg';

interface Expense {
    user_id: number;
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
        INSERT INTO expenses (user_id, name, category, amount, date, payment_type)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id;
    `;
    const values = [expense.user_id, expense.name, expense.category, expense.amount, expense.date, expense.payment_type];

    try {
        const result: QueryResult = await pool.query(query, values);
        return `Expense inserted with ID: ${result.rows[0].id}`;
    } catch (error) {
        throw new Error('Failed to insert expense');
    }
};

/**
 * Retrieves all expenses for a given user.
 * @param { number } userId
 * @returns { Promise<QueryResult> }
 */
export const getExpensesModel = async (userId: number): Promise<QueryResult> => {
    const query = `
        SELECT id, name, category, amount, date, payment_type
        FROM expenses
        WHERE user_id = $1
        ORDER BY date DESC;
    `;
    
    try {
        const result: QueryResult = await pool.query(query, [userId]);
        return result;
    } catch (error) {
        throw new Error('Failed to retrieve expenses');
    }
};

/**
 * Deletes an expense by user_id and expense_id
 * @param { string } user_id
 * @param { string } expense_id
 * @returns { Promise<QueryResult> }
 */
export const deleteExpenseModel = async (user_id: string, expense_id: string): Promise<QueryResult> => {
    const query = 'DELETE FROM expenses WHERE user_id = $1 AND id = $2';
    const values = [user_id, expense_id];
    return pool.query(query, values);
};
