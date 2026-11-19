import React, { useState } from 'react';
import { 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend 
} from 'recharts';
import { TrendingUp, Activity, PieChart as PieIcon, Layers } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AnalyticsCharts: React.FC = () => {
  const { studentAnalytics, learningAnalytics, courses, practiceProblemsSummary } = useApp();
  const [timeRange, setTimeRange] = useState<'6M' | '1Y'>('6M');

  const studentGrowthData = [
    { month: 'Jun', students: 0, enrolled: 0, certified: 0 },
    { month: 'Jul', students: 0, enrolled: 0, certified: 0 },
    { month: 'Aug', students: 0, enrolled: 0, certified: 0 },
    { month: 'Sep', students: 0, enrolled: 0, certified: 0 },
    { month: 'Oct', students: 0, enrolled: 0, certified: 0 },
    { month: 'Nov', students: studentAnalytics.totalRegistrations, enrolled: learningAnalytics.totalEnrollments, certified: 0 },
  ];

  const totalEnroll = learningAnalytics.totalEnrollments || 1;
  const trackDistribution = [
    { name: 'Python Track', count: learningAnalytics.courseEnrollments['Python'] || 0, color: '#3b82f6' },
    { name: 'Web Development', count: learningAnalytics.courseEnrollments['Web Development'] || 0, color: '#10b981' },
    { name: 'SQL & Databases', count: learningAnalytics.courseEnrollments['SQL & Databases'] || 0, color: '#f59e0b' },
    { name: 'AI & Data Science', count: learningAnalytics.courseEnrollments['AI & Data Science'] || 0, color: '#8b5cf6' },
  ].map(t => ({
    ...t,
    value: learningAnalytics.totalEnrollments > 0 ? Math.round((t.count / totalEnroll) * 100) : 0
  }));

  const weeklyActivityData = [
    { day: 'Mon', quizSubmissions: 0, codeCommits: 0, problemSubmissions: 0 },
    { day: 'Tue', quizSubmissions: 0, codeCommits: 0, problemSubmissions: 0 },
    { day: 'Wed', quizSubmissions: 0, codeCommits: 0, problemSubmissions: 0 },
    { day: 'Thu', quizSubmissions: 0, codeCommits: 0, problemSubmissions: 0 },
    { day: 'Fri', quizSubmissions: 0, codeCommits: 0, problemSubmissions: 0 },
    { day: 'Sat', quizSubmissions: 0, codeCommits: 0, problemSubmissions: 0 },
    { day: 'Sun', quizSubmissions: 0, codeCommits: 0, problemSubmissions: 0 },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Student Growth & Certification Area Chart (2 cols) */}
      <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                STUDENT ENROLLMENT & CERTIFICATION TRAJECTORY
              </h3>
              <p className="text-[11px] text-slate-500">
                Monthly active learners and proctored alumni graduation
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-[11px] self-start sm:self-auto">
            <button
              onClick={() => setTimeRange('6M')}
              className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                timeRange === '6M' ? 'bg-white text-blue-600 shadow-2xs font-semibold' : 'text-slate-600'
              }`}
            >
              Last 6 Months
            </button>
            <button
              onClick={() => setTimeRange('1Y')}
              className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                timeRange === '1Y' ? 'bg-white text-blue-600 shadow-2xs font-semibold' : 'text-slate-600'
              }`}
            >
              Academic Year
            </button>
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={studentGrowthData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorStudents" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorCertified" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.25}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#0f172a', 
                  borderRadius: '8px', 
                  border: 'none', 
                  color: '#fff', 
                  fontSize: '12px' 
                }} 
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              <Area type="monotone" dataKey="students" name="Registered Students" stroke="#2563eb" strokeWidth={2} fillOpacity={1} fill="url(#colorStudents)" />
              <Area type="monotone" dataKey="certified" name="QR-Certified Alumni" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorCertified)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Track Distribution & Enrollment breakdown (1 col) */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
            <PieIcon className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              TRACK ENROLLMENT SPLIT
            </h3>
            <p className="text-[11px] text-slate-500 font-mono">
              {learningAnalytics.totalEnrollments} Total Track Enrollments
            </p>
          </div>
        </div>

        <div className="space-y-3.5 pt-1">
          {trackDistribution.map((track, i) => (
            <div key={i} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700">{track.name}</span>
                <span className="text-slate-500 font-mono text-[11px]">{track.count} learners ({track.value}%)</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div 
                  className="h-full rounded-full transition-all duration-500" 
                  style={{ width: `${track.value}%`, backgroundColor: track.color }}
                ></div>
              </div>
            </div>
          ))}
        </div>

        <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-100 mt-4 text-[11px] text-blue-900 flex items-start gap-2">
          <Layers className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
          <span>
            Python & Full Stack tracks represent over <strong>65%</strong> of active student enrollments.
          </span>
        </div>
      </div>

      {/* Weekly Activity Chart (Full width) */}
      <div className="lg:col-span-3 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                WEEKLY LEARNING VELOCITY & BROWSER CODING RUNS
              </h3>
              <p className="text-[11px] text-slate-500">
                Module quizzes, client-side compiler code runs, and {practiceProblemsSummary.totalCount} interview problem submissions
              </p>
            </div>
          </div>
          <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono">
            Mon - Sun Analysis
          </span>
        </div>

        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weeklyActivityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#0f172a', 
                  borderRadius: '8px', 
                  border: 'none', 
                  color: '#fff', 
                  fontSize: '12px' 
                }} 
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              <Bar dataKey="problemSubmissions" name="Interview Problems Practiced" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="quizSubmissions" name="Module Quizzes" fill="#10b981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="codeCommits" name="Browser Compiler Runs" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
