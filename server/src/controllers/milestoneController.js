const { store } = require('../services/dataStore');

const getMilestones = (req, res) => {
  try {
    const { projectId } = req.query;
    let milestones = store.getCollection('milestones');
    const employees = store.getCollection('employees');

    if (projectId) {
      milestones = milestones.filter((m) => m.projectId === projectId);
    }

    const enriched = milestones.map((m) => {
      const emp = employees.find((e) => e.id === m.responsibleEmployeeId) || null;
      return {
        ...m,
        responsibleEmployee: emp ? { id: emp.id, empId: emp.empId, name: emp.name } : null,
      };
    });

    return res.json({
      success: true,
      count: enriched.length,
      milestones: enriched.sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0)),
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

const createMilestone = (req, res) => {
  try {
    const { projectId, name, description, plannedDate, responsibleEmployeeId, remarks, orderIndex } = req.body;

    if (!projectId || !name || !plannedDate) {
      return res.status(400).json({ success: false, message: 'Project ID, milestone name, and planned date are required' });
    }

    const milestones = store.getCollection('milestones').filter((m) => m.projectId === projectId);
    const milestoneId = `MS-${String(milestones.length + 1).padStart(2, '0')}`;

    const newMilestone = store.addItem('milestones', {
      milestoneId,
      projectId,
      name,
      description: description || '',
      plannedDate,
      actualDate: null,
      completionStatus: 'PENDING',
      responsibleEmployeeId: responsibleEmployeeId || null,
      remarks: remarks || '',
      orderIndex: orderIndex !== undefined ? Number(orderIndex) : milestones.length + 1,
    });

    store.addItem('auditLogs', {
      entityType: 'MILESTONE',
      entityId: newMilestone.id,
      action: 'CREATE',
      performedById: req.user ? req.user.id : 'usr-002',
      changes: { milestoneId, name, plannedDate },
    });

    return res.status(201).json({
      success: true,
      message: `Milestone ${milestoneId} created successfully`,
      milestone: newMilestone,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

const updateMilestone = (req, res) => {
  try {
    const { id } = req.params;
    const updates = { ...req.body };

    const milestone = store.getCollection('milestones').find((m) => m.id === id);
    if (!milestone) {
      return res.status(404).json({ success: false, message: 'Milestone not found' });
    }

    if (updates.completionStatus === 'COMPLETED' && !updates.actualDate) {
      updates.actualDate = new Date().toISOString().split('T')[0];
    }

    const updated = store.updateItem('milestones', id, updates);

    store.addItem('auditLogs', {
      entityType: 'MILESTONE',
      entityId: id,
      action: 'UPDATE',
      performedById: req.user ? req.user.id : 'usr-002',
      changes: updates,
    });

    return res.json({
      success: true,
      message: 'Milestone updated successfully',
      milestone: updated,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  getMilestones,
  createMilestone,
  updateMilestone,
};

