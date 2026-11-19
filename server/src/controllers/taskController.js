const { store } = require('../services/dataStore');

// Helper to recalculate overall project completion percentage based on tasks & milestones
const recalculateProjectProgress = (projectId) => {
  const tasks = store.getCollection('tasks').filter((t) => t.projectId === projectId);
  const milestones = store.getCollection('milestones').filter((m) => m.projectId === projectId);

  if (tasks.length === 0 && milestones.length === 0) return;

  let totalWeight = 0;
  let earnedScore = 0;

  if (tasks.length > 0) {
    totalWeight += 0.6; // 60% task weight
    const completedTasks = tasks.filter((t) => t.status === 'COMPLETED').length;
    const inProgressTasks = tasks.filter((t) => t.status === 'IN_PROGRESS' || t.status === 'IN_REVIEW').length;
    const taskScore = (completedTasks + inProgressTasks * 0.5) / tasks.length;
    earnedScore += taskScore * 0.6;
  }

  if (milestones.length > 0) {
    totalWeight += 0.4; // 40% milestone weight
    const completedMilestones = milestones.filter((m) => m.completionStatus === 'COMPLETED').length;
    const milestoneScore = completedMilestones / milestones.length;
    earnedScore += milestoneScore * 0.4;
  }

  const calculatedPercentage = totalWeight > 0 ? Math.round((earnedScore / totalWeight) * 100) : 0;
  
  // Update project completion % (capped at 99% unless formally completed)
  const prj = store.getCollection('projects').find((p) => p.id === projectId);
  if (prj && prj.status !== 'COMPLETED' && prj.status !== 'DELIVERED') {
    const finalPct = Math.min(99, calculatedPercentage);
    store.updateItem('projects', projectId, { completionPercentage: finalPct });
  }
};

