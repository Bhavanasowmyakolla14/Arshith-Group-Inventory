import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  BookOpen, 
  Users, 
  Clock, 
  CheckCircle, 
  Edit3, 
  Trash2, 
  ExternalLink,
  ChevronRight,
  TrendingUp,
  FolderGit2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Course } from '../../types';

export const CourseManagement: React.FC = () => {
  const { 
    courses, 
    setSelectedCourseId, 
    setActiveSection, 
    setIsAddCourseModalOpen, 
    deleteCourse,
    filterTrack,
    setFilterTrack 
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const filteredCourses = courses.filter((course) => {
    const title = course.title || '';
    const code = course.code || course.id || '';
    const inst = typeof course.instructor === 'object' && course.instructor !== null
      ? (course.instructor as any).name || ''
      : (typeof course.instructor === 'string' ? course.instructor : '');

    const q = searchQuery.toLowerCase();
    const matchesSearch = title.toLowerCase().includes(q) ||
                          code.toLowerCase().includes(q) ||
                          inst.toLowerCase().includes(q);
    const matchesTrack = filterTrack === 'All' || course.track === filterTrack;
    const matchesStatus = statusFilter === 'All' || course.status === statusFilter;
    return matchesSearch && matchesTrack && matchesStatus;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header & Controls */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Course & Curriculum Management
            </h1>
            <p className="text-xs text-slate-500">
              Manage learning tracks, syllabi, batch enrollments, and academic performance.
            </p>
          </div>

          <button
            onClick={() => setIsAddCourseModalOpen(true)}
            className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2 rounded-lg shadow-sm shadow-blue-600/30 transition-all cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Course</span>
          </button>
        </div>

        {/* Filter Controls Row */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          {/* Search Box */}
          <div className="flex-1 min-w-[240px] flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs">
            <Search className="w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by title, course code, instructor..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent outline-none text-slate-700 placeholder-slate-400"
            />
          </div>

          {/* Track Filter */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs">
            {['All', 'Python', 'SQL', 'Web', 'AI'].map((track) => (
              <button
                key={track}
                onClick={() => setFilterTrack(track)}
                className={`px-3 py-1 rounded-md font-medium transition-all cursor-pointer ${
                  filterTrack === track
                    ? 'bg-white text-blue-600 font-bold shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {track === 'All' ? 'All Tracks' : track}
              </button>
            ))}
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-slate-700 outline-none cursor-pointer"
          >
            <option value="All">All Statuses</option>
            <option value="In Progress">In Progress</option>
            <option value="Upcoming">Upcoming</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
      </div>

      {/* Course Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredCourses.map((course) => (
          <div 
            key={course.id}
            className="bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col group"
          >
            {/* Thumbnail Header with Status Tag */}
            <div className="relative h-44 overflow-hidden bg-slate-100">
              <img 
                src={course.thumbnail} 
                alt={course.title} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent"></div>
              
              <div className="absolute top-3 left-3 flex items-center gap-2">
                <span className="font-mono text-[10px] font-bold bg-slate-900/80 backdrop-blur-xs text-white px-2 py-0.5 rounded border border-white/20">
                  {course.code}
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  course.status === 'Completed'
                    ? 'bg-emerald-500 text-white'
                    : course.status === 'In Progress'
                      ? 'bg-blue-600 text-white'
                      : 'bg-amber-500 text-white'
                }`}>
                  {course.status}
                </span>
              </div>

              <div className="absolute bottom-3 left-3 right-3 text-white">
                <span className="text-[10px] font-semibold tracking-wider uppercase text-cyan-300 block">
                  {course.category}
                </span>
                <h3 className="text-sm font-bold truncate leading-tight">
                  {course.title}
                </h3>
              </div>
            </div>

            {/* Course Card Body */}
            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                {course.description}
              </p>

              {/* Metrics Row: Modules, Students, Progress */}
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-1.5 text-slate-600">
                    <FolderGit2 className="w-3.5 h-3.5 text-slate-400" />
                    <span>{course.modulesCount} Modules</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-600">
                    <Users className="w-3.5 h-3.5 text-slate-400" />
                    <span>{course.enrolledStudentsCount} Learners</span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px] font-medium text-slate-500">
                    <span>Batch Completion Rate</span>
                    <span className="font-bold text-blue-600 font-mono">{course.completionPercent}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-blue-600 h-full rounded-full transition-all duration-300"
                      style={{ width: `${course.completionPercent}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Card Footer Buttons */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <div className="text-[11px] text-slate-500 truncate max-w-[150px]">
                  {typeof course.instructor === 'object' && course.instructor !== null
                    ? (course.instructor as any).name
                    : (course.instructor || 'Lead Educator')}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => deleteCourse(course.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                    title="Archive Course"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => {
                      setSelectedCourseId(course.id);
                      setActiveSection('course-detail');
                    }}
                    className="flex items-center gap-1 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                  >
                    <span>View Details</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredCourses.length === 0 && (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-700">No courses match the current filter</h3>
          <p className="text-xs text-slate-400 mt-1">Try resetting the track or search query.</p>
        </div>
      )}
    </div>
  );
};

