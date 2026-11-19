import React, { useState } from 'react';
import { X, BookOpen, Layers, Check } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Course } from '../../types';

export const CourseModal: React.FC = () => {
  const { isAddCourseModalOpen, setIsAddCourseModalOpen, addCourse } = useApp();

  const [title, setTitle] = useState('');
  const [code, setCode] = useState('');
  const [category, setCategory] = useState<Course['category']>('Python Programming');
  const [track, setTrack] = useState<Course['track']>('Python');
  const [description, setDescription] = useState('');
  const [instructor, setInstructor] = useState('Arshith Sharma');
  const [durationWeeks, setDurationWeeks] = useState(12);
  const [difficulty, setDifficulty] = useState<Course['difficulty']>('Medium');
  const [budgetLakhs, setBudgetLakhs] = useState(6.5);
  const [thumbnail, setThumbnail] = useState('https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=60');

  if (!isAddCourseModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addCourse({
      title: title.trim(),
      code: code.trim() || `TRACK-${Math.floor(100 + Math.random() * 900)}`,
      category,
      track,
      description: description.trim() || 'Comprehensive course track with hands-on practice problems.',
      instructor,
      durationWeeks,
      difficulty,
      isFree: true,
      operationalCostPerStudent: 350,
      thumbnail
    });

    setIsAddCourseModalOpen(false);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value as Course['category'];
    setCategory(val);
    if (val.includes('Python')) setTrack('Python');
    else if (val.includes('SQL')) setTrack('SQL');
    else if (val.includes('Web')) setTrack('Web');
    else setTrack('AI');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div 
        className="w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-blue-600 text-white">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-800">Add New Learning Track</h2>
              <p className="text-[11px] text-slate-500">Configure new curriculum syllabus and batch schedule</p>
            </div>
          </div>
          <button 
            onClick={() => setIsAddCourseModalOpen(false)}
            className="text-slate-400 hover:text-slate-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Course Track Title</label>
            <input
              type="text"
              required
              placeholder="e.g. FastAPI & Async Microservices Architecture"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Course Code</label>
              <input
                type="text"
                placeholder="e.g. PYTHON-FAST-201"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-200 font-mono uppercase focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Category</label>
              <select
                value={category}
                onChange={handleCategoryChange}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-blue-500 bg-white"
              >
                <option value="Python Programming">Python Programming</option>
                <option value="SQL & Databases">SQL & Databases</option>
                <option value="Web Development">Web Development</option>
                <option value="AI with Data Science">AI with Data Science</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Description</label>
            <textarea
              rows={3}
              placeholder="High level overview of what students will build and master..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Lead Instructor</label>
              <input
                type="text"
                value={instructor}
                onChange={(e) => setInstructor(e.target.value)}
                className="w-full text-xs p-2 rounded-lg border border-slate-200"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Duration (Weeks)</label>
              <input
                type="number"
                min="4"
                max="32"
                value={durationWeeks}
                onChange={(e) => setDurationWeeks(Number(e.target.value))}
                className="w-full text-xs p-2 rounded-lg border border-slate-200"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Difficulty</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as any)}
                className="w-full text-xs p-2 rounded-lg border border-slate-200 bg-white"
              >
                <option value="Beginner">Beginner</option>
                <option value="Medium">Medium</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Cover Thumbnail URL</label>
            <input
              type="text"
              value={thumbnail}
              onChange={(e) => setThumbnail(e.target.value)}
              className="w-full text-xs p-2 rounded-lg border border-slate-200 font-mono text-slate-500"
            />
          </div>

          <div className="pt-4 flex items-center justify-end gap-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsAddCourseModalOpen(false)}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm cursor-pointer"
            >
              Create Track
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

