import React, { useState } from 'react';
import { X, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';
import { api } from '../../services/api';

export const ProjectCompleteModal = ({ isOpen, onClose, onSuccess, project }) => {
  const [deploymentUrl, setDeploymentUrl] = useState(project?.deploymentUrl || '');
  const [gitRepoUrl, setGitRepoUrl] = useState(project?.gitRepoUrl || '');
  const [finalReportUrl, setFinalReportUrl] = useState(project?.finalReportUrl || '');
  const [managerApprovalRemarks, setManagerApprovalRemarks] = useState('');
  const [confirmedChecks, setConfirmedChecks] = useState({
    tasksDone: true,
    milestonesDone: true,
    testingDone: true,
    docsUploaded: true,
  });
  const [loading, setLoading] = useState(false);

  if (!isOpen || !project) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!confirmedChecks.tasksDone || !confirmedChecks.milestonesDone || !confirmedChecks.testingDone) {
      alert('All quality assurance and milestone checkboxes must be confirmed.');
      return;
    }

    try {
      setLoading(true);
      await api.completeProject(project.id, {
        deploymentUrl,
        gitRepoUrl,
        finalReportUrl,
        managerApprovalRemarks: managerApprovalRemarks || 'All acceptance criteria validated and signed off by PM.',
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
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 text-xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-blue-600" />
            <div>
              <h3 className="text-sm font-bold text-slate-900">Project Completion Workflow Sign-Off</h3>
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
          <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 text-blue-950 text-xs space-y-1">
            <div className="font-bold flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-blue-600" /> Formal Completion Verification
            </div>
            <p className="text-[11px]">
              Confirming this workflow records an authorized project manager approval, locks progress at 100%, and prepares
              the project for client delivery and handover.
            </p>
          </div>

          {/* Mandatory Checklist Items */}
          <div className="space-y-2 bg-slate-50 p-3 rounded-xl border border-slate-200">
            <div className="text-[11px] font-bold text-slate-700 uppercase tracking-wider font-mono">
              Prerequisite Completion Checklist
            </div>
            <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-800">
              <input
                type="checkbox"
                checked={confirmedChecks.tasksDone}
                onChange={(e) => setConfirmedChecks({ ...confirmedChecks, tasksDone: e.target.checked })}
                className="w-4 h-4 text-blue-600 rounded"
              />
              <span>All mandatory development tasks and code reviews completed</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-800">
              <input
                type="checkbox"
                checked={confirmedChecks.milestonesDone}
                onChange={(e) => setConfirmedChecks({ ...confirmedChecks, milestonesDone: e.target.checked })}
                className="w-4 h-4 text-blue-600 rounded"
              />
              <span>All scheduled contractual milestones achieved</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-800">
              <input
                type="checkbox"
                checked={confirmedChecks.testingDone}
                onChange={(e) => setConfirmedChecks({ ...confirmedChecks, testingDone: e.target.checked })}
                className="w-4 h-4 text-blue-600 rounded"
              />
              <span>User Acceptance Testing (UAT) and security scan signed off</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-800">
              <input
                type="checkbox"
                checked={confirmedChecks.docsUploaded}
                onChange={(e) => setConfirmedChecks({ ...confirmedChecks, docsUploaded: e.target.checked })}
                className="w-4 h-4 text-blue-600 rounded"
              />
              <span>Required technical and user documentation uploaded</span>
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Production / Deployment URL</label>
              <input
                type="url"
                placeholder="https://app.client.com"
                value={deploymentUrl}
                onChange={(e) => setDeploymentUrl(e.target.value)}
                className="w-full p-2.5 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white font-mono text-[11px]"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Git Repository URL</label>
              <input
                type="url"
                placeholder="https://github.com/..."
                value={gitRepoUrl}
                onChange={(e) => setGitRepoUrl(e.target.value)}
                className="w-full p-2.5 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white font-mono text-[11px]"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Project Manager Approval Sign-Off Remarks</label>
            <textarea
              rows={2}
              placeholder="e.g. Code passed all unit tests; security clearance certificate attached; ready for client delivery."
              value={managerApprovalRemarks}
              onChange={(e) => setManagerApprovalRemarks(e.target.value)}
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
              {loading ? 'Processing...' : 'Approve & Mark Completed'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

