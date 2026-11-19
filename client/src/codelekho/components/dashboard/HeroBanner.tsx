import React from 'react';
import { RefreshCw, Plus, Calendar, ChevronDown, CheckCircle2, Award, Code2, ShieldCheck, Sparkles, BookOpen } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { DateFilterOption } from '../../types';

export const HeroBanner: React.FC = () => {
  const { 
    setIsAddCourseModalOpen, 
    filterTrack, 
    setFilterTrack, 
    dateFilter, 
    setDateFilter, 
    showToast,
    isBackendConnected,
    practiceProblemsSummary,
    modules
  } = useApp();

  const dateOptions: DateFilterOption[] = ['Today', 'This Week', 'This Month', 'This Year'];

  return (
    <div className="relative rounded-2xl bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-950 text-white p-6 md:p-8 shadow-xl shadow-blue-900/10 border border-blue-600/30 overflow-hidden">
      {/* Background Subtle Gradient Accents */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-cyan-400/10 blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-1/3 -mb-20 w-60 h-60 rounded-full bg-blue-500/10 blur-2xl pointer-events-none"></div>

      <div className="relative z-10 space-y-4">
        {/* Breadcrumb & Free Platform Badges */}
        <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono tracking-wider text-blue-200/80">
          <span className="bg-emerald-500/30 text-emerald-300 px-2 py-0.5 rounded border border-emerald-400/30 font-bold uppercase">
            100% FREE CODING EDUCATION
          </span>
          <span>•</span>
          <span className="uppercase">CODELEKHO LMS EXECUTIVE MANAGEMENT SYSTEM</span>
          <span>•</span>
          <span className="text-cyan-300">Academic Year 2026-27</span>
          {isBackendConnected && (
            <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-2 py-0.5 rounded text-[10px] flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              Live Backend
            </span>
          )}
        </div>

        {/* Title and Subtitle */}
        <div className="space-y-1.5 max-w-4xl">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            CodeLekho – Executive LMS Management System
          </h1>
          <p className="text-xs sm:text-sm text-blue-100/90 leading-relaxed">
            Free technical education platform delivering 4 career tracks: Python, SQL & Databases, Web Development, and AI & Data Science. Monitoring {modules.length} interactive modules, {practiceProblemsSummary.totalCount} interview problems, browser coding practice, module quizzes, 45-minute proctored final exams, and tamper-proof QR-verified certificates.
          </p>
        </div>

        {/* Platform Feature Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px]">
          <span className="bg-blue-900/60 text-blue-200 border border-blue-400/30 px-2.5 py-1 rounded-full flex items-center gap-1">
            <BookOpen className="w-3 h-3 text-blue-300" /> {modules.length} Learning Modules
          </span>
          <span className="bg-blue-900/60 text-blue-200 border border-blue-400/30 px-2.5 py-1 rounded-full flex items-center gap-1">
            <Code2 className="w-3 h-3 text-cyan-300" /> {practiceProblemsSummary.totalCount} Interview Problems
          </span>
          <span className="bg-blue-900/60 text-blue-200 border border-blue-400/30 px-2.5 py-1 rounded-full flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-amber-300" /> 45-Min Proctored Exam (70% Pass)
          </span>
          <span className="bg-blue-900/60 text-blue-200 border border-blue-400/30 px-2.5 py-1 rounded-full flex items-center gap-1">
            <Award className="w-3 h-3 text-emerald-300" /> QR-Verified Certificates
          </span>
        </div>

        {/* Action Controls & Filters: Date Filters */}
        <div className="pt-2 flex flex-wrap items-center gap-2.5">
          {/* Segmented Date Filters */}
          <div className="flex items-center bg-blue-950/70 p-1 rounded-lg border border-blue-400/30 backdrop-blur-xs">
            {dateOptions.map((opt) => {
              const isSelected = dateFilter === opt;
              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => {
                    setDateFilter(opt);
                    showToast('Filter Applied', `Showing metrics for ${opt}`);
                  }}
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-blue-200 hover:text-white hover:bg-blue-900/50'
                  }`}
                >
                  {opt}
                </button>
              );
            })}
          </div>

          {/* Category Dropdown */}
          <div className="relative">
            <select
              value={filterTrack}
              onChange={(e) => setFilterTrack(e.target.value)}
              className="appearance-none bg-blue-900/60 hover:bg-blue-900/80 text-white text-xs font-medium pl-3.5 pr-8 py-2 rounded-lg border border-blue-400/30 outline-none cursor-pointer backdrop-blur-xs transition-colors"
            >
              <option value="All" className="bg-slate-900 text-white">All 4 Learning Tracks</option>
              <option value="Python" className="bg-slate-900 text-white">Python Programming</option>
              <option value="SQL" className="bg-slate-900 text-white">SQL & Databases</option>
              <option value="Web" className="bg-slate-900 text-white">Web Development</option>
              <option value="AI" className="bg-slate-900 text-white">AI & Data Science</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-blue-300 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Refresh Button */}
          <button
            onClick={() => showToast('Database Synced', 'Synced with database collection.')}
            className="p-2 bg-blue-900/60 hover:bg-blue-800 text-white rounded-lg border border-blue-400/30 transition-colors cursor-pointer"
            title="Refresh Live Data"
          >
            <RefreshCw className="w-4 h-4 text-blue-200" />
          </button>

          {/* New Course Button */}
          <button
            onClick={() => setIsAddCourseModalOpen(true)}
            className="flex items-center gap-1.5 bg-blue-500 hover:bg-blue-400 text-white text-xs font-semibold px-4 py-2 rounded-lg shadow-md shadow-blue-500/20 transition-all cursor-pointer ml-auto"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add Track</span>
          </button>
        </div>
      </div>
    </div>
  );
};
