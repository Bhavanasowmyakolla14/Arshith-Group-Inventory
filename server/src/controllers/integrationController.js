const { integrationService } = require('../services/integrationService');
const { syncEngine } = require('../services/syncEngine');
const { centralAnalyticsService } = require('../services/centralAnalyticsService');
const { store } = require('../services/dataStore');

// 1. Get all integrations
const getIntegrations = async (req, res, next) => {
  try {
    const list = integrationService.getAll();
    res.json({ success: true, count: list.length, data: list });
  } catch (err) {
    next(err);
  }
};

// 2. Get single integration detail
const getIntegrationByKey = async (req, res, next) => {
  try {
    const { key } = req.params;
    const item = integrationService.getByKey(key);
    if (!item) {
      return res.status(404).json({ success: false, message: `Integration "${key}" not found.` });
    }
    res.json({ success: true, data: item });
  } catch (err) {
    next(err);
  }
};

// 3. Test connection to source database/API
const testConnection = async (req, res, next) => {
  try {
    const { key } = req.params;
    const result = await integrationService.testConnection(key);
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// 4. Update configuration
const updateConfig = async (req, res, next) => {
  try {
    const { key } = req.params;
    const { config } = req.body;
    if (!config) {
      return res.status(400).json({ success: false, message: 'Configuration payload required.' });
    }
    const updated = integrationService.updateConfig(key, config);
    res.json({ success: true, message: 'Configuration saved successfully.', data: updated });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// 5. Trigger sync
const triggerSync = async (req, res, next) => {
  try {
    const { key } = req.params;
    const { syncType = 'FULL' } = req.body;
    const result = await syncEngine.runSync(key, { syncType });
    res.json({ success: true, message: `Sync completed with status: ${result.status}`, data: result });
  } catch (err) {
    res.status(500).json({ success: false, message: `Sync failed: ${err.message}` });
  }
};

// 6. Get sync jobs for integration
const getSyncJobs = async (req, res, next) => {
  try {
    const { key } = req.params;
    const allJobs = store.getCollection('integration_sync_jobs') || [];
    const jobs = allJobs.filter((j) => j.integrationKey === key);
    res.json({ success: true, count: jobs.length, data: jobs });
  } catch (err) {
    next(err);
  }
};

// 7. Get sync logs
const getSyncLogs = async (req, res, next) => {
  try {
    const { key } = req.params;
    const { jobId, limit = 100 } = req.query;
    let logs = store.getCollection('integration_sync_logs') || [];

    if (key && key !== 'ALL') {
      logs = logs.filter((l) => l.integrationKey === key);
    }
    if (jobId) {
      logs = logs.filter((l) => l.jobId === jobId);
    }

    const limited = logs.slice(0, parseInt(limit, 10));
    res.json({ success: true, count: limited.length, data: limited });
  } catch (err) {
    next(err);
  }
};

// 8. Get synchronized records
const getSyncedRecords = async (req, res, next) => {
  try {
    const filters = req.query;
    const result = centralAnalyticsService.getSyncedRecords(filters);
    res.json({ success: true, ...result });
  } catch (err) {
    next(err);
  }
};

// 9. Central multi-company business analytics
const getCentralAnalytics = async (req, res, next) => {
  try {
    const { company = 'all', startDate, endDate } = req.query;
    const overview = centralAnalyticsService.getOverview(company, { startDate, endDate });
    res.json({ success: true, data: overview });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getIntegrations,
  getIntegrationByKey,
  testConnection,
  updateConfig,
  triggerSync,
  getSyncJobs,
  getSyncLogs,
  getSyncedRecords,
  getCentralAnalytics,
};

