const express = require('express');
const router = express.Router();
const {
  getEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  getAssignments,
  assignEmployee,
  updateAssignment,
  deleteAssignment,
  releaseEmployee,
} = require('../controllers/employeeController');
const { authenticate } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/rbacMiddleware');

// Employees CRUD
router.get('/', authenticate, getEmployees);
router.get('/:id', authenticate, getEmployeeById);
router.post('/', authenticate, authorize(['SUPER_ADMIN']), createEmployee);
router.put('/:id', authenticate, authorize(['SUPER_ADMIN']), updateEmployee);
router.delete('/:id', authenticate, authorize(['SUPER_ADMIN']), deleteEmployee);

// Project Teams / Assignments CRUD
router.get('/assignments/all', authenticate, getAssignments);
router.post('/assignments', authenticate, authorize(['SUPER_ADMIN', 'PROJECT_MANAGER']), assignEmployee);
router.put('/assignments/:assignmentId', authenticate, authorize(['SUPER_ADMIN', 'PROJECT_MANAGER']), updateAssignment);
router.delete('/assignments/:assignmentId', authenticate, authorize(['SUPER_ADMIN', 'PROJECT_MANAGER']), deleteAssignment);
router.post('/assignments/:assignmentId/release', authenticate, authorize(['SUPER_ADMIN', 'PROJECT_MANAGER']), releaseEmployee);

module.exports = router;

