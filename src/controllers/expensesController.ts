import { Request, Response } from 'express';
import { logger } from './../utils/logger';
import { insertExpenseModel, getExpensesModel, getExpensesByTripIdModel, deleteExpenseModel } from './../models/expensesModel';

/**
 * Inserts a new expense into the database.
 * @param { Request } req
 * @param { Response } res
 * @returns { Promise<void> }
 */
export const insertExpense = async (req: Request, res: Response): Promise<void> => {
    const { user_id, trips_id, name, category, amount, date, payment_type } = req.body;

    // Validate required fields
    if (!user_id || !trips_id || !name || !category || !amount || !date || !payment_type) {
        res.status(400).json({
            status: 'error',
            message: 'Missing required fields',
            statusCode: 400,
        });
        return;
    }

    try {
        await insertExpenseModel({ user_id, trips_id, name, category, amount, date, payment_type });
        res.status(201).json({
            status: 'ok',
            message: 'Expense inserted successfully',
            statusCode: 201,
        });
    } catch (error) {
        const errMsg = error instanceof Error ? error.message : 'Unknown error occurred';
        logger.error(`insertExpense error: ${errMsg}`);
        res.status(500).json({
            status: 'error',
            message: 'Failed to insert expense',
            statusCode: 500,
        });
    }
};

/**
 * Retrieves expenses by user ID from the database.
 * @param { Request } req
 * @param { Response } res
 * @returns { Promise<void> }
 */
export const getExpenses = async (req: Request, res: Response): Promise<void> => {
    const { userId } = req.params;

    try {
        const expenses = await getExpensesModel(Number(userId));
        res.status(200).json({
            status: 'ok',
            data: expenses,
            statusCode: 200,
        });
    } catch (error) {
        const errMsg = error instanceof Error ? error.message : 'Unknown error occurred';
        logger.error(`getExpenses error: ${errMsg}`);
        res.status(500).json({
            status: 'error',
            message: 'Failed to retrieve expenses',
            statusCode: 500,
        });
    }
};

/**
 * Retrieves expenses by trip ID from the database.
 * @param { Request } req
 * @param { Response } res
 * @returns { Promise<void> }
 */
export const getExpensesByTripId = async (req: Request, res: Response): Promise<void> => {
    const { tripsId } = req.params;

    try {
        const expenses = await getExpensesByTripIdModel(Number(tripsId));
        res.status(200).json({
            status: 'ok',
            data: expenses,
            statusCode: 200,
        });
    } catch (error) {
        const errMsg = error instanceof Error ? error.message : 'Unknown error occurred';
        logger.error(`getExpensesByTripId error: ${errMsg}`);
        res.status(500).json({
            status: 'error',
            message: 'Failed to retrieve expenses for the specified trip',
            statusCode: 500,
        });
    }
};

/**
 * Deletes an expense from the database by user ID and expense ID.
 * @param { Request } req
 * @param { Response } res
 * @returns { Promise<void> }
 */
export const deleteExpense = async (req: Request, res: Response): Promise<void> => {
    const { expenseId } = req.params;

    // Validate required fields
    if (!expenseId) {
        res.status(400).json({
            status: 'error',
            message: 'Missing required fields',
            statusCode: 400,
        });
        return;
    }

    try {
        const message = await deleteExpenseModel(Number(expenseId));
        res.status(200).json({
            status: 'ok',
            message,
            statusCode: 200,
        });
    } catch (error) {
        const errMsg = error instanceof Error ? error.message : 'Unknown error occurred';
        logger.error(`deleteExpense error: ${errMsg}`);
        res.status(500).json({
            status: 'error',
            message: 'Failed to delete expense',
            statusCode: 500,
        });
    }
};
