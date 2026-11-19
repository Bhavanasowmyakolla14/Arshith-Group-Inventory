import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  FolderGit2, 
  HelpCircle, 
  Code2, 
  Terminal, 
  Database, 
  Globe, 
  BrainCircuit, 
  TrendingUp, 
  FileCheck, 
  GraduationCap, 
  CalendarClock, 
  ShieldCheck, 
  Award, 
  BarChart3, 
  PieChart, 
  Coins, 
  Bell, 
  UserCog, 
  KeyRound, 
  Settings, 
  LogOut, 
  ChevronRight,
  Activity,
  Layers,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../../context/AuthContext';
import { NavigationSection } from '../../types';

interface NavItem {
  id: NavigationSection;
  label: string;
  icon: React.ElementType;
  badge?: string;
  badgeColor?: string;
}

interface NavGroup {
  groupTitle: string;
  items: NavItem[];
}

export const Sidebar: React.FC = () => {
  const { logout } = useAuth();
  const { 
    activeSection, 
    setActiveSection, 
    students, 
    courses, 
    modules, 
    certificates, 
    practiceProblemsSummary,
  } = useApp();

  const navigationGroups: NavGroup[] = [
    {
      groupTitle: 'Core Academy',
      items: [
        { id: 'dashboard', label: 'Executive Dashboard', icon: LayoutDashboard },
        { id: 'students', label: 'Students Directory', icon: Users, badge: students.length.toString(), badgeColor: 'bg-blue-500/20 text-blue-300 border border-blue-500/30' },
        { id: 'courses', label: 'Courses & Tracks', icon: BookOpen, badge: courses.length.toString() },
        { id: 'learning-modules', label: 'Learning Modules', icon: FolderGit2, badge: modules.length.toString() },
      ]
    },
    {
      groupTitle: 'Operations & Execution',
      items: [
        { id: 'practice-problems', label: 'Practice Problems', icon: Code2, badge: practiceProblemsSummary.totalCount.toString() },
        { id: 'question-bank', label: 'Question Bank', icon: HelpCircle },
        { id: 'course-progress', label: 'Course Progress', icon: TrendingUp },
        { id: 'assignments', label: 'Assignments', icon: FileCheck },
        { id: 'proctoring', label: 'Proctoring & Exams', icon: ShieldCheck, badge: 'Live', badgeColor: 'bg-rose-500/20 text-rose-300 border border-rose-500/30' },
        { id: 'certificates', label: 'QR Certificates', icon: Award, badge: certificates.length.toString() },
      ]
    },
    {
      groupTitle: 'Finance & Governance',
      items: [
        { id: 'financial-management', label: 'Budget & Spend (₹)', icon: Coins },
        { id: 'student-analytics', label: 'Student Analytics', icon: BarChart3 },
        { id: 'learning-analytics', label: 'Learning Analytics', icon: Activity },
        { id: 'growth-analytics', label: 'Growth & Cohorts', icon: TrendingUp },
      ]
    },
    {
      groupTitle: 'Administration',
      items: [
        { id: 'notifications', label: 'Alerts & Notifications', icon: Bell },
        { id: 'user-management', label: 'Access Control', icon: UserCog },
        { id: 'roles-permissions', label: 'Roles & Permissions', icon: KeyRound },
        { id: 'settings', label: 'Platform Settings', icon: Settings },
      ]
    }
  ];

  return (
    <aside className="w-64 bg-[#101827] text-slate-300 flex flex-col flex-shrink-0 border-r border-[#1E293B] select-none shadow-2xl z-30 h-screen">
      {/* Brand Header matching Arshith Infotech */}
      <div className="h-16 flex items-center px-4 border-b border-[#1E293B] bg-[#0B0F19]/90 backdrop-blur-md">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveSection('dashboard')}>
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600 to-blue-800 flex items-center justify-center text-white font-extrabold shadow-md shadow-indigo-950/60 border border-indigo-400/30">
            <GraduationCap className="w-5 h-5 text-indigo-100" />
          </div>
          <div>
            <div className="font-extrabold text-[13px] tracking-wider text-white uppercase font-sans flex items-center gap-1.5">
              <span>Code</span>
              <span className="text-cyan-400 font-semibold">Lekho</span>
              <span className="text-[9px] bg-emerald-500/20 text-emerald-300 font-mono px-1 py-0.2 rounded border border-emerald-400/30 ml-0.5">ERP</span>
            </div>
            <div className="text-[9px] text-slate-400 font-mono tracking-widest uppercase">
              Academic LMS OS
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Groups */}
      <div className="flex-1 overflow-y-auto py-3 px-3 space-y-4 scrollbar-thin scrollbar-thumb-slate-800">
        {navigationGroups.map((group, gIdx) => (
          <div key={gIdx} className="space-y-1">
            <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">
              {group.groupTitle}
            </div>
            {group.items.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all group relative cursor-pointer ${
                    isActive
                      ? 'bg-blue-600/20 text-white font-semibold border-l-4 border-blue-500 shadow-xs'
                      : 'text-slate-400 hover:bg-slate-800/60 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <Icon
                      className={`w-4 h-4 shrink-0 transition-colors ${
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

      {/* Sidebar Footer matching Arshith Infotech */}
      <div className="p-3 border-t border-[#1E293B] bg-[#0B0F19]/60">
        <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
            <span>Cloud Sync Active</span>
          </div>
          <span className="text-slate-500">v2.4.0</span>
        </div>
        <div className="text-[9px] text-slate-500 font-mono mt-1">
          External Enterprise Mode • 2026
        </div>
      </div>
    </aside>
  );
};
