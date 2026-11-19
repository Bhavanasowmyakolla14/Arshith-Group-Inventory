import React from 'react';
import { 
  Users, 
  UserCheck, 
  BookOpen, 
  Layers, 
  IndianRupee, 
  CreditCard, 
  Clock, 
  TrendingDown, 
  TrendingUp, 
  AlertTriangle,
  ArrowUpRight,
  ShieldCheck,
  Award,
  Code2,
  HeartHandshake
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const KpiSection: React.FC = () => {
  const { 
    studentAnalytics, 
    learningAnalytics, 
    examAnalytics, 
    certificateAnalytics, 
    financialAnalytics, 
    dateFilter, 
    practiceProblemsSummary 
  } = useApp();

  return (
    <div className="space-y-4">
      {/* ROW 1: Student & Curriculum Engagement KPIs (4 Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Total Registrations */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold tracking-wider uppercase text-slate-400">
              TOTAL REGISTRATIONS
            </span>
            <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
              <Users className="w-4 h-4" />
            </div>
          </div>

          <div className="mt-3">
            <div className="text-2xl font-extrabold text-slate-900 tracking-tight font-mono">
              {studentAnalytics.totalRegistrations} Learners
            </div>
            <div className="flex items-center gap-2 mt-1.5">
              <span className="text-[11px] text-slate-500">
                New: +{studentAnalytics.newRegistrations}
              </span>
              <span className="text-[10px] bg-emerald-50 text-emerald-700 font-semibold px-1.5 py-0.5 rounded border border-emerald-200">
                +{studentAnalytics.monthlyGrowthRate}% MoM
              </span>
            </div>
            <div className="text-[10px] text-slate-400 mt-2 truncate">
              Filtered for: {dateFilter} (Live database collection)
            </div>
          </div>
        </div>

        {/* 2. Active vs Inactive Students */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold tracking-wider uppercase text-slate-400">
              ACTIVE VS INACTIVE
            </span>
            <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>

          <div className="mt-3">
            <div className="text-2xl font-extrabold text-slate-900 tracking-tight font-mono">
              {studentAnalytics.activeStudents} Active
            </div>
            <div className="flex items-center gap-1.5 mt-1.5 text-[11px] text-slate-600">
              <span className="text-rose-600 font-medium font-mono">{studentAnalytics.inactiveStudents} Inactive</span>
              <span>•</span>
              <span className="text-slate-500 font-mono">
                {studentAnalytics.totalRegistrations > 0 
                  ? Math.round((studentAnalytics.activeStudents / studentAnalytics.totalRegistrations) * 100) 
                  : 0}% Active Rate
              </span>
            </div>
            <div className="text-[10px] text-slate-400 mt-2 truncate">
              Active within 7 days vs inactive over 30 days
            </div>
          </div>
        </div>

        {/* 3. Total Enrollments Across 4 Tracks */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold tracking-wider uppercase text-slate-400">
              TRACK ENROLLMENTS
            </span>
            <div className="w-8 h-8 rounded-full bg-cyan-50 text-cyan-700 flex items-center justify-center border border-cyan-100">
              <Layers className="w-4 h-4" />
            </div>
          </div>

          <div className="mt-3">
            <div className="text-2xl font-extrabold text-slate-900 tracking-tight font-mono">
              {learningAnalytics.totalEnrollments} Enrollments
            </div>
            <div className="flex items-center gap-2 mt-1.5">
              <span className="text-[11px] text-slate-500">
                4 Free Tracks
              </span>
              <span className="text-[10px] bg-cyan-50 text-cyan-800 font-semibold px-1.5 py-0.5 rounded border border-cyan-200">
                100% Free
              </span>
            </div>
            <div className="text-[10px] text-slate-400 mt-2 truncate">
              Python, SQL, Web Dev & AI Career Tracks
            </div>
          </div>
        </div>

        {/* 4. 45-Min Proctored Exam Pass Rate */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold tracking-wider uppercase text-slate-400">
              45-MIN PROCTORED EXAM PASS RATE
            </span>
            <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>

          <div className="mt-3">
            <div className="text-2xl font-extrabold text-emerald-700 tracking-tight font-mono">
              {examAnalytics.passPercentage}% Passed
            </div>
            <div className="flex items-center gap-1.5 mt-1.5 text-[11px] text-slate-600">
              <span className="text-emerald-600 font-medium">{examAnalytics.passedCount} Passed</span>
              <span>•</span>
              <span className="text-rose-600 font-medium">{examAnalytics.failedCount} Failed</span>
              <span>•</span>
              <span className="font-mono text-slate-500">Avg {examAnalytics.avgScore}%</span>
            </div>
            <div className="text-[10px] text-slate-400 mt-2 truncate">
              Strict 70% passing threshold benchmark
            </div>
          </div>
        </div>
      </div>

      {/* ROW 2: Learning Activity & Financial Management (Free Model) KPIs (5 Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* 5. QR-Verified Certificates */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold tracking-wider uppercase text-slate-400">
              QR CERTIFICATES
            </span>
            <div className="w-8 h-8 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-100">
              <Award className="w-4 h-4" />
            </div>
          </div>

          <div className="mt-3">
            <div className="text-2xl font-extrabold text-slate-900 tracking-tight font-mono">
              {certificateAnalytics.totalGenerated} Total
            </div>
            <div className="flex items-center gap-1.5 mt-1.5 text-[11px] text-slate-600">
              <span className="text-emerald-600 font-semibold font-mono">{certificateAnalytics.verifiedCount} Verified</span>
              <span>•</span>
              <span className="text-amber-600 font-mono">{certificateAnalytics.pendingCount} Pending</span>
            </div>
            <div className="text-[10px] text-slate-400 mt-2 truncate">
              Cryptographic QR-code tamper-proof credentials
            </div>
          </div>
        </div>

        {/* 6. Course Tuition Revenue (Free Education Platform - strictly ₹0) */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold tracking-wider uppercase text-slate-400">
              COURSE TUITION (FREE)
            </span>
            <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
              <span className="text-sm font-bold">₹</span>
            </div>
          </div>

          <div className="mt-3">
            <div className="text-2xl font-extrabold text-slate-900 tracking-tight font-mono">
              ₹0
            </div>
            <div className="flex items-center gap-1.5 mt-1.5 text-[11px]">
              <span className="text-blue-600 font-semibold bg-blue-50 px-1.5 py-0.2 rounded border border-blue-200">
                100% Free Platform
              </span>
            </div>
            <div className="text-[10px] text-slate-400 mt-2 truncate">
              Zero student tuition or hidden charges
            </div>
          </div>
        </div>

        {/* 7. Actual Operational Expenses */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold tracking-wider uppercase text-slate-400">
              OPERATIONAL EXPENSES
            </span>
            <div className="w-8 h-8 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-100">
              <TrendingDown className="w-4 h-4" />
            </div>
          </div>

          <div className="mt-3">
            <div className="text-2xl font-extrabold text-rose-700 tracking-tight font-mono">
              ₹{(financialAnalytics?.operationalExpenses || 0).toLocaleString('en-IN')}
            </div>
            <div className="flex items-center gap-1.5 mt-1.5 text-[11px] text-slate-500">
              <span>Cloud & AI Proctoring</span>
            </div>
            <div className="text-[10px] text-slate-400 mt-2 truncate">
              AWS sandboxes, AI proctoring compute & ops
            </div>
          </div>
        </div>

        {/* 8. Sponsorships & Partnerships */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold tracking-wider uppercase text-slate-400">
              GRANTS & SPONSORSHIPS
            </span>
            <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
              <HeartHandshake className="w-4 h-4" />
            </div>
          </div>

          <div className="mt-3">
            <div className="text-2xl font-extrabold text-emerald-700 tracking-tight font-mono">
              ₹{((financialAnalytics?.sponsorshipIncome || 0) + (financialAnalytics?.partnershipIncome || 0)).toLocaleString('en-IN')}
            </div>
            <div className="flex items-center gap-1.5 mt-1.5 text-[11px] text-slate-500">
              <span>CSR & Hiring Tie-Ups</span>
            </div>
            <div className="text-[10px] text-slate-400 mt-2 truncate">
              Philanthropic foundation grants & university partnerships
            </div>
          </div>
        </div>

        {/* 9. Net Institutional Balance - Dark Navy Card */}
        <div className="bg-[#0e172e] p-5 rounded-2xl border border-blue-900/60 shadow-lg shadow-slate-900/10 text-white relative overflow-hidden group">
          <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-blue-600/10 rounded-full blur-xl pointer-events-none"></div>

          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold tracking-wider uppercase text-blue-300">
              NET BALANCE
            </span>
            <div className="w-8 h-8 rounded-full bg-blue-800/80 text-blue-300 flex items-center justify-center border border-blue-700">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>

          <div className="mt-3">
            <div className={`text-2xl font-extrabold tracking-tight font-mono ${(financialAnalytics?.netInstitutionalBalance || 0) >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              ₹{(financialAnalytics?.netInstitutionalBalance || 0).toLocaleString('en-IN')}
            </div>
            <div className="flex items-center gap-1 mt-1.5 text-[11px] text-blue-200/80">
              <ArrowUpRight className="w-3.5 h-3.5 text-cyan-300" />
              <span>Income - Ops Expenses</span>
            </div>
            <div className="text-[10px] text-blue-300/60 mt-2 truncate">
              Surplus allocated to subsidize student labs
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
