import React from 'react';
import {
  LayoutDashboard,
  FolderGit2,
  Workflow,
  Users2,
  UserCheck,
  CheckSquare,
  Milestone,
  IndianRupee,
  PauseCircle,
  Calendar,
  FileText,
  BarChart3,
  Bell,
  ShieldCheck,
  Settings,
  History,
  Layers,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

export const navSections = [
  {
    title: 'Core Portfolio',
    items: [
      { id: 'dashboard', label: 'Executive Dashboard', icon: LayoutDashboard },
      { id: 'projects', label: 'Projects Inventory', icon: FolderGit2, badge: 'Main', badgeColor: 'bg-blue-500/20 text-blue-300 border border-blue-500/30' },
      { id: 'pipeline', label: 'Portfolio Pipeline', icon: Workflow },
      { id: 'calendar', label: 'Timelines & Deadlines', icon: Calendar },
    ],
  },
  {
    title: 'Operations & Execution',
    items: [
      { id: 'teams', label: 'Project Teams', icon: Users2 },
      { id: 'employees', label: 'Employee Directory', icon: UserCheck },
      { id: 'tasks', label: 'Tasks & Sprints', icon: CheckSquare },
      { id: 'milestones', label: 'Project Milestones', icon: Milestone },
      { id: 'documents', label: 'Artifacts & Documents', icon: FileText },
    ],
  },
  {
    title: 'Finance & Governance',
    items: [
      { id: 'finances', label: 'Budget & Spend (₹)', icon: IndianRupee },
      { id: 'on-hold', label: 'On-Hold Projects', icon: PauseCircle, badgeColor: 'bg-amber-500/20 text-amber-300 border border-amber-500/30' },
      { id: 'reports', label: 'Reports & Analytics', icon: BarChart3, badge: '16', badgeColor: 'bg-sky-500/20 text-sky-300 border border-sky-500/30' },
    ],
  },
  {
    title: 'Administration',
    items: [
      { id: 'notifications', label: 'Alerts & Notifications', icon: Bell },
      { id: 'users', label: 'Access Control', icon: ShieldCheck },
      { id: 'audit-logs', label: 'Audit Trail', icon: History },
      { id: 'settings', label: 'Platform Settings', icon: Settings },
    ],
  },
];

export const Sidebar = ({ activeTab, setActiveTab }) => {
  return (
    <aside className="w-64 bg-[#101827] text-slate-300 flex flex-col flex-shrink-0 border-r border-[#1E293B] select-none shadow-2xl z-30">
      {/* Brand Header */}
      <div className="h-16 flex items-center px-4 border-b border-[#1E293B] bg-[#0B0F19]/90 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center text-white font-extrabold shadow-md shadow-blue-950/60 border border-blue-400/30">
            <Layers className="w-5 h-5 text-blue-100" />
          </div>
          <div>
            <div className="font-extrabold text-[13px] tracking-wider text-white uppercase font-sans flex items-center gap-1.5">
              <span>Arshith</span>
              <span className="text-sky-400 font-semibold">Infotech</span>
            </div>
            <div className="text-[9px] text-slate-400 font-mono tracking-widest uppercase">
              Project Portfolio OS
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Groups */}
      <div className="flex-1 overflow-y-auto py-3 px-3 space-y-4 scrollbar-thin scrollbar-thumb-slate-800">
        {navSections.map((section, sIdx) => (
          <div key={sIdx} className="space-y-1">
            <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">
              {section.title}
            </div>
            {section.items.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all group relative ${
                    isActive
                      ? 'bg-blue-600/20 text-white font-semibold border-l-4 border-blue-500 shadow-xs'
                      : 'text-slate-400 hover:bg-slate-800/60 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon
                      className={`w-4 h-4 transition-colors ${
                        isActive ? 'text-blue-400' : 'text-slate-400 group-hover:text-blue-400'
                      }`}
                    />
                    <span className="truncate">{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[9px] px-1.5 py-0.5 rounded font-mono font-medium ${
                        item.badgeColor || (isActive ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400')
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Footer System Status */}
      <div className="p-3 border-t border-[#1E293B] bg-[#0B0F19]/60 text-[11px]">
        <div className="flex items-center justify-between text-slate-400 mb-1">
          <span className="flex items-center gap-1.5 font-medium">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            <span className="text-slate-300 text-[10px]">Cloud Sync Active</span>
          </span>
          <span className="font-mono text-slate-400 text-[10px]">v2.4.0</span>
        </div>
        <div className="text-slate-400 text-[10px] truncate font-mono">
          Internal Enterprise Node • 2026
        </div>
      </div>
    </aside>
  );
};
