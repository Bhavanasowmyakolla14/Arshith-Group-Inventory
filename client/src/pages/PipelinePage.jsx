import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { ArrowRight, Eye, AlertTriangle, Users } from 'lucide-react';

const formatINR = (val) => {
  const num = Number(val) || 0;
  if (num >= 100000) return `₹${(num / 100000).toFixed(1)}L`;
  return `₹${num.toLocaleString('en-IN')}`;
};

export const PipelinePage = ({ onSelectProject }) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const stages = [
    { id: 'NEW', label: '1. New Intake', color: 'border-sky-500' },
    { id: 'UNDER_REVIEW', label: '2. Under Review', color: 'border-indigo-500' },
    { id: 'ACCEPTED', label: '3. Accepted', color: 'border-blue-500' },
    { id: 'APPROVED', label: '4. Approved', color: 'border-blue-600' },
    { id: 'ASSIGNED', label: '5. Assigned', color: 'border-slate-500' },
    { id: 'IN_PROGRESS', label: '6. In Progress', color: 'border-blue-600' },
    { id: 'TESTING', label: '7. Testing & QA', color: 'border-amber-500' },
    { id: 'COMPLETED', label: '8. Completed', color: 'border-teal-600' },
    { id: 'DELIVERED', label: '9. Delivered', color: 'border-teal-700' },
  ];

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await api.getProjects('limit=100');
        if (res.success) setProjects(res.projects);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="p-6 space-y-4 max-w-7xl mx-auto">
      <div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">Project Portfolio Pipeline Workflow</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          End-to-end lifecycle visual pipeline tracking from intake to completion and client delivery.
        </p>
      </div>

      <div className="overflow-x-auto pb-4">
        <div className="flex gap-4 min-w-max">
          {stages.map((st) => {
            const stageProjects = projects.filter((p) => p.status === st.id);
            return (
              <div
                key={st.id}
                className="w-72 bg-slate-50 p-3 rounded-xl border border-slate-200 flex flex-col min-h-[500px]"
              >
                <div className={`flex items-center justify-between pb-2 mb-3 border-b-2 ${st.color}`}>
                  <span className="font-bold text-xs text-slate-800">{st.label}</span>
                  <span className="px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 text-[10px] font-bold">
                    {stageProjects.length}
                  </span>
                </div>

                <div className="space-y-3 flex-1 overflow-y-auto">
                  {stageProjects.map((p) => (
                    <div
                      key={p.id}
                      onClick={() => onSelectProject(p.id)}
                      className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs hover:shadow-md cursor-pointer transition-all space-y-2 text-xs"
                    >
                      <div className="flex items-center justify-between text-[10px] font-mono">
                        <span className="font-bold text-blue-900">{p.projectId}</span>
                        <span className="text-slate-400">{p.priority}</span>
                      </div>

                      <div className="font-bold text-slate-900 line-clamp-2">{p.title}</div>
                      <div className="text-[11px] text-slate-500 truncate">{p.client?.companyName}</div>

                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                        <span className="font-semibold text-blue-800">{formatINR(p.approvedBudget)}</span>
                        <span className="font-mono text-slate-500">{p.completionPercentage}%</span>
                      </div>
                    </div>
                  ))}

                  {stageProjects.length === 0 && (
                    <div className="h-32 flex items-center justify-center text-slate-400 text-xs italic">
                      No projects currently in {st.label}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

