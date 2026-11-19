import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Milestone, Calendar, CheckCircle2, Clock } from 'lucide-react';

export const MilestonesPage = ({ onSelectProject }) => {
  const [milestones, setMilestones] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMilestones = async () => {
      try {
        setLoading(true);
        const res = await api.getMilestones();
        if (res.success) setMilestones(res.milestones);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMilestones();
  }, []);

  return (
    <div className="p-6 space-y-5 max-w-7xl mx-auto text-xs">
      <div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <Milestone className="w-5 h-5 text-blue-800" /> Contractual Project Milestones
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Delivery checkpoints, technical signoffs and customer billing milestones across the company portfolio.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold text-[11px] uppercase">
            <tr>
              <th className="py-2.5 px-4">Milestone ID</th>
              <th className="py-2.5 px-4">Milestone Name</th>
              <th className="py-2.5 px-4">Responsible Lead</th>
              <th className="py-2.5 px-4">Planned Date</th>
              <th className="py-2.5 px-4">Actual Completion</th>
              <th className="py-2.5 px-4 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {milestones.map((m) => (
              <tr key={m.id} className="hover:bg-slate-50">
                <td className="py-2.5 px-4 font-mono font-bold text-slate-800">{m.milestoneId}</td>
                <td className="py-2.5 px-4">
                  <div className="font-semibold text-slate-900">{m.name}</div>
                  <div className="text-[11px] text-slate-500">{m.description}</div>
                </td>
                <td className="py-2.5 px-4 text-slate-700">{m.responsibleEmployee?.name || 'Assigned Lead'}</td>
                <td className="py-2.5 px-4 font-mono text-slate-600">{m.plannedDate}</td>
                <td className="py-2.5 px-4 font-mono text-blue-600">{m.actualDate || '—'}</td>
                <td className="py-2.5 px-4 text-center">
                  <span
                    className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                      m.completionStatus === 'COMPLETED'
                        ? 'bg-blue-100 text-blue-800'
                        : m.completionStatus === 'IN_PROGRESS'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {m.completionStatus}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

