const { store } = require('../services/dataStore');

// Helper to recalculate project finances when expenses/payments change
const syncProjectFinances = (projectId) => {
  const project = store.getCollection('projects').find((p) => p.id === projectId);
  if (!project) return;

  const expenses = store.getCollection('expenses').filter((e) => e.projectId === projectId && e.approvalStatus === 'APPROVED');
  const payments = store.getCollection('clientPayments').filter((p) => p.projectId === projectId && p.status === 'RECEIVED');

  // Breakdown by category
  let employeeCost = 0;
  let softwareInfraCost = 0;
  let otherExpenses = 0;
  let totalApprovedExpenses = 0;

  expenses.forEach((e) => {
    const amt = Number(e.amount) || 0;
    totalApprovedExpenses += amt;
    if (e.expenseCategory === 'Employee Cost') {
      employeeCost += amt;
    } else if (['Software Subscriptions', 'Cloud Hosting Expenses', 'Hardware Expenses'].includes(e.expenseCategory)) {
      softwareInfraCost += amt;
    } else {
      otherExpenses += amt;
    }
  });

  // Client payments
  const totalReceived = payments.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
  const approvedBudget = Number(project.approvedBudget) || 0;
  const clientPendingPayment = Math.max(0, approvedBudget - totalReceived);
  const remainingBudget = approvedBudget - totalApprovedExpenses;
  const profitOrLoss = totalReceived - totalApprovedExpenses;

  // Threshold alerts
  const utilization = approvedBudget > 0 ? (totalApprovedExpenses / approvedBudget) * 100 : 0;
  if (utilization >= 100) {
    store.addItem('notifications', {
      userId: 'usr-001',
      title: `BUDGET EXCEEDED: ${project.projectId}`,
      message: `Project ${project.title} has exceeded approved budget! Expenditure: ₹${totalApprovedExpenses.toLocaleString('en-IN')}, Budget: ₹${approvedBudget.toLocaleString('en-IN')}`,
      type: 'ALERT',
      relatedProjectId: projectId,
      isRead: false,
    });
  } else if (utilization >= 80) {
    store.addItem('notifications', {
      userId: 'usr-001',
      title: `Budget Warning: ${project.projectId}`,
      message: `Project ${project.title} has reached ${utilization.toFixed(1)}% budget utilization.`,
      type: 'WARNING',
      relatedProjectId: projectId,
      isRead: false,
    });
  }

  store.updateItem('projects', projectId, {
    actualDevCost: totalApprovedExpenses,
    employeeCost,
    softwareInfraCost,
    otherExpenses,
    totalReceived,
    clientPendingPayment,
    remainingBudget,
    profitOrLoss,
  });
};

