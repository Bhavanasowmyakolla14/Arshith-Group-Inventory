const express = require('express');
const router = express.Router();
const {
  getExpenses,
  createExpense,
  updateExpenseStatus,
  recordClientPayment,
  getProjectFinances,
} = require('../controllers/financeController');
const { authenticate } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/rbacMiddleware');

router.get('/expenses', authenticate, getExpenses);
router.post('/expenses', authenticate, createExpense);
router.patch('/expenses/:id/status', authenticate, authorize(['SUPER_ADMIN', 'FINANCE_MANAGER']), updateExpenseStatus);
router.post('/payments', authenticate, authorize(['SUPER_ADMIN', 'FINANCE_MANAGER']), recordClientPayment);
router.get('/projects/:projectId', authenticate, getProjectFinances);

module.exports = router;

