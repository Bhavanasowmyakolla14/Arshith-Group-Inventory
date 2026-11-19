import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Toast: React.FC = () => {
  const { toastMessage, dismissToast } = useApp();

  useEffect(() => {
    if (!toastMessage) return;
    const timer = setTimeout(() => {
      dismissToast();
    }, 4000);
    return () => clearTimeout(timer);
  }, [toastMessage, dismissToast]);

  if (!toastMessage) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-[#0f172a] text-white px-4 py-3 rounded-lg shadow-2xl border border-slate-700/60 animate-in fade-in slide-in-from-bottom-3 duration-200">
      <div className="flex items-center gap-2.5">
        {toastMessage.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
        {toastMessage.type === 'error' && <AlertCircle className="w-4 h-4 text-rose-400" />}
        {toastMessage.type === 'info' && <Info className="w-4 h-4 text-blue-400" />}
        {toastMessage.type === 'warning' && <AlertCircle className="w-4 h-4 text-amber-400" />}
        <span className="text-xs font-medium text-slate-100">{toastMessage.title}</span>
      </div>
      {toastMessage.message && (
        <span className="text-xs text-slate-400 border-l border-slate-700 pl-2.5">
          {toastMessage.message}
        </span>
      )}
      <button 
        onClick={dismissToast}
        className="ml-2 text-slate-400 hover:text-white transition-colors"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};

