import React, { useState, useEffect } from 'react';
import { 
  X, 
  Send, 
  Paperclip, 
  Clock, 
  Calendar, 
  Check, 
  AlertTriangle, 
  User, 
  UploadCloud, 
  FileText,
  Sliders,
  Sparkles
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { LearningModule, ModuleStatus } from '../../types';

export const ModuleDetailModal: React.FC = () => {
  const { activeModuleModal, closeModuleModal, updateModule, showToast } = useApp();

  const [currentStatus, setCurrentStatus] = useState<ModuleStatus>('Completed');
  const [currentProgress, setCurrentProgress] = useState<number>(100);
  const [noteText, setNoteText] = useState<string>('');
  const [newComment, setNewComment] = useState<string>('');
  const [logHours, setLogHours] = useState<string>('2');
  const [logDate, setLogDate] = useState<string>('17/11/2026');

  useEffect(() => {
    if (activeModuleModal) {
      setCurrentStatus(activeModuleModal.status);
      setCurrentProgress(activeModuleModal.progressPercent);
      setNoteText(activeModuleModal.notes || '');
    }
  }, [activeModuleModal]);

  if (!activeModuleModal) return null;

  const statuses: ModuleStatus[] = [
    'To Do', 
    'Assigned', 
    'In Progress', 
    'In Review', 
    'Blocked', 
    'Completed'
  ];

  const handleSaveUpdate = () => {
    const updated: LearningModule = {
      ...activeModuleModal,
      status: currentStatus,
      progressPercent: currentProgress,
      notes: noteText
    };
    updateModule(updated);
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const newCommentObj = {
      id: `c-${Date.now()}`,
      author: 'Arshith Sharma',
      avatar: 'AS',
      timestamp: 'Just now',
      content: newComment.trim()
    };

    const updated: LearningModule = {
      ...activeModuleModal,
      comments: [newCommentObj, ...activeModuleModal.comments]
    };
    updateModule(updated);
    setNewComment('');
  };

  const handleAddTimeLog = () => {
    const hrs = parseFloat(logHours);
    if (isNaN(hrs) || hrs <= 0) return;

    const newLog = {
      id: `tl-${Date.now()}`,
      author: 'Kiran Rao (Demo)',
      hours: hrs,
      date: logDate
    };

    const updated: LearningModule = {
      ...activeModuleModal,
      timeSpentHours: (activeModuleModal.timeSpentHours || 0) + hrs,
      timeLogs: [newLog, ...activeModuleModal.timeLogs]
    };
    updateModule(updated);
    setLogHours('');
  };

  const handleFileUpload = () => {
    const fakeFile = {
      id: `f-${Date.now()}`,
      name: `module_submission_${Date.now().toString().slice(-4)}.py`,
      size: '14.8 KB',
      uploadedAt: 'Just now'
    };
    const updated: LearningModule = {
      ...activeModuleModal,
      files: [fakeFile, ...activeModuleModal.files]
    };
    updateModule(updated);
    showToast('File Attached', `${fakeFile.name} uploaded successfully.`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div 
        className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header matching Reference Image 4 */}
        <div className="p-6 border-b border-slate-100 flex items-start justify-between bg-slate-50/50">
          <div className="space-y-1">
            <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <span className="font-mono text-slate-900">{activeModuleModal.code}</span>
              <span className="text-slate-400 font-normal">•</span>
              <span>{activeModuleModal.title}</span>
            </h2>
            <div className="flex items-center gap-2 text-xs text-blue-600 font-medium">
              <span>{activeModuleModal.courseId} • CodeLekho LMS Specialization Track</span>
            </div>
            {/* Badges */}
            <div className="flex items-center gap-2 pt-2">
              <span className="text-[11px] font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-200">
                {activeModuleModal.status}
              </span>
              <span className="text-[11px] font-semibold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full border border-blue-200">
                {activeModuleModal.difficulty}
              </span>
              {activeModuleModal.isMandatory && (
                <span className="text-[11px] font-semibold bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full border border-indigo-200">
                  Mandatory
                </span>
              )}
            </div>
          </div>
          <button 
            onClick={closeModuleModal}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Key Info Row: Assignee, Start, Due, Time Spent, Progress % */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200/80">
            <div>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                ASSIGNEE
              </span>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center">
                  KR
                </div>
                <span className="text-xs font-semibold text-slate-800 truncate">
                  {activeModuleModal.assignedStudent}
                </span>
              </div>
            </div>

            <div>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                START
              </span>
              <span className="text-xs font-medium text-slate-700">
                {activeModuleModal.startDate || '—'}
              </span>
            </div>

            <div>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                DUE
              </span>
              <span className="text-xs font-medium text-slate-700">
                {activeModuleModal.dueDate}
              </span>
            </div>

            <div>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                TIME SPENT
              </span>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800">
                  {activeModuleModal.timeSpentHours}h
                </span>
                <span className="text-[11px] font-bold text-blue-600">
                  {currentProgress}%
                </span>
              </div>
            </div>
          </div>

          {/* Update Status / Progress Section matching Image 4 */}
          <div className="p-4 rounded-xl border border-slate-200 space-y-4 bg-white shadow-2xs">
            <div className="text-xs font-semibold text-slate-700">
              Update status / progress
            </div>

            {/* Segmented Status Buttons */}
            <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 rounded-lg border border-slate-200">
              {statuses.map((status) => {
                const isSelected = currentStatus === status;
                return (
                  <button
                    key={status}
                    type="button"
                    onClick={() => setCurrentStatus(status)}
                    className={`flex-1 min-w-[70px] py-1.5 px-3 rounded-md text-xs font-medium transition-all text-center cursor-pointer ${
                      isSelected
                        ? 'bg-blue-600 text-white shadow-xs font-semibold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                    }`}
                  >
                    {status}
                  </button>
                );
              })}
            </div>

            {/* Progress Slider */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-medium text-slate-600">
                <span>Completion Percentage</span>
                <span className="font-bold text-blue-600">{currentProgress}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={currentProgress}
                onChange={(e) => setCurrentProgress(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>

            {/* Note Textarea */}
            <div className="space-y-1.5">
              <textarea
                placeholder="Note (optional)"
                rows={2}
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>

            {/* Save update button */}
            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleSaveUpdate}
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-4 py-2 rounded-lg shadow-xs hover:shadow-md transition-all cursor-pointer"
              >
                Save update
              </button>
            </div>
          </div>

          {/* Lower Grid: Comments (Left) vs Files & Time log (Right) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left: Comments Section */}
            <div className="space-y-3">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                <span>Comments ({activeModuleModal.comments?.length || 0})</span>
              </div>

              {/* Comments Feed */}
              <div className="space-y-2.5 max-h-52 overflow-y-auto pr-1">
                {activeModuleModal.comments && activeModuleModal.comments.length > 0 ? (
                  activeModuleModal.comments.map((comment) => (
                    <div key={comment.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200/70 space-y-1">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-semibold text-slate-800">{comment.author}</span>
                        <span className="text-slate-400">{comment.timestamp}</span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {comment.content}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-xs text-slate-400 italic">
                    No comments logged yet.
                  </div>
                )}
              </div>

              {/* Add comment input */}
              <form onSubmit={handleAddComment} className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Add a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="flex-1 text-xs px-3 py-2 rounded-lg border border-slate-200 outline-none focus:border-blue-500"
                />
                <button
                  type="submit"
                  className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>

            {/* Right: Files & Time log */}
            <div className="space-y-4">
              {/* Files */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                  <div className="flex items-center gap-1.5">
                    <Paperclip className="w-3.5 h-3.5 text-slate-400" />
                    <span>Files ({activeModuleModal.files?.length || 0})</span>
                  </div>
                  <button 
                    onClick={handleFileUpload}
                    className="text-blue-600 hover:text-blue-700 flex items-center gap-1 text-[11px] font-medium cursor-pointer"
                  >
                    <UploadCloud className="w-3 h-3" /> Upload
                  </button>
                </div>

                <div className="space-y-1.5 max-h-28 overflow-y-auto">
                  {activeModuleModal.files && activeModuleModal.files.length > 0 ? (
                    activeModuleModal.files.map((file) => (
                      <div key={file.id} className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200 text-xs">
                        <div className="flex items-center gap-2 truncate">
                          <FileText className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                          <span className="truncate font-medium text-slate-700">{file.name}</span>
                          <span className="text-[10px] text-slate-400 shrink-0">({file.size})</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-xs text-slate-400 italic p-2 bg-slate-50 rounded-lg text-center">
                      No files attached
                    </div>
                  )}
                </div>
              </div>

              {/* Time log matching Image 4 */}
              <div className="space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>Time log</span>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    placeholder="Hrs"
                    value={logHours}
                    onChange={(e) => setLogHours(e.target.value)}
                    className="w-16 text-xs px-2.5 py-1.5 border border-slate-200 rounded-lg outline-none"
                  />
                  <input
                    type="text"
                    value={logDate}
                    onChange={(e) => setLogDate(e.target.value)}
                    className="w-28 text-xs px-2.5 py-1.5 border border-slate-200 rounded-lg outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddTimeLog}
                    className="bg-slate-800 hover:bg-slate-900 text-white text-xs font-medium px-3 py-1.5 rounded-lg cursor-pointer"
                  >
                    Log
                  </button>
                </div>

                {/* Time log history */}
                <div className="space-y-1 pt-1 max-h-24 overflow-y-auto">
                  {activeModuleModal.timeLogs?.map((tl) => (
                    <div key={tl.id} className="flex items-center justify-between text-[11px] text-slate-600 py-0.5">
                      <span>{tl.author} • {tl.date}</span>
                      <span className="font-semibold text-slate-800">{tl.hours}h</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer matching Image 4 */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={() => showToast('Edit Mode', 'Module configuration unlocked.')}
            className="px-3.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-200/70 border border-slate-300 rounded-lg transition-colors cursor-pointer"
          >
            Edit task
          </button>
          <button
            type="button"
            onClick={closeModuleModal}
            className="px-4 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-200/50 rounded-lg transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

