// Roles: SUPER_ADMIN, PROJECT_MANAGER, TEAM_LEAD, EMPLOYEE, FINANCE_MANAGER

const authorize = (allowedRoles = []) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const userRole = req.user.roleName || req.user.role;

    // Super Admin has universal access
    if (userRole === 'SUPER_ADMIN') {
      return next();
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: Access requires one of [${allowedRoles.join(', ')}]. Current role: ${userRole}`,
      });
    }

    next();
  };
};

module.exports = { authorize };

