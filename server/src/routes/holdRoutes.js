const express = require('express');
const router = express.Router();
const { getOnHoldProjects } = require('../controllers/holdController');
const { authenticate } = require('../middleware/authMiddleware');

router.get('/', authenticate, getOnHoldProjects);

module.exports = router;

