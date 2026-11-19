const express = require('express');
const router = express.Router();
const { getMilestones, createMilestone, updateMilestone } = require('../controllers/milestoneController');
const { authenticate } = require('../middleware/authMiddleware');

router.get('/', authenticate, getMilestones);
router.post('/', authenticate, createMilestone);
router.put('/:id', authenticate, updateMilestone);

module.exports = router;

