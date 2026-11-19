import { Student, Course, LearningModule, CertificateRecord, FinancialTransaction, ExamAttempt, GrowthMetrics } from '../types';

// Live CodeLekho Production API Base URL (configurable via .env VITE_API_BASE_URL)
export const PRODUCTION_API_URL = import.meta.env?.VITE_API_BASE_URL || '/api/codelekho';
export const LOCAL_FALLBACK_URL = import.meta.env?.VITE_LOCAL_API_URL || 'http://localhost:5000/api';

export interface ProductionHealthStatus {
  status: string;
  service: string;
  database: string;
  email: string;
  payments: string;
  timestamp: string;
}

export interface ProductionStudentItem {
  id: string;
  name: string;
  email: string;
  phone?: string;
  regNo?: string;
  primaryCourse?: string;
  enrolledCourses?: string[];
  progress?: number;
  completedModulesCount?: number;
  totalModules?: number;
  projectStatus?: string;
  certificateStatus?: string;
  certificateId?: string;
  joinDate?: string;
  createdAt?: string;
  status?: string;
  examScore?: number;
}

export const apiService = {
  // Fetch live courses from Supabase
  async getCourses(): Promise<{ success: boolean; courses: Course[] }> {
    try {
      const res = await fetch(`${PRODUCTION_API_URL}/courses`, { signal: AbortSignal.timeout(6000) });
      if (!res.ok) return { success: false, courses: [] };
      const data = await res.json();
      return { success: true, courses: data.courses || [] };
    } catch {
      return { success: false, courses: [] };
    }
  },

  // 1. Production Backend Health Check
  async checkProductionHealth(): Promise<ProductionHealthStatus | null> {
    try {
      const res = await fetch(`${PRODUCTION_API_URL}/health`, {
        signal: AbortSignal.timeout(4000)
      });
      if (!res.ok) return null;
      return await res.json();
    } catch (err) {
      console.warn('Production health check failed:', err);
      return null;
    }
  },

  // 2. Authenticate as Staff / Admin on CodeLekho Live API
  async loginStaff(credentials: { email: string; regNo?: string; password?: string }): Promise<{ success: boolean; staffToken?: string; learner?: any; message?: string }> {
    try {
      const res = await fetch(`${PRODUCTION_API_URL}/learners/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: credentials.email.trim().toLowerCase(),
          regNo: (credentials.regNo || '').trim().toUpperCase(),
          password: credentials.password || ''
        }),
        signal: AbortSignal.timeout(6000)
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        return {
          success: false,
          message: data.message || `Login failed with HTTP status ${res.status}`
        };
      }

      // Check if response contains staffToken
      const token = data.staffToken || data.token;
      if (token) {
        localStorage.setItem('arb_staff', token);
        localStorage.setItem('codelekho_staff_token', token);
        if (data.learner) {
          localStorage.setItem('codelekho_staff_profile', JSON.stringify(data.learner));
        }
      }

      return {
        success: true,
        staffToken: token,
        learner: data.learner
      };
    } catch (err: any) {
      return {
        success: false,
        message: err.message || 'Network error reaching https://codelekho.com/api/learners/login'
      };
    }
  },

  // Get active staff token
  getStoredStaffToken(): string | null {
    return localStorage.getItem('arb_staff') || localStorage.getItem('codelekho_staff_token') || null;
  },

  setStoredStaffToken(token: string): void {
    localStorage.setItem('arb_staff', token);
    localStorage.setItem('codelekho_staff_token', token);
  },

  clearStaffToken(): void {
    localStorage.removeItem('arb_staff');
    localStorage.removeItem('codelekho_staff_token');
    localStorage.removeItem('codelekho_staff_profile');
  },

  // 3. Fetch Real Registered Students from Live CodeLekho Production API
  async getLiveStudents(): Promise<{ success: boolean; students: Student[]; source: string; error?: string }> {
    const token = this.getStoredStaffToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      // Primary Production Endpoint: GET https://codelekho.com/api/admin/students
      const res = await fetch(`${PRODUCTION_API_URL}/admin/students`, {
        headers,
        signal: AbortSignal.timeout(5000)
      });

      if (res.ok) {
        const data = await res.json();
        const rawList: ProductionStudentItem[] = data.students || (Array.isArray(data) ? data : []);

        const mapped: Student[] = rawList.map((item, idx) => {
          const course = item.primaryCourse || (item.enrolledCourses && item.enrolledCourses[0]) || 'Python Programming';
          const track = course.toLowerCase().includes('sql')
            ? 'SQL'
            : course.toLowerCase().includes('web')
            ? 'Web'
            : course.toLowerCase().includes('ai') || course.toLowerCase().includes('data')
            ? 'AI'
            : 'Python';

          const progress = typeof item.progress === 'number' ? item.progress : 0;
          const regDate = item.joinDate || (item.createdAt ? new Date(item.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Recent');

          return {
            id: item.id || `live-st-${idx}`,
            studentId: item.studentId || item.regNo || item.id || `ARB-STU-${String(idx + 1).padStart(4, '0')}`,
            name: item.name || 'Student Learner',
            email: item.email,
            avatar: `https://images.unsplash.com/photo-${1534528741775 + (idx % 10)}?w=150&auto=format&fit=crop&q=80`,
            phone: item.phone || '+91 98000 00000',
            enrolledCourses: item.enrolledCourses || [course],
            track: track as any,
            courseProgress: progress,
            examStatus: (item.examStatus as any) || (typeof item.examScore === 'number' && item.examScore > 0 ? (item.examScore >= 70 ? 'Passed' : 'Needs Retake') : (progress >= 80 ? 'Scheduled' : 'Pending')),
            examScore: typeof item.examScore === 'number' ? item.examScore : undefined,
            examAttempts: typeof item.examScore === 'number' && item.examScore > 0 ? 1 : 0,
            certificateStatus: (item.certificateStatus === 'Earned' || item.certificateStatus === 'Issued' || item.certificateId) ? 'Issued' : (progress >= 100 ? 'In Review' : 'In Training'),
            certificateId: item.certificateId,
            registrationDate: regDate,
            status: item.status === 'Suspended' ? 'Inactive' : (item.status === 'On-Track' ? 'On-Track' : 'Active'),
            lastActive: 'Live Synced',
            lastActiveTimestamp: Date.now(),
            modulesCompleted: item.completedModulesCount !== undefined ? item.completedModulesCount : Math.round((progress / 100) * 15),
            totalModules: item.totalModules || 15,
            quizScoreAvg: 85,
            codingProblemsSolved: Math.round(progress * 1.5)
          };
        });

        // Persist verified production list in localStorage
        localStorage.setItem('codelekho_prod_students', JSON.stringify(mapped));
        localStorage.setItem('codelekho_prod_sync_time', new Date().toISOString());

        return {
          success: true,
          students: mapped,
          source: 'Live CodeLekho Production Database (Supabase /admin/students)'
        };
      }

      // If token expired or endpoint returned 401/404, check if cached live records exist
      const cached = localStorage.getItem('codelekho_prod_students');
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return {
              success: true,
              students: parsed,
              source: 'Cached CodeLekho Production Students (Offline Buffer)'
            };
          }
        } catch {}
      }

      return {
        success: false,
        students: [],
        source: 'https://codelekho.com/api',
        error: res.status === 404
          ? 'Admin API requires authenticated Staff Token. Please sign in with your CodeLekho admin credentials.'
          : res.status === 401
          ? 'Staff session expired. Please re-authenticate.'
          : `HTTP ${res.status}: Failed to fetch students.`
      };
    } catch (err: any) {
      return {
        success: false,
        students: [],
        source: 'https://codelekho.com/api',
        error: err.message || 'Connection error to codelekho.com'
      };
    }
  },

  // 4. Register a New Student on Live codelekho.com Production
  async registerProductionStudent(data: {
    name: string;
    regNo: string;
    phone: string;
    email: string;
    password?: string;
  }): Promise<{ success: boolean; data?: any; message?: string }> {
    try {
      const res = await fetch(`${PRODUCTION_API_URL}/learners/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name.trim(),
          regNo: data.regNo.trim().toUpperCase(),
          phone: data.phone.trim(),
          email: data.email.trim().toLowerCase(),
          password: data.password || 'CodeLekho@2026'
        }),
        signal: AbortSignal.timeout(6000)
      });

      const result = await res.json();
      if (!res.ok) {
        return {
          success: false,
          message: result.message || 'Registration failed'
        };
      }

      return {
        success: true,
        data: result,
        message: `Student ${data.name} successfully registered on codelekho.com!`
      };
    } catch (err: any) {
      return {
        success: false,
        message: err.message || 'Could not connect to live registration endpoint.'
      };
    }
  },

  // 5. Update Student Status on Live Production
  async updateStudentStatus(studentId: string, status: string): Promise<boolean> {
    const token = this.getStoredStaffToken();
    if (!token) return false;

    try {
      const res = await fetch(`${PRODUCTION_API_URL}/admin/students/${encodeURIComponent(studentId)}/status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status }),
        signal: AbortSignal.timeout(4000)
      });
      return res.ok;
    } catch {
      return false;
    }
  },

  // 6. Export Students to Excel directly from Live Production API
  async exportExcel(): Promise<Blob | null> {
    const token = this.getStoredStaffToken();
    try {
      const res = await fetch(`${PRODUCTION_API_URL}/admin/export/students`, {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      });
      if (!res.ok) return null;
      return await res.blob();
    } catch {
      return null;
    }
  }
};