const getTasks = (req, res) => {
  try {
    const { projectId, assignedEmployeeId, status, priority } = req.query;
    let tasks = store.getCollection('tasks');
    const employees = store.getCollection('employees');
    const projects = store.getCollection('projects');

    if (projectId) {
      tasks = tasks.filter((t) => t.projectId === projectId);
    }
    if (assignedEmployeeId) {
      tasks = tasks.filter((t) => t.assignedEmployeeId === assignedEmployeeId);
    }
    if (status && status !== 'ALL') {
      tasks = tasks.filter((t) => t.status === status);
    }
    if (priority && priority !== 'ALL') {
      tasks = tasks.filter((t) => t.priority === priority);
    }

    const enriched = tasks.map((t) => {
      const emp = employees.find((e) => e.id === t.assignedEmployeeId) || null;
      const prj = projects.find((p) => p.id === t.projectId) || null;
      return {
        ...t,
        assignedEmployee: emp ? { id: emp.id, empId: emp.empId, name: emp.name, email: emp.email, designation: emp.designation } : null,
        project: prj ? { id: prj.id, projectId: prj.projectId, title: prj.title, status: prj.status } : null,
      };
    });

    return res.json({
      success: true,
      count: enriched.length,
      tasks: enriched,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

const createTask = (req, res) => {
  try {
    const {
      projectId,
      title,
      description,
      assignedEmployeeId,
      priority = 'MEDIUM',
      status = 'TO_DO',
      plannedStartDate,
      dueDate,
      estimatedHours = 0,
    } = req.body;

    if (!projectId || !title) {
      return res.status(400).json({ success: false, message: 'Project ID and task title are required' });
    }

    const tasks = store.getCollection('tasks');
    const projectTasks = tasks.filter((t) => t.projectId === projectId);
    const taskId = `TSK-${String(projectTasks.length + 1).padStart(3, '0')}`;

    const newTask = store.addItem('tasks', {
      taskId,
      projectId,
      title,
      description: description || '',
      assignedEmployeeId: assignedEmployeeId || null,
      createdById: req.user ? req.user.id : 'usr-002',
      priority,
      status,
      plannedStartDate: plannedStartDate || new Date().toISOString().split('T')[0],
      dueDate: dueDate || null,
      actualCompletedDate: null,
      completionPercentage: status === 'COMPLETED' ? 100 : 0,
      estimatedHours: Number(estimatedHours) || 0,
      actualHoursSpent: 0,
    });

    recalculateProjectProgress(projectId);

    store.addItem('auditLogs', {
      entityType: 'TASK',
      entityId: newTask.id,
      action: 'CREATE',
      performedById: req.user ? req.user.id : 'usr-002',
      changes: { taskId, title, priority, status },
    });

    return res.status(201).json({
      success: true,
      message: `Task ${taskId} created successfully`,
      task: newTask,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

const updateTask = (req, res) => {
  try {
    const { id } = req.params;
    const updates = { ...req.body };

    const task = store.getCollection('tasks').find((t) => t.id === id);
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    if (updates.status === 'COMPLETED' && task.status !== 'COMPLETED') {
      updates.actualCompletedDate = new Date().toISOString().split('T')[0];
      updates.completionPercentage = 100;
    }

    const updatedTask = store.updateItem('tasks', id, updates);
    recalculateProjectProgress(task.projectId);

    store.addItem('auditLogs', {
      entityType: 'TASK',
      entityId: id,
      action: 'UPDATE',
      performedById: req.user ? req.user.id : 'usr-002',
      changes: updates,
    });

    return res.json({
      success: true,
      message: 'Task updated successfully',
      task: updatedTask,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

const addTaskComment = (req, res) => {
  try {
    const { id } = req.params;
    const { comment } = req.body;

    if (!comment) {
      return res.status(400).json({ success: false, message: 'Comment content is required' });
    }

    const newComment = store.addItem('taskComments', {
      taskId: id,
      userId: req.user ? req.user.id : 'usr-004',
      comment,
      createdAt: new Date().toISOString(),
    });

    return res.status(201).json({
      success: true,
      comment: newComment,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

const logTimeEntry = (req, res) => {
  try {
    const { id } = req.params;
    const { hoursSpent, date, description, employeeId } = req.body;

    const task = store.getCollection('tasks').find((t) => t.id === id);
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    const hours = Number(hoursSpent) || 0;
    const newEntry = store.addItem('timeEntries', {
      taskId: id,
      projectId: task.projectId,
      employeeId: employeeId || task.assignedEmployeeId || 'emp-004',
      hoursSpent: hours,
      date: date || new Date().toISOString().split('T')[0],
      description: description || 'Development and testing work',
    });

    // Update task actual hours spent
    const newTotal = (Number(task.actualHoursSpent) || 0) + hours;
    store.updateItem('tasks', id, { actualHoursSpent: newTotal });

    return res.status(201).json({
      success: true,
      message: `${hours} hours logged successfully`,
      entry: newEntry,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

const manualUpdateProgress = (req, res) => {
  try {
    const { projectId } = req.params;
    const { completionPercentage, explanation } = req.body;

    if (completionPercentage === undefined || !explanation) {
      return res.status(400).json({ success: false, message: 'Completion percentage and formal explanation are required' });
    }

    const pct = Math.max(0, Math.min(99, parseInt(completionPercentage, 10))); // Cap at 99 unless formal completion

    const updated = store.updateItem('projects', projectId, {
      completionPercentage: pct,
      internalRemarks: `Manual Progress Override (${pct}%): ${explanation}`,
    });

    store.addItem('auditLogs', {
      entityType: 'PROJECT',
      entityId: projectId,
      action: 'PROGRESS_OVERRIDE',
      performedById: req.user ? req.user.id : 'usr-002',
      changes: { newPercentage: pct, explanation },
    });

    return res.json({
      success: true,
      message: `Project progress manually updated to ${pct}%`,
      project: updated,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

const deleteTask = (req, res) => {
  try {
    const { id } = req.params;
    const task = store.getCollection('tasks').find((t) => t.id === id);
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    const removed = store.removeItem('tasks', id);
    recalculateProjectProgress(task.projectId);

    store.addItem('auditLogs', {
      entityType: 'TASK',
      entityId: id,
      action: 'DELETE',
      performedById: req.user ? req.user.id : 'usr-001',
      changes: { taskId: task.taskId, title: task.title, projectId: task.projectId },
    });

    return res.json({
      success: true,
      message: `Task ${task.taskId} removed successfully`,
      task: removed,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  addTaskComment,
  logTimeEntry,
  manualUpdateProgress,
};

