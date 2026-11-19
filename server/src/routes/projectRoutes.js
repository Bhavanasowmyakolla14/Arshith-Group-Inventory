const express = require('express');
const router = express.Router();
const {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  changeStatus,
  placeOnHold,
  resumeProject,
  completeProject,
  deliverProject,
  archiveProject,
  deleteProject,
} = require('../controllers/projectController');
const { assignEmployee } = require('../controllers/employeeController');
const { authenticate } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/rbacMiddleware');

router.get('/', authenticate, getProjects);
router.get('/:id', authenticate, getProjectById);
router.post('/', authenticate, authorize(['SUPER_ADMIN', 'PROJECT_MANAGER']), createProject);
router.put('/:id', authenticate, authorize(['SUPER_ADMIN', 'PROJECT_MANAGER']), updateProject);

// Status workflows
router.patch('/:id/status', authenticate, authorize(['SUPER_ADMIN', 'PROJECT_MANAGER']), changeStatus);
router.post('/:id/hold', authenticate, authorize(['SUPER_ADMIN', 'PROJECT_MANAGER']), placeOnHold);
router.post('/:id/resume', authenticate, authorize(['SUPER_ADMIN', 'PROJECT_MANAGER']), resumeProject);
router.post('/:id/complete', authenticate, authorize(['SUPER_ADMIN', 'PROJECT_MANAGER']), completeProject);
router.post('/:id/deliver', authenticate, authorize(['SUPER_ADMIN']), deliverProject);

// Archive and controlled delete
router.patch('/:id/archive', authenticate, authorize(['SUPER_ADMIN']), archiveProject);
router.delete('/:id', authenticate, authorize(['SUPER_ADMIN']), deleteProject);

// Team assignment to project
router.post('/:projectId/assignments', authenticate, authorize(['SUPER_ADMIN', 'PROJECT_MANAGER']), assignEmployee);

module.exports = router;

