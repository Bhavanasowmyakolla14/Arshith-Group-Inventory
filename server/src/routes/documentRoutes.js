const express = require('express');
const router = express.Router();
const { getDocuments, createDocument } = require('../controllers/documentController');
const { authenticate } = require('../middleware/authMiddleware');

router.get('/', authenticate, getDocuments);
router.post('/', authenticate, createDocument);

module.exports = router;

