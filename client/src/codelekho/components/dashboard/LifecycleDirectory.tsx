import React from 'react';
import { 
  Inbox, 
  FileSearch, 
  CheckCircle, 
  ThumbsUp, 
  UserCheck, 
  PlayCircle, 
  FlaskConical, 
  CheckCheck, 
  Truck,
  ArrowRight,
  AlertTriangle,
  Clock,
  Ban
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const LifecycleDirectory: React.FC = () => {
  const { setActiveSection } = useApp();

  const pipelineStages = [
    { count: 0, label: 'New Intake', desc: '1. New Intake', icon: Inbox, color: 'text-slate-400', bg: 'bg-slate-50', border: 'border-slate-200' },
    { count: 0, label: 'Under Review', desc: '2. Under Review', icon: FileSearch, color: 'text-slate-400', bg: 'bg-slate-50', border: 'border-slate-200' },
    { count: 0, label: 'Accepted', desc: '3. Accepted', icon: CheckCircle, color: 'text-slate-400', bg: 'bg-slate-50', border: 'border-slate-200' },
    { count: 0, label: 'Approved', desc: '4. Approved', icon: ThumbsUp, color: 'text-slate-400', bg: 'bg-slate-50', border: 'border-slate-200' },
    { count: 0, label: 'Assigned', desc: '5. Assigned', icon: UserCheck, color: 'text-slate-400', bg: 'bg-slate-50', border: 'border-slate-200' },
    { count: 0, label: 'In Progress', desc: '6. In Progress', icon: PlayCircle, color: 'text-slate-400', bg: 'bg-slate-50', border: 'border-slate-200' },
    { count: 0, label: 'Testing & QA', desc: '7. Testing & QA', icon: FlaskConical, color: 'text-slate-400', bg: 'bg-slate-50', border: 'border-slate-200' },
    { count: 0, label: 'Completed', desc: '8. Completed', icon: CheckCheck, color: 'text-slate-400', bg: 'bg-slate-50', border: 'border-slate-200' },
    { count: 0, label: 'Delivered', desc: '9. Delivered', icon: Truck, color: 'text-slate-400', bg: 'bg-slate-50', border: 'border-slate-200' },
  ];

  const exceptionCategories = [
    { title: 'All Registered', badge: '0 Total Portfolio', sub: 'Zero active cohorts', badgeColor: 'bg-slate-800 text-white' },
    { title: 'Resource Gap', badge: '0 Unassigned', sub: 'Zero unassigned items', badgeColor: 'bg-slate-100 text-slate-700' },
    { title: 'On-Track', badge: '0 On-Track', sub: 'Zero active cohorts', badgeColor: 'bg-slate-100 text-slate-700' },
    { title: 'Overdue', badge: '0 Escalated SLA', sub: 'Zero overdue items', badgeColor: 'bg-slate-100 text-slate-700' },
    { title: 'Terminated', badge: '0 Cancelled', sub: 'Zero dropouts', badgeColor: 'bg-slate-100 text-slate-700' },
    { title: 'Delivered', badge: '0 Requisite', sub: 'Zero completed items', badgeColor: 'bg-slate-100 text-slate-700' },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-6">
      {/* Header matching Image 1 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-600"></span>
            <h2 className="text-xs font-bold tracking-wider text-slate-800 uppercase">
              PROJECT LIFECYCLE FLOW & STATUS DIRECTORY
            </h2>
            <span className="text-[11px] text-slate-400 font-normal">
              Click any stage to filter projects
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Workflow from project inception to client delivery
          </p>
        </div>

        <button 
          onClick={() => setActiveSection('courses')}
          className="text-xs text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1 self-start sm:self-auto cursor-pointer"
        >
          View Full Portfolio <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Primary Delivery Pipeline */}
      <div className="space-y-3">
        <div className="text-[10px] font-bold tracking-wider uppercase text-slate-400">
          PRIMARY DELIVERY PIPELINE (IN ORDER OF EXECUTION)
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-2">
          {pipelineStages.map((stage, idx) => {
            const Icon = stage.icon;
            return (
              <div 
                key={idx}
                className={`p-3 rounded-xl border ${stage.border} ${stage.bg} flex flex-col items-center text-center transition-all hover:scale-105 cursor-pointer shadow-2xs`}
              >
                <Icon className={`w-4 h-4 ${stage.color} mb-1.5`} />
                <span className="text-lg font-extrabold text-slate-900 leading-none">
                  {stage.count}
                </span>
                <span className="text-[10px] text-slate-600 font-medium mt-1 truncate w-full">
                  {stage.desc}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Governance & Operational Exceptions */}
      <div className="space-y-3 pt-2">
        <div className="text-[10px] font-bold tracking-wider uppercase text-slate-400">
          GOVERNANCE, OPERATIONAL EXCEPTIONS & REPUTE CATEGORIES
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {exceptionCategories.map((cat, idx) => (
            <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 space-y-1.5">
              <span className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded ${cat.badgeColor}`}>
                {cat.badge}
              </span>
              <div className="text-xs font-bold text-slate-800">
                {cat.title}
              </div>
              <div className="text-[10px] text-slate-500 leading-tight">
                {cat.sub}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

