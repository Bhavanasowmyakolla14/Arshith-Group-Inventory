import React from 'react';
import { 
  Users, 
  Award, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  ChevronRight, 
  ArrowUpRight,
  ShieldCheck,
  Star
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const RecentActivityTables: React.FC = () => {
  const { 
    students, 
    courses, 
    examAttempts, 
    setActiveSection, 
    setSelectedStudentForProfile, 
    setSelectedCourseId 
  } = useApp();

  const recentStudents = students.slice(0, 5);
  const topStudents = [...students].sort((a, b) => (b.courseProgress + (b.examScore || 0)) - (a.courseProgress + (a.examScore || 0))).slice(0, 4);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Table 1: Recent Student Registrations from Database */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                RECENT STUDENT REGISTRATIONS
              </h3>
              <p className="text-[11px] text-slate-500">Live enrollments synced via CodeLekho database</p>
            </div>
          </div>
          <button
            onClick={() => setActiveSection('students')}
            className="text-xs text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1 cursor-pointer"
          >
            All Students <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="text-slate-400 border-b border-slate-100 font-semibold text-[11px]">
                <th className="pb-2 font-medium">STUDENT</th>
                <th className="pb-2 font-medium">COURSE TRACK</th>
                <th className="pb-2 font-medium">REGISTERED</th>
                <th className="pb-2 font-medium text-right">STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentStudents.map((st) => (
                <tr key={st.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-2.5">
                    <div className="font-semibold text-slate-800">{st.name}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{st.email}</div>
                  </td>
                  <td className="py-2.5 font-medium text-slate-700 truncate max-w-[150px]">
                    {st.enrolledCourses[0] || 'Python Track'}
                  </td>
                  <td className="py-2.5 text-slate-400 text-[11px] font-mono">{st.registrationDate}</td>
                  <td className="py-2.5 text-right">
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full">
                      <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                      {st.status}
                    </span>
                  </td>
                </tr>
              ))}
              {recentStudents.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-slate-400 text-xs">
                    No student registrations found in database (0 total).
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Table 2: 45-Min Proctored Exam Submissions */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-amber-50 text-amber-600">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                45-MIN PROCTORED EXAM ATTEMPTS
              </h3>
              <p className="text-[11px] text-slate-500">Benchmark: 70% passing threshold with biometric anti-cheat</p>
            </div>
          </div>
          <button
            onClick={() => setActiveSection('exam-dashboard')}
            className="text-xs text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1 cursor-pointer"
          >
            Exam Audit <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="text-slate-400 border-b border-slate-100 font-semibold text-[11px]">
                <th className="pb-2 font-medium">LEARNER</th>
                <th className="pb-2 font-medium">ASSESSMENT</th>
                <th className="pb-2 font-medium text-center">SCORE</th>
                <th className="pb-2 font-medium text-right">PROCTOR AUDIT</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {examAttempts.map((attempt) => {
                const isPass = attempt.scorePercent >= 70;
                return (
                  <tr key={attempt.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-2.5 font-semibold text-slate-800">{attempt.studentName}</td>
                    <td className="py-2.5 text-slate-600 truncate max-w-[140px]">{attempt.examCode}</td>
                    <td className="py-2.5 text-center">
                      <span className={`font-mono font-bold text-xs ${isPass ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {attempt.scorePercent}%
                      </span>
                    </td>
                    <td className="py-2.5 text-right">
                      <span className={`inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full ${
                        attempt.proctorAudit === 'Clean' 
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                          : 'bg-rose-50 text-rose-700 border border-rose-200 font-semibold'
                      }`}>
                        {attempt.proctorAudit === 'Clean' ? '100% Verified' : 'Flagged Window Switch'}
                      </span>
                    </td>
                  </tr>
                );
              })}
              {examAttempts.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-slate-400 text-xs">
                    No proctored exam attempts recorded yet (0 total).
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Table 3: Top Performing Students */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-purple-50 text-purple-600">
              <Star className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                TOP PERFORMING STUDENTS
              </h3>
              <p className="text-[11px] text-slate-500">Highest aggregate curriculum & assessment ranking</p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {topStudents.map((st, idx) => (
            <div 
              key={st.id}
              onClick={() => setSelectedStudentForProfile(st)}
              className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/70 transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-slate-800 text-white text-[11px] font-bold flex items-center justify-center shrink-0">
                  #{idx + 1}
                </div>
                <img src={st.avatar} alt={st.name} className="w-8 h-8 rounded-full object-cover" />
                <div>
                  <div className="font-semibold text-xs text-slate-800 group-hover:text-blue-600 transition-colors">
                    {st.name}
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">
                    {st.studentId} • {st.track} Track
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-xs font-bold text-slate-900 font-mono">
                  {st.courseProgress}% progress
                </div>
                <div className="text-[10px] text-emerald-600 font-medium">
                  Exam: {st.examScore ? `${st.examScore}% (Passed)` : 'Scheduled'}
                </div>
              </div>
            </div>
          ))}
          {topStudents.length === 0 && (
            <div className="py-8 text-center text-slate-400 text-xs">
              No student performance rankings recorded yet (0 total).
            </div>
          )}
        </div>
      </div>

      {/* Table 4: 4 Career Tracks Overview */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                CAREER TRACKS PERFORMANCE OVERVIEW
              </h3>
              <p className="text-[11px] text-slate-500">100% Free technical curricula cohorts</p>
            </div>
          </div>
          <button
            onClick={() => setActiveSection('courses')}
            className="text-xs text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1 cursor-pointer"
          >
            All Tracks <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-3.5">
          {courses.map((c) => (
            <div 
              key={c.id} 
              onClick={() => {
                setSelectedCourseId(c.id);
                setActiveSection('course-detail');
              }}
              className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/70 transition-all cursor-pointer group space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 group-hover:text-blue-600 transition-colors truncate max-w-[220px]">
                  {c.title}
                </span>
                <span className="text-xs font-mono font-bold text-blue-600">
                  {c.completionPercent}%
                </span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-blue-600 h-full rounded-full transition-all duration-300"
                  style={{ width: `${c.completionPercent}%` }}
                ></div>
              </div>
              <div className="flex items-center justify-between text-[10px] text-slate-500">
                <span>{c.enrolledStudentsCount} Free Enrollments</span>
                <span>Quiz Avg: {c.avgQuizScore}%</span>
              </div>
            </div>
          ))}
          {courses.length === 0 && (
            <div className="py-8 text-center text-slate-400 text-xs">
              No active courses in catalog (0 total).
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
