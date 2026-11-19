const { store } = require('../services/dataStore');

// Helper to auto-generate unique Project ID e.g. AIP-2026-016
const generateProjectId = () => {
  const year = new Date().getFullYear();
  const projects = store.getCollection('projects');
  const count = projects.length + 1;
  const seq = String(count).padStart(3, '0');
  let candidate = `AIP-${year}-${seq}`;
  let attempt = count;
  while (projects.some((p) => p.projectId === candidate)) {
    attempt++;
    candidate = `AIP-${year}-${String(attempt).padStart(3, '0')}`;
  }
  return candidate;
};

const getProjects = (req, res) => {
  try {
    const {
      search,
      status,
      category,
      priority,
      clientId,
      projectManagerId,
      overdueOnly,
      unassignedOnly,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      page = 1,
      limit = 20,
    } = req.query;

    let projects = store.getCollection('projects').filter((p) => !p.isArchived);
    const clients = store.getCollection('clients');
    const users = store.getCollection('users');
    const assignments = store.getCollection('assignments');
    const today = new Date('2026-11-12');

    // Enrich projects with client, manager and team summaries
    let enriched = projects.map((p) => {
      const client = clients.find((c) => c.id === p.clientId) || null;
      const manager = users.find((u) => u.id === p.projectManagerId) || null;
      const activeAssignments = assignments.filter((a) => a.projectId === p.id && a.assignmentStatus === 'ACTIVE');
      const isOverdue =
        !['COMPLETED', 'DELIVERED', 'CANCELLED', 'REJECTED'].includes(p.status) &&
        p.expectedCompletionDate &&
        new Date(p.expectedCompletionDate) < today;

      return {
        ...p,
        client,
        projectManager: manager ? { id: manager.id, name: manager.name, email: manager.email } : null,
        activeAssignmentsCount: activeAssignments.length,
        isOverdue: Boolean(isOverdue),
      };
    });

    // 1. Search
    if (search && search.trim() !== '') {
      const q = search.toLowerCase().trim();
      enriched = enriched.filter(
        (p) =>
          p.projectId.toLowerCase().includes(q) ||
          p.title.toLowerCase().includes(q) ||
          (p.description && p.description.toLowerCase().includes(q)) ||
          (p.client && p.client.companyName.toLowerCase().includes(q)) ||
          (p.client && p.client.contactPerson.toLowerCase().includes(q)) ||
          (p.requiredTechnologies && p.requiredTechnologies.some((t) => t.toLowerCase().includes(q)))
      );
    }

    // 2. Filters
    if (status && status !== 'ALL') {
      enriched = enriched.filter((p) => p.status === status);
    }
    if (category && category !== 'ALL') {
      enriched = enriched.filter((p) => p.categoryName === category);
    }
    if (priority && priority !== 'ALL') {
      enriched = enriched.filter((p) => p.priority === priority);
    }
    if (clientId && clientId !== 'ALL') {
      enriched = enriched.filter((p) => p.clientId === clientId);
    }
    if (projectManagerId && projectManagerId !== 'ALL') {
      enriched = enriched.filter((p) => p.projectManagerId === projectManagerId);
    }
    if (overdueOnly === 'true') {
      enriched = enriched.filter((p) => p.isOverdue);
    }
    if (unassignedOnly === 'true') {
      enriched = enriched.filter((p) => p.activeAssignmentsCount === 0);
    }

    // 3. Sorting
    enriched.sort((a, b) => {
      let valA = a[sortBy];
      let valB = b[sortBy];

      if (sortBy === 'client') {
        valA = a.client ? a.client.companyName : '';
        valB = b.client ? b.client.companyName : '';
      }

      if (typeof valA === 'string') {
        return sortOrder === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
      }
      return sortOrder === 'asc' ? Number(valA || 0) - Number(valB || 0) : Number(valB || 0) - Number(valA || 0);
    });

    // 4. Pagination
    const totalCount = enriched.length;
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const startIndex = (pageNum - 1) * limitNum;
    const paginated = enriched.slice(startIndex, startIndex + limitNum);

    return res.json({
      success: true,
      totalCount,
      page: pageNum,
      totalPages: Math.ceil(totalCount / limitNum),
      projects: paginated,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

const getProjectById = (req, res) => {
  try {
    const { id } = req.params;
    const projects = store.getCollection('projects');
    const project = projects.find((p) => p.id === id || p.projectId === id);

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    const clients = store.getCollection('clients');
    const users = store.getCollection('users');
    const employees = store.getCollection('employees');
    const assignments = store.getCollection('assignments');
    const tasks = store.getCollection('tasks');
    const milestones = store.getCollection('milestones');
    const expenses = store.getCollection('expenses');
    const clientPayments = store.getCollection('clientPayments');
    const holds = store.getCollection('holds');
    const risks = store.getCollection('risks');
    const documents = store.getCollection('documents');
    const statusHistory = store.getCollection('statusHistory');
    const auditLogs = store.getCollection('auditLogs');

    const client = clients.find((c) => c.id === project.clientId) || null;
    const projectManager = users.find((u) => u.id === project.projectManagerId) || null;

    // Enrich team assignments with employee info
    const projectAssignments = assignments
      .filter((a) => a.projectId === project.id)
      .map((a) => {
        const emp = employees.find((e) => e.id === a.employeeId);
        return {
          ...a,
          employee: emp || null,
          employeeName: emp ? emp.name : 'Unknown',
          empId: emp ? emp.empId : 'N/A',
        };
      });

    // Project tasks
    const projectTasks = tasks.filter((t) => t.projectId === project.id);

    // Project milestones
    const projectMilestones = milestones
      .filter((m) => m.projectId === project.id)
      .sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0));

    // Project expenses
    const projectExpenses = expenses.filter((e) => e.projectId === project.id);

    // Project payments
    const projectPayments = clientPayments.filter((p) => p.projectId === project.id);

    // Project holds
    const projectHolds = holds.filter((h) => h.projectId === project.id);

    // Project risks
    const projectRisks = risks.filter((r) => r.projectId === project.id);

    // Project documents
    const projectDocuments = documents.filter((d) => d.projectId === project.id);

    // Status history
    const projectStatusHistory = statusHistory
      .filter((s) => s.projectId === project.id)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // Activity logs
    const projectActivity = auditLogs
      .filter((a) => a.entityId === project.id)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // Financial calculations
    const approvedBudget = Number(project.approvedBudget) || 0;
    const actualDevCost = Number(project.actualDevCost) || 0;
    const remainingBudget = approvedBudget - actualDevCost;
    const budgetVariance = actualDevCost - approvedBudget;
    const budgetUtilization = approvedBudget > 0 ? ((actualDevCost / approvedBudget) * 100).toFixed(1) : 0;

    return res.json({
      success: true,
      project: {
        ...project,
        client,
        projectManager: projectManager ? { id: projectManager.id, name: projectManager.name, email: projectManager.email } : null,
        assignments: projectAssignments,
        tasks: projectTasks,
        milestones: projectMilestones,
        expenses: projectExpenses,
        clientPayments: projectPayments,
        holds: projectHolds,
        risks: projectRisks,
        documents: projectDocuments,
        statusHistory: projectStatusHistory,
        activityLogs: projectActivity,
        financialMetrics: {
          approvedBudget,
          actualDevCost,
          remainingBudget,
          budgetVariance,
          budgetUtilization: Number(budgetUtilization),
          isOverBudget: actualDevCost > approvedBudget,
        },
      },
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

const createProject = (req, res) => {
  try {
    const {
      title,
      clientId,
      clientName,
      clientCompany,
      clientEmail,
      clientPhone,
      description,
      categoryName,
      projectType = 'FIXED_PRICE',
      projectSource = 'DIRECT_CLIENT',
      priority = 'MEDIUM',
      objective,
      scope,
      functionalRequirements,
      technicalRequirements,
      deliverables,
      expectedOutcome,
      requiredTechnologies = [],
      dependencies,
      specialInstructions,
      receivedDate,
      acceptedDate,
      plannedStartDate,
      expectedCompletionDate,
      proposedBudget = 0,
      approvedBudget = 0,
      advanceReceived = 0,
      estimatedDevCost = 0,
      projectManagerId,
      status = 'NEW',
      internalRemarks,
    } = req.body;

    if (!title) {
      return res.status(400).json({ success: false, message: 'Project title is required' });
    }

    let finalClientId = clientId;

    // Auto-create client if details are provided and clientId is not specified
    if (!finalClientId && clientCompany) {
      const clients = store.getCollection('clients');
      const newClient = store.addItem('clients', {
        clientId: `CLI-${Date.now().toString().slice(-4)}`,
        companyName: clientCompany,
        contactPerson: clientName || clientCompany,
        email: clientEmail || `${clientCompany.toLowerCase().replace(/\s+/g, '')}@client.com`,
        phone: clientPhone || '',
        notes: 'Auto-created via Project Registration form',
      });
      finalClientId = newClient.id;
    }

    if (!finalClientId) {
      // Default to first client
      const defaultClient = store.getCollection('clients')[0];
      finalClientId = defaultClient ? defaultClient.id : 'cli-001';
    }

    const autoProjectId = generateProjectId();
    const approved = Number(approvedBudget) || 0;
    const proposed = Number(proposedBudget) || approved;
    const advance = Number(advanceReceived) || 0;
    const pendingPayment = approved - advance;

    const newProject = store.addItem('projects', {
      projectId: autoProjectId,
      title,
      description: description || '',
      clientId: finalClientId,
      categoryName: categoryName || 'Enterprise Web Application',
      projectManagerId: projectManagerId || null,
      projectType,
      projectSource,
      priority,
      status,
      completionPercentage: 0,
      currentPhase: 'Initiation',
      internalRemarks: internalRemarks || '',
      receivedDate: receivedDate || new Date().toISOString().split('T')[0],
      acceptedDate: acceptedDate || null,
      plannedStartDate: plannedStartDate || null,
      actualStartDate: null,
      expectedCompletionDate: expectedCompletionDate || null,
      revisedCompletionDate: null,
      actualCompletionDate: null,
      deliveryDate: null,
      proposedBudget: proposed,
      approvedBudget: approved,
      advanceReceived: advance,
      totalReceived: advance,
      clientPendingPayment: pendingPayment > 0 ? pendingPayment : 0,
      estimatedDevCost: Number(estimatedDevCost) || 0,
      actualDevCost: 0,
      employeeCost: 0,
      softwareInfraCost: 0,
      otherExpenses: 0,
      remainingBudget: approved,
      profitOrLoss: advance,
      objective: objective || '',
      scope: scope || '',
      functionalRequirements: functionalRequirements || '',
      technicalRequirements: technicalRequirements || '',
      deliverables: deliverables || '',
      expectedOutcome: expectedOutcome || '',
      requiredTechnologies: Array.isArray(requiredTechnologies)
        ? requiredTechnologies
        : typeof requiredTechnologies === 'string'
        ? requiredTechnologies.split(',').map((t) => t.trim())
        : [],
      dependencies: dependencies || '',
      specialInstructions: specialInstructions || '',
      isArchived: false,
    });

    // Record initial status history
    store.addItem('statusHistory', {
      projectId: newProject.id,
      previousStatus: 'NONE',
      newStatus: status,
      changedById: req.user ? req.user.id : 'usr-001',
      changeReason: 'Initial project registration',
      remarks: 'Created via Arshith Infotech Project Inventory Form',
    });

    // Audit log
    store.addItem('auditLogs', {
      entityType: 'PROJECT',
      entityId: newProject.id,
      action: 'CREATE',
      performedById: req.user ? req.user.id : 'usr-001',
      changes: { projectId: autoProjectId, title, budget: approved },
    });

    // Notification
    store.addItem('notifications', {
      userId: 'usr-001',
      title: 'New Project Registered',
      message: `Project ${autoProjectId} (${title}) has been registered with status ${status}.`,
      type: 'INFO',
      relatedProjectId: newProject.id,
      isRead: false,
    });

    return res.status(201).json({
      success: true,
      message: `Project ${autoProjectId} created successfully`,
      project: newProject,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

const updateProject = (req, res) => {
  try {
    const { id } = req.params;
    const updates = { ...req.body };

    // Prevent direct status change through update (must use /status endpoint)
    delete updates.status;

    // Recalculate financial fields if budget changed
    if (updates.approvedBudget !== undefined || updates.actualDevCost !== undefined) {
      const existing = store.getCollection('projects').find((p) => p.id === id);
      if (existing) {
        const approved = updates.approvedBudget !== undefined ? Number(updates.approvedBudget) : Number(existing.approvedBudget);
        const actual = updates.actualDevCost !== undefined ? Number(updates.actualDevCost) : Number(existing.actualDevCost);
        updates.remainingBudget = approved - actual;
        const totalReceived = Number(existing.totalReceived) || 0;
        updates.profitOrLoss = totalReceived - actual;
      }
    }

    const updated = store.updateItem('projects', id, updates);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    // Audit log
    store.addItem('auditLogs', {
      entityType: 'PROJECT',
      entityId: id,
      action: 'UPDATE',
      performedById: req.user ? req.user.id : 'usr-001',
      changes: updates,
    });

    return res.json({
      success: true,
      message: 'Project updated successfully',
      project: updated,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

const changeStatus = (req, res) => {
  try {
    const { id } = req.params;
    const { newStatus, reason, remarks } = req.body;

    const validStatuses = [
      'NEW',
      'UNDER_REVIEW',
      'ACCEPTED',
      'REJECTED',
      'APPROVED',
      'ASSIGNED',
      'IN_PROGRESS',
      'ON_HOLD',
      'TESTING',
      'COMPLETED',
      'DELIVERED',
      'CANCELLED',
    ];

    if (!validStatuses.includes(newStatus)) {
      return res.status(400).json({ success: false, message: `Invalid status. Must be one of [${validStatuses.join(', ')}]` });
    }

    const project = store.getCollection('projects').find((p) => p.id === id);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    const previousStatus = project.status;

    // Enforce completion workflow guard (Section 5 requirement)
    if (newStatus === 'COMPLETED') {
      return res.status(400).json({
        success: false,
        message: 'Direct status change to COMPLETED not allowed. Use the dedicated /complete approval endpoint with required signoffs.',
      });
    }

    // Enforce delivery workflow guard
    if (newStatus === 'DELIVERED') {
      return res.status(400).json({
        success: false,
        message: 'Direct status change to DELIVERED not allowed. Use the dedicated /deliver endpoint with required client acceptance.',
      });
    }

    // If changing to ON_HOLD, recommend using the /hold endpoint
    if (newStatus === 'ON_HOLD') {
      return res.status(400).json({
        success: false,
        message: 'Please use the dedicated Place On-Hold endpoint with required hold reason and pending tasks summary.',
      });
    }

    const updates = { status: newStatus };
    if (newStatus === 'ACCEPTED' && !project.acceptedDate) {
      updates.acceptedDate = new Date().toISOString().split('T')[0];
    }
    if (newStatus === 'IN_PROGRESS' && !project.actualStartDate) {
      updates.actualStartDate = new Date().toISOString().split('T')[0];
    }

    const updatedProject = store.updateItem('projects', id, updates);

    // Record status history
    store.addItem('statusHistory', {
      projectId: id,
      previousStatus,
      newStatus,
      changedById: req.user ? req.user.id : 'usr-001',
      changeReason: reason || 'Status transition requested by user',
      remarks: remarks || '',
    });

    // Audit log
    store.addItem('auditLogs', {
      entityType: 'STATUS',
      entityId: id,
      action: 'STATUS_CHANGE',
      performedById: req.user ? req.user.id : 'usr-001',
      changes: { previousStatus, newStatus, reason, remarks },
    });

    // Notification
    store.addItem('notifications', {
      userId: 'usr-001',
      title: `Project Status Changed: ${project.projectId}`,
      message: `Status moved from ${previousStatus} to ${newStatus}. Reason: ${reason || 'N/A'}`,
      type: 'INFO',
      relatedProjectId: id,
      isRead: false,
    });

    return res.json({
      success: true,
      message: `Status updated from ${previousStatus} to ${newStatus}`,
      project: updatedProject,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

const placeOnHold = (req, res) => {
  try {
    const { id } = req.params;
    const { holdReason, pendingTasksSummary, responsiblePersonId, expectedResumeDate, financialImpact, remarks } = req.body;

    if (!holdReason) {
      return res.status(400).json({ success: false, message: 'Hold reason is required' });
    }

    const project = store.getCollection('projects').find((p) => p.id === id);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    const previousStatus = project.status;

    // Update project status to ON_HOLD
    store.updateItem('projects', id, {
      status: 'ON_HOLD',
      currentPhase: `On Hold: ${holdReason.substring(0, 40)}`,
    });

    // Create hold record
    const holdRecord = store.addItem('holds', {
      projectId: id,
      holdReason,
      holdDate: new Date().toISOString(),
      currentProgressAtHold: project.completionPercentage,
      pendingTasksSummary: pendingTasksSummary || 'Pending tasks logged at hold',
      responsiblePersonId: responsiblePersonId || (req.user ? req.user.id : 'usr-002'),
      expectedResumeDate: expectedResumeDate || null,
      resumeDate: null,
      financialImpact: financialImpact || 'Nil direct impact; resource reallocated',
      remarks: remarks || '',
      resumeRemarks: null,
      isActive: true,
    });

    // Record status history
    store.addItem('statusHistory', {
      projectId: id,
      previousStatus,
      newStatus: 'ON_HOLD',
      changedById: req.user ? req.user.id : 'usr-002',
      changeReason: holdReason,
      remarks: `Expected Resume: ${expectedResumeDate || 'TBD'}. ${remarks || ''}`,
    });

    // Audit log
    store.addItem('auditLogs', {
      entityType: 'PROJECT',
      entityId: id,
      action: 'HOLD',
      performedById: req.user ? req.user.id : 'usr-002',
      changes: { holdReason, expectedResumeDate, progressAtHold: project.completionPercentage },
    });

    // Notification
    store.addItem('notifications', {
      userId: 'usr-001',
      title: `Project Placed On Hold: ${project.projectId}`,
      message: `${project.title} placed on hold. Reason: ${holdReason}`,
      type: 'ALERT',
      relatedProjectId: id,
      isRead: false,
    });

    return res.json({
      success: true,
      message: `Project ${project.projectId} placed on hold`,
      hold: holdRecord,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

const resumeProject = (req, res) => {
  try {
    const { id } = req.params;
    const { resumeRemarks, targetStatus = 'IN_PROGRESS' } = req.body;

    const project = store.getCollection('projects').find((p) => p.id === id);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    if (project.status !== 'ON_HOLD') {
      return res.status(400).json({ success: false, message: 'Project is not currently on hold' });
    }

    // Deactivate active hold record
    const holds = store.getCollection('holds');
    const activeHold = holds.find((h) => h.projectId === id && h.isActive);
    if (activeHold) {
      store.updateItem('holds', activeHold.id, {
        isActive: false,
        resumeDate: new Date().toISOString(),
        resumeRemarks: resumeRemarks || 'Resumed by project manager',
      });
    }

    // Update project status
    store.updateItem('projects', id, {
      status: targetStatus,
      currentPhase: 'Resumed Development & Execution',
    });

    // Record status history
    store.addItem('statusHistory', {
      projectId: id,
      previousStatus: 'ON_HOLD',
      newStatus: targetStatus,
      changedById: req.user ? req.user.id : 'usr-002',
      changeReason: 'Project resumed from hold',
      remarks: resumeRemarks || 'All gating conditions cleared',
    });

    // Audit log
    store.addItem('auditLogs', {
      entityType: 'PROJECT',
      entityId: id,
      action: 'RESUME',
      performedById: req.user ? req.user.id : 'usr-002',
      changes: { previous: 'ON_HOLD', resumedTo: targetStatus, resumeRemarks },
    });

    // Notification
    store.addItem('notifications', {
      userId: 'usr-001',
      title: `Project Resumed: ${project.projectId}`,
      message: `${project.title} resumed to ${targetStatus}.`,
      type: 'SUCCESS',
      relatedProjectId: id,
      isRead: false,
    });

    return res.json({
      success: true,
      message: `Project ${project.projectId} resumed successfully`,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

const completeProject = (req, res) => {
  try {
    const { id } = req.params;
    const { deploymentUrl, gitRepoUrl, finalReportUrl, managerApprovalRemarks } = req.body;

    const project = store.getCollection('projects').find((p) => p.id === id);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    const tasks = store.getCollection('tasks').filter((t) => t.projectId === id);
    const milestones = store.getCollection('milestones').filter((m) => m.projectId === id);

    // Check checklist items
    const pendingTasks = tasks.filter((t) => t.status !== 'COMPLETED');
    const pendingMilestones = milestones.filter((m) => m.completionStatus !== 'COMPLETED');

    const warnings = [];
    if (pendingTasks.length > 0) {
      warnings.push(`${pendingTasks.length} tasks remain uncompleted`);
    }
    if (pendingMilestones.length > 0) {
      warnings.push(`${pendingMilestones.length} milestones are pending`);
    }

    const todayDate = new Date().toISOString().split('T')[0];

    const updated = store.updateItem('projects', id, {
      status: 'COMPLETED',
      completionPercentage: 100,
      actualCompletionDate: todayDate,
      currentPhase: 'Completed - Awaiting Client Delivery Sign-off',
      deploymentUrl: deploymentUrl || project.deploymentUrl,
      gitRepoUrl: gitRepoUrl || project.gitRepoUrl,
      finalReportUrl: finalReportUrl || project.finalReportUrl,
    });

    // Status history
    store.addItem('statusHistory', {
      projectId: id,
      previousStatus: project.status,
      newStatus: 'COMPLETED',
      changedById: req.user ? req.user.id : 'usr-002',
      changeReason: 'Formal completion sign-off recorded',
      remarks: managerApprovalRemarks || 'All deliverables finalized and approved by Project Manager',
    });

    // Audit log
    store.addItem('auditLogs', {
      entityType: 'PROJECT',
      entityId: id,
      action: 'COMPLETE',
      performedById: req.user ? req.user.id : 'usr-002',
      changes: { status: 'COMPLETED', actualCompletionDate: todayDate, warnings },
    });

    // Notification
    store.addItem('notifications', {
      userId: 'usr-001',
      title: `Project Completed: ${project.projectId}`,
      message: `${project.title} marked COMPLETED. Final report and handover ready.`,
      type: 'SUCCESS',
      relatedProjectId: id,
      isRead: false,
    });

    return res.json({
      success: true,
      message: `Project ${project.projectId} successfully marked as COMPLETED`,
      project: updated,
      warnings,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

const deliverProject = (req, res) => {
  try {
    const { id } = req.params;
    const { clientAcceptance = true, handoverDocsUrl, warrantyDetails, remarks } = req.body;

    const project = store.getCollection('projects').find((p) => p.id === id);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    if (project.status !== 'COMPLETED' && project.status !== 'TESTING') {
      return res.status(400).json({
        success: false,
        message: `Project must be in COMPLETED or TESTING status before delivery. Current status: ${project.status}`,
      });
    }

    const todayDate = new Date().toISOString().split('T')[0];

    const updated = store.updateItem('projects', id, {
      status: 'DELIVERED',
      completionPercentage: 100,
      deliveryDate: todayDate,
      clientAcceptance: Boolean(clientAcceptance),
      handoverDocsUrl: handoverDocsUrl || project.handoverDocsUrl,
      warrantyDetails: warrantyDetails || '12-Month Standard SLA Warranty active',
      currentPhase: 'Delivered - Operational & Warranty Period',
    });

    // Status history
    store.addItem('statusHistory', {
      projectId: id,
      previousStatus: project.status,
      newStatus: 'DELIVERED',
      changedById: req.user ? req.user.id : 'usr-001',
      changeReason: 'Client delivery and acceptance completed',
      remarks: remarks || 'Client sign-off confirmed; warranty period initiated.',
    });

    // Audit log
    store.addItem('auditLogs', {
      entityType: 'PROJECT',
      entityId: id,
      action: 'DELIVER',
      performedById: req.user ? req.user.id : 'usr-001',
      changes: { status: 'DELIVERED', deliveryDate: todayDate, clientAcceptance, warrantyDetails },
    });

    // Notification
    store.addItem('notifications', {
      userId: 'usr-001',
      title: `Project Delivered to Client: ${project.projectId}`,
      message: `${project.title} has been DELIVERED to ${project.clientId}.`,
      type: 'SUCCESS',
      relatedProjectId: id,
      isRead: false,
    });

    return res.json({
      success: true,
      message: `Project ${project.projectId} successfully marked as DELIVERED`,
      project: updated,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

const archiveProject = (req, res) => {
  try {
    const { id } = req.params;
    const { archiveReason } = req.body;

    const project = store.getCollection('projects').find((p) => p.id === id);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    const updated = store.updateItem('projects', id, {
      isArchived: true,
      archivedAt: new Date().toISOString(),
      archiveReason: archiveReason || 'Archived by Administrator',
    });

    store.addItem('auditLogs', {
      entityType: 'PROJECT',
      entityId: id,
      action: 'ARCHIVE',
      performedById: req.user ? req.user.id : 'usr-001',
      changes: { isArchived: true, archiveReason },
    });

    return res.json({
      success: true,
      message: `Project ${project.projectId} archived successfully`,
      project: updated,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

const deleteProject = (req, res) => {
  try {
    const { id } = req.params;
    const { reason, soft = false } = req.body || {};

    const project = store.getCollection('projects').find((p) => p.id === id);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    if (soft) {
      const updated = store.updateItem('projects', id, {
        isArchived: true,
        archivedAt: new Date().toISOString(),
        archiveReason: reason || 'Soft deleted / archived by Administrator',
        status: 'CANCELLED',
      });

      store.addItem('auditLogs', {
        entityType: 'PROJECT',
        entityId: id,
        action: 'SOFT_DELETE',
        performedById: req.user ? req.user.id : 'usr-001',
        changes: { previousStatus: project.status, reason },
      });

      return res.json({
        success: true,
        message: `Project ${project.projectId} archived successfully`,
        project: updated,
      });
    }

    // Default: Permanent deletion from active portfolio
    const removed = store.removeItem('projects', id);

    // Clean up dependent child records
    if (store.data.tasks) {
      store.data.tasks = store.data.tasks.filter((t) => t.projectId !== id);
    }
    if (store.data.milestones) {
      store.data.milestones = store.data.milestones.filter((m) => m.projectId !== id);
    }
    if (store.data.assignments) {
      store.data.assignments = store.data.assignments.filter((a) => a.projectId !== id);
    }
    if (store.data.holds) {
      store.data.holds = store.data.holds.filter((h) => h.projectId !== id);
    }
    if (store.data.expenses) {
      store.data.expenses = store.data.expenses.filter((e) => e.projectId !== id);
    }
    if (store.data.clientPayments) {
      store.data.clientPayments = store.data.clientPayments.filter((cp) => cp.projectId !== id);
    }
    if (store.data.risks) {
      store.data.risks = store.data.risks.filter((r) => r.projectId !== id);
    }
    if (store.data.documents) {
      store.data.documents = store.data.documents.filter((d) => d.projectId !== id);
    }
    if (store.data.statusHistory) {
      store.data.statusHistory = store.data.statusHistory.filter((sh) => sh.projectId !== id);
    }

    store.addItem('auditLogs', {
      entityType: 'PROJECT',
      entityId: id,
      action: 'DELETE',
      performedById: req.user ? req.user.id : 'usr-001',
      changes: {
        projectId: project.projectId,
        title: project.title,
        reason: reason || 'Permanently deleted by Admin',
        deletedAt: new Date().toISOString(),
      },
    });

    store.save();

    return res.json({
      success: true,
      message: `Project ${project.projectId} (${project.title}) deleted successfully`,
      deletedProject: removed,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  changeStatus,
  placeOnHold,
  resumeProject,
  completeProject,
  deliverProject,
  archiveProject,
  deleteProject,
};

