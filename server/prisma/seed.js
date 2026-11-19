const { PrismaClient } = require('@prisma/client');
const { generateSeedData } = require('../src/services/dataStore');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding PostgreSQL database for Arshith Infotech...');
  const data = generateSeedData();

  // 1. Roles
  const roles = [
    { name: 'SUPER_ADMIN', description: 'Universal access to all modules and configurations' },
    { name: 'PROJECT_MANAGER', description: 'Project management, task assignments and hold management' },
    { name: 'TEAM_LEAD', description: 'Technical lead, team task monitoring' },
    { name: 'EMPLOYEE', description: 'Assigned tasks execution and updates' },
    { name: 'FINANCE_MANAGER', description: 'Financial ledger, expense approvals and payment audits' },
  ];

  for (const r of roles) {
    await prisma.role.upsert({
      where: { name: r.name },
      update: {},
      create: r,
    });
  }

  // 2. Categories
  for (const cat of data.categories) {
    await prisma.projectCategory.upsert({
      where: { name: cat.name },
      update: {},
      create: { name: cat.name, description: cat.description },
    });
  }

  // 3. Employees
  for (const emp of data.employees) {
    await prisma.employee.upsert({
      where: { email: emp.email },
      update: {},
      create: {
        empId: emp.empId,
        name: emp.name,
        email: emp.email,
        phone: emp.phone,
        department: emp.department,
        designation: emp.designation,
        skills: emp.skills,
        experienceYears: emp.experienceYears,
        hourlyRate: emp.hourlyRate,
        maxActiveProjects: emp.maxActiveProjects,
        status: emp.status,
      },
    });
  }

  // 4. Clients
  for (const cli of data.clients) {
    await prisma.client.upsert({
      where: { clientId: cli.clientId },
      update: {},
      create: {
        clientId: cli.clientId,
        companyName: cli.companyName,
        contactPerson: cli.contactPerson,
        email: cli.email,
        phone: cli.phone,
        address: cli.address,
        industry: cli.industry,
        notes: cli.notes,
      },
    });
  }

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('Seed notice:', e.message);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

