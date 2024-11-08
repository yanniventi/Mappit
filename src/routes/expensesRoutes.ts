import { Router } from 'express';
import { insertExpense, getExpenses, getExpensesByTripId, deleteExpense } from '../controllers/expensesController';

const router = Router();

// Define the routes
router.post('/add-expenses', insertExpense);
router.get('/get-expenses/:userId', getExpenses);  // Get expenses by user ID
router.get('/get-expenses/trip/:tripsId', getExpensesByTripId);  // Get expenses by trip ID
router.delete('/delete-expense/:userId/:expenseId', deleteExpense);  // Delete expense by user ID and expense ID

export default router;
