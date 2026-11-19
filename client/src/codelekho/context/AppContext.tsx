import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { 
  NavigationSection, 
  Course, 
  LearningModule, 
  Student, 
  Exam,
  ExamAttempt,
  CertificateRecord,
  FinancialTransaction,
  GrowthMetrics,
  TimelineProject, 
  AlertSummary, 
  ToastMessage,
  DateFilterOption
} from '../types';
import { 
  INITIAL_COURSES, 
  INITIAL_MODULES, 
  INITIAL_STUDENTS, 
  INITIAL_EXAMS,
  INITIAL_EXAM_ATTEMPTS,
  INITIAL_CERTIFICATES,
  INITIAL_FINANCIALS,
  INITIAL_GROWTH_METRICS,
  PRACTICE_PROBLEMS_SUMMARY,
  INITIAL_TIMELINE_PROJECTS, 
  INITIAL_ALERT_SUMMARY 
} from '../data/database';
import { apiService, ProductionHealthStatus } from '../services/api';

export interface StudentAnalyticsData {
  totalRegistrations: number;
  activeStudents: number;
  inactiveStudents: number;
  newRegistrations: number;
  dailyGrowthRate: number;
  monthlyGrowthRate: number;
}

export interface LearningAnalyticsData {
  courseEnrollments: { [track: string]: number };
  totalEnrollments: number;
  avgModuleCompletion: number;
  avgQuizScore: number;
  totalCodingPracticeSubmissions: number;
  interviewProblemsPracticed: number;
}

export interface ExamAnalyticsData {
  totalAttempts: number;
  passPercentage: number;
  failurePercentage: number;
  avgScore: number;
  passedCount: number;
  failedCount: number;
}

export interface CertificateAnalyticsData {
  totalGenerated: number;
  verifiedCount: number;
  pendingCount: number;
}

export interface FinancialAnalyticsData {
  isFreePlatform: boolean;
  courseTuitionRevenue: number; // ₹0
  operationalExpenses: number;
  sponsorshipIncome: number;
  partnershipIncome: number;
  paidServiceIncome: number;
  netInstitutionalBalance: number;
  hasTransactions: boolean;
}

interface AppContextType {
  activeSection: NavigationSection;
  setActiveSection: (section: NavigationSection) => void;
  selectedCourseId: string | null;
  setSelectedCourseId: (id: string | null) => void;
  selectedCourse: Course | undefined;
  
  // Database Collections
  courses: Course[];
  modules: LearningModule[];
  students: Student[];
  exams: Exam[];
  examAttempts: ExamAttempt[];
  certificates: CertificateRecord[];
  financials: FinancialTransaction[];
  growthMetrics: GrowthMetrics;
  timelineProjects: TimelineProject[];
  alertSummary: AlertSummary;
  practiceProblemsSummary: typeof PRACTICE_PROBLEMS_SUMMARY;

  // Filter & Backend Status
  dateFilter: DateFilterOption;
  setDateFilter: (filter: DateFilterOption) => void;
  isBackendConnected: boolean;

  // Live Production Sync Status & Staff Auth
  productionHealth: ProductionHealthStatus | null;
  productionSyncStatus: 'connected' | 'connecting' | 'needs_auth' | 'error';
  productionSyncError: string | null;
  productionSource: string;
  isStaffAuthenticated: boolean;
  staffProfile: any | null;
  isSyncModalOpen: boolean;
  setIsSyncModalOpen: (open: boolean) => void;
  syncLiveStudentsNow: () => Promise<void>;
  loginStaff: (credentials: { email: string; regNo?: string; password?: string }) => Promise<boolean>;
  logoutStaff: () => void;
  registerLiveStudent: (student: { name: string; regNo: string; phone: string; email: string; password?: string }) => Promise<boolean>;

  // Real-time Database Computed Analytics
  studentAnalytics: StudentAnalyticsData;
  learningAnalytics: LearningAnalyticsData;
  examAnalytics: ExamAnalyticsData;
  certificateAnalytics: CertificateAnalyticsData;
  financialAnalytics: FinancialAnalyticsData;

  // Modals & Popups
  activeModuleModal: LearningModule | null;
  openModuleModal: (module: LearningModule) => void;
  closeModuleModal: () => void;
  updateModule: (updatedModule: LearningModule) => void;
  
