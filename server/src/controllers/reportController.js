const { store } = require('../services/dataStore');

// Helper to convert array of objects to CSV string
const convertToCSV = (rows) => {
  if (!rows || rows.length === 0) return '';
  const headers = Object.keys(rows[0]);
  const headerLine = headers.map((h) => `"${h.replace(/"/g, '""')}"`).join(',');
  const lines = rows.map((row) =>
    headers
      .map((header) => {
        const val = row[header] === null || row[header] === undefined ? '' : String(row[header]);
        return `"${val.replace(/"/g, '""')}"`;
      })
      .join(',')
  );
  return [headerLine, ...lines].join('\n');
};

const getReportData = (req, res) => {
  try {
    const { reportType = '1', format = 'json' } = req.query;
    const projects = store.getCollection('projects').filter((p) => !p.isArchived);
    const clients = store.getCollection('clients');
    const employees = store.getCollection('employees');
    const assignments = store.getCollection('assignments');
    const expenses = store.getCollection('expenses');
    const holds = store.getCollection('holds');
    const users = store.getCollection('users');
    const today = new Date('2026-11-12');

    let reportTitle = '';
    let reportData = [];

    switch (reportType) {
      // 1. Complete project inventory
      case '1':
      default:
        reportTitle = 'Complete Project Inventory Report';
        reportData = projects.map((p) => {
          const client = clients.find((c) => c.id === p.clientId);
          const pm = users.find((u) => u.id === p.projectManagerId);
          return {
            'Project ID': p.projectId,
            'Project Title': p.title,
            Client: client ? client.companyName : 'N/A',
            Category: p.categoryName || 'N/A',
            'Project Manager': pm ? pm.name : 'Unassigned',
            Status: p.status,
            Priority: p.priority,
            'Progress %': `${p.completionPercentage}%`,
            'Approved Budget (₹)': p.approvedBudget,
            'Actual Expenditure (₹)': p.actualDevCost,
            'Start Date': p.plannedStartDate || 'N/A',
            'Target Deadline': p.expectedCompletionDate || 'N/A',
          };
        });
        break;

      // 2. Project-wise budget report
      case '2':
        reportTitle = 'Project-wise Budget Allocation & Variance Report';
        reportData = projects.map((p) => {
          const client = clients.find((c) => c.id === p.clientId);
          const approved = Number(p.approvedBudget) || 0;
          const actual = Number(p.actualDevCost) || 0;
          const remaining = approved - actual;
          const variance = actual - approved;
          const utilization = approved > 0 ? ((actual / approved) * 100).toFixed(1) : '0.0';
          return {
            'Project ID': p.projectId,
            'Project Title': p.title,
            Client: client ? client.companyName : 'N/A',
            'Proposed Budget (₹)': p.proposedBudget,
            'Approved Budget (₹)': approved,
            'Actual Expenditure (₹)': actual,
            'Remaining Budget (₹)': remaining,
            'Budget Variance (₹)': variance,
            'Utilization %': `${utilization}%`,
            'Over Budget': actual > approved ? 'YES' : 'NO',
          };
        });
        break;

      // 3. Actual expenditure report
      case '3':
        reportTitle = 'Actual Expenditure Detailed Breakdown Report';
        reportData = projects
          .filter((p) => Number(p.actualDevCost) > 0)
          .map((p) => {
            const client = clients.find((c) => c.id === p.clientId);
            return {
              'Project ID': p.projectId,
              'Project Title': p.title,
              Client: client ? client.companyName : 'N/A',
              'Total Approved Cost (₹)': p.actualDevCost,
              'Employee Resource Cost (₹)': p.employeeCost,
              'Software & Cloud Infra Cost (₹)': p.softwareInfraCost,
              'Other Expenses (₹)': p.otherExpenses,
              'Total Client Received (₹)': p.totalReceived,
            };
          });
        break;

      // 4. Accepted projects report
      case '4':
        reportTitle = 'Accepted Projects Report';
        reportData = projects
          .filter((p) => ['ACCEPTED', 'APPROVED', 'ASSIGNED', 'IN_PROGRESS', 'TESTING', 'COMPLETED', 'DELIVERED'].includes(p.status))
          .map((p) => {
            const client = clients.find((c) => c.id === p.clientId);
            return {
              'Project ID': p.projectId,
              'Project Title': p.title,
              Client: client ? client.companyName : 'N/A',
              'Accepted Date': p.acceptedDate || 'N/A',
              'Approved Budget (₹)': p.approvedBudget,
              Status: p.status,
              Priority: p.priority,
            };
          });
        break;

      // 5. Rejected projects report
      case '5':
        reportTitle = 'Rejected Projects & Commercial Proposals Report';
        reportData = projects
          .filter((p) => p.status === 'REJECTED')
          .map((p) => {
            const client = clients.find((c) => c.id === p.clientId);
            return {
              'Project ID': p.projectId,
              'Project Title': p.title,
              Client: client ? client.companyName : 'N/A',
              'Proposed Budget (₹)': p.proposedBudget,
              'Received Date': p.receivedDate || 'N/A',
              'Rejection Reason': p.internalRemarks || 'Commercial/Technical Mismatch',
            };
          });
        break;

      // 6. In-progress projects report
      case '6':
        reportTitle = 'Active In-Progress Projects Delivery Report';
        reportData = projects
          .filter((p) => p.status === 'IN_PROGRESS')
          .map((p) => {
            const client = clients.find((c) => c.id === p.clientId);
            const pm = users.find((u) => u.id === p.projectManagerId);
            return {
              'Project ID': p.projectId,
              'Project Title': p.title,
              Client: client ? client.companyName : 'N/A',
              'Project Manager': pm ? pm.name : 'N/A',
              'Current Phase': p.currentPhase,
              'Completion %': `${p.completionPercentage}%`,
              'Target Deadline': p.expectedCompletionDate || 'N/A',
              'Approved Budget (₹)': p.approvedBudget,
              'Spend to Date (₹)': p.actualDevCost,
            };
          });
        break;

      // 7. On-hold projects report
      case '7':
        reportTitle = 'On-Hold Projects Risk & Impact Report';
        reportData = holds.map((h) => {
          const prj = projects.find((p) => p.id === h.projectId);
          const pm = users.find((u) => u.id === h.responsiblePersonId);
          return {
            'Project ID': prj ? prj.projectId : 'N/A',
            'Project Title': prj ? prj.title : 'N/A',
            'Hold Reason': h.holdReason,
            'Hold Date': h.holdDate ? h.holdDate.split('T')[0] : 'N/A',
            'Progress at Hold %': `${h.currentProgressAtHold}%`,
            'Responsible Person': pm ? pm.name : 'N/A',
            'Expected Resume Date': h.expectedResumeDate || 'TBD',
            'Financial Impact': h.financialImpact || 'N/A',
            'Active Hold': h.isActive ? 'YES' : 'NO',
          };
        });
        break;

      // 8. Completed projects report
      case '8':
        reportTitle = 'Completed Projects Performance Report';
        reportData = projects
          .filter((p) => p.status === 'COMPLETED' || p.status === 'DELIVERED')
          .map((p) => {
            const client = clients.find((c) => c.id === p.clientId);
            return {
              'Project ID': p.projectId,
              'Project Title': p.title,
              Client: client ? client.companyName : 'N/A',
              'Approved Budget (₹)': p.approvedBudget,
              'Actual Cost (₹)': p.actualDevCost,
              'Gross Margin (₹)': Number(p.approvedBudget) - Number(p.actualDevCost),
              'Completion Date': p.actualCompletionDate || 'N/A',
              Status: p.status,
            };
          });
        break;

      // 9. Delivered projects report
      case '9':
        reportTitle = 'Delivered Projects Handover & Warranty Report';
        reportData = projects
          .filter((p) => p.status === 'DELIVERED')
          .map((p) => {
            const client = clients.find((c) => c.id === p.clientId);
            return {
              'Project ID': p.projectId,
              'Project Title': p.title,
              Client: client ? client.companyName : 'N/A',
              'Delivery Date': p.deliveryDate || 'N/A',
              'Total Revenue (₹)': p.totalReceived,
              'Client Acceptance': p.clientAcceptance ? 'CONFIRMED' : 'PENDING',
              'Warranty Terms': p.warrantyDetails || 'Standard Warranty',
              'Live URL': p.deploymentUrl || 'N/A',
            };
          });
        break;

      // 10. Employee-wise project allocation report
      case '10':
        reportTitle = 'Employee-wise Project Allocation Report';
        reportData = assignments
          .filter((a) => a.assignmentStatus === 'ACTIVE')
          .map((a) => {
            const emp = employees.find((e) => e.id === a.employeeId);
            const prj = projects.find((p) => p.id === a.projectId);
            return {
              'Employee ID': emp ? emp.empId : 'N/A',
              'Employee Name': emp ? emp.name : 'N/A',
              Department: emp ? emp.department : 'N/A',
              'Project ID': prj ? prj.projectId : 'N/A',
              'Project Title': prj ? prj.title : 'N/A',
              'Project Role': a.projectRole,
              'Allocation %': `${a.allocationPercentage}%`,
              'Assigned Date': a.assignedDate,
              'Expected Release': a.expectedReleaseDate || 'Project End',
            };
          });
        break;

      // 11. Employee workload report
      case '11':
        reportTitle = 'Employee Workload & Capacity Audit Report';
        reportData = employees.map((emp) => {
          const empAssignments = assignments.filter((a) => a.employeeId === emp.id && a.assignmentStatus === 'ACTIVE');
          const totalAlloc = empAssignments.reduce((sum, a) => sum + (Number(a.allocationPercentage) || 0), 0);
          return {
            'Employee ID': emp.empId,
            'Employee Name': emp.name,
            Designation: emp.designation,
            Department: emp.department,
            'Active Projects Count': empAssignments.length,
            'Max Projects Allowed': emp.maxActiveProjects,
            'Total Allocation %': `${totalAlloc}%`,
            'Available Capacity %': `${Math.max(0, 100 - totalAlloc)}%`,
            'Overload Flag': totalAlloc > 100 || empAssignments.length > emp.maxActiveProjects ? 'ALERT: OVERLOADED' : 'NORMAL',
          };
        });
        break;

      // 12. Project manager performance report
      case '12':
        reportTitle = 'Project Manager Delivery Performance Report';
        const pms = users.filter((u) => u.roleName === 'PROJECT_MANAGER' || u.roleName === 'SUPER_ADMIN');
        reportData = pms.map((pm) => {
          const managed = projects.filter((p) => p.projectManagerId === pm.id);
          const completedCount = managed.filter((p) => p.status === 'COMPLETED' || p.status === 'DELIVERED').length;
          const activeCount = managed.filter((p) => p.status === 'IN_PROGRESS' || p.status === 'TESTING').length;
          const totalBudget = managed.reduce((sum, p) => sum + (Number(p.approvedBudget) || 0), 0);
          return {
            'Manager Name': pm.name,
            Email: pm.email,
            'Total Projects Managed': managed.length,
            'Active Projects': activeCount,
            'Completed/Delivered': completedCount,
            'Portfolio Value (₹)': totalBudget,
            'Completion Rate %': managed.length > 0 ? `${((completedCount / managed.length) * 100).toFixed(1)}%` : '0%',
          };
        });
        break;

      // 13. Client-wise project report
      case '13':
        reportTitle = 'Client-wise Project Portfolio Report';
        reportData = clients.map((cli) => {
          const cliProjects = projects.filter((p) => p.clientId === cli.id);
          const totalBudget = cliProjects.reduce((sum, p) => sum + (Number(p.approvedBudget) || 0), 0);
          const totalReceived = cliProjects.reduce((sum, p) => sum + (Number(p.totalReceived) || 0), 0);
          const totalPending = cliProjects.reduce((sum, p) => sum + (Number(p.clientPendingPayment) || 0), 0);
          return {
            'Client ID': cli.clientId,
            'Company Name': cli.companyName,
            'Contact Person': cli.contactPerson,
            Industry: cli.industry || 'N/A',
            'Total Projects': cliProjects.length,
            'Total Contract Value (₹)': totalBudget,
            'Revenue Collected (₹)': totalReceived,
            'Outstanding Receivables (₹)': totalPending,
          };
        });
        break;

      // 14. Monthly project report
      case '14':
        reportTitle = 'Monthly Project Intake and Completion Report (2026)';
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        reportData = months.map((m, idx) => {
          const received = projects.filter((p) => {
            const d = new Date(p.receivedDate || p.createdAt);
            return d.getMonth() === idx && d.getFullYear() === 2026;
          });
          const completed = projects.filter((p) => {
            if (!p.actualCompletionDate) return false;
            const d = new Date(p.actualCompletionDate);
            return d.getMonth() === idx && d.getFullYear() === 2026;
          });
          const monthlyIntakeValue = received.reduce((sum, p) => sum + (Number(p.proposedBudget) || 0), 0);
          return {
            Month: `${m} 2026`,
            'Projects Received': received.length,
            'Projects Completed': completed.length,
            'Intake Proposed Value (₹)': monthlyIntakeValue,
          };
        });
        break;

      // 15. Delayed project report
      case '15':
        reportTitle = 'Delayed & Overdue Projects Critical Exception Report';
        reportData = projects
          .filter((p) => {
            if (['COMPLETED', 'DELIVERED', 'CANCELLED', 'REJECTED'].includes(p.status)) return false;
            if (!p.expectedCompletionDate) return false;
            return new Date(p.expectedCompletionDate) < today;
          })
          .map((p) => {
            const client = clients.find((c) => c.id === p.clientId);
            const pm = users.find((u) => u.id === p.projectManagerId);
            const diffDays = Math.ceil((today - new Date(p.expectedCompletionDate)) / (1000 * 60 * 60 * 24));
            return {
              'Project ID': p.projectId,
              'Project Title': p.title,
              Client: client ? client.companyName : 'N/A',
              'Project Manager': pm ? pm.name : 'N/A',
              'Planned Deadline': p.expectedCompletionDate,
              'Days Overdue': diffDays,
              'Current Progress %': `${p.completionPercentage}%`,
              'Approved Budget (₹)': p.approvedBudget,
              'Current Phase': p.currentPhase,
              'Delay Impact / Root Cause': p.internalRemarks || 'Technical / Regulatory block',
            };
          });
        break;

      // 16. Project profitability report
      case '16':
        reportTitle = 'Project Profitability & Cost of Delivery Report';
        reportData = projects
          .filter((p) => Number(p.totalReceived) > 0 || Number(p.actualDevCost) > 0)
          .map((p) => {
            const client = clients.find((c) => c.id === p.clientId);
            const revenue = Number(p.totalReceived) || 0;
            const cost = Number(p.actualDevCost) || 0;
            const netProfit = revenue - cost;
            const profitMargin = revenue > 0 ? ((netProfit / revenue) * 100).toFixed(1) : '0.0';
            return {
              'Project ID': p.projectId,
              'Project Title': p.title,
              Client: client ? client.companyName : 'N/A',
              'Revenue Received (₹)': revenue,
              'Actual Delivery Cost (₹)': cost,
              'Net Profit / Loss (₹)': netProfit,
              'Profit Margin %': `${profitMargin}%`,
              'Financial Health': netProfit >= 0 ? 'PROFITABLE' : 'DEFICIT',
            };
          });
        break;
    }

    if (format === 'csv') {
      const csv = convertToCSV(reportData);
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="Arshith_Infotech_Report_${reportType}.csv"`);
      return res.send(csv);
    }

    return res.json({
      success: true,
      reportType,
      title: reportTitle,
      recordCount: reportData.length,
      data: reportData,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getReportData };

