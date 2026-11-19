const express = require('express');
const router = express.Router();
const { getRisks, createRisk, updateRisk } = require('../controllers/riskController');
const { authenticate } = require('../middleware/authMiddleware');

router.get('/', authenticate, getRisks);
router.post('/', authenticate, createRisk);
router.put('/:id', authenticate, updateRisk);

module.exports = router;

