import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Calendar as CalendarIcon, Clock, AlertTriangle, Layers, Users } from 'lucide-react';

export const CalendarPage = ({ onSelectProject }) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const today = new Date('2026-11-12');

  useEffect(() => {
    const fetchTimeline = async () => {
      try {
        setLoading(true);
        const res = await api.getProjects('limit=100');
        if (res.success) {
          setProjects(res.projects);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTimeline();
  }, []);

  const activeProjects = projects.filter((p) => !['REJECTED', 'CANCELLED'].includes(p.status));

  // Months for timeline header (Jan 2026 - Dec 2026)
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const getPositionPercentage = (dateStr) => {
    if (!dateStr) return 0;
    const d = new Date(dateStr);
    const startYear = new Date('2026-01-01');
    const endYear = new Date('2026-12-31');
    const totalMs = endYear - startYear;
    const currentMs = d - startYear;
    return Math.max(0, Math.min(100, (currentMs / totalMs) * 100));
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto text-xs">
      <div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <CalendarIcon className="w-5 h-5 text-blue-800" /> Project Calendar & Gantt Timeline
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Visualize multi-project development schedules, resource overlap conflicts, and delivery deadlines.
        </p>
      </div>

      {/* Gantt Chart View */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
            <span className="font-bold text-slate-800">2026 Enterprise Portfolio Gantt Timeline</span>
          </div>
          <span className="text-[11px] font-mono text-slate-400">Current Simulation Date: Nov 12, 2026</span>
        </div>

        {/* Timeline Header Months */}
        <div className="grid grid-cols-12 gap-1 text-center font-mono text-[10px] font-bold text-slate-400 uppercase py-2 bg-slate-50 rounded-lg border border-slate-100">
          {months.map((m) => (
            <div key={m}>{m}</div>
          ))}
        </div>

        {/* Project Gantt Bars */}
        <div className="space-y-4 pt-2">
          {activeProjects.map((p) => {
            const startPct = getPositionPercentage(p.plannedStartDate || p.receivedDate);
            const endPct = getPositionPercentage(p.expectedCompletionDate || '2026-12-31');
            const barWidth = Math.max(8, endPct - startPct);
            const isOverdue = p.isOverdue;

            return (
              <div key={p.id} className="space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <button
                    onClick={() => onSelectProject(p.id)}
                    className="font-bold text-slate-800 hover:text-blue-600 flex items-center gap-2"
                  >
                    <span className="font-mono text-blue-800">{p.projectId}</span>
                    <span>{p.title}</span>
                  </button>
                  <div className="flex items-center gap-3 text-slate-500 font-mono text-[10px]">
                    <span>{p.plannedStartDate || 'Start'}</span>
                    <span>→</span>
                    <span className={isOverdue ? 'text-red-600 font-bold' : ''}>
                      {p.expectedCompletionDate || 'End'}
                    </span>
                  </div>
                </div>

                {/* Progress & Timeline Bar Track */}
                <div className="relative h-6 bg-slate-100 rounded-md overflow-hidden border border-slate-200">
                  <div
                    className={`absolute top-0 bottom-0 rounded flex items-center px-2 text-[10px] text-white font-bold transition-all shadow-xs ${
                      isOverdue
                        ? 'bg-red-600'
                        : p.status === 'COMPLETED' || p.status === 'DELIVERED'
                        ? 'bg-blue-600'
                        : p.status === 'ON_HOLD'
                        ? 'bg-amber-600'
                        : 'bg-blue-900'
                    }`}
                    style={{ left: `${startPct}%`, width: `${barWidth}%` }}
                  >
                    <span className="truncate">{p.completionPercentage}%</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

