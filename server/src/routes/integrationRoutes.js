const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/rbacMiddleware');
const {
  getIntegrations,
  getIntegrationByKey,
  testConnection,
  updateConfig,
  triggerSync,
  getSyncJobs,
  getSyncLogs,
  getSyncedRecords,
  getCentralAnalytics,
} = require('../controllers/integrationController');

// All integration endpoints require authentication
router.use(authenticate);

// Central Business Analytics
router.get('/analytics/overview', getCentralAnalytics);

// Synced records explorer
router.get('/records', getSyncedRecords);

// Integrations management
router.get('/', getIntegrations);
router.get('/:key', getIntegrationByKey);
router.post('/:key/test', testConnection);

// Sync & Config management (Admin or Project Manager)
router.post('/:key/sync', authorize(['SUPER_ADMIN', 'PROJECT_MANAGER']), triggerSync);
router.put('/:key/config', authorize(['SUPER_ADMIN']), updateConfig);

// Sync Jobs & Logs
router.get('/:key/jobs', getSyncJobs);
router.get('/:key/logs', getSyncLogs);

module.exports = router;

