import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Building2, GraduationCap, Leaf, Check } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const CompanySwitcherDropdown = () => {
  const { company, switchCompany } = useAuth();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const companies = [
    {
      id: 'arshith',
      name: 'Arshith Infotech',
      tagline: 'Project Inventory & Portfolio OS',
      icon: Building2,
      iconColor: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      badge: 'Projects',
    },
    {
      id: 'codelekho',
      name: 'CodeLekho ERP',
      tagline: 'Academic ERP & LMS Command Center',
      icon: GraduationCap,
      iconColor: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      borderColor: 'border-indigo-200',
      badge: 'Academic',
    },
    {
      id: 'arshithfresh',
      name: 'Arshith Fresh IMS',
      tagline: 'Inventory & Supply Chain Management',
      icon: Leaf,
      iconColor: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-200',
      badge: 'Supply Chain',
    },
  ];

  const current = companies.find((c) => c.id === company) || companies[0];
  const CurrentIcon = current.icon;

  const handleSelectCompany = (id) => {
    setOpen(false);
    if (switchCompany) {
      switchCompany(id);
    } else {
      localStorage.setItem('arshith_company', id);
      window.location.reload();
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2.5 px-3 py-1.5 bg-[#F5F7FA] hover:bg-slate-100 border border-[#E2E8F0] hover:border-blue-400 rounded-xl text-xs font-semibold text-[#111827] transition-all shadow-2xs cursor-pointer group"
        title="Switch between Enterprise Companies"
      >
        <div className={`w-5 h-5 rounded-md ${current.bgColor} flex items-center justify-center`}>
          <CurrentIcon className={`w-3.5 h-3.5 ${current.iconColor}`} />
        </div>
        <div className="text-left flex items-center gap-1.5">
          <span className="font-bold text-[#111827]">{current.name}</span>
          <span className="hidden sm:inline text-[10px] font-mono text-slate-500 bg-white border border-[#E2E8F0] px-1.5 py-0.5 rounded">
            {current.badge}
          </span>
        </div>
        <ChevronDown className={`w-3.5 h-3.5 text-slate-500 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-[#E2E8F0] p-1.5 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
          <div className="px-3 py-2 border-b border-[#F1F5F9] mb-1">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">
              Select Enterprise Company
            </div>
            <div className="text-xs text-slate-500">
              Switch company portal workspace instantly
            </div>
          </div>
          <div className="space-y-1">
            {companies.map((c) => {
              const Icon = c.icon;
              const isSelected = c.id === company;
              return (
                <button
                  key={c.id}
                  onClick={() => handleSelectCompany(c.id)}
                  className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-blue-50/80 border border-blue-200 text-blue-900'
                      : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-8 h-8 rounded-lg ${c.bgColor} border ${c.borderColor} flex items-center justify-center flex-shrink-0`}>
                      <Icon className={`w-4 h-4 ${c.iconColor}`} />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-[#111827] flex items-center gap-1.5">
                        <span>{c.name}</span>
                      </div>
                      <div className="text-[10px] text-slate-500 truncate">
                        {c.tagline}
                      </div>
                    </div>
                  </div>
                  {isSelected && (
                    <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center flex-shrink-0 ml-2">
                      <Check className="w-3 h-3" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

