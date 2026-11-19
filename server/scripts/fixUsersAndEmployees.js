const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const storePath = path.resolve(__dirname, '../data/store.json');
const store = JSON.parse(fs.readFileSync(storePath, 'utf8'));

// Generate valid hash for 'admin123'
const defaultPasswordHash = bcrypt.hashSync('admin123', 10);

const employees = [
  {
    id: 'emp-001',
    empId: 'EMP-0101',
    name: 'Arshith Sharma',
    email: 'admin@arshith.com',
    phone: '+91 98765 43210',
    department: 'Executive Management',
    designation: 'Managing Director & CEO',
    skills: ['Strategic Planning', 'Enterprise Architecture', 'Portfolio Management', 'Executive Leadership'],
    experienceYears: 16,
    joinDate: '2020-01-01',
    hourlyRate: 3500,
    maxActiveProjects: 10,
    status: 'ACTIVE',
    createdAt: '2026-01-01T00:00:00.000Z'
  },
  {
    id: 'emp-002',
    empId: 'EMP-0102',
    name: 'Priya Sundaram',
    email: 'pm@arshith.com',
    phone: '+91 98765 43211',
    department: 'Project Delivery',
    designation: 'Senior Project Manager',
    skills: ['Agile / Scrum', 'Risk Management', 'Stakeholder Communication', 'Budget Tracking', 'Jira'],
    experienceYears: 10,
    joinDate: '2021-03-15',
    hourlyRate: 2200,
    maxActiveProjects: 4,
    status: 'ACTIVE',
    createdAt: '2026-01-05T00:00:00.000Z'
  },
  {
    id: 'emp-003',
    empId: 'EMP-0103',
    name: 'Vikramaditya Rao',
    email: 'lead@arshith.com',
    phone: '+91 98765 43212',
    department: 'Engineering',
    designation: 'Technical Architect & Lead',
    skills: ['System Design', 'React.js', 'Node.js', 'PostgreSQL', 'Microservices', 'Kubernetes'],
    experienceYears: 9,
    joinDate: '2021-06-01',
    hourlyRate: 2000,
    maxActiveProjects: 3,
    status: 'ACTIVE',
    createdAt: '2026-01-10T00:00:00.000Z'
  },
  {
    id: 'emp-004',
    empId: 'EMP-0104',
    name: 'Ananya Deshmukh',
    email: 'dev@arshith.com',
    phone: '+91 98765 43213',
    department: 'Engineering',
    designation: 'Senior Full Stack Developer',
    skills: ['React.js', 'Vite', 'Tailwind CSS', 'TypeScript', 'Express.js', 'Prisma ORM'],
    experienceYears: 6,
    joinDate: '2022-02-10',
    hourlyRate: 1600,
    maxActiveProjects: 2,
    status: 'ACTIVE',
    createdAt: '2026-01-15T00:00:00.000Z'
  },
  {
    id: 'emp-005',
    empId: 'EMP-0105',
    name: 'Rajesh Kulkarni',
    email: 'finance@arshith.com',
    phone: '+91 98765 43214',
    department: 'Finance & Accounts',
    designation: 'Head of Financial Operations',
    skills: ['Financial Modeling', 'Cost Auditing', 'Budget Analysis', 'Taxation & Invoicing'],
    experienceYears: 12,
    joinDate: '2021-01-15',
    hourlyRate: 1800,
    maxActiveProjects: 5,
    status: 'ACTIVE',
    createdAt: '2026-01-12T00:00:00.000Z'
  },
  {
    id: 'emp-006',
    empId: 'EMP-0106',
    name: 'Karthik Nair',
    email: 'karthik.n@arshith.com',
    phone: '+91 98765 43215',
    department: 'Engineering',
    designation: 'Backend Developer',
    skills: ['Node.js', 'PostgreSQL', 'Redis', 'GraphQL', 'Docker', 'RESTful APIs'],
    experienceYears: 5,
    joinDate: '2022-08-01',
    hourlyRate: 1400,
    maxActiveProjects: 3,
    status: 'ACTIVE',
    createdAt: '2026-02-01T00:00:00.000Z'
  },
  {
    id: 'emp-007',
    empId: 'EMP-0107',
    name: 'Sneha Patel',
    email: 'sneha.p@arshith.com',
    phone: '+91 98765 43216',
    department: 'Design',
    designation: 'UI/UX Design Specialist',
    skills: ['Figma', 'Design Systems', 'User Research', 'Wireframing', 'Prototyping'],
    experienceYears: 5,
    joinDate: '2022-10-15',
    hourlyRate: 1500,
    maxActiveProjects: 3,
    status: 'ACTIVE',
    createdAt: '2026-02-10T00:00:00.000Z'
  },
  {
    id: 'emp-008',
    empId: 'EMP-0108',
    name: 'Rohan Verma',
    email: 'rohan.v@arshith.com',
    phone: '+91 98765 43217',
    department: 'QA & Testing',
    designation: 'Lead QA Automation Engineer',
    skills: ['Cypress', 'Playwright', 'Jest', 'API Testing', 'Performance Profiling', 'Selenium'],
    experienceYears: 6,
    joinDate: '2023-01-10',
    hourlyRate: 1300,
    maxActiveProjects: 4,
    status: 'ACTIVE',
    createdAt: '2026-02-15T00:00:00.000Z'
  },
  {
    id: 'emp-009',
    empId: 'EMP-0109',
    name: 'Meera Iyer',
    email: 'meera.i@arshith.com',
    phone: '+91 98765 43218',
    department: 'DevOps & Cloud',
    designation: 'DevOps & Security Specialist',
    skills: ['AWS', 'Terraform', 'CI/CD Pipelines', 'Docker', 'Kubernetes', 'Security Hardening'],
    experienceYears: 7,
    joinDate: '2023-03-01',
    hourlyRate: 1900,
    maxActiveProjects: 4,
    status: 'ACTIVE',
    createdAt: '2026-02-20T00:00:00.000Z'
  },
  {
    id: 'emp-010',
    empId: 'EMP-0110',
    name: 'Amitabh Sen',
    email: 'amitabh.s@arshith.com',
    phone: '+91 98765 43219',
    department: 'Data & AI',
    designation: 'Machine Learning Engineer',
    skills: ['Python', 'PyTorch', 'FastAPI', 'LangChain', 'Vector DBs', 'Model Fine-tuning'],
    experienceYears: 4,
    joinDate: '2023-07-01',
    hourlyRate: 1700,
    maxActiveProjects: 2,
    status: 'ACTIVE',
    createdAt: '2026-03-01T00:00:00.000Z'
  }
];

