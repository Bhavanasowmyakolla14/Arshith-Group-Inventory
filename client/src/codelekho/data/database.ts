import { 
  Course, 
  LearningModule, 
  Student, 
  PracticeProblem,
  Exam,
  ExamAttempt,
  CertificateRecord,
  FinancialTransaction,
  GrowthMetrics,
  TimelineProject,
  AlertSummary
} from '../types';

// All data collections initialized to ZERO (empty arrays and 0 metrics)
export const INITIAL_COURSES: Course[] = [];

export const INITIAL_MODULES: LearningModule[] = [];

export const PRACTICE_PROBLEMS_SUMMARY = {
  totalCount: 0,
  pythonCount: 0,
  sqlCount: 0,
  webCount: 0,
  aiCount: 0,
  totalBrowserRuns: 0,
  acceptedSubmissions: 0,
  averageAcceptanceRate: 0,
  difficultySpread: {
    Easy: 0,
    Medium: 0,
    Hard: 0
  },
  topicCategories: []
};

export const INITIAL_STUDENTS: Student[] = [];

export const INITIAL_EXAMS: Exam[] = [];

export const INITIAL_EXAM_ATTEMPTS: ExamAttempt[] = [];

export const INITIAL_CERTIFICATES: CertificateRecord[] = [];

export const INITIAL_FINANCIALS: FinancialTransaction[] = [];

export const INITIAL_GROWTH_METRICS: GrowthMetrics = {
  websiteVisitors: 0,
  totalLearners: 0,
  registrationConversionPercent: 0,
  monthlyStudentGrowthPercent: 0
};

export const INITIAL_TIMELINE_PROJECTS: TimelineProject[] = [];

export const INITIAL_ALERT_SUMMARY: AlertSummary = {
  unassignedCount: 0,
  activeOnTrackCount: 0,
  escalatedCount: 0,
  cancelledCount: 0,
  completedDeliveredCount: 0
};
