import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, 
  BarChart2, 
  ChevronLeft, 
  ChevronRight, 
  AlertTriangle, 
  Clock, 
  Users, 
  Layers, 
  CheckCircle2, 
  Flag,
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const CalendarTimeline: React.FC = () => {
  const { timelineProjects, alertSummary, openModuleModal, modules, showToast } = useApp();
  const [viewMode, setViewMode] = useState<'gantt' | 'calendar'>('gantt');
  const [currentMonth, setCurrentMonth] = useState('November 2026');

  const months = ['Sept 26', 'Oct 26', 'Nov 26', 'Dec 26', 'Jan 27', 'Feb 27', 'Mar 27'];

  // Calendar dates for November 2026 (starts on Sunday, Nov 1)
  const calendarDays = Array.from({ length: 30 }, (_, i) => i + 1);

  const calendarEvents: { [day: number]: { title: string; type: 'exam' | 'deadline' | 'session' | 'review'; code: string }[] } = {};

  const getBarColor = (color: string) => {
    switch (color) {
      case 'green': return 'bg-emerald-500';
      case 'orange': return 'bg-amber-500';
      case 'amber': return 'bg-orange-400';
      case 'blue': return 'bg-blue-600';
      case 'purple': return 'bg-purple-300';
      default: return 'bg-blue-500';
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header matching Reference Image 2 */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="text-[10px] font-mono tracking-wider text-blue-600 uppercase font-semibold">
              CODELEKHO PORTFOLIO
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Calendar & Timeline
            </h1>
            <p className="text-xs text-slate-500">
              Project timelines, milestones, deadlines, overlapping projects and resource conflicts.
            </p>
          </div>

          {/* Toggle buttons & Month selector */}
          <div className="flex flex-wrap items-center gap-2.5 self-start md:self-auto">
            {/* View Switcher: Gantt | Calendar */}
            <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200">
              <button
                onClick={() => setViewMode('gantt')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                  viewMode === 'gantt' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <BarChart2 className="w-3.5 h-3.5" />
                <span>Gantt</span>
              </button>
              <button
                onClick={() => setViewMode('calendar')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                  viewMode === 'calendar' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <CalendarIcon className="w-3.5 h-3.5" />
                <span>Calendar</span>
              </button>
            </div>

            {/* Month Navigator */}
            <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-lg px-2 py-1 shadow-2xs">
              <button 
                onClick={() => showToast('Calendar Filter', 'Navigated to previous month.')}
                className="p-1 hover:bg-slate-100 rounded text-slate-500 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-xs font-semibold text-slate-800 px-2 min-w-[110px] text-center">
                {currentMonth}
              </span>
              <button 
                onClick={() => showToast('Calendar Filter', 'Navigated to next month.')}
                className="p-1 hover:bg-slate-100 rounded text-slate-500 cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* GANTT VIEW matching Reference Image 2 */}
        {viewMode === 'gantt' ? (
          <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
            <div className="overflow-x-auto">
              <div className="min-w-[840px]">
                {/* Header row: Project Title Column + Month Columns */}
                <div className="grid grid-cols-12 bg-slate-50/80 border-b border-slate-200 text-[11px] font-semibold text-slate-500 py-2.5 px-4">
                  <div className="col-span-4 uppercase tracking-wider">PROJECT</div>
                  <div className="col-span-8 grid grid-cols-7 text-center">
                    {months.map((m, i) => (
                      <div key={i} className="border-l border-slate-200/60 first:border-l-0 text-[10px] font-mono">
                        {m}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Project Rows with Gantt Bars */}
                <div className="divide-y divide-slate-100 relative">
                  {/* Today marker (Nov 17, 2026 - column 3 around 45%) */}
                  <div 
                    className="absolute top-0 bottom-0 pointer-events-none z-10 flex flex-col items-center"
                    style={{ left: 'calc(33.33% + (66.66% * (2.55 / 7)))' }}
                  >
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-4 ring-emerald-100"></div>
                    <div className="w-0.5 flex-1 bg-red-400 border-r border-dashed border-red-500 opacity-80"></div>
                    <div className="w-2.5 h-2.5 rounded-full border-2 border-red-500 bg-white"></div>
                  </div>

                  {timelineProjects.map((proj) => {
                    // Compute left % and width % in the 8-col grid
                    const colWidthPercent = 100 / 7;
                    const leftOffset = proj.startMonthIndex * colWidthPercent;
                    const barWidth = proj.durationMonths * colWidthPercent;

                    return (
                      <div 
                        key={proj.id} 
                        className="grid grid-cols-12 items-center px-4 py-3 hover:bg-slate-50/80 transition-colors group cursor-pointer"
                        onClick={() => {
                          const matchingMod = modules.find(m => m.code.includes('DEMO') || m.code.includes('0001')) || modules[0];
                          if (matchingMod) openModuleModal(matchingMod);
                        }}
                      >
                        {/* Project Info */}
                        <div className="col-span-4 pr-3 truncate">
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono text-[10px] text-slate-400 font-semibold">{proj.code}</span>
                            <span className="text-xs font-semibold text-slate-800 truncate group-hover:text-blue-600 transition-colors">
                              {proj.title}
                            </span>
                          </div>
                          <div className="text-[10px] text-slate-400 flex items-center gap-2 mt-0.5">
                            <span>Lead: {proj.lead}</span>
                            <span>•</span>
                            <span className={proj.isOverdue ? 'text-rose-600 font-semibold' : 'text-slate-500'}>
                              {proj.statusText}
                            </span>
                          </div>
                        </div>

                        {/* Gantt Bar Lane */}
                        <div className="col-span-8 relative h-7 flex items-center">
                          <div className="w-full grid grid-cols-7 h-full absolute inset-0 pointer-events-none">
                            {months.map((_, i) => (
                              <div key={i} className="border-l border-slate-100 first:border-l-0 h-full"></div>
                            ))}
                          </div>

                          {/* The Colorful Progress Bar */}
                          <div 
                            className={`h-4 rounded-full ${getBarColor(proj.color)} relative shadow-xs transition-all group-hover:brightness-95 flex items-center px-2`}
                            style={{
                              marginLeft: `${leftOffset}%`,
                              width: `${Math.min(barWidth, 100 - leftOffset)}%`,
                            }}
                          >
                            {/* Inner progress fill if partial */}
                            <span className="text-[9px] font-bold text-white drop-shadow-xs whitespace-nowrap overflow-hidden text-ellipsis">
                              {proj.progressPercent}%
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  {timelineProjects.length === 0 && (
                    <div className="py-12 text-center text-slate-400 text-xs">
                      No timeline projects or milestones scheduled (0 total).
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Bottom Legend matching Image 2 */}
            <div className="px-6 py-3 bg-slate-50/80 border-t border-slate-200 flex flex-wrap items-center gap-6 text-[11px] text-slate-600">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                <span>Progress (filled part)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rotate-45 bg-amber-500"></span>
                <span>Milestone</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full border border-red-500 bg-red-100"></span>
                <span>Today (Nov 17, 2026)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="px-1 py-0.2 text-[9px] bg-rose-100 text-rose-700 font-bold rounded">Overdue</span>
                <span>Critical SLA</span>
              </div>
            </div>
          </div>
        ) : (
          /* MONTHLY CALENDAR VIEW */
          <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
            <div className="grid grid-cols-7 bg-slate-50 border-b border-slate-200 text-center py-2 text-xs font-semibold text-slate-600">
              <span>Sun</span>
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
            </div>
            <div className="grid grid-cols-7 divide-x divide-y divide-slate-100">
              {calendarDays.map((day) => {
                const events = calendarEvents[day] || [];
                const isToday = day === 17;
                return (
                  <div key={day} className={`min-h-[90px] p-2 transition-colors hover:bg-slate-50/60 ${isToday ? 'bg-blue-50/40' : ''}`}>
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-xs font-bold ${isToday ? 'bg-blue-600 text-white w-5 h-5 rounded-full flex items-center justify-center' : 'text-slate-700'}`}>
                        {day}
                      </span>
                      {isToday && (
                        <span className="text-[9px] uppercase font-bold text-blue-600 tracking-wider">Today</span>
                      )}
                    </div>
                    <div className="space-y-1">
                      {events.map((ev, i) => (
                        <div
                          key={i}
                          onClick={() => {
                            const mod = modules[0];
                            openModuleModal(mod);
                          }}
                          className={`text-[10px] p-1 rounded font-medium truncate cursor-pointer transition-transform hover:scale-102 ${
                            ev.type === 'exam' 
                              ? 'bg-rose-100 text-rose-800 border border-rose-200' 
                              : ev.type === 'deadline' 
                                ? 'bg-amber-100 text-amber-800 border border-amber-200' 
                                : ev.type === 'session' 
                                  ? 'bg-purple-100 text-purple-800 border border-purple-200' 
                                  : 'bg-blue-100 text-blue-800 border border-blue-200'
                          }`}
                        >
                          {ev.title}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* 4 Bottom Status & Alert Summary Boxes matching Reference Image 2 */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* Box 1: Upcoming (14 days) */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-slate-800 font-bold text-xs">
            <Clock className="w-4 h-4 text-blue-600" />
            <span>Upcoming (14 days)</span>
          </div>

          <div className="space-y-2">
            {alertSummary.upcomingList.slice(0, 3).map((item, i) => (
              <div key={i} className="text-xs p-2 rounded-lg bg-slate-50 border border-slate-100 space-y-0.5">
                <div className="font-semibold text-slate-800 truncate">{item.title}</div>
                <div className="flex items-center justify-between text-[10px] text-slate-400">
                  <span>{item.date}</span>
                  <span className="bg-blue-50 text-blue-600 px-1.5 py-0.2 rounded font-medium">{item.tag}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Box 2: Overdue deadlines (2) matching Image 2 */}
        <div className="bg-rose-50/40 p-5 rounded-2xl border border-rose-200/80 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-rose-700 font-bold text-xs">
            <AlertTriangle className="w-4 h-4 text-rose-600" />
            <span>Overdue deadlines (2)</span>
          </div>

          <div className="space-y-2">
            {alertSummary.overdueList.map((item, i) => (
              <div key={i} className="text-xs p-2.5 rounded-lg bg-white border border-rose-200 space-y-1 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 truncate">{item.title}</span>
                  <span className="text-[10px] font-mono text-rose-600 font-bold whitespace-nowrap">{item.date}</span>
                </div>
                <div className="text-[10px] text-rose-700">
                  {item.impact}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Box 3: Resource conflicts matching Image 2 */}
        <div className="bg-amber-50/40 p-5 rounded-2xl border border-amber-200/80 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-amber-800 font-bold text-xs">
            <Users className="w-4 h-4 text-amber-600" />
            <span>Resource conflicts</span>
          </div>

          <div className="space-y-2">
            {alertSummary.resourceConflicts.map((res, i) => (
              <div key={i} className="text-xs p-2.5 rounded-lg bg-white border border-amber-200 space-y-1 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800">{res.title}</span>
                  <span className="text-[9px] bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded font-bold">{res.badge}</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-snug">
                  {res.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Box 4: Overlapping projects per manager matching Image 2 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-slate-800 font-bold text-xs">
            <Layers className="w-4 h-4 text-purple-600" />
            <span>Overlapping projects per manager</span>
          </div>

          <div className="space-y-2">
            {alertSummary.overlappingProjects.map((proj, i) => (
              <div key={i} className="text-xs p-2.5 rounded-lg bg-slate-50 border border-slate-100 space-y-1">
                <div className="font-bold text-slate-800">{proj.mentor}</div>
                <p className="text-[11px] text-slate-600 leading-snug">
                  {proj.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

