const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const storePath = path.resolve(__dirname, '../data/store.json');
const store = JSON.parse(fs.readFileSync(storePath, 'utf8'));

const newPasswordHash = bcrypt.hashSync('ArshithInventory', 10);

// 1. Update usr-001
const adminUser = store.users.find(u => u.id === 'usr-001' || u.roleName === 'SUPER_ADMIN');
if (adminUser) {
  adminUser.name = 'Farook';
  adminUser.email = 'admin@arshithgroup.com';
  adminUser.passwordHash = newPasswordHash;
  console.log('Updated admin user:', adminUser.email, adminUser.name);
}

// 2. Update emp-001
const adminEmp = store.employees.find(e => e.id === 'emp-001' || e.empId === 'EMP-0101');
if (adminEmp) {
  adminEmp.name = 'Farook';
  adminEmp.email = 'admin@arshithgroup.com';
  console.log('Updated employee EMP-0101:', adminEmp.empId, adminEmp.name, adminEmp.email);
}

fs.writeFileSync(storePath, JSON.stringify(store, null, 2), 'utf8');
console.log('Successfully saved store.json with updated admin credentials!');

