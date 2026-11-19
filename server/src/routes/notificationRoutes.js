const express = require('express');
const router = express.Router();
const { getNotifications, markAsRead, markAllAsRead } = require('../controllers/notificationController');
const { authenticate } = require('../middleware/authMiddleware');

router.get('/', authenticate, getNotifications);
router.patch('/:id/read', authenticate, markAsRead);
router.post('/mark-all-read', authenticate, markAllAsRead);

module.exports = router;

