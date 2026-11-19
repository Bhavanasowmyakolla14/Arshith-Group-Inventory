const express = require('express');
const router = express.Router();
const { getReportData } = require('../controllers/reportController');
const { authenticate } = require('../middleware/authMiddleware');

router.get('/', authenticate, getReportData);

module.exports = router;

