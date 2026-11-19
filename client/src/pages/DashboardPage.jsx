import React, { useState, useEffect } from 'react';
import {
  FolderGit2,
  Sparkles,
  FileSearch,
  CheckCircle2,
  XCircle,
  UserCheck,
  UserX,
  PlayCircle,
  PauseCircle,
  FlaskConical,
  Trophy,
  Truck,
  Ban,
  AlertTriangle,
  IndianRupee,
  TrendingUp,
  CreditCard,
  Wallet,
  Clock,
  Filter,
  RefreshCw,
  ArrowUpRight,
  ArrowRight,
  ShieldCheck,
  Layers,
  Users,
  Compass,
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  AreaChart,
  Area,
} from 'recharts';
import { api } from '../services/api';

const formatINR = (val) => {
  const num = Number(val) || 0;
  if (num >= 10000000) {
    return `₹${(num / 10000000).toFixed(2)} Cr`;
  }
  if (num >= 100000) {
    return `₹${(num / 100000).toFixed(2)} L`;
  }
  return `₹${num.toLocaleString('en-IN')}`;
};

// Semantic status colors per user specification (No green brand colors)
const STATUS_CONFIG = {
  NEW: { label: 'New', color: '#0EA5E9', bg: 'bg-sky-50', text: 'text-sky-700', border: 'border-sky-200', dot: 'bg-sky-500' },
  UNDER_REVIEW: { label: 'Under Review', color: '#6366F1', bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200', dot: 'bg-indigo-500' },
  ACCEPTED: { label: 'Accepted', color: '#2563EB', bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', dot: 'bg-blue-600' },
  APPROVED: { label: 'Approved', color: '#1D4ED8', bg: 'bg-blue-50', text: 'text-blue-800', border: 'border-blue-300', dot: 'bg-blue-700' },
  ASSIGNED: { label: 'Assigned', color: '#475569', bg: 'bg-slate-100', text: 'text-slate-800', border: 'border-slate-300', dot: 'bg-slate-600' },
  IN_PROGRESS: { label: 'In Progress', color: '#2563EB', bg: 'bg-blue-100', text: 'text-blue-900', border: 'border-blue-300', dot: 'bg-blue-600' },
  TESTING: { label: 'Testing', color: '#F59E0B', bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', dot: 'bg-amber-500' },
  ON_HOLD: { label: 'On Hold', color: '#D97706', bg: 'bg-amber-100', text: 'text-amber-900', border: 'border-amber-300', dot: 'bg-amber-600' },
  COMPLETED: { label: 'Completed', color: '#0D9488', bg: 'bg-teal-50', text: 'text-teal-700', border: 'border-teal-200', dot: 'bg-teal-600' },
  DELIVERED: { label: 'Delivered', color: '#0F766E', bg: 'bg-teal-100', text: 'text-teal-900', border: 'border-teal-300', dot: 'bg-teal-700' },
  CANCELLED: { label: 'Cancelled', color: '#64748B', bg: 'bg-slate-100', text: 'text-slate-700', border: 'border-slate-300', dot: 'bg-slate-500' },
  REJECTED: { label: 'Rejected', color: '#EF4444', bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200', dot: 'bg-rose-600' },
};

// Premium Floating Tooltip for Recharts
const CustomChartTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#101827] text-white p-3 rounded-xl shadow-xl border border-slate-700 text-xs backdrop-blur-md">
        {label && <div className="font-bold text-slate-200 mb-1.5 pb-1 border-b border-slate-700">{label}</div>}
        {payload.map((entry, index) => (
          <div key={`item-${index}`} className="flex items-center justify-between gap-4 py-0.5">
            <div className="flex items-center gap-1.5 text-slate-300">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color || entry.fill }}></span>
              <span>{entry.name}:</span>
            </div>
            <span className="font-mono font-bold text-sky-400">
              {typeof entry.value === 'number' && entry.name && (entry.name.includes('Budget') || entry.name.includes('Spend'))
                ? formatINR(entry.value)
                : entry.value}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export const DashboardPage = ({ onNavigateToProjectsWithFilter, onOpenNewProjectModal }) => {
  const [loading, setLoading] = useState(true);
  const [statsData, setStatsData] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  const fetchStats = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      if (selectedCategory !== 'ALL') queryParams.append('category', selectedCategory);
      const res = await api.getDashboardStats(queryParams.toString());
      if (res.success) {
        setStatsData(res);
      }
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [selectedCategory]);

  const stats = statsData?.stats || {};
  const financials = statsData?.financials || {};
  const charts = statsData?.charts || {};

  // Lifecycle Primary Pipeline Stages (Intake -> Delivery)
  const pipelineStages = [
    { id: 'NEW', label: '1. New Intake', count: stats.newProjects || 0, icon: Sparkles, color: 'text-sky-600 bg-sky-50 border-sky-200' },
    { id: 'UNDER_REVIEW', label: '2. Under Review', count: stats.underReview || 0, icon: FileSearch, color: 'text-indigo-600 bg-indigo-50 border-indigo-200' },
    { id: 'ACCEPTED', label: '3. Accepted', count: stats.accepted || 0, icon: CheckCircle2, color: 'text-blue-600 bg-blue-50 border-blue-200' },
    { id: 'APPROVED', label: '4. Approved', count: stats.approved || 0, icon: ShieldCheck, color: 'text-blue-700 bg-blue-50 border-blue-300' },
    { id: 'ASSIGNED', label: '5. Assigned', count: stats.assigned || 0, icon: UserCheck, color: 'text-slate-700 bg-slate-100 border-slate-300' },
    { id: 'IN_PROGRESS', label: '6. In Progress', count: stats.inProgress || 0, icon: PlayCircle, color: 'text-blue-900 bg-blue-100 border-blue-300' },
    { id: 'TESTING', label: '7. Testing & QA', count: stats.testing || 0, icon: FlaskConical, color: 'text-amber-700 bg-amber-50 border-amber-200' },
    { id: 'COMPLETED', label: '8. Completed', count: stats.completed || 0, icon: Trophy, color: 'text-teal-700 bg-teal-50 border-teal-200' },
    { id: 'DELIVERED', label: '9. Delivered', count: stats.delivered || 0, icon: Truck, color: 'text-teal-800 bg-teal-100 border-teal-300' },
  ];

  // Secondary Governance & Exception States
  const governanceCards = [
    { id: 'ALL', label: 'Total Portfolio', count: stats.totalProjects || 0, icon: FolderGit2, tag: 'All Registered', badgeColor: 'bg-[#101827] text-white' },
    { id: 'UNASSIGNED', label: 'Unassigned', count: stats.unassigned || 0, icon: UserX, tag: 'Resource Gap', badgeColor: 'bg-amber-100 text-amber-900 border border-amber-300' },
    { id: 'ON_HOLD', label: 'On Hold', count: stats.onHold || 0, icon: PauseCircle, tag: 'Paused', badgeColor: 'bg-amber-100 text-amber-900 border border-amber-300' },
    { id: 'OVERDUE', label: 'Overdue SLA', count: stats.overdue || 0, icon: AlertTriangle, tag: 'Escalation', badgeColor: 'bg-rose-100 text-rose-900 border border-rose-300' },
    { id: 'CANCELLED', label: 'Cancelled', count: stats.cancelled || 0, icon: Ban, tag: 'Terminated', badgeColor: 'bg-slate-100 text-slate-700 border border-slate-300' },
    { id: 'REJECTED', label: 'Rejected', count: stats.rejected || 0, icon: XCircle, tag: 'Declined', badgeColor: 'bg-rose-50 text-rose-800 border border-rose-200' },
  ];

  const budgetBurnPercent = financials.totalApprovedBudget > 0
    ? Math.min(100, Math.round((financials.totalActualExpenditure / financials.totalApprovedBudget) * 100))
    : 0;

  return (
    <div className="p-6 md:p-8 space-y-7 max-w-[1600px] mx-auto text-[#111827]">
      {/* 1. EXECUTIVE HERO COMMAND BANNER (NAVY BLUE & SILVER) */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#101827] via-[#1E293B] to-[#1E3A8A] p-6 md:p-8 text-white shadow-xl border border-slate-800">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-blue-500/20 text-blue-300 border border-blue-500/30">
                <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse"></span>
                Arshith Infotech • Enterprise Portfolio OS
              </span>
              <span className="text-xs text-slate-400 font-mono">Fiscal Year 2026-27</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white font-sans">
              Executive Project Portfolio Command Center
            </h1>
            <p className="text-xs md:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Unified governance, real-time lifecycle tracking, financial burn surveillance, and commercial delivery monitoring.
            </p>
          </div>

          {/* Quick Category & Action Controls */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 bg-[#101827]/90 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-200 shadow-inner">
              <Filter className="w-4 h-4 text-sky-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-transparent focus:outline-none text-slate-200 font-medium cursor-pointer"
              >
                <option value="ALL" className="bg-[#101827] text-white">All Categories ({stats.totalProjects || 15})</option>
                <option value="Enterprise Web Application" className="bg-[#101827] text-white">Enterprise Web Application</option>
                <option value="FinTech & Banking Solutions" className="bg-[#101827] text-white">FinTech & Banking Solutions</option>
                <option value="Healthcare & Telemedicine" className="bg-[#101827] text-white">Healthcare & Telemedicine</option>
                <option value="Supply Chain & Logistics" className="bg-[#101827] text-white">Supply Chain & Logistics</option>
                <option value="AI & Machine Learning Solutions" className="bg-[#101827] text-white">AI & Machine Learning</option>
                <option value="Smart City & Public Infrastructure" className="bg-[#101827] text-white">Smart City & Public Infrastructure</option>
              </select>
            </div>

            <button
              onClick={fetchStats}
              className="p-2.5 bg-[#101827]/90 hover:bg-slate-800 border border-slate-700 rounded-xl text-slate-200 hover:text-white transition-all shadow-inner"
              title="Refresh Portfolio State"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-sky-400' : ''}`} />
            </button>

            <button
              onClick={onOpenNewProjectModal}
              className="flex items-center gap-2 px-4 py-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-950/40 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>+ New Project</span>
            </button>
          </div>
        </div>

        {/* Ambient background glow decoration in Sky Blue */}
        <div className="absolute right-0 top-0 -mt-12 -mr-12 w-96 h-96 rounded-full bg-blue-500/15 blur-3xl pointer-events-none"></div>
      </div>

      {/* 2. TOP 4 HERO PULSE SPOTLIGHT METRICS (PURE WHITE CARDS, SILVER BORDERS) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Spotlight 1: Portfolio Value & Burn Rate */}
        <div className="bg-white rounded-2xl p-5 border border-[#E2E8F0] shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748B] font-mono">
              Approved Contracts Value
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-[#2563EB]">
              <IndianRupee className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-[#111827] font-sans tracking-tight">
            {formatINR(financials.totalApprovedBudget)}
          </div>
          <div className="mt-3 space-y-1.5">
            <div className="flex items-center justify-between text-[11px] font-medium text-[#64748B]">
              <span>Actual Burn: {formatINR(financials.totalActualExpenditure)}</span>
              <span className="font-mono font-bold text-[#2563EB]">{budgetBurnPercent}% Spent</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-600 to-sky-500 rounded-full transition-all duration-500"
                style={{ width: `${budgetBurnPercent}%` }}
              ></div>
            </div>
            <div className="text-[10px] text-[#64748B] font-medium">
              Available Runway: {formatINR(financials.remainingBudget)}
            </div>
          </div>
        </div>

        {/* Spotlight 2: Active Inventory Volume */}
        <div className="bg-white rounded-2xl p-5 border border-[#E2E8F0] shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748B] font-mono">
              Total Managed Projects
            </span>
            <div className="w-8 h-8 rounded-xl bg-sky-50 border border-sky-200 flex items-center justify-center text-[#0EA5E9]">
              <FolderGit2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-[#111827] font-sans tracking-tight">
            {stats.totalProjects || 0} Projects
          </div>
          <div className="mt-3 flex items-center gap-1.5 flex-wrap">
            <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-bold">
              {stats.inProgress || 0} In Progress
            </span>
            <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">
              {stats.onHold || 0} On Hold
            </span>
            <span className="px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 text-[10px] font-bold">
              {stats.delivered || 0} Delivered
            </span>
          </div>
          <div className="text-[10px] text-[#64748B] font-medium mt-2">
            Central repository for intake, execution & client handover
          </div>
        </div>

        {/* Spotlight 3: Revenue Realization & Invoicing */}
        <div className="bg-white rounded-2xl p-5 border border-[#E2E8F0] shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748B] font-mono">
              Total Realized Inflow
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-[#2563EB]">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-[#111827] font-sans tracking-tight">
            {formatINR(financials.totalProjectRevenue)}
          </div>
          <div className="mt-3 flex items-center justify-between text-[11px] font-medium text-[#64748B]">
            <span>Pending Receivables</span>
            <span className="font-mono font-bold text-amber-700">{formatINR(financials.pendingPayments)}</span>
          </div>
          <div className="text-[10px] text-[#64748B] font-medium mt-2">
            Client billing, invoice settlements, & advance deposits
          </div>
        </div>

        {/* Spotlight 4: Gross Project Margin (ROYAL BLUE GRADIENT) */}
        <div className="bg-gradient-to-br from-[#1E3A8A] to-[#101827] rounded-2xl p-5 text-white shadow-md hover:shadow-lg transition-all group relative overflow-hidden border border-blue-800/50">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-200 font-mono">
              Gross Project Profit
            </span>
            <div className="w-8 h-8 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-white">
              <Trophy className="w-4 h-4 text-sky-300" />
            </div>
          </div>
          <div className="text-2xl font-black text-white font-sans tracking-tight">
            {formatINR(financials.totalProjectProfit)}
          </div>
          <div className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-500/20 text-sky-200 border border-blue-400/30 text-[10px] font-semibold">
            <Sparkles className="w-3 h-3 text-sky-300" />
            <span>High Profit Margin Portfolio</span>
          </div>
          <div className="text-[10px] text-blue-200/80 font-medium mt-2">
            Revenue surplus over operational development costs
          </div>
        </div>
      </div>

      {/* 3. INTERACTIVE LIFECYCLE PIPELINE TRACK (ALL 14 CARDS CLICKABLE) */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#E2E8F0]">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold uppercase tracking-wider text-[#111827] font-mono flex items-center gap-2">
                <Compass className="w-4 h-4 text-[#2563EB]" /> Project Lifecycle Flow & Status Directory
              </h2>
              <span className="text-[10px] font-bold bg-[#F5F7FA] text-[#64748B] px-2 py-0.5 rounded-full border border-[#E2E8F0]">
                Click any stage to filter projects
              </span>
            </div>
            <p className="text-xs text-[#64748B] mt-0.5">
              Chronological workflow progression from project proposal reception to client warranty and release.
            </p>
          </div>
          <button
            onClick={() => onNavigateToProjectsWithFilter('ALL')}
            className="text-xs font-bold text-[#2563EB] hover:text-[#1D4ED8] hover:underline flex items-center gap-1 self-start sm:self-auto"
          >
            <span>View Full Portfolio</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Primary Delivery Stages Ribbon (1 to 9) */}
        <div>
          <div className="text-[11px] font-bold uppercase tracking-wider text-[#64748B] font-mono mb-2.5 flex items-center gap-1.5">
            <span>Primary Delivery Pipeline (In Order of Execution)</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-2.5">
            {pipelineStages.map((stage) => {
              const Icon = stage.icon;
              return (
                <button
                  key={stage.id}
                  onClick={() => onNavigateToProjectsWithFilter(stage.id)}
                  className="text-left p-3 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] hover:bg-white hover:border-[#2563EB] hover:shadow-md transition-all group cursor-pointer flex flex-col justify-between min-h-[92px]"
                >
                  <div className="flex items-center justify-between w-full">
                    <span className={`p-1.5 rounded-lg border ${stage.color}`}>
                      <Icon className="w-3.5 h-3.5" />
                    </span>
                    <ArrowUpRight className="w-3 h-3 text-slate-300 group-hover:text-[#2563EB] transition-colors" />
                  </div>
                  <div className="mt-2">
                    <div className="text-lg font-black text-[#111827] font-mono leading-none">
                      {stage.count}
                    </div>
                    <div className="text-[11px] font-semibold text-[#64748B] truncate mt-1">
                      {stage.label}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Governance, Exceptions & Special Status Cards */}
        <div>
          <div className="text-[11px] font-bold uppercase tracking-wider text-[#64748B] font-mono mb-2.5 flex items-center gap-1.5">
            <span>Governance, Operational Exceptions & Review Categories</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
            {governanceCards.map((gov) => {
              const Icon = gov.icon;
              const isOverdueAlert = gov.id === 'OVERDUE' && gov.count > 0;
              return (
                <button
                  key={gov.id}
                  onClick={() => onNavigateToProjectsWithFilter(gov.id)}
                  className={`text-left p-3 rounded-xl border transition-all group cursor-pointer flex flex-col justify-between min-h-[92px] ${
                    isOverdueAlert
                      ? 'border-red-300 bg-red-50/50 hover:border-red-500 hover:shadow-md ring-1 ring-red-400'
                      : 'border-[#E2E8F0] bg-[#F8FAFC] hover:bg-white hover:border-[#2563EB] hover:shadow-md'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${gov.badgeColor}`}>
                      {gov.tag}
                    </span>
                    <ArrowUpRight className="w-3 h-3 text-slate-400 group-hover:text-[#111827] transition-colors" />
                  </div>
                  <div className="mt-2">
                    <div className="flex items-baseline gap-2">
                      <span className={`text-xl font-black font-mono leading-none ${isOverdueAlert ? 'text-red-700' : 'text-[#111827]'}`}>
                        {gov.count}
                      </span>
                      <span className="text-[11px] font-semibold text-[#64748B] truncate">
                        {gov.label}
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 4. FINANCIAL LEDGER DASHBOARD (ALL 7 IN INR ₹) */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#111827] font-mono flex items-center gap-2">
              <IndianRupee className="w-4 h-4 text-[#2563EB]" /> Commercial Governance & Ledger Balances
            </h2>
            <p className="text-xs text-[#64748B] mt-0.5">
              Audited project capital allocation, expenditure tracking, receivables and gross operating margin in INR (₹).
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-[#2563EB] bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200">
            Audited Balance Sheet
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-3">
          {/* Card 1: Total Proposed Budget */}
          <div className="p-4 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC]">
            <div className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider">Proposed Budget</div>
            <div className="text-lg font-black text-[#111827] mt-1.5 font-mono">{formatINR(financials.totalProposedBudget)}</div>
            <div className="text-[10px] text-[#64748B] mt-1">Pre-sanction estimate</div>
          </div>

          {/* Card 2: Total Approved Budget (BLUE ACCENT) */}
          <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/40">
            <div className="text-[10px] font-bold text-blue-800 uppercase tracking-wider">Approved Budget</div>
            <div className="text-lg font-black text-blue-950 mt-1.5 font-mono">{formatINR(financials.totalApprovedBudget)}</div>
            <div className="text-[10px] text-blue-700 font-medium mt-1">Client signed contracts</div>
          </div>

          {/* Card 3: Total Actual Expenditure */}
          <div className="p-4 rounded-xl border border-rose-200 bg-rose-50/30">
            <div className="text-[10px] font-bold text-rose-800 uppercase tracking-wider">Actual Expenditure</div>
            <div className="text-lg font-black text-rose-950 mt-1.5 font-mono">{formatINR(financials.totalActualExpenditure)}</div>
            <div className="text-[10px] text-rose-600 font-medium mt-1">Approved operational spend</div>
          </div>

          {/* Card 4: Remaining Budget */}
          <div className="p-4 rounded-xl border border-sky-200 bg-sky-50/30">
            <div className="text-[10px] font-bold text-sky-800 uppercase tracking-wider">Remaining Budget</div>
            <div className="text-lg font-black text-sky-950 mt-1.5 font-mono">{formatINR(financials.remainingBudget)}</div>
            <div className="text-[10px] text-sky-600 font-medium mt-1">Available runway</div>
          </div>

          {/* Card 5: Pending Payments */}
          <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/30">
            <div className="text-[10px] font-bold text-amber-800 uppercase tracking-wider">Pending Receivables</div>
            <div className="text-lg font-black text-amber-950 mt-1.5 font-mono">{formatINR(financials.pendingPayments)}</div>
            <div className="text-[10px] text-amber-700 font-medium mt-1">Unbilled / unpaid client dues</div>
          </div>

          {/* Card 6: Total Project Revenue */}
          <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/40">
            <div className="text-[10px] font-bold text-blue-800 uppercase tracking-wider">Total Received</div>
            <div className="text-lg font-black text-blue-950 mt-1.5 font-mono">{formatINR(financials.totalProjectRevenue)}</div>
            <div className="text-[10px] text-blue-700 font-medium mt-1">Cleared client wire payments</div>
          </div>

          {/* Card 7: Total Project Profit (NAVY / ROYAL BLUE) */}
          <div className="p-4 rounded-xl border border-blue-400 bg-gradient-to-br from-[#1E3A8A] to-[#101827] text-white shadow-sm">
            <div className="text-[10px] font-bold text-blue-200 uppercase tracking-wider">Total Profit Margin</div>
            <div className="text-lg font-black text-white mt-1.5 font-mono">{formatINR(financials.totalProjectProfit)}</div>
            <div className="text-[10px] text-sky-300 font-medium mt-1">Gross commercial surplus</div>
          </div>
        </div>
      </div>

      {/* 5. INTERACTIVE ANALYTICAL CHARTS GRID (NAVY & BLUE PALETTE) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Project Distribution by Status */}
        <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#111827] font-mono">
                Project Distribution Across Stages
              </h3>
              <p className="text-[11px] text-[#64748B]">Current portfolio breakdown across lifecycle workflow</p>
            </div>
            <span className="text-[10px] font-bold text-[#64748B] bg-[#F5F7FA] px-2 py-0.5 rounded border border-[#E2E8F0]">Donut View</span>
          </div>
          <div className="h-64 flex items-center justify-center">
            {charts.statusDistribution && charts.statusDistribution.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={charts.statusDistribution}
                    dataKey="count"
                    nameKey="label"
                    cx="50%"
                    cy="50%"
                    outerRadius={88}
                    innerRadius={52}
                    paddingAngle={3}
                  >
                    {charts.statusDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={STATUS_CONFIG[entry.status]?.color || '#2563EB'} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomChartTooltip />} />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-xs text-[#64748B]">No status data recorded</div>
            )}
          </div>
        </div>

        {/* Chart 2: Monthly Projects Received vs Completed (BLUE & SKY BARS) */}
        <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#111827] font-mono">
                Monthly Intake vs Delivery Velocity (2026)
              </h3>
              <p className="text-[11px] text-[#64748B]">Trend of new contracts received vs completed deliverables</p>
            </div>
            <span className="text-[10px] font-bold text-[#64748B] bg-[#F5F7FA] px-2 py-0.5 rounded border border-[#E2E8F0]">Dual Bar</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={charts.monthlyReceived?.map((item, idx) => ({
                  month: item.month,
                  Received: item.count,
                  Completed: charts.monthlyCompleted?.[idx]?.count || 0,
                })) || []}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748B' }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#64748B' }} />
                <Tooltip content={<CustomChartTooltip />} />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Bar dataKey="Received" name="New Projects Received" fill="#101827" radius={[6, 6, 0, 0]} />
                <Bar dataKey="Completed" name="Projects Completed" fill="#2563EB" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Project Budget vs Actual Expenditure (Top Projects) */}
        <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#111827] font-mono">
                Approved Budget vs Actual Expenditure
              </h3>
              <p className="text-[11px] text-[#64748B]">Financial variance comparison for top enterprise contracts</p>
            </div>
            <span className="text-[10px] font-bold text-[#64748B] bg-[#F5F7FA] px-2 py-0.5 rounded border border-[#E2E8F0]">Variance</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts.budgetVsActual || []} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E2E8F0" />
                <XAxis type="number" tickFormatter={(v) => formatINR(v)} tick={{ fontSize: 10, fill: '#64748B' }} />
                <YAxis dataKey="id" type="category" tick={{ fontSize: 10, fill: '#64748B' }} width={80} />
                <Tooltip content={<CustomChartTooltip />} />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '6px' }} />
                <Bar dataKey="approvedBudget" name="Approved Budget" fill="#2563EB" radius={[0, 4, 4, 0]} />
                <Bar dataKey="actualExpenditure" name="Actual Spend" fill="#F59E0B" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4: Employee Capacity & Allocation % */}
        <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#111827] font-mono">
                Employee Capacity & Workload Allocation
              </h3>
              <p className="text-[11px] text-[#64748B]">Live human resource allocation commitment across portfolio</p>
            </div>
            <span className="text-[10px] font-bold text-[#64748B] bg-[#F5F7FA] px-2 py-0.5 rounded border border-[#E2E8F0]">Talent Roster</span>
          </div>
          <div className="h-64">
            {charts.employeeAllocation && charts.employeeAllocation.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={charts.employeeAllocation.slice(0, 7)}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#64748B' }} interval={0} angle={-15} textAnchor="end" height={40} />
                  <YAxis unit="%" tick={{ fontSize: 10, fill: '#64748B' }} domain={[0, 120]} />
                  <Tooltip content={<CustomChartTooltip />} />
                  <Bar
                    dataKey="totalAllocationPercentage"
                    name="Allocation %"
                    fill="#0EA5E9"
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 bg-[#F8FAFC] rounded-xl border border-dashed border-[#E2E8F0]">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center mb-2 text-[#2563EB]">
                  <Users className="w-5 h-5" />
                </div>
                <div className="text-xs font-bold text-[#111827]">No Resource Allocations Assigned (0 Employees)</div>
                <div className="text-[11px] text-[#64748B] max-w-xs mt-1">
                  Once team members are registered in Employees or Project Teams, capacity commitments and workload % will display here.
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Chart 5: Project Completion Trends (BLUE AREA CHART) */}
        <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#111827] font-mono">
                Project Completion Progress Curve
              </h3>
              <p className="text-[11px] text-[#64748B]">Distribution of projects across progress completion stages</p>
            </div>
            <span className="text-[10px] font-bold text-[#64748B] bg-[#F5F7FA] px-2 py-0.5 rounded border border-[#E2E8F0]">Curve</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={charts.completionTrends || []}>
                <defs>
                  <linearGradient id="colorCountBlue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="bucket" tick={{ fontSize: 11, fill: '#64748B' }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#64748B' }} />
                <Tooltip content={<CustomChartTooltip />} />
                <Area type="monotone" dataKey="count" name="Projects" stroke="#2563EB" strokeWidth={2.5} fillOpacity={1} fill="url(#colorCountBlue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 6: Overdue Project Escalation Analysis */}
        <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#111827] font-mono flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-rose-600" /> Overdue Project Analysis & Escalation
              </h3>
              <p className="text-[11px] text-[#64748B]">Projects exceeding contractual delivery target dates</p>
            </div>
            <span className="text-[10px] font-bold text-[#64748B] bg-[#F5F7FA] px-2 py-0.5 rounded border border-[#E2E8F0]">Critical Audit</span>
          </div>
          <div className="h-64 overflow-y-auto pr-1">
            {charts.overdueAnalysis && charts.overdueAnalysis.length > 0 ? (
              <div className="space-y-3">
                {charts.overdueAnalysis.map((item, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl border border-rose-200 bg-rose-50/40 text-xs space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-rose-900 font-bold bg-rose-100 px-2 py-0.5 rounded">
                        {item.projectId}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-rose-200 text-rose-800 font-bold text-[10px]">
                        {item.daysOverdue} Days Overdue
                      </span>
                    </div>
                    <div className="text-[#111827] font-bold truncate">{item.title}</div>
                    <div className="flex items-center justify-between text-[11px] text-[#64748B] pt-1 border-t border-rose-100">
                      <span>Target Date: {item.expectedDate}</span>
                      <span className="font-semibold text-[#2563EB]">Progress: {item.progress}%</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-xs text-[#64748B] bg-blue-50/30 rounded-xl border border-dashed border-blue-200 p-6 text-center">
                <CheckCircle2 className="w-8 h-8 text-[#2563EB] mb-2" />
                <span className="font-bold text-[#111827] text-sm">All Active Projects On Schedule</span>
                <span className="text-[11px] text-[#64748B] mt-0.5">No projects currently violate delivery SLA deadlines.</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