const getExpenses = (req, res) => {
  try {
    const { projectId, approvalStatus, category } = req.query;
    let expenses = store.getCollection('expenses');
    const projects = store.getCollection('projects');
    const users = store.getCollection('users');

    if (projectId) {
      expenses = expenses.filter((e) => e.projectId === projectId);
    }
    if (approvalStatus && approvalStatus !== 'ALL') {
      expenses = expenses.filter((e) => e.approvalStatus === approvalStatus);
    }
    if (category && category !== 'ALL') {
      expenses = expenses.filter((e) => e.expenseCategory === category);
    }

    const enriched = expenses.map((e) => {
      const prj = projects.find((p) => p.id === e.projectId) || null;
      const enteredBy = users.find((u) => u.id === e.enteredById) || null;
      const approvedBy = users.find((u) => u.id === e.approvedById) || null;
      return {
        ...e,
        project: prj ? { id: prj.id, projectId: prj.projectId, title: prj.title } : null,
        enteredBy: enteredBy ? { id: enteredBy.id, name: enteredBy.name } : null,
        approvedBy: approvedBy ? { id: approvedBy.id, name: approvedBy.name } : null,
      };
    });

    return res.json({
      success: true,
      count: enriched.length,
      expenses: enriched.sort((a, b) => new Date(b.transactionDate) - new Date(a.transactionDate)),
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

const createExpense = (req, res) => {
  try {
    const {
      projectId,
      expenseCategory,
      description,
      amount,
      transactionDate,
      paymentMethod = 'BANK_TRANSFER',
      vendor,
      receiptUrl,
    } = req.body;

    if (!projectId || !expenseCategory || !amount || !description) {
      return res.status(400).json({ success: false, message: 'Project, category, amount, and description are required' });
    }

    const expenses = store.getCollection('expenses');
    const expenseId = `EXP-2026-${String(expenses.length + 1).padStart(3, '0')}`;

    const newExpense = store.addItem('expenses', {
      expenseId,
      projectId,
      expenseCategory,
      description,
      amount: Number(amount),
      transactionDate: transactionDate || new Date().toISOString().split('T')[0],
      paymentMethod,
      vendor: vendor || '',
      receiptUrl: receiptUrl || null,
      enteredById: req.user ? req.user.id : 'usr-002',
      approvalStatus: 'PENDING',
      approvedById: null,
      approvalRemarks: null,
      approvedAt: null,
    });

    // Notify Finance Manager
    store.addItem('notifications', {
      userId: 'usr-005',
      title: 'New Expense Pending Approval',
      message: `Expense ${expenseId} for ₹${Number(amount).toLocaleString('en-IN')} submitted for project approval.`,
      type: 'INFO',
      relatedProjectId: projectId,
      isRead: false,
    });

    store.addItem('auditLogs', {
      entityType: 'EXPENSE',
      entityId: newExpense.id,
      action: 'CREATE',
      performedById: req.user ? req.user.id : 'usr-002',
      changes: { expenseId, amount: Number(amount), category: expenseCategory },
    });

    return res.status(201).json({
      success: true,
      message: `Expense entry ${expenseId} recorded; pending finance approval`,
      expense: newExpense,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

const updateExpenseStatus = (req, res) => {
  try {
    const { id } = req.params;
    const { approvalStatus, approvalRemarks } = req.body;

    if (!['APPROVED', 'REJECTED'].includes(approvalStatus)) {
      return res.status(400).json({ success: false, message: 'Status must be APPROVED or REJECTED' });
    }

    const expense = store.getCollection('expenses').find((e) => e.id === id);
    if (!expense) {
      return res.status(404).json({ success: false, message: 'Expense entry not found' });
    }

    const updated = store.updateItem('expenses', id, {
      approvalStatus,
      approvalRemarks: approvalRemarks || '',
      approvedById: req.user ? req.user.id : 'usr-005',
      approvedAt: new Date().toISOString(),
    });

    // Recalculate project financials if approved
    syncProjectFinances(expense.projectId);

    store.addItem('auditLogs', {
      entityType: 'EXPENSE',
      entityId: id,
      action: approvalStatus,
      performedById: req.user ? req.user.id : 'usr-005',
      changes: { previous: expense.approvalStatus, updated: approvalStatus, remarks: approvalRemarks },
    });

    return res.json({
      success: true,
      message: `Expense ${expense.expenseId} ${approvalStatus}`,
      expense: updated,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

const recordClientPayment = (req, res) => {
  try {
    const {
      projectId,
      invoiceNumber,
      amount,
      paymentDate,
      paymentMethod = 'NEFT_RTGS',
      transactionReference,
      notes,
    } = req.body;

    if (!projectId || !amount) {
      return res.status(400).json({ success: false, message: 'Project ID and payment amount are required' });
    }

    const payments = store.getCollection('clientPayments');
    const paymentId = `PAY-2026-${String(payments.length + 1).padStart(3, '0')}`;

    const newPayment = store.addItem('clientPayments', {
      paymentId,
      projectId,
      invoiceNumber: invoiceNumber || `INV-AIP-2026-${String(payments.length + 10).padStart(3, '0')}`,
      amount: Number(amount),
      paymentDate: paymentDate || new Date().toISOString().split('T')[0],
      paymentMethod,
      transactionReference: transactionReference || `TXN-${Date.now().toString().slice(-8)}`,
      status: 'RECEIVED',
      notes: notes || '',
      receivedById: req.user ? req.user.id : 'usr-005',
    });

    // Update project total received and pending payments
    syncProjectFinances(projectId);

    store.addItem('auditLogs', {
      entityType: 'PAYMENT',
      entityId: newPayment.id,
      action: 'RECORD',
      performedById: req.user ? req.user.id : 'usr-005',
      changes: { paymentId, amount: Number(amount), invoiceNumber },
    });

    return res.status(201).json({
      success: true,
      message: `Payment of ₹${Number(amount).toLocaleString('en-IN')} recorded successfully`,
      payment: newPayment,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

const getProjectFinances = (req, res) => {
  try {
    const { projectId } = req.params;
    const project = store.getCollection('projects').find((p) => p.id === projectId);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    const expenses = store.getCollection('expenses').filter((e) => e.projectId === projectId);
    const payments = store.getCollection('clientPayments').filter((p) => p.projectId === projectId);

    const approvedBudget = Number(project.approvedBudget) || 0;
    const proposedBudget = Number(project.proposedBudget) || 0;
    const actualSpending = Number(project.actualDevCost) || 0;
    const totalReceived = Number(project.totalReceived) || 0;
    const pendingPayment = Number(project.clientPendingPayment) || 0;
    const remainingBudget = approvedBudget - actualSpending;
    const budgetVariance = actualSpending - approvedBudget;
    const utilizationPercentage = approvedBudget > 0 ? ((actualSpending / approvedBudget) * 100).toFixed(1) : 0;

    return res.json({
      success: true,
      finances: {
        proposedBudget,
        approvedBudget,
        actualSpending,
        totalReceived,
        pendingPayment,
        remainingBudget,
        budgetVariance,
        utilizationPercentage: Number(utilizationPercentage),
        isOverBudget: actualSpending > approvedBudget,
        isWarningThreshold: Number(utilizationPercentage) >= 80,
        categoryBreakdown: {
          employeeCost: Number(project.employeeCost) || 0,
          softwareInfraCost: Number(project.softwareInfraCost) || 0,
          otherExpenses: Number(project.otherExpenses) || 0,
        },
        expenses,
        payments,
      },
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  getExpenses,
  createExpense,
  updateExpenseStatus,
  recordClientPayment,
  getProjectFinances,
};

