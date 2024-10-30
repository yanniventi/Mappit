import { Router } from 'express';
import { insertExpense, getExpenses } from '../controllers/expensesController';

const router = Router();

// Define the routes
router.post('/get-expenses', getExpenses);
router.post('/add-expenses', insertExpense);

export default router;