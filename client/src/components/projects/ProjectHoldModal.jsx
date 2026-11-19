import React, { useState } from 'react';
import { X, PauseCircle, AlertTriangle } from 'lucide-react';
import { api } from '../../services/api';

export const ProjectHoldModal = ({ isOpen, onClose, onSuccess, project }) => {
  const [holdReason, setHoldReason] = useState('');
  const [pendingTasksSummary, setPendingTasksSummary] = useState('');
  const [expectedResumeDate, setExpectedResumeDate] = useState('');
  const [financialImpact, setFinancialImpact] = useState('Nil direct impact; team reallocated to active priority sprint');
  const [remarks, setRemarks] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen || !project) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!holdReason) {
      alert('Hold reason is mandatory.');
      return;
    }

    try {
      setLoading(true);
      await api.placeOnHold(project.id, {
        holdReason,
        pendingTasksSummary,
        expectedResumeDate,
        financialImpact,
        remarks,
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
            <PauseCircle className="w-5 h-5 text-amber-600" />
            <div>
              <h3 className="text-sm font-bold text-slate-900">Place Project On Hold</h3>
              <p className="text-[11px] text-slate-500 font-mono">
                {project.projectId} – {project.title}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 mt-4">
          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 flex-shrink-0 text-amber-700 mt-0.5" />
            <div className="text-[11px]">
              Placing this project on hold will freeze active sprint metrics, log progress at hold (
              <span className="font-bold">{project.completionPercentage}%</span>), and maintain a permanent audit record
              in executive reporting.
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Reason for Placing On Hold *</label>
            <input
              type="text"
              required
              placeholder="e.g. Client regulatory ethics review / Awaiting hardware shipment"
              value={holdReason}
              onChange={(e) => setHoldReason(e.target.value)}
              className="w-full p-2.5 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Pending Tasks Summary</label>
            <textarea
              rows={2}
              placeholder="Summary of unfinished work items frozen during the hold period"
              value={pendingTasksSummary}
              onChange={(e) => setPendingTasksSummary(e.target.value)}
              className="w-full p-2.5 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white"
            ></textarea>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Expected Resume Date</label>
              <input
                type="date"
                value={expectedResumeDate}
                onChange={(e) => setExpectedResumeDate(e.target.value)}
                className="w-full p-2.5 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Financial Impact Assessment</label>
              <input
                type="text"
                value={financialImpact}
                onChange={(e) => setFinancialImpact(e.target.value)}
                className="w-full p-2.5 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Remarks & Mitigation Notes</label>
            <textarea
              rows={2}
              placeholder="Additional management context or conditional triggers to resume"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
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
              className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-lg shadow-sm"
            >
              {loading ? 'Processing...' : 'Confirm Place On Hold'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

