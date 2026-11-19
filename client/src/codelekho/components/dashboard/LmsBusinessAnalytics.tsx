import React, { useState, useEffect } from 'react';
import { 
  Users, 
  UserCheck, 
  GraduationCap, 
  AlertCircle, 
  Layers, 
  CreditCard, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  TrendingUp, 
  ArrowRight,
  BookOpen,
  PieChart as PieIcon,
  DollarSign,
  Award,
  Sparkles,
  BarChart3,
  Code2,
  ShieldCheck,
  Check,
  ExternalLink,
  Plus,
  Coins,
  Activity,
  HeartHandshake
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend, 
  LineChart, 
  Line,
  AreaChart,
  Area
} from 'recharts';
import { useApp } from '../../context/AppContext';

export const LmsBusinessAnalytics: React.FC = () => {
  const { 
    students, 
    courses, 
    modules,
    certificates, 
    financials,
    growthMetrics,
    dateFilter, 
    studentAnalytics,
    learningAnalytics,
    examAnalytics,
    certificateAnalytics,
    financialAnalytics,
    practiceProblemsSummary,
    addFinancialTransaction,
    verifyCertificate,
    activeSection,
    setActiveSection, 
    setSelectedCourseId,
    showToast 
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'all' | 'students' | 'learning' | 'exams' | 'certificates' | 'financials' | 'growth'>('all');

  useEffect(() => {
    if (activeSection === 'student-analytics') setActiveSubTab('students');
    else if (activeSection === 'learning-analytics') setActiveSubTab('learning');
    else if (activeSection === 'growth-analytics') setActiveSubTab('growth');
    else if (activeSection === 'financial-management') setActiveSubTab('financials');
  }, [activeSection]);

  // Registration chart data
  const registrationChartData = [
    { month: 'Jun', total: 0, active: 0 },
    { month: 'Jul', total: 0, active: 0 },
    { month: 'Aug', total: 0, active: 0 },
    { month: 'Sep', total: 0, active: 0 },
    { month: 'Oct', total: 0, active: 0 },
    { month: 'Nov', total: studentAnalytics.totalRegistrations, active: studentAnalytics.activeStudents },
  ];

  return (
    <div className="space-y-6">
      {/* Sub-Navigation for Quick Anchoring */}
      <div className="flex items-center justify-between bg-white px-4 py-2.5 rounded-xl border border-slate-200/80 shadow-2xs overflow-x-auto text-xs font-medium">
        <div className="flex items-center gap-1">
          {[
            { id: 'all', label: 'All 6 LMS Analytics' },
            { id: 'students', label: '1. Student Analytics' },
            { id: 'learning', label: '2. Learning Analytics' },
            { id: 'exams', label: '3. 45-Min Exam Analytics' },
            { id: 'certificates', label: '4. QR Certificates' },
            { id: 'financials', label: '5. Financials (Free Model)' },
            { id: 'growth', label: '6. Growth Telemetry' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                activeSubTab === tab.id
                  ? 'bg-blue-600 text-white font-semibold shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <span className="hidden lg:inline-block font-mono text-[11px] text-slate-400">
          Filter: {dateFilter} • Database Synced
        </span>
      </div>

      {/* 1. STUDENT ANALYTICS */}
      {(activeSubTab === 'all' || activeSubTab === 'students') && (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                <Users className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  1. STUDENT ANALYTICS & REGISTRATION COHORT VELOCITY
                </h2>
                <p className="text-[11px] text-slate-500">
                  Total student registrations, active retention, inactive monitoring, daily and monthly growth rates
                </p>
              </div>
            </div>

            <button
              onClick={() => setActiveSection('students')}
              className="text-xs text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1 cursor-pointer self-start sm:self-auto"
            >
              Open Student Directory <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Total Registered</span>
              <div className="text-xl font-extrabold text-slate-900 font-mono">{studentAnalytics.totalRegistrations}</div>
              <span className="text-[10px] text-slate-500">Actual student DB records</span>
            </div>

            <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-200/70 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 block">Active Students</span>
              <div className="text-xl font-extrabold text-emerald-800 font-mono">{studentAnalytics.activeStudents}</div>
              <span className="text-[10px] text-emerald-600">Active within past 7 days</span>
            </div>

            <div className="p-3.5 rounded-xl bg-rose-50/60 border border-rose-200/70 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700 block">Inactive Students</span>
              <div className="text-xl font-extrabold text-rose-800 font-mono">{studentAnalytics.inactiveStudents}</div>
              <span className="text-[10px] text-rose-600">No activity &gt;30 days</span>
            </div>

            <div className="p-3.5 rounded-xl bg-blue-50/60 border border-blue-200/70 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 block">New Registrations</span>
              <div className="text-xl font-extrabold text-blue-800 font-mono">+{studentAnalytics.newRegistrations}</div>
              <span className="text-[10px] text-blue-600">Past 48h enrollment</span>
            </div>

            <div className="p-3.5 rounded-xl bg-purple-50/60 border border-purple-200/70 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 block">Daily Growth Rate</span>
              <div className="text-xl font-extrabold text-purple-800 font-mono">+{studentAnalytics.dailyGrowthRate}%</div>
              <span className="text-[10px] text-purple-600">Day-over-day registrations</span>
            </div>

            <div className="p-3.5 rounded-xl bg-cyan-50/60 border border-cyan-200/70 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-700 block">Monthly Growth</span>
              <div className="text-xl font-extrabold text-cyan-800 font-mono">+{studentAnalytics.monthlyGrowthRate}%</div>
              <span className="text-[10px] text-cyan-600">Month-over-month rate</span>
            </div>
          </div>
        </div>
      )}

      {/* 2. LEARNING ANALYTICS */}
      {(activeSubTab === 'all' || activeSubTab === 'learning') && (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-cyan-50 text-cyan-600">
                <Code2 className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  2. LEARNING ANALYTICS (60+ MODULES & 355 INTERVIEW PROBLEMS)
                </h2>
                <p className="text-[11px] text-slate-500">
                  Course-wise enrollments, module completion, module quiz scores, and browser-based coding practice telemetry
                </p>
              </div>
            </div>

            <span className="text-xs font-mono font-bold bg-cyan-50 text-cyan-800 border border-cyan-200 px-2.5 py-1 rounded-full">
              {practiceProblemsSummary.totalCount} Practice Problems • {modules.length}+ Modules
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {courses.map((course) => {
              const trackKey = course.track === 'Python' ? 'Python' : course.track === 'SQL' ? 'SQL & Databases' : course.track === 'Web' ? 'Web Development' : 'AI & Data Science';
              const enrollCount = learningAnalytics.courseEnrollments[trackKey] || 0;

              return (
                <div key={course.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200/70 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] font-bold bg-white text-slate-700 px-1.5 py-0.5 rounded border border-slate-200">
                      {course.code}
                    </span>
                    <span className="text-xs font-bold text-blue-600 font-mono">
                      {enrollCount} Enrolled
                    </span>
                  </div>

                  <div>
                    <h3 className="text-xs font-bold text-slate-800 truncate" title={course.title}>
                      {course.title}
                    </h3>
                    <p className="text-[10px] text-slate-400 font-mono mt-0.5">{course.modulesCount} modules • Free Track</p>
                  </div>

                  <div className="space-y-1.5 text-xs text-slate-600 border-t border-slate-200/60 pt-2">
                    <div className="flex items-center justify-between text-[11px]">
                      <span>Module Completion:</span>
                      <span className="font-mono font-bold text-slate-800">{course.completionPercent}%</span>
                    </div>
                    <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-blue-600 h-full rounded-full" style={{ width: `${course.completionPercent}%` }}></div>
                    </div>

                    <div className="flex items-center justify-between text-[11px] pt-1">
                      <span>Module Quiz Score:</span>
                      <span className="font-mono font-bold text-emerald-600">{course.avgQuizScore}%</span>
                    </div>

                    <div className="flex items-center justify-between text-[11px]">
                      <span>Coding Practice Runs:</span>
                      <span className="font-mono font-bold text-purple-600">{course.codingPracticeSubmissions}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Browser Coding Practice Summary Box */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
            <div className="space-y-1">
              <span className="font-bold text-blue-900 text-xs flex items-center gap-1.5">
                <Code2 className="w-4 h-4 text-blue-600" />
                Browser-Based Coding Practice & Interview Problem Submissions
              </span>
              <p className="text-[11px] text-blue-700">
                {(practiceProblemsSummary?.totalBrowserRuns || 0).toLocaleString()} code executions in client compiler • {(practiceProblemsSummary?.acceptedSubmissions || 0).toLocaleString()} test cases verified • {practiceProblemsSummary?.averageAcceptanceRate || 0}% average acceptance rate across {practiceProblemsSummary?.totalCount || 0} interview problems.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <div className="text-right">
                <div className="font-mono font-extrabold text-blue-900 text-sm">{learningAnalytics.interviewProblemsPracticed} Solved</div>
                <div className="text-[10px] text-blue-600">By enrolled students</div>
              </div>
              <button
                onClick={() => setActiveSection('practice-problems')}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-xs cursor-pointer"
              >
                View Problem Bank
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. EXAM ANALYTICS */}
      {(activeSubTab === 'all' || activeSubTab === 'exams') && (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-amber-50 text-amber-600">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  3. 45-MINUTE PROCTORED FINAL EXAM ANALYTICS
                </h2>
                <p className="text-[11px] text-slate-500">
                  Assessment attempts, pass percentage, failure percentage, average scores, and anti-cheat webcam audits (Benchmark: 70%)
                </p>
              </div>
            </div>

            <span className="text-xs font-mono font-bold bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-1 rounded-full">
              45-Minute Timer • 70% Passing Threshold
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70 space-y-1">
              <span className="text-[10px] font-bold uppercase text-slate-500">Total Exam Attempts</span>
              <div className="text-2xl font-extrabold text-slate-900 font-mono">{examAnalytics.totalAttempts}</div>
              <span className="text-[10px] text-slate-400">Proctored assessment sessions</span>
            </div>

            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 space-y-1">
              <span className="text-[10px] font-bold uppercase text-emerald-700">Pass Percentage (≥70%)</span>
              <div className="text-2xl font-extrabold text-emerald-800 font-mono">{examAnalytics.passPercentage}%</div>
              <span className="text-[10px] text-emerald-600">{examAnalytics.passedCount} candidates qualified</span>
            </div>

            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 space-y-1">
              <span className="text-[10px] font-bold uppercase text-rose-700">Failure / Retake %</span>
              <div className="text-2xl font-extrabold text-rose-800 font-mono">{examAnalytics.failurePercentage}%</div>
              <span className="text-[10px] text-rose-600">{examAnalytics.failedCount} learner retakes</span>
            </div>

            <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 space-y-1">
              <span className="text-[10px] font-bold uppercase text-blue-700">Average Proctored Score</span>
              <div className="text-2xl font-extrabold text-blue-800 font-mono">{examAnalytics.avgScore}%</div>
              <span className="text-[10px] text-blue-600">Across all 4 career tracks</span>
            </div>
          </div>
        </div>
      )}

      {/* 4. CERTIFICATE MANAGEMENT */}
      {(activeSubTab === 'all' || activeSubTab === 'certificates') && (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-purple-50 text-purple-600">
                <Award className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  4. QR-VERIFIED CERTIFICATE MANAGEMENT
                </h2>
                <p className="text-[11px] text-slate-500">
                  Cryptographic certificates generated, verified, and pending proctoring clearance
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full font-mono">
                {certificateAnalytics.verifiedCount} Verified
              </span>
              <span className="font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full font-mono">
                {certificateAnalytics.pendingCount} Pending
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 text-slate-500 border-b border-slate-200 font-semibold text-[11px] uppercase">
                  <th className="py-2.5 px-3">Certificate ID</th>
                  <th className="py-2.5 px-3">Student Name</th>
                  <th className="py-2.5 px-3">Career Track</th>
                  <th className="py-2.5 px-3">Issue Date</th>
                  <th className="py-2.5 px-3 text-center">Score</th>
                  <th className="py-2.5 px-3 text-center">Status</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {certificates.map((cert) => (
                  <tr key={cert.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-2.5 px-3 font-mono font-bold text-blue-600">{cert.certificateId}</td>
                    <td className="py-2.5 px-3 font-semibold text-slate-800">{cert.studentName}</td>
                    <td className="py-2.5 px-3 text-slate-600">{cert.track}</td>
                    <td className="py-2.5 px-3 font-mono text-slate-400">{cert.issueDate}</td>
                    <td className="py-2.5 px-3 text-center font-mono font-bold text-slate-800">
                      {cert.finalScore ? `${cert.finalScore}%` : '—'}
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <span className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        cert.status === 'Verified' 
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        {cert.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <button
                        onClick={() => {
                          if (cert.status !== 'Verified') {
                            verifyCertificate(cert.id);
                          } else {
                            showToast('QR Verified', `Hash: ${cert.qrVerificationHash}`);
                          }
                        }}
                        className="text-xs text-blue-600 hover:text-blue-700 font-semibold cursor-pointer"
                      >
                        {cert.status === 'Verified' ? 'View QR Hash' : 'Verify Certificate'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 5. FINANCIAL MANAGEMENT (Free Education Model) */}
      {(activeSubTab === 'all' || activeSubTab === 'financials') && (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
                <HeartHandshake className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  5. FINANCIAL MANAGEMENT (FREE CODING EDUCATION MODEL)
                </h2>
                <p className="text-[11px] text-slate-500">
                  No invented course fees. Itemized operational expenses, sponsorship grants, partnership income, and paid add-on services
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                const title = prompt('Enter Grant/Expense Title:');
                if (title) {
                  const amt = prompt('Enter Amount in ₹:');
                  if (amt) {
                    addFinancialTransaction({
                      title,
                      amount: Number(amt),
                      type: 'Sponsorship'
                    });
                  }
                }
              }}
              className="text-xs bg-slate-900 hover:bg-slate-800 text-white font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer self-start sm:self-auto"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Log Grant / Expense</span>
            </button>
          </div>

          {/* Free Education Policy Banner */}
          <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-200/80 text-xs text-blue-900 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-600 shrink-0" />
              <div>
                <strong>CodeLekho Free Education Policy:</strong> All student course enrollments, interview problems, and proctored examinations are 100% free of tuition. Course Fee Revenue is strictly <strong>₹0</strong>.
              </div>
            </div>
            <span className="font-mono font-bold bg-blue-600 text-white px-2 py-0.5 rounded text-[11px] shrink-0">
              ₹0 Student Fees
            </span>
          </div>

          {/* 4 Financial Columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Operational Expenses */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Actual Operational Expenses
              </span>
              <div className="text-xl font-extrabold text-rose-700 font-mono">
                ₹{(financialAnalytics?.operationalExpenses || 0).toLocaleString('en-IN')}
              </div>
              <p className="text-[10px] text-slate-500">AWS sandboxes, AI proctoring compute & ops</p>
            </div>

            {/* Sponsorship Grants */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70 space-y-1">
              <span className="text-[10px] font-bold tracking-wider uppercase text-slate-400 block">
                Sponsorship Income
              </span>
              <div className="text-xl font-extrabold text-emerald-700 font-mono">
                ₹{(financialAnalytics?.sponsorshipIncome || 0).toLocaleString('en-IN')}
              </div>
              <p className="text-[10px] text-slate-500">Philanthropic CSR education grants</p>
            </div>

            {/* Partnership Income */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70 space-y-1">
              <span className="text-[10px] font-bold tracking-wider uppercase text-slate-400 block">
                Partnership Income
              </span>
              <div className="text-xl font-extrabold text-emerald-700 font-mono">
                ₹{(financialAnalytics?.partnershipIncome || 0).toLocaleString('en-IN')}
              </div>
              <p className="text-[10px] text-slate-500">University & hiring placement tie-ups</p>
            </div>

            {/* Paid Service Income */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70 space-y-1">
              <span className="text-[10px] font-bold tracking-wider uppercase text-slate-400 block">
                Genuine Paid Services
              </span>
              <div className="text-xl font-extrabold text-purple-700 font-mono">
                ₹{(financialAnalytics?.paidServiceIncome || 0).toLocaleString('en-IN')}
              </div>
              <p className="text-[10px] text-slate-500">Optional 1-on-1 code reviews & mock interviews</p>
            </div>
          </div>
        </div>
      )}

      {/* 6. GROWTH ANALYTICS */}
      {(activeSubTab === 'all' || activeSubTab === 'growth') && (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
                <TrendingUp className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  6. GROWTH ANALYTICS & REGISTRATION CONVERSION
                </h2>
                <p className="text-[11px] text-slate-500">
                  Live website visitors, registrations, registration conversion rate, and monthly student growth trajectory
                </p>
              </div>
            </div>

            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Tracking Active
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70 space-y-1">
              <span className="text-[10px] font-bold uppercase text-slate-400">Website Visitors</span>
              <div className="text-2xl font-extrabold text-slate-900 font-mono">
                {(growthMetrics?.websiteVisitors || 0).toLocaleString()}
              </div>
              <span className="text-[10px] text-slate-500">Unique monthly platform visits</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70 space-y-1">
              <span className="text-[10px] font-bold uppercase text-slate-400">Total Registered</span>
              <div className="text-2xl font-extrabold text-blue-600 font-mono">
                {studentAnalytics.totalRegistrations}
              </div>
              <span className="text-[10px] text-slate-500">Actual students in database</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70 space-y-1">
              <span className="text-[10px] font-bold uppercase text-slate-400">Registration Conversion</span>
              <div className="text-2xl font-extrabold text-emerald-600 font-mono">
                {growthMetrics.websiteVisitors > 0 ? ((studentAnalytics.totalRegistrations / growthMetrics.websiteVisitors) * 100).toFixed(2) : '0.00'}%
              </div>
              <span className="text-[10px] text-slate-500">Registrations / Visitors</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70 space-y-1">
              <span className="text-[10px] font-bold uppercase text-slate-400">Monthly Student Growth</span>
              <div className="text-2xl font-extrabold text-purple-600 font-mono">
                +{studentAnalytics.monthlyGrowthRate}%
              </div>
              <span className="text-[10px] text-slate-500">Compounded monthly growth</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
