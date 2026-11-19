const bcrypt = require('bcryptjs');
const { generateToken } = require('../config/jwt');
const { store } = require('../services/dataStore');

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    const users = store.getCollection('users');
    let normalizedEmail = email.toLowerCase().trim();
    if (normalizedEmail === 'admin@arshith.com') {
      normalizedEmail = 'admin@arshithgroup.com';
    }
    const user = users.find((u) => u.email.toLowerCase() === normalizedEmail);

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    if (!user.isActive) {
      return res.status(403).json({ success: false, message: 'Account is deactivated. Contact administrator.' });
    }

    // Check password (allow standard bypass for demo passwords)
    const validPasswords = ['ArshithInventory', 'CodeLekho2026', 'admin123', 'pm123', 'lead123', 'dev123', 'finance123'];
    let isMatch = validPasswords.includes(password);
    if (!isMatch && user.passwordHash) {
      isMatch = await bcrypt.compare(password, user.passwordHash);
    }

    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const token = generateToken({
      id: user.id,
      email: user.email,
      name: user.name,
      roleName: user.roleName,
      department: user.department,
      employeeId: user.employeeId,
    });

    // Log audit
    store.addItem('auditLogs', {
      entityType: 'USER',
      entityId: user.id,
      action: 'LOGIN',
      performedById: user.id,
      changes: { loginTime: new Date().toISOString() },
    });

    return res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        roleName: user.roleName,
        department: user.department,
        designation: user.designation,
        employeeId: user.employeeId,
        company: req.body.company || (email.toLowerCase().includes('codelekho') ? 'codelekho' : (email.toLowerCase().includes('arshithfresh') ? 'arshithfresh' : 'arshith')),
      },
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

const getMe = async (req, res) => {
  try {
    const users = store.getCollection('users');
    const user = users.find((u) => u.id === req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    const { passwordHash, ...safeUser } = user;
    return res.json({ success: true, user: safeUser });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = store.getCollection('users').map(({ passwordHash, ...u }) => u);
    return res.json({ success: true, count: users.length, users });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { login, getMe, getUsers };

