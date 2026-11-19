import React, { useState } from 'react';
import { 
  Search, 
  Bell, 
  Plus, 
  Shield, 
  LogOut, 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../../context/AuthContext';
import { CompanySwitcherDropdown } from '../../../components/layout/CompanySwitcherDropdown';

export const TopHeader: React.FC = () => {
  const { user, logout } = useAuth();
  const { 
    setGlobalSearchOpen, 
    setIsAddCourseModalOpen, 
    setActiveSection,
    students
  } = useApp();

  const [notificationsOpen, setNotificationsOpen] = useState(false);

  return (
    <header className="h-16 bg-white border-b border-[#E2E8F0] px-6 flex items-center justify-between sticky top-0 z-20 shadow-xs">
      {/* Search Input matching Arshith Infotech */}
      <div className="flex items-center gap-4 flex-1 max-w-md">
        <div 
          onClick={() => setGlobalSearchOpen(true)}
          className="relative w-full group cursor-pointer"
        >
          <Search className="w-4 h-4 text-[#64748B] group-focus-within:text-[#2563EB] absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors" />
          <input
            type="text"
            readOnly
            placeholder="Search projects by ID, title, client, or tech stack..."
            className="w-full pl-9 pr-12 py-2 text-xs bg-[#F5F7FA] border border-[#E2E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#2563EB] focus:bg-white transition-all text-[#111827] placeholder-[#64748B] cursor-pointer"
          />
          <kbd className="hidden sm:inline-flex items-center gap-0.5 absolute right-2.5 top-1/2 -translate-y-1/2 px-1.5 py-0.5 text-[10px] font-mono text-[#64748B] bg-white border border-[#E2E8F0] rounded shadow-2xs">
            Ctrl K
          </kbd>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* System telemetry indicator */}
        <div className="hidden xl:flex items-center gap-2 px-3 py-1 bg-blue-50/80 border border-blue-200/80 rounded-full text-[11px] font-semibold text-blue-800">
          <span className="w-2 h-2 rounded-full bg-[#2563EB] animate-pulse"></span>
          <span>Live Core • Production</span>
        </div>

        {/* Quick Action Button: New Course / Project */}
        <button
          onClick={() => setIsAddCourseModalOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-lg text-xs font-semibold shadow-xs hover:shadow transition-all cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Project</span>
        </button>

        {/* Company Dropdown Selector (Unified) */}
        <CompanySwitcherDropdown />

        {/* Admin Badge */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#F5F7FA] border border-[#E2E8F0] text-[#111827] rounded-lg text-xs font-semibold tracking-wide">
          <Shield className="w-3.5 h-3.5 text-[#2563EB]" />
          <span className="font-mono text-[11px]">ADMINISTRATOR</span>
        </div>

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="relative p-2 text-[#64748B] hover:text-[#111827] hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            title="System Notifications"
          >
            <Bell className="w-4 h-4" />
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-800">Notifications</span>
                <span className="text-[10px] bg-slate-100 text-slate-600 font-semibold px-2 py-0.5 rounded-full">0 new</span>
              </div>
              <div className="p-6 text-center text-xs text-slate-400">
                No new system notifications (0 total).
              </div>
              <div className="p-2 border-t border-slate-100 text-center">
                <button 
                  onClick={() => {
                    setNotificationsOpen(false);
                    setActiveSection('notifications');
                  }}
                  className="text-xs text-blue-600 hover:text-blue-700 font-medium cursor-pointer"
                >
                  View all system logs
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Info & Avatar */}
        <div className="flex items-center gap-2.5 pl-3 border-l border-[#E2E8F0]">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#1E3A8A] to-[#2563EB] text-white font-bold text-xs flex items-center justify-center border border-blue-400/30 shadow-2xs">
            {user?.name ? user.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase() : 'FK'}
          </div>
          <div className="hidden md:block text-left">
            <div className="text-xs font-bold text-[#111827] leading-tight">{user?.name || 'Farook'}</div>
            <div className="text-[10px] text-[#64748B] font-medium">{user?.designation || 'Director & ERP Administrator'}</div>
          </div>

          {/* Logout Button */}
          <button
            onClick={logout}
            className="flex items-center gap-1 ml-1 px-2.5 py-1.5 text-[#64748B] hover:text-rose-700 hover:bg-rose-50 rounded-lg text-xs font-medium transition-colors border border-[#E2E8F0] cursor-pointer"
            title="Log out of Admin session"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
};
