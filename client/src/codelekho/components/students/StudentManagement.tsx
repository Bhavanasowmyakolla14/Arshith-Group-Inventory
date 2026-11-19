import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  Download, 
  Plus, 
  MoreVertical, 
  ExternalLink, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Eye, 
  Edit3, 
  Trash2,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  Award,
  Database,
  RefreshCw,
  Key,
  ShieldCheck,
  Radio,
  FileSpreadsheet
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Student } from '../../types';
import { apiService } from '../../services/api';

export const StudentManagement: React.FC = () => {
  const { 
    students, 
    setSelectedStudentForProfile, 
    deleteStudent, 
    showToast,
    productionHealth,
    productionSyncStatus,
    productionSource,
    isStaffAuthenticated,
    staffProfile,
    setIsSyncModalOpen,
    syncLiveStudentsNow
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [trackFilter, setTrackFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [isSyncing, setIsSyncing] = useState(false);
  const itemsPerPage = 8;

  const filteredStudents = students.filter((s) => {
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.studentId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTrack = trackFilter === 'All' || s.track === trackFilter;
    const matchesStatus = statusFilter === 'All' || s.status === statusFilter;
    return matchesSearch && matchesTrack && matchesStatus;
  });

  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage) || 1;
  const paginatedStudents = filteredStudents.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleManualSync = async () => {
    setIsSyncing(true);
    await syncLiveStudentsNow();
    setIsSyncing(false);
  };

  const handleExport = async () => {
    // Try live Excel export from production API
    const excelBlob = await apiService.exportExcel();
    if (excelBlob) {
      const url = window.URL.createObjectURL(excelBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `codelekho_students_prod_${Date.now()}.xlsx`;
      a.click();
      showToast('Export Successful', `Exported real students to Excel (.xlsx) from codelekho.com API.`);
      return;
    }

    // Fallback to CSV
    const csvContent = [
      'Student ID,Name,Email,Track,Progress,Exam Status,Certificate Status,Registration Date,Account Status',
      ...filteredStudents.map(s => 
        `"${s.studentId}","${s.name}","${s.email}","${s.track}","${s.courseProgress}%","${s.examStatus}","${s.certificateStatus}","${s.registrationDate}","${s.status}"`
      )
    ].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `codelekho_students_${Date.now()}.csv`;
    a.click();
    showToast('Export Successful', `Exported ${filteredStudents.length} student records.`);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Live Production Synchronization Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white p-5 rounded-2xl border border-slate-800 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] bg-blue-500/20 text-cyan-300 px-2 py-0.5 rounded border border-blue-400/30 uppercase font-bold tracking-wider">
                PRODUCTION DATABASE
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Supabase PostgreSQL (Active)
              </span>
            </div>
            <h2 className="text-lg font-black tracking-tight text-white">
              Real CodeLekho Website Registered Students
            </h2>
            <p className="text-xs text-slate-400 max-w-2xl">
              Synchronizing verified student accounts from <code className="font-mono text-cyan-300 text-[11px] bg-slate-800 px-1 py-0.5 rounded">https://codelekho.com/api/admin/students</code>. Automated background polling every 15s.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 self-start md:self-auto">
            <button
              onClick={handleManualSync}
              disabled={isSyncing}
              className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-semibold px-3.5 py-2 rounded-xl transition-all shadow-sm cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Syncing...' : 'Sync from Live Site'}</span>
            </button>

            <button
              onClick={() => setIsSyncModalOpen(true)}
              className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold px-3.5 py-2 rounded-xl border border-slate-700 transition-colors cursor-pointer"
            >
              <Key className="w-3.5 h-3.5 text-cyan-400" />
              <span>{isStaffAuthenticated ? 'Staff Authenticated' : 'Connect Staff Token'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Controls & Search Bar */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                Students Directory ({students.length})
              </h1>
              {isStaffAuthenticated && (
                <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold px-2 py-0.5 rounded-full">
                  Live Supabase Connected
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500">
              Live registered student accounts, course enrollments, learning progress, and exam status.
            </p>
          </div>

          <div className="flex items-center gap-2.5 self-start sm:self-auto">
            <button
              onClick={handleExport}
              className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold px-3.5 py-2 rounded-lg border border-slate-200 transition-colors cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              <span>Export to Excel (.xlsx)</span>
            </button>

            <button
              onClick={() => setIsSyncModalOpen(true)}
              className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2 rounded-lg shadow-sm shadow-blue-600/30 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Register New Student</span>
            </button>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <div className="flex-1 min-w-[240px] flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs">
            <Search className="w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by student name, ID (e.g. CL-2026), or email..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="flex-1 bg-transparent outline-none text-slate-700 placeholder-slate-400"
            />
          </div>

          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs">
            {['All', 'Python', 'SQL', 'Web', 'AI'].map((track) => (
              <button
                key={track}
                onClick={() => {
                  setTrackFilter(track);
                  setCurrentPage(1);
                }}
                className={`px-3 py-1 rounded-md font-medium transition-all cursor-pointer ${
                  trackFilter === track
                    ? 'bg-white text-blue-600 font-bold shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {track === 'All' ? 'All Tracks' : track}
              </button>
            ))}
          </div>

          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-slate-700 outline-none cursor-pointer"
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="On-Track">On-Track</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Student Table or Empty State */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {filteredStudents.length === 0 ? (
          <div className="p-12 text-center space-y-4">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
              <Database className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-800">
                {students.length === 0 ? 'Live Production Database Connected' : 'No Students Match Filter'}
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                {students.length === 0
                  ? 'CodeLekho production protects /admin/students behind staff authentication. Sign in with your staff account or provide a staff token to pull live registered students from Supabase.'
                  : 'Try clearing your search query or switching track filters.'}
              </p>
            </div>
            {students.length === 0 && (
              <button
                onClick={() => setIsSyncModalOpen(true)}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer inline-flex items-center gap-2"
              >
                <Key className="w-4 h-4" />
                <span>Sign In with Staff Account / Token</span>
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50/80 text-slate-500 border-b border-slate-200 font-semibold text-[11px] uppercase tracking-wider">
                  <th className="py-3 px-4">Student ID</th>
                  <th className="py-3 px-4">Learner Name & Email</th>
                  <th className="py-3 px-4">Enrolled Course</th>
                  <th className="py-3 px-4">Course Progress</th>
                  <th className="py-3 px-4">Exam Status</th>
                  <th className="py-3 px-4">Certificate</th>
                  <th className="py-3 px-4">Registered Date</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {paginatedStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-blue-600">
                      {student.studentId}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <img src={student.avatar} alt={student.name} className="w-8 h-8 rounded-full object-cover shrink-0 border border-slate-200" />
                        <div>
                          <div className="font-bold text-slate-900">{student.name}</div>
                          <div className="text-[11px] text-slate-500 font-mono">{student.email}</div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 max-w-[180px]">
                      <span className="font-semibold text-slate-800 truncate block">
                        {student.enrolledCourses[0]}
                      </span>
                      {student.enrolledCourses.length > 1 && (
                        <span className="text-[10px] text-blue-600 font-semibold">
                          +{student.enrolledCourses.length - 1} more course(s)
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 min-w-[140px]">
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-mono font-bold text-slate-800">{student.courseProgress}%</span>
                          <span className="text-[10px] text-slate-400">{student.modulesCompleted}/{student.totalModules} mods</span>
                        </div>
                        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                          <div 
                            className="bg-blue-600 h-full rounded-full transition-all duration-300"
                            style={{ width: `${student.courseProgress}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                        student.examStatus === 'Passed'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : student.examStatus === 'Scheduled'
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : student.examStatus === 'Needs Retake'
                              ? 'bg-rose-50 text-rose-700 border border-rose-200'
                              : 'bg-slate-100 text-slate-600'
                      }`}>
                        {student.examStatus}
                        {student.examScore !== undefined && ` (${student.examScore}%)`}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      {student.certificateStatus === 'Issued' ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                          <Award className="w-3 h-3 text-amber-500" /> QR Verified
                        </span>
                      ) : student.certificateStatus === 'In Review' ? (
                        <span className="text-[11px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
                          In Review
                        </span>
                      ) : (
                        <span className="text-[11px] text-slate-400">Not Eligible</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 font-mono text-[11px] text-slate-600 whitespace-nowrap">
                      {student.registrationDate}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        student.status === 'Active'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : student.status === 'On-Track'
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'bg-slate-100 text-slate-600'
                      }`}>
                        {student.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedStudentForProfile(student)}
                          className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                          title="View Complete Profile & Transcripts"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => deleteStudent(student.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          title="Archive Student"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Bar */}
        {filteredStudents.length > 0 && (
          <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
            <div>
              Showing <span className="font-semibold text-slate-800">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
              <span className="font-semibold text-slate-800">
                {Math.min(currentPage * itemsPerPage, filteredStudents.length)}
              </span>{' '}
              of <span className="font-semibold text-slate-800">{filteredStudents.length}</span> students
            </div>

            <div className="flex items-center gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="font-medium text-slate-700">Page {currentPage} of {totalPages}</span>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
