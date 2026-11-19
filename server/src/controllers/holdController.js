const { store } = require('../services/dataStore');

const getOnHoldProjects = (req, res) => {
  try {
    const holds = store.getCollection('holds');
    const projects = store.getCollection('projects');
    const users = store.getCollection('users');
    const clients = store.getCollection('clients');
    const today = new Date('2026-11-12');

    const onHoldList = holds.map((h) => {
      const prj = projects.find((p) => p.id === h.projectId) || null;
      const respPerson = users.find((u) => u.id === h.responsiblePersonId) || null;
      const client = prj ? clients.find((c) => c.id === prj.clientId) : null;

      // Calculate hold duration in days
      const startDate = new Date(h.holdDate);
      const endDate = h.resumeDate ? new Date(h.resumeDate) : today;
      const durationDays = Math.max(0, Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)));

      return {
        ...h,
        durationDays,
        project: prj
          ? {
              id: prj.id,
              projectId: prj.projectId,
              title: prj.title,
              categoryName: prj.categoryName,
              status: prj.status,
              approvedBudget: prj.approvedBudget,
              currentProgress: prj.completionPercentage,
              client: client ? { companyName: client.companyName } : null,
            }
          : null,
        responsiblePerson: respPerson ? { id: respPerson.id, name: respPerson.name, email: respPerson.email } : null,
      };
    });

    const activeHolds = onHoldList.filter((h) => h.isActive && h.project);
    const resolvedHolds = onHoldList.filter((h) => !h.isActive && h.project);

    // Safeguard: Check if any project is marked ON_HOLD without an active hold record
    const onHoldProjects = projects.filter((p) => !p.isArchived && p.status === 'ON_HOLD');
    onHoldProjects.forEach((p) => {
      const hasActive = activeHolds.some((h) => h.projectId === p.id);
      if (!hasActive) {
        const client = clients.find((c) => c.id === p.clientId);
        const manager = users.find((u) => u.id === p.projectManagerId);
        const holdDateStr = p.updatedAt || new Date().toISOString();
        const start = new Date(holdDateStr);
        const durationDays = Math.max(1, Math.ceil((today - start) / (1000 * 60 * 60 * 24)));

        activeHolds.push({
          id: `hld-synth-${p.id}`,
          projectId: p.id,
          holdReason: p.currentPhase || 'Temporarily suspended pending client/regulatory review',
          holdDate: holdDateStr,
          currentProgressAtHold: p.completionPercentage,
          pendingTasksSummary: 'Development tasks paused at current milestone',
          responsiblePersonId: p.projectManagerId || 'usr-002',
          expectedResumeDate: p.expectedCompletionDate || null,
          resumeDate: null,
          financialImpact: 'Resource reallocation in effect; advance payments secured',
          remarks: p.internalRemarks || '',
          isActive: true,
          durationDays,
          project: {
            id: p.id,
            projectId: p.projectId,
            title: p.title,
            categoryName: p.categoryName,
            status: p.status,
            approvedBudget: p.approvedBudget,
            currentProgress: p.completionPercentage,
            client: client ? { companyName: client.companyName } : null,
          },
          responsiblePerson: manager ? { id: manager.id, name: manager.name, email: manager.email } : null,
        });
      }
    });

    return res.json({
      success: true,
      totalActiveOnHold: activeHolds.length,
      totalHistoricalHolds: activeHolds.length + resolvedHolds.length,
      activeHolds,
      resolvedHolds,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getOnHoldProjects };

