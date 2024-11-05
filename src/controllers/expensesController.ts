import { Request, Response } from 'express';
import { logger } from './../utils/logger';
import { insertExpenseModel, getExpensesModel, deleteExpenseModel } from './../models/expensesModel';
import { QueryResult } from 'pg';

/**
 * Inserts a new expense into the database.
 * @param { Request } req
 * @param { Response } res
 * @returns { Promise<void> }
 */
export const insertExpense = async (req: Request, res: Response): Promise<void> => {
    const { user_id, name, category, amount, date, payment_type } = req.body;
    
    if (!user_id || !name || !category || !amount || !date || !payment_type) {
        res.status(400).json({
            status: 'error',
            message: 'Missing required fields',
            statusCode: 400,
        });
        return;
    }

    try {
        await insertExpenseModel({ user_id, name, category, amount, date, payment_type });
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
 * Retrieves expenses from the database.
 * @param { Request } req
 * @param { Response } res
 * @returns { Promise<void> }
 */
export const getExpenses = async (req: Request, res: Response): Promise<void> => {
    const { user_id } = req.body;

    try {
        const result: QueryResult = await getExpensesModel(user_id);
        res.status(200).json({
            status: 'ok',
            message: result.rows,
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
 * Deletes an expense from the database.
 * @param { Request } req
 * @param { Response } res
 * @returns { Promise<void> }
 */
export const deleteExpense = async (req: Request, res: Response): Promise<void> => {
    const { user_id, expense_id } = req.body;

    // Validate required fields
    if (!user_id || !expense_id) {
        res.status(400).json({
            status: 'error',
            message: 'Missing required fields',
            statusCode: 400,
        });
        return;
    }

    try {
        const deleteResult = await deleteExpenseModel(user_id, expense_id);

        if (deleteResult.rowCount === 0) {
            res.status(404).json({
                status: 'error',
                message: 'Expense not found or not deleted',
                statusCode: 404,
            });
        } else {
            res.status(200).json({
                status: 'ok',
                message: 'Expense deleted successfully',
                statusCode: 200,
            });
        }
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