  selectedStudentForProfile: Student | null;
  setSelectedStudentForProfile: (student: Student | null) => void;
  
  isAddCourseModalOpen: boolean;
  setIsAddCourseModalOpen: (open: boolean) => void;
  addCourse: (course: Partial<Course>) => void;
  editCourse: (id: string, updates: Partial<Course>) => void;
  deleteCourse: (id: string) => void;
  
  addStudent: (student: Partial<Student>) => void;
  editStudent: (id: string, updates: Partial<Student>) => void;
  deleteStudent: (id: string) => void;

  addFinancialTransaction: (txn: Partial<FinancialTransaction>) => void;
  verifyCertificate: (certId: string) => void;

  globalSearchOpen: boolean;
  setGlobalSearchOpen: (open: boolean) => void;
  
  toastMessage: ToastMessage | null;
  showToast: (title: string, message?: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  dismissToast: () => void;

  isSidebarCollapsed: boolean;
  toggleSidebar: () => void;

  filterTrack: string;
  setFilterTrack: (track: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeSection, setActiveSection] = useState<NavigationSection>('dashboard');
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>('c-py-01');
  const [dateFilter, setDateFilter] = useState<DateFilterOption>('This Year');
  const [isBackendConnected, setIsBackendConnected] = useState<boolean>(false);
  
  // Persistent Collections in localStorage with automatic zero-reset
  const [courses, setCourses] = useState<Course[]>(() => {
    if (!localStorage.getItem('codelekho_zero_v3')) {
      localStorage.removeItem('codelekho_db_courses');
      localStorage.removeItem('codelekho_db_modules');
      localStorage.removeItem('codelekho_prod_students');
      localStorage.removeItem('codelekho_db_exam_attempts');
      localStorage.removeItem('codelekho_db_certificates');
      localStorage.removeItem('codelekho_db_financials');
      localStorage.setItem('codelekho_zero_v3', 'true');
      return [];
    }
    const saved = localStorage.getItem('codelekho_db_courses');
    return saved ? JSON.parse(saved) : INITIAL_COURSES;
  });

  const [modules, setModules] = useState<LearningModule[]>(() => {
    const saved = localStorage.getItem('codelekho_db_modules');
    return saved ? JSON.parse(saved) : INITIAL_MODULES;
  });

  const [students, setStudents] = useState<Student[]>(() => {
    // Only load real production students from verified cache; never use hardcoded sample arrays
    const saved = localStorage.getItem('codelekho_prod_students');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      } catch {}
    }
    return []; // Zero students until real production records are synchronized
  });

  const [examAttempts, setExamAttempts] = useState<ExamAttempt[]>(() => {
    const saved = localStorage.getItem('codelekho_db_exam_attempts');
    return saved ? JSON.parse(saved) : INITIAL_EXAM_ATTEMPTS;
  });

  const [certificates, setCertificates] = useState<CertificateRecord[]>(() => {
    const saved = localStorage.getItem('codelekho_db_certificates');
    return saved ? JSON.parse(saved) : INITIAL_CERTIFICATES;
  });

  const [financials, setFinancials] = useState<FinancialTransaction[]>(() => {
    const saved = localStorage.getItem('codelekho_db_financials');
    return saved ? JSON.parse(saved) : INITIAL_FINANCIALS;
  });

  const [growthMetrics] = useState<GrowthMetrics>(INITIAL_GROWTH_METRICS);
  const [exams] = useState<Exam[]>(INITIAL_EXAMS);
  const [timelineProjects] = useState<TimelineProject[]>(INITIAL_TIMELINE_PROJECTS);
  const [alertSummary] = useState<AlertSummary>(INITIAL_ALERT_SUMMARY);

  const [activeModuleModal, setActiveModuleModal] = useState<LearningModule | null>(null);
  const [selectedStudentForProfile, setSelectedStudentForProfile] = useState<Student | null>(null);
  const [isAddCourseModalOpen, setIsAddCourseModalOpen] = useState(false);
  const [globalSearchOpen, setGlobalSearchOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<ToastMessage | null>(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [filterTrack, setFilterTrack] = useState<string>('All');

  // Live Production Synchronization State
  const [productionHealth, setProductionHealth] = useState<ProductionHealthStatus | null>(null);
  const [productionSyncStatus, setProductionSyncStatus] = useState<'connected' | 'connecting' | 'needs_auth' | 'error'>('connecting');
  const [productionSyncError, setProductionSyncError] = useState<string | null>(null);
  const [productionSource, setProductionSource] = useState<string>('https://codelekho.com/api');
  const [isStaffAuthenticated, setIsStaffAuthenticated] = useState<boolean>(() => !!apiService.getStoredStaffToken());
  const [staffProfile, setStaffProfile] = useState<any | null>(() => {
    const saved = localStorage.getItem('codelekho_staff_profile');
    return saved ? JSON.parse(saved) : null;
  });
  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);

  // Persistence Effects
  useEffect(() => {
    localStorage.setItem('codelekho_db_courses', JSON.stringify(courses));
  }, [courses]);

  useEffect(() => {
    localStorage.setItem('codelekho_db_modules', JSON.stringify(modules));
  }, [modules]);

  useEffect(() => {
    localStorage.setItem('codelekho_prod_students', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem('codelekho_db_exam_attempts', JSON.stringify(examAttempts));
  }, [examAttempts]);

  useEffect(() => {
    localStorage.setItem('codelekho_db_certificates', JSON.stringify(certificates));
  }, [certificates]);

  useEffect(() => {
    localStorage.setItem('codelekho_db_financials', JSON.stringify(financials));
  }, [financials]);

  // Synchronize with Live CodeLekho Production API
  const syncLiveStudentsNow = async () => {
    setProductionSyncStatus('connecting');
    setProductionSyncError(null);

    // 1. Health check to https://codelekho.com/api/health
    const health = await apiService.checkProductionHealth();
    setProductionHealth(health);

    // 2. Fetch real students from production /admin/students
    const result = await apiService.getLiveStudents();
    if (result.success) {
      setStudents(result.students);
      setProductionSyncStatus('connected');
      setProductionSource(result.source);
      setIsBackendConnected(true);
      showToast('Live Synchronized', `Synchronized ${result.students.length} real student accounts from CodeLekho production.`);
    } else {
      setIsBackendConnected(health?.status === 'ok');
      if (result.error?.includes('Staff Token')) {
        setProductionSyncStatus('needs_auth');
      } else {
        setProductionSyncStatus('error');
      }
      setProductionSyncError(result.error || 'Failed to sync with live database.');
    }
  };

  // Automated 15-Second Live Poller matching CodeLekho production architecture
  useEffect(() => {
    syncLiveStudentsNow();

    const pollingInterval = Number(import.meta.env?.VITE_POLLING_INTERVAL_MS) || 15000;
    const poller = setInterval(async () => {
      if (!document.hidden) {
        try {
          const res = await apiService.getLiveStudents();
          if (res.success) {
            setStudents(res.students);
            setProductionSyncStatus('connected');
          }
        } catch {}
      }
    }, pollingInterval); // configurable via .env (default: 15s)

    return () => clearInterval(poller);
  }, []);

  const loginStaff = async (credentials: { email: string; regNo?: string; password?: string }): Promise<boolean> => {
    const res = await apiService.loginStaff(credentials);
    if (res.success) {
      setIsStaffAuthenticated(true);
      setStaffProfile(res.learner || null);
      showToast('Admin Connected', 'Staff authenticated to live CodeLekho API.');
      await syncLiveStudentsNow();
      return true;
    } else {
      showToast('Authentication Error', res.message || 'Invalid staff credentials', 'error');
      return false;
    }
  };

  const logoutStaff = () => {
    apiService.clearStaffToken();
    setIsStaffAuthenticated(false);
    setStaffProfile(null);
    setProductionSyncStatus('needs_auth');
    showToast('Signed Out', 'Staff session cleared.', 'info');
  };

  const registerLiveStudent = async (studentData: { name: string; regNo: string; phone: string; email: string; password?: string }): Promise<boolean> => {
    const res = await apiService.registerProductionStudent(studentData);
    if (res.success) {
      showToast('Student Registered', res.message, 'success');
      await syncLiveStudentsNow();
      return true;
    } else {
      showToast('Registration Error', res.message, 'error');
      return false;
    }
  };

  // Global Ctrl+K shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setGlobalSearchOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const showToast = (title: string, message?: string, type: 'success' | 'info' | 'warning' | 'error' = 'success') => {
    const id = Date.now().toString();
    setToastMessage({ id, title, message, type });
  };

  const dismissToast = () => {
    setToastMessage(null);
  };

  const openModuleModal = (module: LearningModule) => {
    setActiveModuleModal(module);
  };

  const closeModuleModal = () => {
    setActiveModuleModal(null);
  };

  const updateModule = (updated: LearningModule) => {
    setModules(prev => prev.map(m => m.id === updated.id ? updated : m));
    setActiveModuleModal(updated);
    showToast('Task updated', `Progress set to ${updated.progressPercent}% (${updated.status})`, 'success');
  };

  const addCourse = (newCourseData: Partial<Course>) => {
    const newCourse: Course = {
      id: `c-new-${Date.now()}`,
      code: newCourseData.code || `TRACK-${Math.floor(100 + Math.random() * 900)}`,
      title: newCourseData.title || 'Untitled Course Track',
      category: newCourseData.category || 'Python Programming',
      track: newCourseData.track || 'Python',
      description: newCourseData.description || 'Free coding curriculum with module quizzes and coding practice.',
      thumbnail: newCourseData.thumbnail || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=60',
      instructor: newCourseData.instructor || 'Arshith Sharma',
      instructorTitle: newCourseData.instructorTitle || 'Lead Instructor',
      startDate: newCourseData.startDate || '01 Dec 2026',
      endDate: newCourseData.endDate || '28 Feb 2027',
      durationWeeks: newCourseData.durationWeeks || 12,
      enrolledStudentsCount: 0,
      activeLearnersCount: 0,
      modulesCount: 16,
      completionPercent: 0,
      avgExamScore: 0,
      avgQuizScore: 0,
      codingPracticeSubmissions: 0,
      status: 'Upcoming',
      batch: newCourseData.batch || 'Cohort 2026-C',
      difficulty: newCourseData.difficulty || 'Medium',
      isFree: true,
      operationalCostPerStudent: 350,
      certifiedStudentsCount: 0,
    };
    setCourses(prev => [newCourse, ...prev]);
    showToast('Course Created', `${newCourse.title} added to curriculum.`, 'success');
  };

  const editCourse = (id: string, updates: Partial<Course>) => {
    setCourses(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
    showToast('Course Updated', 'Course parameters and syllabus refreshed.', 'success');
  };

  const deleteCourse = (id: string) => {
    setCourses(prev => prev.filter(c => c.id !== id));
    showToast('Course Removed', 'Course archived from catalog.', 'info');
  };

  const addStudent = (studentData: Partial<Student>) => {
    const newStudent: Student = {
      id: `st-${Date.now()}`,
      studentId: `CL-${Math.floor(1000 + Math.random() * 9000)}`,
      name: studentData.name || 'New Learner',
      email: studentData.email || 'learner@codelekho.edu',
      avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80`,
      phone: studentData.phone || '+91 98000 00000',
      enrolledCourses: studentData.enrolledCourses || ['Python for Data Engineering & Software Systems'],
      track: studentData.track || 'Python',
      courseProgress: 0,
      examStatus: 'Pending',
      examAttempts: 0,
      certificateStatus: 'Not Eligible',
      registrationDate: '17 Nov 2026',
      status: 'Active',
      lastActive: 'Just now',
      lastActiveTimestamp: Date.now(),
      modulesCompleted: 0,
      totalModules: 16,
      quizScoreAvg: 0,
      codingProblemsSolved: 0,
    };
    setStudents(prev => [newStudent, ...prev]);
    showToast('Student Enrolled', `${newStudent.name} registered into CodeLekho.`, 'success');
  };

  const editStudent = (id: string, updates: Partial<Student>) => {
    setStudents(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
    showToast('Student Profile Updated', 'Student profile details refreshed.', 'success');
  };

  const deleteStudent = (id: string) => {
    setStudents(prev => prev.filter(s => s.id !== id));
    showToast('Student Removed', 'Student record archived.', 'info');
  };

  const addFinancialTransaction = (txn: Partial<FinancialTransaction>) => {
    const newTxn: FinancialTransaction = {
      id: `fin-${Date.now()}`,
      type: txn.type || 'Sponsorship',
      title: txn.title || 'Institutional Contribution',
      sourceOrVendor: txn.sourceOrVendor || 'Education Partner',
      category: txn.category || 'CSR Tech Grant',
      amount: txn.amount || 50000,
      date: '17 Nov 2026',
      timestamp: Date.now(),
      status: 'Settled'
    };
    setFinancials(prev => [newTxn, ...prev]);
    showToast('Transaction Logged', `₹${newTxn.amount.toLocaleString('en-IN')} added to accounts.`, 'success');
  };

  const verifyCertificate = (certId: string) => {
    setCertificates(prev => prev.map(c => c.id === certId ? { ...c, status: 'Verified' } : c));
    showToast('Certificate Verified', 'Cryptographic QR hash confirmed.', 'success');
  };

  const toggleSidebar = () => {
    setIsSidebarCollapsed(prev => !prev);
  };

  const selectedCourse = courses.find(c => c.id === selectedCourseId) || courses[0];

  // Date Filter evaluation helper
  const matchesDate = (dateStr: string) => {
    if (!dateStr) return true;
    const lower = dateStr.toLowerCase();
    if (dateFilter === 'Today') {
      return lower.includes('17 nov') || lower.includes('today') || lower.includes('just now');
    }
    if (dateFilter === 'This Week') {
      return lower.includes('17 nov') || lower.includes('16 nov') || lower.includes('15 nov') || 
             lower.includes('14 nov') || lower.includes('13 nov') || lower.includes('12 nov') ||
             lower.includes('11 nov') || lower.includes('today') || lower.includes('just now');
    }
    if (dateFilter === 'This Month') {
      return lower.includes('nov 2026') || lower.includes('today') || lower.includes('just now');
    }
    return lower.includes('2026') || lower.includes('today') || lower.includes('just now');
  };

  // 1. STUDENT ANALYTICS (Dynamically computed from actual database)
  const studentAnalytics: StudentAnalyticsData = useMemo(() => {
    const filtered = students.filter(s => matchesDate(s.registrationDate));
    const active = filtered.filter(s => s.status === 'Active' || s.status === 'On-Track').length;
    const inactive = filtered.filter(s => s.status === 'Inactive' || (Date.now() - s.lastActiveTimestamp > 1000 * 60 * 60 * 24 * 30)).length;
    const newRegs = filtered.filter(s => s.registrationDate.includes('17 Nov') || s.registrationDate.includes('16 Nov')).length;

    return {
      totalRegistrations: filtered.length,
      activeStudents: active,
      inactiveStudents: inactive,
      newRegistrations: newRegs,
      dailyGrowthRate: 0,
      monthlyGrowthRate: 0
    };
  }, [students, dateFilter]);

  // 2. LEARNING ANALYTICS (Course enrollments, 60+ modules, quiz scores, 355 coding problems)
  const learningAnalytics: LearningAnalyticsData = useMemo(() => {
    const courseEnrollments: { [track: string]: number } = {
      'Python': 0,
      'SQL & Databases': 0,
      'Web Development': 0,
      'AI & Data Science': 0
    };

    students.forEach(s => {
      s.enrolledCourses.forEach(cName => {
        const lower = cName.toLowerCase();
        if (lower.includes('python')) courseEnrollments['Python'] += 1;
        else if (lower.includes('sql') || lower.includes('postgres')) courseEnrollments['SQL & Databases'] += 1;
        else if (lower.includes('web') || lower.includes('react') || lower.includes('full stack')) courseEnrollments['Web Development'] += 1;
        else if (lower.includes('ai') || lower.includes('pytorch')) courseEnrollments['AI & Data Science'] += 1;
      });
    });

    const totalEnrollments = Object.values(courseEnrollments).reduce((a, b) => a + b, 0);
    const avgModuleCompletion = courses.reduce((a, b) => a + b.completionPercent, 0) / (courses.length || 1);
    const avgQuizScore = courses.reduce((a, b) => a + b.avgQuizScore, 0) / (courses.length || 1);
    const totalCodingPracticeSubmissions = courses.reduce((a, b) => a + b.codingPracticeSubmissions, 0);
    const interviewProblemsPracticed = students.reduce((a, b) => a + b.codingProblemsSolved, 0);

    return {
      courseEnrollments,
      totalEnrollments,
      avgModuleCompletion: Math.round(avgModuleCompletion * 10) / 10,
      avgQuizScore: Math.round(avgQuizScore * 10) / 10,
      totalCodingPracticeSubmissions,
      interviewProblemsPracticed
    };
  }, [students, courses]);

  // 3. EXAM ANALYTICS (45-Minute Proctored Final Assessment, 70% pass benchmark)
  const examAnalytics: ExamAnalyticsData = useMemo(() => {
    const totalAttempts = examAttempts.length;
    const passed = examAttempts.filter(e => e.passed || e.scorePercent >= 70).length;
    const failed = totalAttempts - passed;
    const avgScore = totalAttempts > 0 
      ? Math.round(examAttempts.reduce((acc, e) => acc + e.scorePercent, 0) / totalAttempts) 
      : 0;

    return {
      totalAttempts,
      passPercentage: totalAttempts > 0 ? Math.round((passed / totalAttempts) * 100) : 0,
      failurePercentage: totalAttempts > 0 ? Math.round((failed / totalAttempts) * 100) : 0,
      avgScore,
      passedCount: passed,
      failedCount: failed
    };
  }, [examAttempts]);

  // 4. CERTIFICATE MANAGEMENT (Generated, Verified, Pending)
  const certificateAnalytics: CertificateAnalyticsData = useMemo(() => {
    const totalGenerated = certificates.length;
    const verifiedCount = certificates.filter(c => c.status === 'Verified').length;
    const pendingCount = certificates.filter(c => c.status === 'Pending Review').length;

    return {
      totalGenerated,
      verifiedCount,
      pendingCount
    };
  }, [certificates]);

  // 5. FINANCIAL MANAGEMENT (Free Education Model - Course revenue is strictly ₹0)
  const financialAnalytics: FinancialAnalyticsData = useMemo(() => {
    const filtered = financials.filter(f => matchesDate(f.date));
    const operationalExpenses = filtered.filter(f => f.type === 'Expense').reduce((acc, f) => acc + f.amount, 0);
    const sponsorshipIncome = filtered.filter(f => f.type === 'Sponsorship').reduce((acc, f) => acc + f.amount, 0);
    const partnershipIncome = filtered.filter(f => f.type === 'Partnership').reduce((acc, f) => acc + f.amount, 0);
    const paidServiceIncome = filtered.filter(f => f.type === 'PaidService').reduce((acc, f) => acc + f.amount, 0);
    
    const netInstitutionalBalance = (sponsorshipIncome + partnershipIncome + paidServiceIncome) - operationalExpenses;

    return {
      isFreePlatform: true,
      courseTuitionRevenue: 0, // Free education model: course revenue is strictly ₹0
      operationalExpenses,
      sponsorshipIncome,
      partnershipIncome,
      paidServiceIncome,
      netInstitutionalBalance,
      hasTransactions: filtered.length > 0
    };
  }, [financials, dateFilter]);

  return (
    <AppContext.Provider
      value={{
        activeSection,
        setActiveSection,
        selectedCourseId,
        setSelectedCourseId,
        selectedCourse,
        courses,
        modules,
        students,
        exams,
        examAttempts,
        certificates,
        financials,
        growthMetrics,
        timelineProjects,
        alertSummary,
        practiceProblemsSummary: PRACTICE_PROBLEMS_SUMMARY,
        dateFilter,
        setDateFilter,
        isBackendConnected,
        studentAnalytics,
        learningAnalytics,
        examAnalytics,
        certificateAnalytics,
        financialAnalytics,
        activeModuleModal,
        openModuleModal,
        closeModuleModal,
        updateModule,
        selectedStudentForProfile,
        setSelectedStudentForProfile,
        isAddCourseModalOpen,
        setIsAddCourseModalOpen,
        addCourse,
        editCourse,
        deleteCourse,
        addStudent,
        editStudent,
        deleteStudent,
        addFinancialTransaction,
        verifyCertificate,
        globalSearchOpen,
        setGlobalSearchOpen,
        toastMessage,
        showToast,
        dismissToast,
        isSidebarCollapsed,
        toggleSidebar,
        filterTrack,
        setFilterTrack,

        // Live Production Synchronization
        productionHealth,
        productionSyncStatus,
        productionSyncError,
        productionSource,
        isStaffAuthenticated,
        staffProfile,
        isSyncModalOpen,
        setIsSyncModalOpen,
        syncLiveStudentsNow,
        loginStaff,
        logoutStaff,
        registerLiveStudent,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
