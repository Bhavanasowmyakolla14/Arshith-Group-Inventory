const http = require('http');

const endpoints = [
  { name: 'Dashboard Stats', path: '/api/dashboard/stats' },
  { name: 'Projects List', path: '/api/projects' },
  { name: 'On-Hold Projects', path: '/api/on-hold-projects' },
  { name: 'Employees Directory', path: '/api/employees' },
  { name: 'Tasks List', path: '/api/tasks' },
  { name: 'Milestones List', path: '/api/milestones' },
  { name: 'Finances & Expenses', path: '/api/finances/expenses' },
  { name: 'Documents Library', path: '/api/documents' },
  { name: 'Reports & Analytics', path: '/api/reports?reportType=financial_portfolio&format=json' },
  { name: 'Notifications Feed', path: '/api/notifications' },
  { name: 'User Management', path: '/api/auth/users' },
  { name: 'Audit Logs Trail', path: '/api/audit-logs' },
  { name: 'Clients Roster', path: '/api/clients' }
];

function testEndpoint(ep) {
  return new Promise((resolve) => {
    http.get('http://localhost:5000' + ep.path, {
      headers: { 'Authorization': 'Bearer demo_token' }
    }, (res) => {
      let b = '';
      res.on('data', d => b += d);
      res.on('end', () => {
        try {
          const j = JSON.parse(b);
          resolve({ name: ep.name, status: res.statusCode, ok: j.success !== false });
        } catch(e) {
          resolve({ name: ep.name, status: res.statusCode, ok: res.statusCode === 200 });
        }
      });
    }).on('error', (err) => resolve({ name: ep.name, error: err.message, ok: false }));
  });
}

async function run() {
  console.log('Testing all system endpoints...');
  const results = await Promise.all(endpoints.map(testEndpoint));
  results.forEach(r => {
    console.log(`${r.ok ? '[✓ PASS]' : '[✗ FAIL]'} ${r.name} -> HTTP ${r.status}`);
  });
}

run();

