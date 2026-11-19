# Arshith Infotech – Project Inventory & Portfolio Management System

A mission-critical, enterprise-grade **Project Inventory and Project Portfolio Management System** developed exclusively for **Arshith Infotech Pvt Ltd**.

This centralized platform governs the entire lifecycle of enterprise software projects: from initial client inquiry, commercial proposal, technical feasibility review, formal acceptance, resource & employee allocation, agile task & milestone execution, on-hold freeze/resumption governance, to quality assurance testing, formal completion sign-off, and client delivery.

---

## 🌟 Key Architecture & Highlights

- **Executive KPI Dashboard**: 14 status KPI cards (Total, New, Under Review, Accepted, Rejected, Assigned, Unassigned, In Progress, On Hold, Testing, Completed, Delivered, Cancelled, Overdue) and 7 Financial KPIs in INR (₹). Every card is clickable and directly opens the filtered project repository.
- **Main Project Module**: Comprehensive search, multi-field filtering, sorting, pagination, and CSV export. Form with Sections A-F (Basic Info, Scope & Requirements, Timelines, Financials, Management & Documents) with auto-generated unique Project IDs (`AIP-2026-001`).
- **12-Stage Lifecycle Status Engine**: Enforces formal transitions, prevents premature completion (requires authorized sign-off), logs previous & new status, user, timestamp, reasons, and audit remarks.
- **Employee Workload & Allocation Engine**: Prevents over-allocation, monitors individual capacity vs max active projects, and maps skills to project roles. Reuses employee records.
- **Full Project Workspace (8 Tabs)**:
  1. **Overview**: Objectives, functional/technical specs, tech stack badges, live staging/git URLs.
  2. **Team**: Employee roles, allocation %, responsibilities, assignment history, assign/release actions.
  3. **Tasks**: Interactive Kanban board (To Do, In Progress, In Review, Completed), task creation, priority badges, logged hours.
  4. **Milestones**: Contractual milestones, target vs actual completion dates, responsible leads.
  5. **Budget & Finance**: Expense breakdown, financial approvals, client payments, real-time budget utilization alerts (80% warning, 100% exceeded).
  6. **Documents**: Proposals, MSA/NDAs, SRS, technical architecture files, versioning and downloads.
  7. **Risks & Issues**: Severity/probability risk matrix, mitigation strategies, tracking status.
  8. **Activity History**: Immutable chronological audit timeline of all modifications.
- **On-Hold Project Governance**: Stalled project tracking, duration counter, root cause analysis, pending tasks freeze, and formal resumption workflow.
- **Completion & Delivery Safeguards**: Multi-point checklist validation before marking completed (tasks, milestones, testing signoff, repo URL, deployment link, warranty details).
- **16 Downloadable Reports & CSV Export**: Complete project inventory, budget allocations, actual expenditures, accepted/rejected proposals, employee workloads, PM performance, client portfolios, monthly intake, overdue exception analysis, and profitability margins.
- **Enterprise RBAC**: Role personas for Super Admin, Project Manager, Team Lead, Employee, and Finance Manager with 1-click persona switching.

---

## 💻 Technology Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Recharts (Pie, Bar, Area, Line charts), Lucide React icons.
- **Backend**: Node.js, Express.js (Modular Controllers, Middlewares, RESTful APIs).
- **Database Layer**: PostgreSQL 17, Prisma ORM schema with 24 normalized models and Decimal financial types, paired with high-performance zero-config persistent store.
- **Security**: JWT authentication, bcrypt password hashing, role-based authorization (RBAC).

---

## 🚀 Quick Start Guide

### 1. Launch the Application
Run the startup script:
```powershell
.\start.ps1
```
Or with standard npm:
```bash
npm run dev
```

### 2. Access in Web Browser
Open: **`http://localhost:5000`**

The single unified Express server serves both the REST API on `/api/*` and the compiled production React application.

---

## 👥 Demo Personas & Logins

| Persona / Name | Email | Role | Access Level |
|---|---|---|---|
| **Arshith Sharma** | `admin@arshith.com` | `SUPER_ADMIN` | Universal administrative access |
| **Priya Sundaram** | `pm@arshith.com` | `PROJECT_MANAGER` | Projects, tasks, hold/resumption, signoffs |
| **Vikramaditya Rao** | `lead@arshith.com` | `TEAM_LEAD` | Technical architecture, team tasks |
| **Ananya Deshmukh** | `dev@arshith.com` | `EMPLOYEE` | Assigned tasks, progress, hours logged |
| **Rajesh Kulkarni** | `finance@arshith.com` | `FINANCE_MANAGER` | Budgets, expense approvals, payment audits |

*Password for all accounts: `admin123` (or click the Role Switcher in the top header for instant 1-click persona switching).*

---

## 📊 Database Schema (Prisma 24 Models)

- `users`: System login accounts and role assignments
- `employees`: Internal HR records (empId, skills, capacity, designation)
- `roles` & `permissions`: Granular module authorization
- `clients`: Enterprise client accounts and billing addresses
- `projects`: Primary project inventory and portfolio records
- `project_categories`: Domain classification (Web, FinTech, Healthcare, Supply Chain, AI, Smart City)
- `project_status_history`: Immutable status transition audit trail
- `project_assignments`: Employee project allocations and commitment percentages
- `project_tasks`: Sprint tasks with Kanban states and hours spent
- `task_comments` & `task_attachments`: Collaboration artifacts
- `project_milestones`: Delivery and billing schedule checkpoints
- `project_budgets`: Category-level cost allocations
- `project_expenses`: Line-item expenditures with approval workflow
- `client_payments`: Invoiced client payments and bank reference numbers
- `project_holds`: Hold period histories, durations, reasons and resume remarks
- `project_risks` & `project_issues`: Mitigation matrix and severity ratings
- `project_documents`: File attachments, version histories, and download URLs
- `project_activity_logs` & `audit_logs`: Governance tracking
- `notifications`: Operational and threshold alerts

---

## 🏢 Corporate Ownership
Developed exclusively for **Arshith Infotech Pvt Ltd**.
© 2026 Arshith Infotech. All Rights Reserved.

