export type NavigationSection = 
  // Main
  | 'dashboard'
  | 'students'
  | 'courses'
  | 'learning-modules'
  | 'question-bank'
  | 'practice-problems'
  // Learning Management
  | 'python-track'
  | 'sql-databases'
  | 'web-development'
  | 'ai-data-science'
  | 'course-progress'
  | 'assignments'
  // Exam Management
  | 'exam-dashboard'
  | 'scheduled-exams'
  | 'proctoring'
  | 'exam-results'
  | 'certificates'
  // Analytics
  | 'student-analytics'
  | 'learning-analytics'
  | 'growth-analytics'
  | 'financial-management'
  // System
  | 'notifications'
  | 'user-management'
  | 'roles-permissions'
  | 'settings'
  | 'course-detail';

export type ModuleStatus = 'To Do' | 'Assigned' | 'In Progress' | 'In Review' | 'Blocked' | 'Completed';
export type DateFilterOption = 'Today' | 'This Week' | 'This Month' | 'This Year';

export interface Comment {
  id: string;
  author: string;
  avatar: string;
  timestamp: string;
  content: string;
}

export interface Attachment {
  id: string;
  name: string;
  size: string;
  uploadedAt: string;
  url?: string;
}

export interface TimeLog {
  id: string;
  author: string;
  hours: number;
  date: string;
}

export interface LearningModule {
  id: string;
  code: string; // e.g. "MOD-PY-01"
  courseId: string;
  title: string;
  category: 'Python' | 'SQL' | 'Web' | 'AI';
  trackName: string;
  difficulty: 'Beginner' | 'Medium' | 'Advanced';
  isMandatory: boolean;
  assignedStudent?: string;
  studentId?: string;
  startDate?: string;
  dueDate?: string;
  timeSpentHours?: number;
  status: ModuleStatus;
  progressPercent: number;
  notes?: string;
  lessonsCount: number;
  quizScore?: number;
  practiceProblemsCount: number;
  comments: Comment[];
  files: Attachment[];
  timeLogs: TimeLog[];
}

export interface PracticeProblem {
  id: string;
  code: string;
  title: string;
  track: 'Python' | 'SQL' | 'Web' | 'AI';
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  totalSubmissions: number;
  acceptanceRate: number;
  browserPracticedCount: number;
}

export interface Course {
  id: string;
  code: string; // e.g. "PYTHON-101"
  title: string;
  category: 'Python Programming' | 'SQL & Databases' | 'Web Development' | 'AI with Data Science';
  track: 'Python' | 'SQL' | 'Web' | 'AI';
  description: string;
  thumbnail: string;
  instructor: string;
  instructorTitle: string;
  startDate: string;
  endDate: string;
  durationWeeks: number;
  enrolledStudentsCount: number;
  activeLearnersCount: number;
  modulesCount: number;
  completionPercent: number;
  avgExamScore: number;
  avgQuizScore: number;
  codingPracticeSubmissions: number;
  status: 'In Progress' | 'Upcoming' | 'Completed' | 'Draft';
  batch: string;
  difficulty: 'Beginner' | 'Medium' | 'Advanced';
  isFree: boolean;
  operationalCostPerStudent: number;
  certifiedStudentsCount: number;
}

export interface Student {
  id: string;
  studentId: string; // e.g. "CL-9042"
  name: string;
  email: string;
  avatar: string;
  phone: string;
  enrolledCourses: string[];
  track: 'Python' | 'SQL' | 'Web' | 'AI';
  courseProgress: number; // 0-100
  examStatus: 'Passed' | 'Scheduled' | 'Pending' | 'Needs Retake';
  examScore?: number;
  examAttempts: number;
  certificateStatus: 'Issued' | 'In Review' | 'Not Eligible';
  certificateId?: string;
  registrationDate: string;
  status: 'Active' | 'On-Track' | 'At-Risk' | 'Inactive' | 'Graduated';
  lastActive: string;
  lastActiveTimestamp: number;
  modulesCompleted: number;
  totalModules: number;
  quizScoreAvg: number;
  codingProblemsSolved: number;
}

export interface ExamAttempt {
  id: string;
  studentId: string;
  studentName: string;
  examCode: string;
  courseTitle: string;
  track: 'Python' | 'SQL' | 'Web' | 'AI';
  durationMinutes: number; // 45 minutes proctored
  scorePercent: number;
  passed: boolean;
  date: string;
  timestamp: number;
  proctorAudit: 'Clean' | 'Warning' | 'Violation';
  violationsFlagged: number;
}

export interface Exam {
  id: string;
  code: string;
  title: string;
  courseTitle: string;
  track: 'Python' | 'SQL' | 'Web' | 'AI';
  batch: string;
  scheduledDate: string;
  durationMinutes: number; // 45 minutes
  totalQuestions: number;
  passThresholdPercent: number; // 70%
  enrolledCount: number;
  completedCount: number;
  avgScorePercent: number;
  status: 'Scheduled' | 'Live Proctoring' | 'Completed' | 'Grading';
  proctorName: string;
}

export interface CertificateRecord {
  id: string;
  certificateId: string; // e.g. "CL-CERT-2026-PY-9042"
  studentId: string;
  studentName: string;
  track: string;
  issueDate: string;
  timestamp: number;
  status: 'Verified' | 'Pending Review' | 'Generated';
  qrVerificationHash: string;
  finalScore: number;
  verificationUrl: string;
}

export interface FinancialTransaction {
  id: string;
  type: 'Expense' | 'Sponsorship' | 'Partnership' | 'PaidService';
  title: string;
  sourceOrVendor: string;
  category: string;
  amount: number;
  date: string;
  timestamp: number;
  status: 'Settled' | 'Pending';
}

export interface GrowthMetrics {
  websiteVisitors: number;
  registrations: number;
  registrationConversionRate: number; // (registrations / visitors) * 100
  dailyActiveLearners: number;
  monthlyGrowthPercent: number;
  isTrackingActive: boolean;
}

export interface TimelineProject {
  id: string;
  code: string;
  title: string;
  track: 'Python' | 'SQL' | 'Web' | 'AI';
  color: 'green' | 'orange' | 'amber' | 'blue' | 'purple';
  startMonthIndex: number;
  durationMonths: number;
  progressPercent: number;
  lead: string;
  statusText: string;
  deadline: string;
  isOverdue?: boolean;
}

export interface AlertSummary {
  upcomingCount: number;
  upcomingList: { title: string; date: string; tag: string }[];
  overdueCount: number;
  overdueList: { title: string; date: string; impact: string }[];
  resourceConflicts: { title: string; desc: string; badge: string }[];
  overlappingProjects: { mentor: string; desc: string }[];
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message?: string;
}
