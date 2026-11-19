import React, { useState } from 'react';
import { X, ArrowRight, ShieldCheck, Clock, CheckCircle } from 'lucide-react';
import { api } from '../../services/api';

export const StatusChangeModal = ({ isOpen, onClose, onSuccess, project }) => {
  const [newStatus, setNewStatus] = useState('');
  const [reason, setReason] = useState('');
  const [remarks, setRemarks] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen || !project) return null;

  const validStatuses = [
    { id: 'NEW', label: '1. New' },
    { id: 'UNDER_REVIEW', label: '2. Under Review' },
    { id: 'ACCEPTED', label: '3. Accepted' },
    { id: 'REJECTED', label: '4. Rejected' },
    { id: 'APPROVED', label: '5. Approved' },
    { id: 'ASSIGNED', label: '6. Assigned' },
    { id: 'IN_PROGRESS', label: '7. In Progress' },
    { id: 'TESTING', label: '9. Testing' },
    { id: 'CANCELLED', label: '12. Cancelled' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newStatus) {
      alert('Please select a new target status');
      return;
    }
    if (!reason) {
      alert('A formal justification/reason is required for auditing status transitions');
      return;
    }

    try {
      setLoading(true);
      await api.changeStatus(project.id, {
        newStatus,
        reason,
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
          <div>
            <h3 className="text-sm font-bold text-slate-900">Project Status Transition</h3>
            <p className="text-[11px] text-slate-500 font-mono mt-0.5">
              {project.projectId} – {project.title}
            </p>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {/* Transition indicator */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
            <div>
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Current Status</div>
              <div className="font-bold text-slate-800 text-xs mt-0.5">{project.status.replace(/_/g, ' ')}</div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400" />
            <div>
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Target Status</div>
              <div className="font-bold text-blue-800 text-xs mt-0.5">
                {newStatus ? newStatus.replace(/_/g, ' ') : 'Select below'}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Select New Status *</label>
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              required
              className="w-full p-2.5 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white text-xs font-medium"
            >
              <option value="">-- Choose Target Workflow State --</option>
              {validStatuses.map((s) => (
                <option key={s.id} value={s.id} disabled={s.id === project.status}>
                  {s.label} {s.id === project.status ? '(Current)' : ''}
                </option>
              ))}
            </select>
            <p className="text-[10px] text-slate-400 mt-1">
              Note: To move to "On Hold", "Completed", or "Delivered", use the dedicated workflow action buttons in the
              header to ensure prerequisite checks are validated.
            </p>
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Reason for Transition *</label>
            <input
              type="text"
              required
              placeholder="e.g. Sprint 1 kicked off / Advance payment credited / Client approved scope"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full p-2.5 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Remarks / Audit Note</label>
            <textarea
              rows={2}
              placeholder="Additional executive context or operational notes for the permanent history log."
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
              className="px-4 py-2 bg-blue-600 hover:bg-blue-800 text-white font-semibold rounded-lg shadow-sm"
            >
              {loading ? 'Recording...' : 'Confirm Status Update'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

