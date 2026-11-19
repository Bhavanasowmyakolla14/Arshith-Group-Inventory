import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Edit3, 
  Archive, 
  TrendingUp, 
  Users, 
  FolderGit2, 
  HelpCircle, 
  FileCheck, 
  GraduationCap, 
  Award, 
  History, 
  DollarSign, 
  Layers, 
  ChevronDown,
  CheckCircle2,
  Calendar,
  Clock,
  Sparkles
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { LearningModule, Student } from '../../types';

export const CourseDetailView: React.FC = () => {
  const { 
    selectedCourse, 
    setActiveSection, 
    modules, 
    students, 
    openModuleModal, 
    showToast,
    setSelectedStudentForProfile
  } = useApp();

  const [activeTab, setActiveTab] = useState<string>('budget');
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);

  if (!selectedCourse) {
    return (
      <div className="p-8 text-center bg-white rounded-2xl border border-slate-200">
        <p className="text-sm text-slate-500">No course selected.</p>
        <button 
          onClick={() => setActiveSection('courses')}
          className="mt-3 text-xs text-blue-600 font-semibold"
        >
          ← Return to Courses
        </button>
      </div>
    );
  }

  const courseModules = modules.filter(m => m.courseId === selectedCourse.id || m.category === selectedCourse.track);
  const enrolledStudents = students.filter(s => s.enrolledCourses.some(c => c.toLowerCase().includes(selectedCourse.track.toLowerCase())));

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'team', label: 'Students & Team' },
    { id: 'tasks', label: 'Modules & Tasks' },
    { id: 'milestones', label: 'Milestones & Lessons' },
    { id: 'budget', label: 'Budget & Finance' },
    { id: 'documents', label: 'Question Bank' },
    { id: 'risks', label: 'Assignments & Risks' },
    { id: 'completion', label: 'Exams & Proctoring' },
    { id: 'activity', label: 'Activity History' },
  ];

  const financialItems = [
    { label: 'Student Course Tuition', value: '₹0 (100% Free Coding Education)', highlight: 'text-blue-600 font-bold' },
    { label: 'Platform Delivery Cost (Per Learner)', value: `₹${selectedCourse.operationalCostPerStudent} / learner` },
    { label: 'AWS Sandbox & Browser Coding Runners', value: '₹38,500' },
    { label: 'AI Proctoring Telemetry API (45-Min Exams)', value: '₹14,200' },
    { label: 'Teaching Assistant & Mentor Honorariums', value: '₹45,000' },
    { label: 'Sponsorship & Philanthropy Grants Received', value: '₹1,50,000', highlight: 'text-emerald-600 font-bold' },
    { label: 'Institutional Partnership Subsidies', value: '₹75,000' },
    { label: 'Remaining Track Subsidy Surplus', value: '+₹1,27,300', highlight: 'text-emerald-600 font-bold' },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Top Breadcrumb matching Reference Image 3 */}
      <div className="flex items-center gap-2 text-xs">
        <button
          onClick={() => setActiveSection('courses')}
          className="text-slate-500 hover:text-blue-600 flex items-center gap-1 font-medium transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> All projects
        </button>
      </div>

      {/* Hero Header Banner Card with dark navy-blue gradient matching Image 3 */}
      <div className="rounded-2xl bg-[#0f172a] text-white p-6 sm:p-7 border border-slate-800 shadow-xl relative overflow-hidden">
        {/* Glow accent */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 space-y-4">
          {/* Top row: Badges + Action Buttons */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700">
                {selectedCourse.code}
              </span>
              <span className="text-xs bg-amber-500/20 text-amber-300 font-medium px-2 py-0.5 rounded-full border border-amber-500/30 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                {selectedCourse.status}
              </span>
              <span className="text-xs bg-blue-500/20 text-blue-300 font-medium px-2 py-0.5 rounded-full border border-blue-500/30">
                {selectedCourse.difficulty}
              </span>
              <span className="text-xs bg-purple-500/20 text-purple-300 font-medium px-2 py-0.5 rounded-full border border-purple-500/30">
                Mandatory Track
              </span>
            </div>

            {/* Action Buttons on right matching Image 3 */}
            <div className="flex items-center gap-2">
              <div className="relative">
                <button
                  onClick={() => setStatusDropdownOpen(!statusDropdownOpen)}
                  className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow-sm transition-all cursor-pointer"
                >
                  <span>Change Status</span>
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>

                {statusDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-40 bg-slate-900 border border-slate-700 rounded-lg shadow-xl py-1 z-30 text-xs">
                    {['In Progress', 'Testing & QA', 'Completed', 'On-Hold'].map((st) => (
                      <button
                        key={st}
                        onClick={() => {
                          setStatusDropdownOpen(false);
                          showToast('Course Status Updated', `Status changed to ${st}.`);
                        }}
                        className="w-full text-left px-3 py-1.5 text-slate-300 hover:bg-slate-800 hover:text-white"
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button
                onClick={() => showToast('Progress Sync', 'Refreshed curriculum progression metrics.')}
                className="flex items-center gap-1 text-xs bg-slate-800/80 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-lg border border-slate-700 transition-colors cursor-pointer"
              >
                Progress Update
              </button>

              <button
                onClick={() => showToast('Edit Mode', 'Course editor modal opened.')}
                className="flex items-center gap-1 text-xs bg-slate-800/80 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-lg border border-slate-700 transition-colors cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit</span>
              </button>

              <button
                onClick={() => showToast('Archive', 'Course archived to historical records.', 'info')}
                className="flex items-center gap-1 text-xs bg-slate-800/80 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-lg border border-slate-700 transition-colors cursor-pointer"
              >
                <Archive className="w-3.5 h-3.5" />
                <span>Archive</span>
              </button>
            </div>
          </div>

          {/* Title & Subtitle */}
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              DEMO • {selectedCourse.title}
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              CodeLekho Client Batch 2 • Standard Academy Curriculum (sample data) • {selectedCourse.category}
            </p>
          </div>

          {/* Progress Bar matching Image 3 */}
          <div className="space-y-1.5 pt-1">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
              <span className="text-[11px] uppercase tracking-wider text-slate-400">Progress</span>
              <span className="text-cyan-400 font-mono">{selectedCourse.completionPercent}%</span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-gradient-to-r from-blue-500 to-cyan-400 h-full rounded-full transition-all duration-500 shadow-sm shadow-cyan-400/30"
                style={{ width: `${selectedCourse.completionPercent}%` }}
              ></div>
            </div>
          </div>

          {/* Instructor & Dates row matching Image 3 */}
          <div className="flex flex-wrap items-center gap-6 pt-2 text-xs text-slate-400 border-t border-slate-800/80">
            <div>
              <span className="text-[10px] uppercase text-slate-500 block">Project Manager / Instructor</span>
              <span className="font-semibold text-slate-200">{selectedCourse.instructor} (Senior Lead)</span>
            </div>
            <div>
              <span className="text-[10px] uppercase text-slate-500 block">Start</span>
              <span className="font-mono text-slate-300">{selectedCourse.startDate}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase text-slate-500 block">Deadline</span>
              <span className="font-mono text-slate-300">{selectedCourse.endDate}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation matching Image 3 */}
      <div className="flex items-center border-b border-slate-200 overflow-x-auto gap-2 text-xs font-medium bg-white px-2 rounded-xl shadow-2xs">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-3 px-3.5 border-b-2 font-semibold transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT: BUDGET & FINANCE (Reference Image 3 exact match) */}
      {activeTab === 'budget' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Budget / Metric Card (4 cols) */}
          <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="text-[11px] font-bold tracking-wider uppercase text-slate-400">
              GRANT SUBSIDY & OPS UTILIZATION
            </div>

            <div>
              <div className="text-3xl font-extrabold text-slate-900 tracking-tight">
                86.67%
              </div>
              <div className="inline-block mt-2 text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full">
                100% Free Tuition for Learners
              </div>
            </div>

            {/* Gauge bar */}
            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
              <div className="bg-emerald-500 h-full rounded-full" style={{ width: '86.67%' }}></div>
            </div>

            <div className="space-y-1.5 text-xs text-slate-500 pt-2 border-t border-slate-100">
              <p>Operational costs covered by institutional CSR grants.</p>
              <div className="font-mono text-[11px] text-slate-400 pt-1">
                Zero fees charged to enrolled candidates
              </div>
              <div className="font-mono text-[11px] text-slate-400">
                Cost per learner: ₹{selectedCourse.operationalCostPerStudent}
              </div>
              <div className="font-mono text-[11px] text-slate-400">
                Surplus allocated to cloud browser compiler clusters
              </div>
            </div>
          </div>

          {/* Right Column: Breakdown Table matching Reference Image 3 (8 cols) */}
          <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
            <table className="w-full text-xs">
              <tbody className="divide-y divide-slate-100">
                {financialItems.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-2.5 text-slate-600 font-medium">{item.label}</td>
                    <td className={`py-2.5 text-right font-mono ${item.highlight || 'text-slate-900 font-semibold'}`}>
                      {item.value}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB CONTENT: MODULES & TASKS */}
      {activeTab === 'tasks' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                COURSE MODULES & LAB ASSIGNMENTS
              </h3>
              <p className="text-[11px] text-slate-500">Click any module to inspect tasks, student commits, and log hours</p>
            </div>
            <span className="text-xs text-blue-600 font-semibold">{courseModules.length} Modules</span>
          </div>

          <div className="space-y-3">
            {courseModules.map((module) => (
              <div
                key={module.id}
                onClick={() => openModuleModal(module)}
                className="p-4 rounded-xl bg-slate-50 hover:bg-blue-50/50 border border-slate-200/70 transition-all cursor-pointer group flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-blue-600 bg-blue-100/60 px-2 py-0.5 rounded border border-blue-200">
                      {module.code}
                    </span>
                    <span className="text-xs font-bold text-slate-800 group-hover:text-blue-700 transition-colors">
                      {module.title}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-[11px] text-slate-500">
                    <span>Assignee: {module.assignedStudent}</span>
                    <span>•</span>
                    <span>Due: {module.dueDate}</span>
                    <span>•</span>
                    <span>Time spent: {module.timeSpentHours}h</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-auto">
                  <div className="text-right">
                    <div className="text-xs font-bold text-slate-900 font-mono">{module.progressPercent}%</div>
                    <div className="text-[10px] text-slate-400">{module.status}</div>
                  </div>
                  <span className="text-xs bg-blue-600 text-white px-2.5 py-1 rounded-md font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    Open Details
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: STUDENTS */}
      {activeTab === 'team' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                ENROLLED LEARNERS IN THIS TRACK
              </h3>
              <p className="text-[11px] text-slate-500">Active participants in {selectedCourse.batch}</p>
            </div>
            <span className="text-xs text-blue-600 font-semibold">{enrolledStudents.length} Active Students</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {enrolledStudents.map((st) => (
              <div 
                key={st.id}
                onClick={() => setSelectedStudentForProfile(st)}
                className="p-4 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/70 transition-all cursor-pointer flex items-center justify-between gap-3 group"
              >
                <div className="flex items-center gap-3">
                  <img src={st.avatar} alt={st.name} className="w-10 h-10 rounded-full object-cover" />
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                      {st.name}
                    </h4>
                    <p className="text-[11px] text-slate-400 font-mono">{st.studentId} • {st.email}</p>
                    <span className="inline-block mt-1 text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.2 rounded font-medium">
                      {st.status}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs font-mono font-bold text-slate-900">{st.courseProgress}% progress</div>
                  <div className="text-[11px] text-emerald-600 font-medium">
                    Exam: {st.examScore ? `${st.examScore}% (Passed)` : 'Scheduled'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Enrolled</span>
            <div className="text-2xl font-extrabold text-slate-900">{selectedCourse.enrolledStudentsCount} Learners</div>
            <p className="text-xs text-slate-500">{selectedCourse.activeLearnersCount} active this week</p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Average Exam Score</span>
            <div className="text-2xl font-extrabold text-blue-600">{selectedCourse.avgExamScore}%</div>
            <p className="text-xs text-slate-500">Above target benchmark of 70%</p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Certificates Issued</span>
            <div className="text-2xl font-extrabold text-emerald-600">{selectedCourse.certifiedStudentsCount} Alumni</div>
            <p className="text-xs text-slate-500">QR-code verified on blockchain ledger</p>
          </div>
        </div>
      )}
    </div>
  );
};

