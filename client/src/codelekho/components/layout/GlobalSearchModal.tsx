import React, { useState } from 'react';
import { Search, X, BookOpen, Users, FolderGit2, GraduationCap, ChevronRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const GlobalSearchModal: React.FC = () => {
  const { 
    globalSearchOpen, 
    setGlobalSearchOpen, 
    courses, 
    modules, 
    students, 
    exams,
    setSelectedCourseId,
    setActiveSection,
    openModuleModal,
    setSelectedStudentForProfile
  } = useApp();

  const [query, setQuery] = useState('');

  if (!globalSearchOpen) return null;

  const filteredCourses = courses.filter(c => 
    c.title.toLowerCase().includes(query.toLowerCase()) || 
    c.code.toLowerCase().includes(query.toLowerCase())
  );

  const filteredModules = modules.filter(m => 
    m.title.toLowerCase().includes(query.toLowerCase()) || 
    m.code.toLowerCase().includes(query.toLowerCase())
  );

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(query.toLowerCase()) || 
    s.studentId.toLowerCase().includes(query.toLowerCase()) ||
    s.email.toLowerCase().includes(query.toLowerCase())
  );

  const filteredExams = exams.filter(e => 
    e.title.toLowerCase().includes(query.toLowerCase()) || 
    e.code.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div 
        className="w-full max-w-2xl bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-200">
          <Search className="w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search projects, tracks, students, modules, proctored exams..."
            className="flex-1 text-sm text-slate-800 placeholder-slate-400 outline-none bg-transparent"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
          <kbd className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded border border-slate-200">
            ESC
          </kbd>
          <button 
            onClick={() => setGlobalSearchOpen(false)}
            className="text-slate-400 hover:text-slate-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Results list */}
        <div className="flex-1 overflow-y-auto p-3 space-y-4">
          {/* Courses */}
          {filteredCourses.length > 0 && (
            <div>
              <div className="text-[11px] font-semibold text-slate-400 px-2 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5" /> Courses & Tracks ({filteredCourses.length})
              </div>
              <div className="space-y-1">
                {filteredCourses.map(course => (
                  <div
                    key={course.id}
                    onClick={() => {
                      setSelectedCourseId(course.id);
                      setActiveSection('course-detail');
                      setGlobalSearchOpen(false);
                    }}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-blue-50/70 cursor-pointer group transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono text-[11px] text-blue-600 font-semibold bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
                        {course.code}
                      </span>
                      <span className="text-xs font-medium text-slate-800 group-hover:text-blue-700">
                        {course.title}
                      </span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-blue-500" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Modules */}
          {filteredModules.length > 0 && (
            <div>
              <div className="text-[11px] font-semibold text-slate-400 px-2 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <FolderGit2 className="w-3.5 h-3.5" /> Modules & Tasks ({filteredModules.length})
              </div>
              <div className="space-y-1">
                {filteredModules.map(module => (
                  <div
                    key={module.id}
                    onClick={() => {
                      openModuleModal(module);
                      setGlobalSearchOpen(false);
                    }}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 cursor-pointer group transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono text-[11px] text-purple-600 font-semibold bg-purple-50 px-1.5 py-0.5 rounded border border-purple-200">
                        {module.code}
                      </span>
                      <span className="text-xs font-medium text-slate-800">
                        {module.title}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        by {module.assignedStudent}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                      {module.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Students */}
          {filteredStudents.length > 0 && (
            <div>
              <div className="text-[11px] font-semibold text-slate-400 px-2 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5" /> Students & Learners ({filteredStudents.length})
              </div>
              <div className="space-y-1">
                {filteredStudents.map(student => (
                  <div
                    key={student.id}
                    onClick={() => {
                      setSelectedStudentForProfile(student);
                      setGlobalSearchOpen(false);
                    }}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 cursor-pointer group transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <img src={student.avatar} alt={student.name} className="w-6 h-6 rounded-full object-cover" />
                      <div>
                        <span className="text-xs font-medium text-slate-800 mr-2">{student.name}</span>
                        <span className="text-[10px] font-mono text-slate-400">{student.studentId}</span>
                      </div>
                    </div>
                    <span className="text-[11px] text-slate-500">{student.email}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Exams */}
          {filteredExams.length > 0 && (
            <div>
              <div className="text-[11px] font-semibold text-slate-400 px-2 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5" /> Exams & Assessments ({filteredExams.length})
              </div>
              <div className="space-y-1">
                {filteredExams.map(exam => (
                  <div
                    key={exam.id}
                    onClick={() => {
                      setActiveSection('exam-dashboard');
                      setGlobalSearchOpen(false);
                    }}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 cursor-pointer group transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono text-[11px] text-amber-600 font-semibold bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                        {exam.code}
                      </span>
                      <span className="text-xs font-medium text-slate-800">
                        {exam.title}
                      </span>
                    </div>
                    <span className="text-[10px] text-blue-600 font-medium">
                      {exam.scheduledDate}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {filteredCourses.length === 0 && filteredModules.length === 0 && filteredStudents.length === 0 && (
            <div className="text-center py-8 text-xs text-slate-400">
              No matching records found for "{query}". Try searching for Python, Web, SQL, Kiran, or 0001.
            </div>
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2 bg-slate-50 border-t border-slate-200 text-[11px] text-slate-500 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span>Navigate: <kbd className="font-mono bg-white px-1 border rounded">↑</kbd> <kbd className="font-mono bg-white px-1 border rounded">↓</kbd></span>
            <span>Select: <kbd className="font-mono bg-white px-1 border rounded">↵</kbd></span>
          </div>
          <span>CodeLekho LMS v2.6.0</span>
        </div>
      </div>
    </div>
  );
};

