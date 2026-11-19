const { store } = require('../services/dataStore');

const getAuditLogs = (req, res) => {
  try {
    const { entityType, action, search } = req.query;
    let logs = store.getCollection('auditLogs');
    const users = store.getCollection('users');

    if (entityType && entityType !== 'ALL') {
      logs = logs.filter((l) => l.entityType === entityType);
    }
    if (action && action !== 'ALL') {
      logs = logs.filter((l) => l.action === action);
    }

    const enriched = logs.map((l) => {
      const user = users.find((u) => u.id === l.performedById) || null;
      return {
        ...l,
        performedBy: user ? { id: user.id, name: user.name, role: user.roleName } : null,
      };
    });

    return res.json({
      success: true,
      count: enriched.length,
      logs: enriched.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getAuditLogs };

