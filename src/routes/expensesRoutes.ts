import { Router } from 'express';
import { insertExpense, getExpenses, deleteExpense } from '../controllers/expensesController';

const router = Router();

// Define the routes
router.post('/get-expenses', getExpenses);
router.post('/add-expenses', insertExpense);
router.delete('/delete-expense', deleteExpense);

export default router;