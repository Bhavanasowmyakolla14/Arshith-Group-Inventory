const express = require('express');
const router = express.Router();
const {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  addTaskComment,
  logTimeEntry,
  manualUpdateProgress,
} = require('../controllers/taskController');
const { authenticate } = require('../middleware/authMiddleware');

router.get('/', authenticate, getTasks);
router.post('/', authenticate, createTask);
router.put('/:id', authenticate, updateTask);
router.delete('/:id', authenticate, deleteTask);
router.post('/:id/comments', authenticate, addTaskComment);
router.post('/:id/time-entries', authenticate, logTimeEntry);
router.post('/projects/:projectId/progress', authenticate, manualUpdateProgress);

module.exports = router;

