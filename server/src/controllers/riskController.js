const { store } = require('../services/dataStore');

const getRisks = (req, res) => {
  try {
    const { projectId, severity, status } = req.query;
    let risks = store.getCollection('risks');
    const employees = store.getCollection('employees');
    const projects = store.getCollection('projects');

    if (projectId) {
      risks = risks.filter((r) => r.projectId === projectId);
    }
    if (severity && severity !== 'ALL') {
      risks = risks.filter((r) => r.severity === severity);
    }
    if (status && status !== 'ALL') {
      risks = risks.filter((r) => r.status === status);
    }

    const enriched = risks.map((r) => {
      const emp = employees.find((e) => e.id === r.responsiblePersonId) || null;
      const prj = projects.find((p) => p.id === r.projectId) || null;
      return {
        ...r,
        responsiblePerson: emp ? { id: emp.id, name: emp.name } : null,
        project: prj ? { id: prj.id, projectId: prj.projectId, title: prj.title } : null,
      };
    });

    return res.json({
      success: true,
      count: enriched.length,
      risks: enriched,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

const createRisk = (req, res) => {
  try {
    const { projectId, title, description, severity = 'MEDIUM', probability = 'MEDIUM', impact, responsiblePersonId, mitigationPlan } = req.body;

    if (!projectId || !title) {
      return res.status(400).json({ success: false, message: 'Project ID and risk title are required' });
    }

    const newRisk = store.addItem('risks', {
      projectId,
      title,
      description: description || '',
      severity,
      probability,
      impact: impact || '',
      responsiblePersonId: responsiblePersonId || null,
      mitigationPlan: mitigationPlan || '',
      status: 'IDENTIFIED',
    });

    store.addItem('auditLogs', {
      entityType: 'RISK',
      entityId: newRisk.id,
      action: 'CREATE',
      performedById: req.user ? req.user.id : 'usr-002',
      changes: { title, severity, probability },
    });

    return res.status(201).json({
      success: true,
      message: 'Risk entry logged successfully',
      risk: newRisk,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

const updateRisk = (req, res) => {
  try {
    const { id } = req.params;
    const updates = { ...req.body };

    const updated = store.updateItem('risks', id, updates);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Risk entry not found' });
    }

    store.addItem('auditLogs', {
      entityType: 'RISK',
      entityId: id,
      action: 'UPDATE',
      performedById: req.user ? req.user.id : 'usr-002',
      changes: updates,
    });

    return res.json({
      success: true,
      message: 'Risk updated successfully',
      risk: updated,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getRisks, createRisk, updateRisk };

