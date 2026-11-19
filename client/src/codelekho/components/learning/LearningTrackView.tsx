import React, { useState } from 'react';
import { 
  Code2, 
  Terminal, 
  Database, 
  Globe, 
  BrainCircuit, 
  BookOpen, 
  CheckCircle2, 
  Clock, 
  FolderGit2, 
  ExternalLink,
  Plus,
  Play,
  FileCheck
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { LearningModule } from '../../types';

interface TrackViewProps {
  trackType: 'Python' | 'SQL' | 'Web' | 'AI' | 'modules' | 'questions' | 'problems' | 'assignments';
}

export const LearningTrackView: React.FC<TrackViewProps> = ({ trackType }) => {
  const { modules, openModuleModal, courses, setSelectedCourseId, setActiveSection, showToast } = useApp();

  const getTitleAndDesc = () => {
    switch (trackType) {
      case 'Python':
        return {
          title: 'Python Programming Specialization Track',
          desc: 'Comprehensive Python curricula from OOP fundamentals, async event loops, to FastAPI and PostgreSQL data engineering.',
          icon: Terminal,
          filterKey: 'Python'
        };
      case 'SQL':
        return {
          title: 'SQL & Relational Databases Track',
          desc: 'Master schema normal forms, EXPLAIN execution planning, composite indexes, CTEs, and transactional concurrency.',
          icon: Database,
          filterKey: 'SQL'
        };
      case 'Web':
        return {
          title: 'Full Stack Web Development Track',
          desc: 'Modern web architecture with React 19, TypeScript, Next.js Server Components, and real-time state machines.',
          icon: Globe,
          filterKey: 'Web'
        };
      case 'AI':
        return {
          title: 'AI & Data Science Fellowship',
          desc: 'Applied machine learning pipelines, PyTorch tensor mechanics, vector search, embeddings, and generative LLMs.',
          icon: BrainCircuit,
          filterKey: 'AI'
        };
      case 'assignments':
        return {
          title: 'Assignments & Project Submissions',
          desc: 'Track hands-on lab code reviews, GitHub pull requests, and mentor evaluation rubrics.',
          icon: FileCheck,
          filterKey: 'All'
        };
      case 'questions':
        return {
          title: 'Assessment Question Bank',
          desc: 'Curated technical quiz questions, coding challenges, and proctored exam problem sets.',
          icon: BookOpen,
          filterKey: 'All'
        };
      case 'problems':
        return {
          title: 'Interactive Practice Problems',
          desc: 'Algorithmic code puzzles, automated sandbox test runners, and real-world micro-challenges.',
          icon: Code2,
          filterKey: 'All'
        };
      default:
        return {
          title: 'Learning Modules Directory',
          desc: 'All course modules, status workflows, and interactive task updates.',
          icon: FolderGit2,
          filterKey: 'All'
        };
    }
  };

  const info = getTitleAndDesc();
  const Icon = info.icon;

  const filteredModules = info.filterKey === 'All' 
    ? modules 
    : modules.filter(m => m.category === info.filterKey);

  const relevantCourses = info.filterKey === 'All'
    ? courses
    : courses.filter(c => c.track === info.filterKey);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-blue-600 text-white shadow-md shadow-blue-600/20">
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] font-mono tracking-wider text-blue-600 uppercase font-semibold">
                CURRICULUM MODULES
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                {info.title}
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                {info.desc}
              </p>
            </div>
          </div>

          <button
            onClick={() => showToast('Action', 'Created new curriculum module.')}
            className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2 rounded-lg shadow-sm shadow-blue-600/30 transition-all cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>New Module</span>
          </button>
        </div>

        {/* 0 Problems Banner if Practice Problems */}
        {trackType === 'problems' && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-slate-100">
            <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-100 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-500">Total Interview Problems</span>
              <div className="text-xl font-extrabold text-blue-600 font-mono">0</div>
              <span className="text-[10px] text-slate-400">0 Py • 0 SQL • 0 Web • 0 AI</span>
            </div>
            <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-100 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-500">Browser Code Runs</span>
              <div className="text-xl font-extrabold text-emerald-700 font-mono">0</div>
              <span className="text-[10px] text-slate-400">In-browser live sandbox</span>
            </div>
            <div className="p-3 bg-purple-50/60 rounded-xl border border-purple-100 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-500">Acceptance Rate</span>
              <div className="text-xl font-extrabold text-purple-700 font-mono">0%</div>
              <span className="text-[10px] text-slate-400">Automated test cases</span>
            </div>
            <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-100 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-500">Curriculum Tier</span>
              <div className="text-sm font-extrabold text-amber-800 font-mono mt-1">100% Free</div>
              <span className="text-[10px] text-slate-400">FAANG & Product Prep</span>
            </div>
          </div>
        )}
      </div>

      {/* Relevant Courses */}
      {relevantCourses.length > 0 && info.filterKey !== 'All' && (
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Active Courses in this Track
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {relevantCourses.map((c) => (
              <div 
                key={c.id}
                onClick={() => {
                  setSelectedCourseId(c.id);
                  setActiveSection('course-detail');
                }}
                className="p-4 rounded-xl bg-white border border-slate-200/80 hover:border-blue-300 shadow-xs hover:shadow-md transition-all cursor-pointer group flex items-center justify-between"
              >
                <div>
                  <span className="font-mono text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-bold">
                    {c.code}
                  </span>
                  <h4 className="text-xs font-bold text-slate-800 mt-1 group-hover:text-blue-600 transition-colors">
                    {c.title}
                  </h4>
                  <p className="text-[11px] text-slate-500">{c.enrolledStudentsCount} enrolled learners • {c.completionPercent}% completed</p>
                </div>
                <span className="text-xs text-blue-600 font-semibold group-hover:translate-x-1 transition-transform">
                  View →
                </span>
              </div>
            ))}
          {filteredModules.length === 0 && (
            <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
              <BookOpen className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-xs font-semibold text-slate-600">No learning modules registered in this track.</p>
              <p className="text-[11px] text-slate-400">All curriculum records reset to zero.</p>
            </div>
          )}
          </div>
        </div>
      )}

      {/* Modules Table / Cards */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              MODULES & LESSONS WORKFLOW
            </h3>
            <p className="text-[11px] text-slate-500">Click any module to inspect Reference Image 4 popup with status slider and comments</p>
          </div>
          <span className="text-xs text-blue-600 font-bold bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
            {filteredModules.length} Modules
          </span>
        </div>

        <div className="space-y-3">
          {filteredModules.map((mod) => (
            <div
              key={mod.id}
              onClick={() => openModuleModal(mod)}
              className="p-4 rounded-xl bg-slate-50 hover:bg-blue-50/50 border border-slate-200/70 transition-all cursor-pointer group flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-2xs"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-purple-700 bg-purple-100 px-2 py-0.5 rounded border border-purple-200">
                    {mod.code}
                  </span>
                  <span className="text-xs font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                    {mod.title}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500">
                  <span>Student: <strong className="text-slate-700">{mod.assignedStudent}</strong></span>
                  <span>•</span>
                  <span>Due: {mod.dueDate}</span>
                  <span>•</span>
                  <span>Time Logged: {mod.timeSpentHours}h</span>
                  <span>•</span>
                  <span>Quiz Score: {mod.quizScore || 85}%</span>
                </div>
              </div>

              <div className="flex items-center gap-3 self-end md:self-auto">
                <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${
                  mod.status === 'Completed'
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                    : mod.status === 'In Progress'
                      ? 'bg-blue-100 text-blue-800 border border-blue-200'
                      : 'bg-amber-100 text-amber-800 border border-amber-200'
                }`}>
                  {mod.status} ({mod.progressPercent}%)
                </span>

                <button
                  type="button"
                  className="px-3 py-1.5 text-xs font-semibold bg-blue-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  Inspect
                </button>
              </div>
            </div>
          ))}
          {filteredModules.length === 0 && (
            <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
              <BookOpen className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-xs font-semibold text-slate-600">No learning modules registered in this track.</p>
              <p className="text-[11px] text-slate-400">All curriculum records reset to zero.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

