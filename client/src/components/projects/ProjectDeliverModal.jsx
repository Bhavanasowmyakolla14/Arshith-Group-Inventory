import React, { useState } from 'react';
import { X, Truck, ShieldCheck } from 'lucide-react';
import { api } from '../../services/api';

export const ProjectDeliverModal = ({ isOpen, onClose, onSuccess, project }) => {
  const [clientAcceptance, setClientAcceptance] = useState(true);
  const [warrantyDetails, setWarrantyDetails] = useState('12 Months Comprehensive SLA Maintenance Contract active');
  const [handoverDocsUrl, setHandoverDocsUrl] = useState(project?.handoverDocsUrl || '/uploads/handover_pack.zip');
  const [remarks, setRemarks] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen || !project) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await api.deliverProject(project.id, {
        clientAcceptance,
        warrantyDetails,
        handoverDocsUrl,
        remarks: remarks || 'Client acceptance certificate signed; handover completed.',
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
            <Truck className="w-5 h-5 text-teal-700" />
            <div>
              <h3 className="text-sm font-bold text-slate-900">Deliver Project to Client</h3>
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
          <div className="p-3 bg-teal-50 rounded-xl border border-teal-200 text-teal-950 text-xs">
            Marking as DELIVERED signifies final commercial and technical acceptance by the client, initiation of warranty
            periods, and clearance for final billing.
          </div>

          <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-800">
            <input
              type="checkbox"
              checked={clientAcceptance}
              onChange={(e) => setClientAcceptance(e.target.checked)}
              className="w-4 h-4 text-teal-600 rounded"
            />
            <span>Formal Client Acceptance Certificate Received & Verified</span>
          </label>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Warranty & Maintenance Terms</label>
            <input
              type="text"
              value={warrantyDetails}
              onChange={(e) => setWarrantyDetails(e.target.value)}
              className="w-full p-2.5 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Handover Document Package URL</label>
            <input
              type="text"
              value={handoverDocsUrl}
              onChange={(e) => setHandoverDocsUrl(e.target.value)}
              className="w-full p-2.5 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white font-mono text-[11px]"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Final Delivery Remarks</label>
            <textarea
              rows={2}
              placeholder="e.g. Master keys and server root credentials safely delivered to Client CTO."
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
              className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white font-semibold rounded-lg shadow-sm"
            >
              {loading ? 'Processing...' : 'Confirm Final Delivery'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

