const { store } = require('../services/dataStore');

const getEmployees = (req, res) => {
  try {
    const { department, status = 'ACTIVE', search } = req.query;
    let employees = store.getCollection('employees');
    const assignments = store.getCollection('assignments').filter((a) => a.assignmentStatus === 'ACTIVE');
    const projects = store.getCollection('projects').filter((p) => !p.isArchived);

    if (status && status !== 'ALL') {
      employees = employees.filter((e) => e.status === status);
    }
    if (department && department !== 'ALL') {
      employees = employees.filter((e) => e.department === department);
    }
    if (search && search.trim() !== '') {
      const q = search.toLowerCase().trim();
      employees = employees.filter(
        (e) =>
          (e.empId && e.empId.toLowerCase().includes(q)) ||
          (e.name && e.name.toLowerCase().includes(q)) ||
          (e.email && e.email.toLowerCase().includes(q)) ||
          (e.designation && e.designation.toLowerCase().includes(q)) ||
          (e.skills && e.skills.some((s) => s.toLowerCase().includes(q)))
      );
    }

    // Enrich with workload, active projects and capacity
    const enriched = employees.map((emp) => {
      const empAssignments = assignments.filter((a) => a.employeeId === emp.id);
      const totalAllocation = empAssignments.reduce((sum, a) => sum + (Number(a.allocationPercentage) || 0), 0);
      const availableCapacity = Math.max(0, 100 - totalAllocation);
      const isOverAllocated = totalAllocation > 100 || empAssignments.length > (emp.maxActiveProjects || 3);

      const activeProjects = empAssignments.map((a) => {
        const prj = projects.find((p) => p.id === a.projectId);
        return {
          assignmentId: a.id,
          projectId: a.projectId,
          projectCode: prj ? prj.projectId : 'N/A',
          projectTitle: prj ? prj.title : 'Unknown Project',
          projectStatus: prj ? prj.status : 'N/A',
          projectRole: a.projectRole,
          responsibilities: a.responsibilities || '',
          allocationPercentage: a.allocationPercentage,
          assignedDate: a.assignedDate,
          expectedReleaseDate: a.expectedReleaseDate,
          expectedCompletionDate: prj ? prj.expectedCompletionDate : null,
        };
      });

      return {
        ...emp,
        activeProjectsCount: empAssignments.length,
        totalAllocationPercentage: totalAllocation,
        availableCapacity,
        isOverAllocated,
        activeProjects,
      };
    });

    return res.json({
      success: true,
      count: enriched.length,
      employees: enriched,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

const getEmployeeById = (req, res) => {
  try {
    const { id } = req.params;
    const employees = store.getCollection('employees');
    const employee = employees.find((e) => e.id === id || e.empId === id);

    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }

    const assignments = store.getCollection('assignments').filter((a) => a.employeeId === employee.id);
    const projects = store.getCollection('projects');
    const tasks = store.getCollection('tasks').filter((t) => t.assignedEmployeeId === employee.id);

    const projectAllocations = assignments.map((a) => {
      const prj = projects.find((p) => p.id === a.projectId);
      return {
        ...a,
        project: prj || null,
      };
    });

    const totalAllocation = assignments
      .filter((a) => a.assignmentStatus === 'ACTIVE')
      .reduce((sum, a) => sum + (Number(a.allocationPercentage) || 0), 0);

    return res.json({
      success: true,
      employee: {
        ...employee,
        totalAllocation,
        availableCapacity: Math.max(0, 100 - totalAllocation),
        isOverAllocated: totalAllocation > 100,
        assignments: projectAllocations,
        assignedTasks: tasks,
      },
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

const createEmployee = (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      department,
      designation,
      skills,
      experienceYears,
      hourlyRate,
      maxActiveProjects,
      status = 'ACTIVE',
      empId: customEmpId,
    } = req.body;

    if (!name || !email || !department || !designation) {
      return res.status(400).json({ success: false, message: 'Name, email, department and designation are required' });
    }

    const employees = store.getCollection('employees');
    if (employees.some((e) => e.email.toLowerCase() === email.toLowerCase())) {
      return res.status(400).json({ success: false, message: 'Employee record with this email already exists' });
    }

    // Auto-generate employee ID if not provided
    let empId = customEmpId;
    if (!empId) {
      const empSeq = String(employees.length + 101).padStart(4, '0');
      empId = `EMP-${empSeq}`;
    }

    const newEmployee = store.addItem('employees', {
      empId,
      name,
      email,
      phone: phone || '',
      department,
      designation,
      skills: Array.isArray(skills)
        ? skills
        : typeof skills === 'string'
        ? skills.split(',').map((s) => s.trim()).filter(Boolean)
        : [],
      experienceYears: parseInt(experienceYears, 10) || 0,
      joinDate: new Date().toISOString().split('T')[0],
      hourlyRate: Number(hourlyRate) || 1500,
      maxActiveProjects: parseInt(maxActiveProjects, 10) || 3,
      status,
    });

    store.addItem('auditLogs', {
      entityType: 'EMPLOYEE',
      entityId: newEmployee.id,
      action: 'CREATE',
      performedById: req.user ? req.user.id : 'usr-001',
      changes: { empId, name, department, designation },
    });

    return res.status(201).json({
      success: true,
      message: `Employee ${empId} created successfully`,
      employee: newEmployee,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

const updateEmployee = (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      email,
      phone,
      department,
      designation,
      skills,
      experienceYears,
      hourlyRate,
      maxActiveProjects,
      status,
      joinDate,
    } = req.body;

    const employee = store.getCollection('employees').find((e) => e.id === id || e.empId === id);
    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }

    const updates = {};
    if (name !== undefined) updates.name = name;
    if (email !== undefined) updates.email = email;
    if (phone !== undefined) updates.phone = phone;
    if (department !== undefined) updates.department = department;
    if (designation !== undefined) updates.designation = designation;
    if (skills !== undefined) {
      updates.skills = Array.isArray(skills)
        ? skills
        : typeof skills === 'string'
        ? skills.split(',').map((s) => s.trim()).filter(Boolean)
        : [];
    }
    if (experienceYears !== undefined) updates.experienceYears = parseInt(experienceYears, 10) || 0;
    if (hourlyRate !== undefined) updates.hourlyRate = Number(hourlyRate) || 0;
    if (maxActiveProjects !== undefined) updates.maxActiveProjects = parseInt(maxActiveProjects, 10) || 3;
    if (status !== undefined) updates.status = status;
    if (joinDate !== undefined) updates.joinDate = joinDate;

    const updated = store.updateItem('employees', employee.id, updates);

    store.addItem('auditLogs', {
      entityType: 'EMPLOYEE',
      entityId: employee.id,
      action: 'UPDATE',
      performedById: req.user ? req.user.id : 'usr-001',
      changes: updates,
    });

    return res.json({
      success: true,
      message: `Employee ${employee.empId} updated successfully`,
      employee: updated,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

const deleteEmployee = (req, res) => {
  try {
    const { id } = req.params;
    const employee = store.getCollection('employees').find((e) => e.id === id || e.empId === id);
    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }

    const removed = store.removeItem('employees', employee.id);

    // Clean up associated assignments
    if (store.data.assignments) {
      store.data.assignments = store.data.assignments.filter((a) => a.employeeId !== employee.id);
    }
    if (store.data.tasks) {
      store.data.tasks = store.data.tasks.map((t) => {
        if (t.assignedEmployeeId === employee.id) {
          return { ...t, assignedEmployeeId: null };
        }
        return t;
      });
    }

    store.addItem('auditLogs', {
      entityType: 'EMPLOYEE',
      entityId: employee.id,
      action: 'DELETE',
      performedById: req.user ? req.user.id : 'usr-001',
      changes: { empId: employee.empId, name: employee.name, deletedAt: new Date().toISOString() },
    });

    store.save();

    return res.json({
      success: true,
      message: `Employee ${employee.empId} (${employee.name}) removed successfully`,
      employee: removed,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

const getAssignments = (req, res) => {
  try {
    const { projectId, employeeId, status = 'ACTIVE' } = req.query;
    let assignments = store.getCollection('assignments');
    const employees = store.getCollection('employees');
    const projects = store.getCollection('projects');

    if (status && status !== 'ALL') {
      assignments = assignments.filter((a) => a.assignmentStatus === status);
    }
    if (projectId) {
      assignments = assignments.filter((a) => a.projectId === projectId);
    }
    if (employeeId) {
      assignments = assignments.filter((a) => a.employeeId === employeeId);
    }

    const enriched = assignments.map((a) => {
      const employee = employees.find((e) => e.id === a.employeeId);
      const project = projects.find((p) => p.id === a.projectId);
      return {
        ...a,
        employee,
        project,
      };
    });

    return res.json({
      success: true,
      count: enriched.length,
      assignments: enriched,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

const assignEmployee = (req, res) => {
  try {
    const projectId = req.params.projectId || req.body.projectId;
    const { employeeId, projectRole, responsibilities, allocationPercentage = 50, expectedReleaseDate } = req.body;

    if (!projectId) {
      return res.status(400).json({ success: false, message: 'Project ID is required' });
    }
    if (!employeeId || !projectRole) {
      return res.status(400).json({ success: false, message: 'Employee ID and Project Role are required' });
    }

    const project = store.getCollection('projects').find((p) => p.id === projectId || p.projectId === projectId);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    const employee = store.getCollection('employees').find((e) => e.id === employeeId || e.empId === employeeId);
    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }

    const assignments = store.getCollection('assignments');
    const existingActive = assignments.filter((a) => a.employeeId === employee.id && a.assignmentStatus === 'ACTIVE');

    // Check existing assignment to same project
    const alreadyAssigned = existingActive.find((a) => a.projectId === project.id);
    if (alreadyAssigned) {
      return res.status(400).json({
        success: false,
        message: `${employee.name} is already assigned to this project as ${alreadyAssigned.projectRole}`,
      });
    }

    // Workload calculation
    const currentAllocation = existingActive.reduce((sum, a) => sum + (Number(a.allocationPercentage) || 0), 0);
    const newAllocation = Number(allocationPercentage) || 50;
    const totalAfter = currentAllocation + newAllocation;

    let warning = null;
    if (totalAfter > 100) {
      warning = `Workload Warning: ${employee.name} is now over-allocated (${totalAfter}%). Max recommended is 100%.`;
    }
    if (existingActive.length >= (employee.maxActiveProjects || 3)) {
      warning = `Project Count Warning: ${employee.name} now has ${existingActive.length + 1} active projects (Max configured: ${employee.maxActiveProjects || 3}).`;
    }

    const newAssignment = store.addItem('assignments', {
      projectId: project.id,
      employeeId: employee.id,
      projectRole,
      responsibilities: responsibilities || '',
      allocationPercentage: newAllocation,
      assignedDate: new Date().toISOString().split('T')[0],
      expectedReleaseDate: expectedReleaseDate || project.expectedCompletionDate || null,
      actualReleaseDate: null,
      assignmentStatus: 'ACTIVE',
    });

    // If project was UNASSIGNED or NEW, advance status to ASSIGNED if appropriate
    if (['NEW', 'APPROVED'].includes(project.status)) {
      store.updateItem('projects', project.id, { status: 'ASSIGNED' });
      store.addItem('statusHistory', {
        projectId: project.id,
        previousStatus: project.status,
        newStatus: 'ASSIGNED',
        changedById: req.user ? req.user.id : 'usr-001',
        changeReason: 'First key project team member allocated',
        remarks: `Assigned ${employee.name} as ${projectRole}`,
      });
    }

    store.addItem('auditLogs', {
      entityType: 'ASSIGNMENT',
      entityId: newAssignment.id,
      action: 'ASSIGN',
      performedById: req.user ? req.user.id : 'usr-001',
      changes: { projectId: project.id, employeeId: employee.id, projectRole, allocationPercentage: newAllocation, warning },
    });

    return res.status(201).json({
      success: true,
      message: `${employee.name} assigned as ${projectRole}`,
      assignment: { ...newAssignment, employee, project },
      warning,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

const updateAssignment = (req, res) => {
  try {
    const { assignmentId } = req.params;
    const { projectRole, allocationPercentage, responsibilities, expectedReleaseDate, assignmentStatus } = req.body;

    const assignment = store.getCollection('assignments').find((a) => a.id === assignmentId);
    if (!assignment) {
      return res.status(404).json({ success: false, message: 'Assignment record not found' });
    }

    const updates = {};
    if (projectRole !== undefined) updates.projectRole = projectRole;
    if (allocationPercentage !== undefined) updates.allocationPercentage = Number(allocationPercentage) || 0;
    if (responsibilities !== undefined) updates.responsibilities = responsibilities;
    if (expectedReleaseDate !== undefined) updates.expectedReleaseDate = expectedReleaseDate;
    if (assignmentStatus !== undefined) {
      updates.assignmentStatus = assignmentStatus;
      if (assignmentStatus === 'RELEASED' && !assignment.actualReleaseDate) {
        updates.actualReleaseDate = new Date().toISOString().split('T')[0];
      }
    }

    const updated = store.updateItem('assignments', assignmentId, updates);

    store.addItem('auditLogs', {
      entityType: 'ASSIGNMENT',
      entityId: assignmentId,
      action: 'UPDATE',
      performedById: req.user ? req.user.id : 'usr-001',
      changes: updates,
    });

    return res.json({
      success: true,
      message: 'Assignment updated successfully',
      assignment: updated,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

const deleteAssignment = (req, res) => {
  try {
    const { assignmentId } = req.params;
    const assignment = store.getCollection('assignments').find((a) => a.id === assignmentId);
    if (!assignment) {
      return res.status(404).json({ success: false, message: 'Assignment record not found' });
    }

    const removed = store.removeItem('assignments', assignmentId);

    store.addItem('auditLogs', {
      entityType: 'ASSIGNMENT',
      entityId: assignmentId,
      action: 'DELETE',
      performedById: req.user ? req.user.id : 'usr-001',
      changes: { assignmentId, projectId: assignment.projectId, employeeId: assignment.employeeId },
    });

    return res.json({
      success: true,
      message: 'Assignment removed successfully',
      assignment: removed,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

const releaseEmployee = (req, res) => {
  try {
    const { assignmentId } = req.params;
    const assignment = store.getCollection('assignments').find((a) => a.id === assignmentId);

    if (!assignment) {
      return res.status(404).json({ success: false, message: 'Assignment not found' });
    }

    const todayDate = new Date().toISOString().split('T')[0];
    const updated = store.updateItem('assignments', assignmentId, {
      assignmentStatus: 'RELEASED',
      actualReleaseDate: todayDate,
    });

    store.addItem('auditLogs', {
      entityType: 'ASSIGNMENT',
      entityId: assignmentId,
      action: 'RELEASE',
      performedById: req.user ? req.user.id : 'usr-001',
      changes: { assignmentStatus: 'RELEASED', actualReleaseDate: todayDate },
    });

    return res.json({
      success: true,
      message: 'Employee successfully released from project assignment',
      assignment: updated,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  getEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  getAssignments,
  assignEmployee,
  updateAssignment,
  deleteAssignment,
  releaseEmployee,
};

