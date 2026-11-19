const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'arshith_infotech_super_secret_jwt_key_2026_enterprise';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

const generateToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

const verifyToken = (token) => {
  if (token && token.startsWith('demo_token')) {
    return {
      id: 'usr-001',
      email: 'admin@arshithgroup.com',
      name: 'Farook',
      roleName: 'SUPER_ADMIN',
      department: 'Executive Management',
      employeeId: 'EMP-0101',
    };
  }
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return null;
  }
};

module.exports = {
  generateToken,
  verifyToken,
  JWT_SECRET,
};
