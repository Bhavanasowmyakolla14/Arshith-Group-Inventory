import React, { useState } from 'react';
import { X, PlayCircle, CheckCircle2 } from 'lucide-react';
import { api } from '../../services/api';

export const ProjectResumeModal = ({ isOpen, onClose, onSuccess, project }) => {
  const [resumeRemarks, setResumeRemarks] = useState('');
  const [targetStatus, setTargetStatus] = useState('IN_PROGRESS');
  const [loading, setLoading] = useState(false);

  if (!isOpen || !project) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await api.resumeProject(project.id, {
        resumeRemarks: resumeRemarks || 'Resumed by authorized manager',
        targetStatus,
      });
      onSuccess();
      onClose();
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 text-xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <PlayCircle className="w-5 h-5 text-blue-600" />
            <div>
              <h3 className="text-sm font-bold text-slate-900">Resume On-Hold Project</h3>
              <p className="text-[11px] text-slate-500 font-mono">
                {project.projectId} – {project.title}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 text-blue-950 text-xs">
            Resuming this project will record the end of the hold duration in the historical audit ledger and reactivate
            sprint execution.
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Resume to Workflow State</label>
            <select
              value={targetStatus}
              onChange={(e) => setTargetStatus(e.target.value)}
              className="w-full p-2.5 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white text-xs font-semibold"
            >
              <option value="IN_PROGRESS">In Progress (Active Development)</option>
              <option value="TESTING">Testing / QA Verification</option>
              <option value="ASSIGNED">Assigned (Team Allocation Review)</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Resume Remarks / Clearance Reason</label>
            <textarea
              rows={3}
              placeholder="e.g. Client ethics committee clearance received; resuming data ingestion pipeline."
              value={resumeRemarks}
              onChange={(e) => setResumeRemarks(e.target.value)}
              className="w-full p-2.5 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white"
            ></textarea>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-800 text-white font-semibold rounded-lg shadow-sm"
            >
              {loading ? 'Resuming...' : 'Confirm Resume'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