const users = [
  {
    id: 'usr-001',
    email: 'admin@arshith.com',
    passwordHash: defaultPasswordHash,
    name: 'Arshith Sharma',
    roleName: 'SUPER_ADMIN',
    department: 'Executive Management',
    designation: 'Managing Director & CEO',
    phone: '+91 98765 43210',
    isActive: true,
    employeeId: 'EMP-0101',
    createdAt: '2026-01-01T00:00:00.000Z'
  },
  {
    id: 'usr-002',
    email: 'pm@arshith.com',
    passwordHash: defaultPasswordHash,
    name: 'Priya Sundaram',
    roleName: 'PROJECT_MANAGER',
    department: 'Project Delivery',
    designation: 'Senior Project Manager',
    phone: '+91 98765 43211',
    isActive: true,
    employeeId: 'EMP-0102',
    createdAt: '2026-01-05T00:00:00.000Z'
  },
  {
    id: 'usr-003',
    email: 'lead@arshith.com',
    passwordHash: defaultPasswordHash,
    name: 'Vikramaditya Rao',
    roleName: 'TEAM_LEAD',
    department: 'Engineering',
    designation: 'Technical Architect & Lead',
    phone: '+91 98765 43212',
    isActive: true,
    employeeId: 'EMP-0103',
    createdAt: '2026-01-10T00:00:00.000Z'
  },
  {
    id: 'usr-004',
    email: 'dev@arshith.com',
    passwordHash: defaultPasswordHash,
    name: 'Ananya Deshmukh',
    roleName: 'EMPLOYEE',
    department: 'Engineering',
    designation: 'Senior Full Stack Developer',
    phone: '+91 98765 43213',
    isActive: true,
    employeeId: 'EMP-0104',
    createdAt: '2026-01-15T00:00:00.000Z'
  },
  {
    id: 'usr-005',
    email: 'finance@arshith.com',
    passwordHash: defaultPasswordHash,
    name: 'Rajesh Kulkarni',
    roleName: 'FINANCE_MANAGER',
    department: 'Finance & Accounts',
    designation: 'Head of Financial Operations',
    phone: '+91 98765 43214',
    isActive: true,
    employeeId: 'EMP-0105',
    createdAt: '2026-01-12T00:00:00.000Z'
  }
];

store.employees = employees;
store.users = users;

fs.writeFileSync(storePath, JSON.stringify(store, null, 2), 'utf8');
console.log('Successfully written store.json!');
console.log('Employees:', store.employees.length);
console.log('Users:', store.users.length);
console.log('Projects:', store.projects.length);

