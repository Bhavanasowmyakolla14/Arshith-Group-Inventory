import React, { useState, useEffect } from 'react';
import { 
  GraduationCap, 
  CalendarClock, 
  ShieldCheck, 
  Award, 
  CheckCircle2, 
  AlertCircle, 
  Camera, 
  Lock, 
  QrCode, 
  Plus, 
  Search, 
  ExternalLink,
  ChevronRight,
  TrendingUp,
  FileCheck
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Exam } from '../../types';

export const ExamManagement: React.FC = () => {
  const { 
    exams, 
    students, 
    certificates, 
    certificateAnalytics,
    examAttempts,
    examAnalytics,
    activeSection,
    showToast 
  } = useApp();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'proctoring' | 'results' | 'certificates'>('dashboard');
  const [selectedCert, setSelectedCert] = useState<any | null>(null);

  useEffect(() => {
    if (activeSection === 'proctoring') {
      setActiveTab('proctoring');
    } else if (activeSection === 'exam-results') {
      setActiveTab('results');
    } else if (activeSection === 'certificates') {
      setActiveTab('certificates');
    } else if (activeSection === 'scheduled-exams' || activeSection === 'exam-dashboard') {
      setActiveTab('dashboard');
    }
  }, [activeSection]);

  const certifiedStudents = students.filter(s => s.certificateStatus === 'Issued');

  const proctorLogs: { id: string; student: string; exam: string; flag: string; time: string; status: string }[] = [];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-[10px] font-mono tracking-wider text-blue-600 uppercase font-semibold">
              CODELEKHO ASSESSMENT SYSTEM
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Exam Management & Proctoring Command Center
            </h1>
            <p className="text-xs text-slate-500">
              Administer proctored final assessments (70% passing benchmark) and issue QR-verified certificates.
            </p>
          </div>

          <button
            onClick={() => showToast('Schedule Exam', 'Opened exam scheduling wizard.')}
            className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2 rounded-lg shadow-sm shadow-blue-600/30 transition-all cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Schedule New Exam</span>
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs font-medium max-w-xl">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex-1 py-1.5 px-3 rounded-md text-center transition-all cursor-pointer ${
              activeTab === 'dashboard' ? 'bg-white text-blue-600 font-bold shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Scheduled Exams
          </button>
          <button
            onClick={() => setActiveTab('proctoring')}
            className={`flex-1 py-1.5 px-3 rounded-md text-center transition-all cursor-pointer ${
              activeTab === 'proctoring' ? 'bg-white text-blue-600 font-bold shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Live Proctoring Hub
          </button>
          <button
            onClick={() => setActiveTab('results')}
            className={`flex-1 py-1.5 px-3 rounded-md text-center transition-all cursor-pointer ${
              activeTab === 'results' ? 'bg-white text-blue-600 font-bold shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Assessment Results
          </button>
          <button
            onClick={() => setActiveTab('certificates')}
            className={`flex-1 py-1.5 px-3 rounded-md text-center transition-all cursor-pointer ${
              activeTab === 'certificates' ? 'bg-white text-blue-600 font-bold shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Certificates ({certificates.length})
          </button>
        </div>
      </div>

      {/* TAB 1: SCHEDULED EXAMS */}
      {activeTab === 'dashboard' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {exams.map((exam) => (
            <div key={exam.id} className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded">
                    {exam.code}
                  </span>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                    exam.status === 'Live Proctoring' 
                      ? 'bg-rose-50 text-rose-700 border border-rose-200 animate-pulse' 
                      : exam.status === 'Completed'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                  }`}>
                    {exam.status}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-800 leading-snug">
                  {exam.title}
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  {exam.courseTitle}
                </p>
              </div>

              <div className="space-y-2 pt-3 border-t border-slate-100 text-xs text-slate-600">
                <div className="flex items-center justify-between">
                  <span>Batch Cohort:</span>
                  <span className="font-semibold text-slate-800">{exam.batch}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Schedule:</span>
                  <span className="font-mono text-[11px] text-slate-700">{exam.scheduledDate}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Pass Threshold:</span>
                  <span className="font-bold text-emerald-600">{exam.passThresholdPercent}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Candidates Enrolled:</span>
                  <span className="font-semibold text-slate-800">{exam.enrolledCount} learners</span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => showToast('Exam Session', `Connecting to proctor tunnel for ${exam.code}...`)}
                  className="w-full py-2 bg-slate-900 hover:bg-blue-600 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer text-center"
                >
                  Inspect Proctor Chamber
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 2: LIVE PROCTORING HUB */}
      {activeTab === 'proctoring' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-rose-50 text-rose-600">
                  <Camera className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                    REAL-TIME PROCTORING TELEMETRY & ANTI-CHEAT LOGS
                  </h3>
                  <p className="text-[11px] text-slate-500">Continuous AI gaze detection and dual-monitor lock</p>
                </div>
              </div>
              <span className="text-[10px] bg-rose-50 text-rose-700 border border-rose-200 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping"></span>
                Live Audit Active
              </span>
            </div>

            <div className="divide-y divide-slate-100">
              {proctorLogs.map((log) => (
                <div key={log.id} className="py-3 flex items-center justify-between text-xs">
                  <div className="space-y-0.5">
                    <div className="font-semibold text-slate-800">{log.student}</div>
                    <div className="text-[11px] text-slate-500">{log.exam}</div>
                    <div className="text-[10px] font-mono text-slate-400">{log.time}</div>
                  </div>

                  <div className="text-right space-y-1">
                    <span className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      log.status === 'Clean'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : log.status === 'Warning'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200 font-bold'
                    }`}>
                      {log.status}
                    </span>
                    <div className="text-[11px] text-slate-600 font-medium">{log.flag}</div>
                  </div>
                </div>
              ))}
              {proctorLogs.length === 0 && (
                <div className="py-8 text-center text-slate-400 text-xs">
                  No active proctoring sessions or flags recorded (0 total).
                </div>
              )}
            </div>
          </div>

          {/* Proctor Rules & Controls */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              PROCTOR ENFORCEMENT POLICY
            </h3>

            <div className="space-y-3 text-xs text-slate-600">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70 space-y-1">
                <div className="font-bold text-slate-800">Passing Grade: 70.0%</div>
                <p className="text-[11px] text-slate-500">CodeLekho criteria mandates minimum 70% proctored score to issue QR certification.</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70 space-y-1">
                <div className="font-bold text-slate-800">Biometric Facial Verification</div>
                <p className="text-[11px] text-slate-500">Candidate webcam identity verified against enrollment photograph every 3 minutes.</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70 space-y-1">
                <div className="font-bold text-slate-800">Secure Browser Sandbox</div>
                <p className="text-[11px] text-slate-500">Clipboard, DevTools, and application switches trigger immediate flags.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: ASSESSMENT RESULTS */}
      {activeTab === 'results' && (
        <div className="space-y-6">
          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 bg-white rounded-xl border border-slate-200/80 shadow-2xs">
              <span className="text-[10px] uppercase font-bold text-slate-400">Total Attempts</span>
              <div className="text-xl font-bold text-slate-900 mt-1">{examAnalytics.totalAttempts}</div>
              <span className="text-[10px] text-slate-500">45-min proctored sessions</span>
            </div>
            <div className="p-4 bg-white rounded-xl border border-slate-200/80 shadow-2xs">
              <span className="text-[10px] uppercase font-bold text-slate-400">Pass Percentage</span>
              <div className="text-xl font-bold text-emerald-600 mt-1">{examAnalytics.passPercentage}%</div>
              <span className="text-[10px] text-emerald-600">≥ 70% threshold benchmark</span>
            </div>
            <div className="p-4 bg-white rounded-xl border border-slate-200/80 shadow-2xs">
              <span className="text-[10px] uppercase font-bold text-slate-400">Average Score</span>
              <div className="text-xl font-bold text-blue-600 mt-1">{examAnalytics.avgScore}%</div>
              <span className="text-[10px] text-slate-500">Across 4 free tracks</span>
            </div>
            <div className="p-4 bg-white rounded-xl border border-slate-200/80 shadow-2xs">
              <span className="text-[10px] uppercase font-bold text-slate-400">Failure / Retake</span>
              <div className="text-xl font-bold text-rose-600 mt-1">{examAnalytics.failurePercentage}%</div>
              <span className="text-[10px] text-rose-600">{examAnalytics.failedCount} students eligible for retake</span>
            </div>
          </div>

          {/* Attempts Table */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  CANDIDATE 45-MINUTE ASSESSMENT ATTEMPTS
                </h3>
                <p className="text-[11px] text-slate-500">Recorded scores, AI proctor audit logs, and pass/fail evaluations</p>
              </div>
              <span className="text-xs text-blue-600 font-semibold">{examAttempts.length} Total Submissions</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50/80 text-slate-500 text-[10px] uppercase tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">Student Name</th>
                    <th className="py-2.5 px-3">Exam Code</th>
                    <th className="py-2.5 px-3">Duration</th>
                    <th className="py-2.5 px-3 text-center">Score</th>
                    <th className="py-2.5 px-3">Proctor Audit</th>
                    <th className="py-2.5 px-3 text-center">Status</th>
                    <th className="py-2.5 px-3">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {examAttempts.map((attempt) => (
                    <tr key={attempt.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3 px-3 font-semibold text-slate-800">
                        {attempt.studentName}
                        <span className="block text-[10px] font-mono text-slate-400">{attempt.studentId}</span>
                      </td>
                      <td className="py-3 px-3 font-mono text-slate-600">{attempt.examCode}</td>
                      <td className="py-3 px-3 font-medium text-slate-600">{attempt.durationMinutes} mins</td>
                      <td className="py-3 px-3 text-center">
                        <span className={`font-mono font-bold ${attempt.passed ? 'text-emerald-600' : 'text-rose-600'}`}>
                          {attempt.scorePercent}%
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <span className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                          attempt.proctorAudit === 'Clean'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}>
                          {attempt.proctorAudit} ({attempt.violationsFlagged} flags)
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          attempt.passed
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}>
                          {attempt.passed ? 'PASSED (≥70%)' : 'FAILED (<70%)'}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-slate-500 font-mono text-[11px]">{attempt.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: CERTIFICATES */}
      {activeTab === 'certificates' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                VERIFIED CERTIFICATE REPOSITORY & QR VERIFICATION
              </h3>
              <p className="text-[11px] text-slate-500">Tamper-proof verifiable credentials with unique QR Code identification</p>
            </div>
            <span className="text-xs text-emerald-600 font-bold bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
              {certificates.length} Total Certificates Issued
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {certificates.map((cert) => (
              <div key={cert.id} className="p-5 rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                    {cert.certificateId}
                  </span>
                  <Award className="w-5 h-5 text-amber-500" />
                </div>

                <div>
                  <h4 className="text-sm font-bold text-slate-800">{cert.studentName}</h4>
                  <p className="text-xs text-slate-500">{cert.track}</p>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-100/70 border border-slate-200/60 flex items-center justify-between text-xs font-mono">
                  <span>Proctor Score:</span>
                  <span className="font-bold text-emerald-600">{cert.finalScore}%</span>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono">
                  <span>Status:</span>
                  <span className={`font-semibold ${cert.status === 'Verified' ? 'text-emerald-600' : 'text-blue-600'}`}>
                    {cert.status}
                  </span>
                </div>

                <div className="pt-2 flex items-center gap-2">
                  <button
                    onClick={() => showToast('QR Credential Link', `Tamper-proof verification URL: https://codelekho.com/verify/${cert.qrVerificationHash.slice(0, 8)}...`)}
                    className="flex-1 py-1.5 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors cursor-pointer text-center"
                  >
                    View QR Certificate
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

