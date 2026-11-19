import React, { useState } from 'react';
import {
  Users,
  GraduationCap,
  Sparkles,
  FileSearch,
  CheckCircle2,
  XCircle,
  UserCheck,
  UserX,
  PlayCircle,
  PauseCircle,
  Trophy,
  Award,
  Ban,
  AlertTriangle,
  IndianRupee,
  CreditCard,
  Filter,
  RefreshCw,
  ArrowUpRight,
  ArrowRight,
  ShieldCheck,
  BookOpen,
  Code2,
  Terminal,
  Database,
  Globe,
  BrainCircuit,
  TrendingUp,
  FileCheck,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AnalyticsCharts } from './AnalyticsCharts';
import { RecentActivityTables } from './RecentActivityTables';

const formatINR = (val: number | string) => {
  const num = Number(val) || 0;
  if (num >= 10000000) {
    return `₹${(num / 10000000).toFixed(2)} Cr`;
  }
  if (num >= 100000) {
    return `₹${(num / 100000).toFixed(2)} L`;
  }
  return `₹${num.toLocaleString('en-IN')}`;
};

export const MainDashboard: React.FC = () => {
  const { 
    students, 
    courses, 
    modules, 
    certificates, 
    setActiveSection, 
    setIsAddCourseModalOpen,
    practiceProblemsSummary,
  } = useApp();

  const [loading, setLoading] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState('ALL');

  // 9 Student Academic Lifecycle Stages
  const academicPipelineStages = [
    { id: 'intake', label: '1. Application Intake', count: 0, icon: Sparkles, color: 'text-sky-600 bg-sky-50 border-sky-200' },
    { id: 'review', label: '2. Profile Review', count: 0, icon: FileSearch, color: 'text-indigo-600 bg-indigo-50 border-indigo-200' },
    { id: 'enrolled', label: '3. Enrolled', count: students.length, icon: CheckCircle2, color: 'text-blue-600 bg-blue-50 border-blue-200' },
    { id: 'assigned', label: '4. Track Assigned', count: students.length, icon: BookOpen, color: 'text-blue-700 bg-blue-50 border-blue-300' },
    { id: 'modules', label: '5. Module Learning', count: modules.length, icon: PlayCircle, color: 'text-slate-700 bg-slate-100 border-slate-300' },
    { id: 'practice', label: '6. Coding Practice', count: practiceProblemsSummary.totalCount, icon: Code2, color: 'text-blue-900 bg-blue-100 border-blue-300' },
    { id: 'exams', label: '7. 45-Min Exam', count: 0, icon: ShieldCheck, color: 'text-amber-700 bg-amber-50 border-amber-200' },
    { id: 'evaluated', label: '8. Evaluated', count: certificates.length, icon: Trophy, color: 'text-teal-700 bg-teal-50 border-teal-200' },
    { id: 'certified', label: '9. QR Certified', count: certificates.length, icon: Award, color: 'text-teal-800 bg-teal-100 border-teal-300' },
  ];

  // 6 Academic Governance & Exception Categories
  const governanceCards = [
    { id: 'all-learners', label: 'Total Enrolled Learners', count: students.length, icon: Users, tag: 'All Registered', badgeColor: 'bg-[#101827] text-white' },
    { id: 'track-gap', label: 'Unassigned to Track', count: 0, icon: UserX, tag: 'Track Gap', badgeColor: 'bg-amber-100 text-amber-900 border border-amber-300' },
    { id: 'deferred', label: 'Leave / On Hold', count: 0, icon: PauseCircle, tag: 'Deferred', badgeColor: 'bg-amber-100 text-amber-900 border border-amber-300' },
    { id: 'overdue-tests', label: 'Overdue Proctored Exam', count: 0, icon: AlertTriangle, tag: 'Escalation', badgeColor: 'bg-rose-100 text-rose-900 border border-rose-300' },
    { id: 'dropped', label: 'Withdrawn Learners', count: 0, icon: Ban, tag: 'Terminated', badgeColor: 'bg-slate-100 text-slate-700 border border-slate-300' },
    { id: 'ineligible', label: 'Ineligible Applicants', count: 0, icon: XCircle, tag: 'Declined', badgeColor: 'bg-rose-50 text-rose-800 border border-rose-200' },
  ];

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 500);
  };

  return (
    <div className="space-y-7 pb-12 text-[#111827]">
      {/* 1. EXECUTIVE ACADEMY COMMAND BANNER (NAVY BLUE & SILVER) */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#101827] via-[#1E293B] to-[#1E3A8A] p-6 md:p-8 text-white shadow-xl border border-slate-800">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-blue-500/20 text-blue-300 border border-blue-500/30">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
                CodeLekho • Academic LMS Command Center
              </span>
              <span className="text-xs text-slate-400 font-mono">Academic Year 2026-27</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white font-sans">
              Executive Academy & LMS Command Center
            </h1>
            <p className="text-xs md:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Unified academic governance, student enrollment tracking, curriculum surveillance, 45-min proctored exam analytics, and QR-verified certification delivery.
            </p>
          </div>

          {/* Quick Track & Action Controls */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 bg-[#101827]/90 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-200 shadow-inner">
              <Filter className="w-4 h-4 text-cyan-400" />
              <select
                value={selectedTrack}
                onChange={(e) => setSelectedTrack(e.target.value)}
                className="bg-transparent focus:outline-none text-slate-200 font-medium cursor-pointer"
              >
                <option value="ALL" className="bg-[#101827] text-white">All Tracks ({courses.length || 4})</option>
                <option value="Python" className="bg-[#101827] text-white">Python Core & OOP Track</option>
                <option value="SQL" className="bg-[#101827] text-white">SQL & Relational Databases</option>
                <option value="Web" className="bg-[#101827] text-white">Full Stack Web Development</option>
                <option value="AI" className="bg-[#101827] text-white">AI & Machine Learning Track</option>
              </select>
            </div>

            <button
              onClick={handleRefresh}
              className="p-2.5 bg-[#101827]/90 hover:bg-slate-800 border border-slate-700 rounded-xl text-slate-200 hover:text-white transition-all shadow-inner cursor-pointer"
              title="Refresh Academy Analytics"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-cyan-400' : ''}`} />
            </button>

            <button
              onClick={() => setIsAddCourseModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-950/40 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              <span>+ New Course</span>
            </button>
          </div>
        </div>

        {/* Ambient background glow decoration in Cyan */}
        <div className="absolute right-0 top-0 -mt-12 -mr-12 w-96 h-96 rounded-full bg-cyan-500/15 blur-3xl pointer-events-none"></div>
      </div>

      {/* 2. TOP 4 HERO PULSE SPOTLIGHT METRICS (PURE WHITE CARDS, SILVER BORDERS) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Spotlight 1: Academy Tuition & Scholarship Value */}
        <div className="bg-white rounded-2xl p-5 border border-[#E2E8F0] shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748B] font-mono">
              Annual Tuition & Scholarships Value
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-[#2563EB]">
              <IndianRupee className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-[#111827] font-sans tracking-tight">
            ₹0
          </div>
          <div className="mt-3 space-y-1.5">
            <div className="flex items-center justify-between text-[11px] font-medium text-[#64748B]">
              <span>Allocated Grants: ₹0</span>
              <span className="font-mono font-bold text-[#2563EB]">0% Spent</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-600 to-sky-500 rounded-full transition-all duration-500"
                style={{ width: `0%` }}
              ></div>
            </div>
            <div className="text-[10px] text-[#64748B] font-medium">
              Available Subsidy: ₹0
            </div>
          </div>
        </div>

        {/* Spotlight 2: Active Enrolled Learners */}
        <div className="bg-white rounded-2xl p-5 border border-[#E2E8F0] shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748B] font-mono">
              Total Managed Learners
            </span>
            <div className="w-8 h-8 rounded-xl bg-cyan-50 border border-cyan-200 flex items-center justify-center text-[#0284C7]">
              <GraduationCap className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-[#111827] font-sans tracking-tight">
            {students.length} Learners
          </div>
          <div className="mt-3 space-y-1.5">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 font-semibold">
                {students.length} Enrolled
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200 font-semibold">
                0 In Training
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-teal-50 text-teal-700 border border-teal-200 font-semibold">
                {certificates.length} Certified
              </span>
            </div>
            <div className="text-[10px] text-[#64748B] font-medium pt-1">
              Central student repository for enrollment, coursework & graduation
            </div>
          </div>
        </div>

        {/* Spotlight 3: Realized Tuition & Inflow */}
        <div className="bg-white rounded-2xl p-5 border border-[#E2E8F0] shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748B] font-mono">
              Total Realized Tuition Inflow
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-[#2563EB]">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-[#111827] font-sans tracking-tight">
            ₹0
          </div>
          <div className="mt-3 space-y-1.5">
            <div className="flex items-center justify-between text-[11px] font-medium text-[#64748B]">
              <span>Pending Receivables:</span>
              <span className="font-mono font-bold text-amber-600">₹0</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-700 to-indigo-600 rounded-full"
                style={{ width: `0%` }}
              ></div>
            </div>
            <div className="text-[10px] text-[#64748B] font-medium">
              Student admissions, institutional sponsorships & grant deposits
            </div>
          </div>
        </div>

        {/* Spotlight 4: Gross Margin Surplus (Dark Hero Theme) */}
        <div className="bg-[#101827] rounded-2xl p-5 border border-slate-800 text-white shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-mono">
              Gross Academy Surplus
            </span>
            <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-sky-400">
              <Trophy className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white font-sans tracking-tight">
            ₹0
          </div>
          <div className="mt-3 space-y-2">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-500/20 text-sky-300 border border-blue-500/30">
              <Sparkles className="w-3 h-3 text-sky-400" />
              <span>100% Free Foundation Surplus</span>
            </div>
            <p className="text-[10px] text-slate-400 leading-tight">
              Operating surplus over digital classrooms, lab servers & faculty costs
            </p>
          </div>
        </div>
      </div>

      {/* 3. STUDENT ACADEMIC LIFECYCLE & ENROLLMENT FLOW */}
      <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#E2E8F0] gap-2">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-[#2563EB]">
                <GraduationCap className="w-3.5 h-3.5" />
              </div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#111827] font-mono">
                Student Academic Lifecycle & Enrollment Flow
              </h2>
              <span className="text-[10px] text-[#64748B] bg-slate-100 border border-slate-200 px-2 py-0.5 rounded font-medium">
                Click any stage to view curriculum progress
              </span>
            </div>
            <p className="text-[11px] text-[#64748B] mt-1">
              Chronological workflow progression from student intake to 45-min proctored exam and QR certificate release.
            </p>
          </div>
          <button
            onClick={() => setActiveSection('students')}
            className="text-xs font-semibold text-[#2563EB] hover:text-[#1D4ED8] flex items-center gap-1 self-start sm:self-auto cursor-pointer"
          >
            <span>View All Students</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 9 Stage Academic Pipeline Row */}
        <div>
          <div className="text-[10px] font-bold uppercase tracking-wider text-[#64748B] mb-2.5 font-mono">
            Primary Academic Journey (In Order of Completion)
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-2.5">
            {academicPipelineStages.map((stage) => {
              const Icon = stage.icon;
              return (
                <button
                  key={stage.id}
                  onClick={() => setActiveSection('courses')}
                  className={`flex flex-col items-start p-3 rounded-xl border transition-all text-left group hover:scale-[1.02] cursor-pointer ${stage.color} hover:shadow-xs`}
                >
                  <div className="flex items-center justify-between w-full mb-1">
                    <Icon className="w-4 h-4 opacity-80 group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="text-lg font-black font-sans leading-tight">
                    {stage.count}
                  </div>
                  <div className="text-[10px] font-semibold truncate w-full mt-0.5">
                    {stage.label}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 6 Academic Governance & Review Exception Categories */}
        <div className="pt-2">
          <div className="text-[10px] font-bold uppercase tracking-wider text-[#64748B] mb-2.5 font-mono">
            Academic Governance & Cohort Exceptions
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
            {governanceCards.map((card) => {
              return (
                <button
                  key={card.id}
                  onClick={() => setActiveSection('students')}
                  className="p-3 rounded-xl border border-[#E2E8F0] bg-[#F5F7FA] hover:bg-white hover:border-blue-400 transition-all text-left flex flex-col justify-between group cursor-pointer hover:shadow-xs"
                >
                  <div className="flex items-center justify-between w-full mb-1">
                    <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-full ${card.badgeColor}`}>
                      {card.tag}
                    </span>
                    <ArrowUpRight className="w-3 h-3 text-[#64748B] opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div>
                    <div className="text-base font-black text-[#111827] font-sans">
                      {card.count}
                    </div>
                    <div className="text-[10px] text-[#64748B] font-semibold truncate">
                      {card.label}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 4. CAREER TRACKS OVERVIEW (PYTHON, SQL, WEB, AI) */}
      <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#111827] font-mono">
              Core Technical Career Tracks
            </h3>
            <p className="text-[11px] text-[#64748B]">Industry-aligned curriculum with interactive compiler and quizzes</p>
          </div>
          <button
            onClick={() => setActiveSection('courses')}
            className="text-xs font-semibold text-[#2563EB] hover:text-[#1D4ED8] flex items-center gap-1"
          >
            <span>Manage Tracks</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Python */}
          <div 
            onClick={() => setActiveSection('python-track')}
            className="p-4 rounded-xl border border-[#E2E8F0] bg-[#F5F7FA] hover:bg-white hover:border-blue-400 transition cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <Terminal className="w-5 h-5" />
            </div>
            <h4 className="text-xs font-bold text-[#111827]">Python Core Track</h4>
            <p className="text-[11px] text-[#64748B] mt-0.5">Syntax, Data Structures, OOP & Scripts</p>
            <div className="mt-3 flex items-center justify-between text-[10px] font-mono text-slate-500 border-t border-slate-200/60 pt-2">
              <span>{modules.filter(m => m.track === 'Python').length || 0} Modules</span>
              <span className="text-blue-600 font-bold">Open Track →</span>
            </div>
          </div>

          {/* SQL */}
          <div 
            onClick={() => setActiveSection('sql-databases')}
            className="p-4 rounded-xl border border-[#E2E8F0] bg-[#F5F7FA] hover:bg-white hover:border-blue-400 transition cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <Database className="w-5 h-5" />
            </div>
            <h4 className="text-xs font-bold text-[#111827]">SQL & Relational DBs</h4>
            <p className="text-[11px] text-[#64748B] mt-0.5">Queries, Joins, Aggregations & Schema</p>
            <div className="mt-3 flex items-center justify-between text-[10px] font-mono text-slate-500 border-t border-slate-200/60 pt-2">
              <span>{modules.filter(m => m.track === 'SQL').length || 0} Modules</span>
              <span className="text-indigo-600 font-bold">Open Track →</span>
            </div>
          </div>

          {/* Web */}
          <div 
            onClick={() => setActiveSection('web-development')}
            className="p-4 rounded-xl border border-[#E2E8F0] bg-[#F5F7FA] hover:bg-white hover:border-blue-400 transition cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <Globe className="w-5 h-5" />
            </div>
            <h4 className="text-xs font-bold text-[#111827]">Full Stack Web</h4>
            <p className="text-[11px] text-[#64748B] mt-0.5">HTML, CSS, JavaScript, React & APIs</p>
            <div className="mt-3 flex items-center justify-between text-[10px] font-mono text-slate-500 border-t border-slate-200/60 pt-2">
              <span>{modules.filter(m => m.track === 'Web').length || 0} Modules</span>
              <span className="text-teal-600 font-bold">Open Track →</span>
            </div>
          </div>

          {/* AI */}
          <div 
            onClick={() => setActiveSection('ai-data-science')}
            className="p-4 rounded-xl border border-[#E2E8F0] bg-[#F5F7FA] hover:bg-white hover:border-blue-400 transition cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <BrainCircuit className="w-5 h-5" />
            </div>
            <h4 className="text-xs font-bold text-[#111827]">AI & Machine Learning</h4>
            <p className="text-[11px] text-[#64748B] mt-0.5">NumPy, Pandas, Scikit-learn & Models</p>
            <div className="mt-3 flex items-center justify-between text-[10px] font-mono text-slate-500 border-t border-slate-200/60 pt-2">
              <span>{modules.filter(m => m.track === 'AI').length || 0} Modules</span>
              <span className="text-emerald-600 font-bold">Open Track →</span>
            </div>
          </div>
        </div>
      </div>

      {/* 5. ACADEMIC CHARTS & RECENT ACTIVITY */}
      <AnalyticsCharts />
      <RecentActivityTables />
    </div>
  );
};
