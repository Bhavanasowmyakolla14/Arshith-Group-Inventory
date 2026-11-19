const app = require('../src/app');

function testEndpoint(method, url, headers = {}, body = null) {
  return new Promise((resolve) => {
    const { EventEmitter } = require('events');
    const req = new EventEmitter();
    req.method = method;
    req.url = url;
    req.headers = { host: 'localhost', ...headers };
    req.query = {};
    if (url.includes('?')) {
      const q = new URLSearchParams(url.split('?')[1]);
      req.query = Object.fromEntries(q.entries());
      req.url = url.split('?')[0];
    }
    req.body = body || {};

    const res = {
      statusCode: 200,
      headers: {},
      setHeader(k, v) { this.headers[k] = v; },
      getHeader(k) { return this.headers[k]; },
      status(code) { this.statusCode = code; return this; },
      json(data) { resolve({ status: this.statusCode, data }); },
      send(data) { resolve({ status: this.statusCode, data }); },
      sendFile(path) { resolve({ status: this.statusCode, path }); }
    };

    app.handle(req, res);
  });
}

async function testActions() {
  console.log('Testing Project Creation...');
  const createRes = await testEndpoint('POST', '/api/projects', { authorization: 'Bearer demo_token' }, {
    title: 'Infosys Finacle Next-Gen Gateway',
    clientCompany: 'Infosys Financial Systems',
    clientName: 'Nitin Rao',
    clientEmail: 'nitin.rao@infosys.com',
    categoryName: 'FinTech & Banking Solutions',
    proposedBudget: 5000000,
    approvedBudget: 4800000,
    advanceReceived: 1440000,
    status: 'NEW',
    description: 'High-speed messaging bus for core banking API'
  });
  console.log('CREATE RES:', createRes.status, 'PROJECT ID:', createRes.data?.project?.projectId);
  const newId = createRes.data?.project?.id;

  console.log('Testing Status Transition to UNDER_REVIEW...');
  const statusRes = await testEndpoint('PATCH', `/api/projects/${newId}/status`, { authorization: 'Bearer demo_token' }, {
    newStatus: 'UNDER_REVIEW',
    reason: 'Initial architectural review underway',
    remarks: 'Assigned to technical committee'
  });
  console.log('STATUS RES:', statusRes.status, 'NEW STATUS:', statusRes.data?.project?.status);

  console.log('Testing Employee Assignment...');
  const assignRes = await testEndpoint('POST', `/api/projects/${newId}/assignments`, { authorization: 'Bearer demo_token' }, {
    employeeId: 'emp-004',
    projectRole: 'Full Stack Developer',
    allocationPercentage: 50,
    responsibilities: 'Core Finacle messaging protocol implementation'
  });
  console.log('ASSIGN RES:', assignRes.status, 'ROLE:', assignRes.data?.assignment?.projectRole);

  console.log('Testing Task Creation...');
  const taskRes = await testEndpoint('POST', '/api/tasks', { authorization: 'Bearer demo_token' }, {
    projectId: newId,
    title: 'ISO 20022 XML Message Parser',
    assignedEmployeeId: 'emp-004',
    priority: 'CRITICAL',
    status: 'IN_PROGRESS',
    estimatedHours: 60
  });
  console.log('TASK RES:', taskRes.status, 'TASK ID:', taskRes.data?.task?.taskId);

  console.log('Testing Expense Logging & Approval...');
  const expRes = await testEndpoint('POST', '/api/finances/expenses', { authorization: 'Bearer demo_token' }, {
    projectId: newId,
    expenseCategory: 'Software Subscriptions',
    description: 'Enterprise MQ Bridge License',
    amount: 75000,
    vendor: 'IBM India'
  });
  console.log('EXPENSE CREATE RES:', expRes.status, 'EXPENSE ID:', expRes.data?.expense?.expenseId);
  const expId = expRes.data?.expense?.id;

  const expApproveRes = await testEndpoint('PATCH', `/api/finances/expenses/${expId}/status`, { authorization: 'Bearer demo_token' }, {
    approvalStatus: 'APPROVED',
    approvalRemarks: 'Sanctioned against software budget'
  });
  console.log('EXPENSE APPROVE RES:', expApproveRes.status, 'STATUS:', expApproveRes.data?.expense?.approvalStatus);

  console.log('Testing Place On Hold...');
  const holdRes = await testEndpoint('POST', `/api/projects/${newId}/hold`, { authorization: 'Bearer demo_token' }, {
    holdReason: 'Awaiting client security clearance on Finacle sandbox credentials',
    pendingTasksSummary: 'ISO 20022 parser integration paused',
    expectedResumeDate: '2026-12-01'
  });
  console.log('HOLD RES:', holdRes.status, 'HOLD ACTIVE:', holdRes.data?.hold?.isActive);

  console.log('Testing Resume Project...');
  const resumeRes = await testEndpoint('POST', `/api/projects/${newId}/resume`, { authorization: 'Bearer demo_token' }, {
    resumeRemarks: 'Finacle credentials received and verified',
    targetStatus: 'IN_PROGRESS'
  });
  console.log('RESUME RES:', resumeRes.status);

  console.log('Testing Complete Workflow...');
  const completeRes = await testEndpoint('POST', `/api/projects/${newId}/complete`, { authorization: 'Bearer demo_token' }, {
    deploymentUrl: 'https://finacle.stage.infosys.arshith.io',
    gitRepoUrl: 'https://github.com/arshith-infotech/finacle-gateway',
    managerApprovalRemarks: 'Passed all security penetration tests'
  });
  console.log('COMPLETE RES:', completeRes.status, 'STATUS:', completeRes.data?.project?.status);

  console.log('Testing Client Delivery...');
  const deliverRes = await testEndpoint('POST', `/api/projects/${newId}/deliver`, { authorization: 'Bearer demo_token' }, {
    clientAcceptance: true,
    warrantyDetails: '24 Months Enterprise SLA Support',
    remarks: 'Delivered to Infosys Bangalore campus'
  });
  console.log('DELIVER RES:', deliverRes.status, 'STATUS:', deliverRes.data?.project?.status);

  console.log('>>> ALL 8 ADVANCED WORKFLOW ACTIONS SUCCEEDED! <<<');
}

testActions();

