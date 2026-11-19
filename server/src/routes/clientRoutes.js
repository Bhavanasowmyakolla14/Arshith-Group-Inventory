const express = require('express');
const router = express.Router();
const { getClients, createClient } = require('../controllers/clientController');
const { authenticate } = require('../middleware/authMiddleware');

router.get('/', authenticate, getClients);
router.post('/', authenticate, createClient);

module.exports = router;

