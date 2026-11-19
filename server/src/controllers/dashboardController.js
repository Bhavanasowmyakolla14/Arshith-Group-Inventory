const { store } = require('../services/dataStore');

const getDashboardStats = (req, res) => {
  try {
    const { startDate, endDate, category } = req.query;
    let projects = store.getCollection('projects').filter((p) => !p.isArchived);
    const assignments = store.getCollection('assignments').filter((a) => a.assignmentStatus === 'ACTIVE');
    const employees = store.getCollection('employees');

    // Filters
    if (category && category !== 'ALL') {
      projects = projects.filter((p) => p.categoryName === category);
    }
    if (startDate) {
      projects = projects.filter((p) => new Date(p.receivedDate || p.createdAt) >= new Date(startDate));
    }
    if (endDate) {
      projects = projects.filter((p) => new Date(p.receivedDate || p.createdAt) <= new Date(endDate));
    }

    const today = new Date('2026-11-12'); // Local simulation date

    // 14 Status KPI Cards
    const totalProjects = projects.length;
    const newProjects = projects.filter((p) => p.status === 'NEW').length;
    const underReview = projects.filter((p) => p.status === 'UNDER_REVIEW').length;
    const accepted = projects.filter((p) => p.status === 'ACCEPTED').length;
    const rejected = projects.filter((p) => p.status === 'REJECTED').length;
    const approved = projects.filter((p) => p.status === 'APPROVED').length;
    const assigned = projects.filter((p) => {
      if (p.status === 'ASSIGNED') return true;
      return assignments.some((a) => a.projectId === p.id);
    }).length;

    const unassigned = projects.filter((p) => {
      const hasAssignment = assignments.some((a) => a.projectId === p.id);
      return !hasAssignment && !['COMPLETED', 'DELIVERED', 'REJECTED', 'CANCELLED'].includes(p.status);
    }).length;

    const inProgress = projects.filter((p) => p.status === 'IN_PROGRESS').length;
    const onHold = projects.filter((p) => p.status === 'ON_HOLD').length;
    const testing = projects.filter((p) => p.status === 'TESTING').length;
    const completed = projects.filter((p) => p.status === 'COMPLETED').length;
    const delivered = projects.filter((p) => p.status === 'DELIVERED').length;
    const cancelled = projects.filter((p) => p.status === 'CANCELLED').length;

    const overdue = projects.filter((p) => {
      if (['COMPLETED', 'DELIVERED', 'CANCELLED', 'REJECTED'].includes(p.status)) return false;
      if (!p.expectedCompletionDate) return false;
      return new Date(p.expectedCompletionDate) < today;
    }).length;

    // Financial KPIs (in INR ₹)
    const totalProposedBudget = projects.reduce((acc, p) => acc + (Number(p.proposedBudget) || 0), 0);
    const totalApprovedBudget = projects.reduce((acc, p) => acc + (Number(p.approvedBudget) || 0), 0);
    const totalActualExpenditure = projects.reduce((acc, p) => acc + (Number(p.actualDevCost) || 0), 0);
    const remainingBudget = totalApprovedBudget - totalActualExpenditure;
    const pendingPayments = projects.reduce((acc, p) => acc + (Number(p.clientPendingPayment) || 0), 0);
    const totalProjectRevenue = projects.reduce((acc, p) => acc + (Number(p.totalReceived) || 0), 0);
    const totalProjectProfit = totalProjectRevenue - totalActualExpenditure;

    // Chart 1: Project distribution by status
    const statusCounts = {
      NEW: newProjects,
      UNDER_REVIEW: underReview,
      ACCEPTED: accepted,
      APPROVED: approved,
      IN_PROGRESS: inProgress,
      TESTING: testing,
      ON_HOLD: onHold,
      COMPLETED: completed,
      DELIVERED: delivered,
      CANCELLED: cancelled,
      REJECTED: rejected,
    };
    const statusDistribution = Object.entries(statusCounts)
      .filter(([_, count]) => count > 0)
      .map(([status, count]) => ({
        status,
        label: status.replace(/_/g, ' '),
        count,
      }));

    // Chart 2 & 3: Monthly projects received and completed in 2026
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyReceived = months.map((m, idx) => {
      const count = projects.filter((p) => {
        const d = new Date(p.receivedDate || p.createdAt);
        return d.getMonth() === idx && d.getFullYear() === 2026;
      }).length;
      return { month: m, count };
    });

    const monthlyCompleted = months.map((m, idx) => {
      const count = projects.filter((p) => {
        if (!p.actualCompletionDate) return false;
        const d = new Date(p.actualCompletionDate);
        return d.getMonth() === idx && d.getFullYear() === 2026;
      }).length;
      return { month: m, count };
    });

    // Chart 4: Accepted vs Rejected
    const acceptedVsRejected = [
      { name: 'Accepted Projects', count: accepted + approved + inProgress + testing + completed + delivered },
      { name: 'Rejected Projects', count: rejected },
    ];

    // Chart 5: Project budget vs actual expenditure (Top 6 active/major projects)
    const budgetVsActual = projects
      .filter((p) => Number(p.approvedBudget) > 0)
      .slice(0, 6)
      .map((p) => ({
        id: p.projectId,
        title: p.title.length > 20 ? p.title.substring(0, 20) + '...' : p.title,
        approvedBudget: Number(p.approvedBudget),
        actualExpenditure: Number(p.actualDevCost),
        variance: Number(p.approvedBudget) - Number(p.actualDevCost),
      }));

    // Chart 6: Employee-wise project allocation
    const employeeAllocation = employees.map((emp) => {
      const empAssignments = assignments.filter((a) => a.employeeId === emp.id);
      const totalAllocation = empAssignments.reduce((sum, a) => sum + (a.allocationPercentage || 0), 0);
      return {
        empId: emp.empId,
        name: emp.name,
        department: emp.department,
        activeProjectsCount: empAssignments.length,
        totalAllocationPercentage: totalAllocation,
        isOverAllocated: totalAllocation > 100 || empAssignments.length > emp.maxActiveProjects,
      };
    });

    // Chart 7: Project completion trends (% completion distribution)
    const completionTrends = [
      { bucket: '0%', count: projects.filter((p) => p.completionPercentage === 0).length },
      { bucket: '1-25%', count: projects.filter((p) => p.completionPercentage > 0 && p.completionPercentage <= 25).length },
      { bucket: '26-50%', count: projects.filter((p) => p.completionPercentage > 25 && p.completionPercentage <= 50).length },
      { bucket: '51-75%', count: projects.filter((p) => p.completionPercentage > 50 && p.completionPercentage <= 75).length },
      { bucket: '76-99%', count: projects.filter((p) => p.completionPercentage > 75 && p.completionPercentage < 100).length },
      { bucket: '100%', count: projects.filter((p) => p.completionPercentage === 100).length },
    ];

    // Chart 8: Overdue Project Analysis
    const overdueAnalysis = projects
      .filter((p) => {
        if (['COMPLETED', 'DELIVERED', 'CANCELLED', 'REJECTED'].includes(p.status)) return false;
        if (!p.expectedCompletionDate) return false;
        return new Date(p.expectedCompletionDate) < today;
      })
      .map((p) => {
        const diffDays = Math.ceil((today - new Date(p.expectedCompletionDate)) / (1000 * 60 * 60 * 24));
        return {
          projectId: p.projectId,
          title: p.title,
          expectedDate: p.expectedCompletionDate,
          daysOverdue: diffDays,
          manager: p.projectManagerId,
          progress: p.completionPercentage,
        };
      });

    return res.json({
      success: true,
      stats: {
        totalProjects,
        newProjects,
        underReview,
        accepted,
        rejected,
        approved,
        assigned,
        unassigned,
        inProgress,
        onHold,
        testing,
        completed,
        delivered,
        cancelled,
        overdue,
      },
      financials: {
        totalProposedBudget,
        totalApprovedBudget,
        totalActualExpenditure,
        remainingBudget,
        pendingPayments,
        totalProjectRevenue,
        totalProjectProfit,
      },
      charts: {
        statusDistribution,
        monthlyReceived,
        monthlyCompleted,
        acceptedVsRejected,
        budgetVsActual,
        employeeAllocation,
        completionTrends,
        overdueAnalysis,
      },
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getDashboardStats };

