import React from 'react';

interface StatusBadgeProps {
  status: string;
  variant?: 'pill' | 'subtle' | 'outline';
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ 
  status, 
  variant = 'pill',
  size = 'sm' 
}) => {
  const normalized = status.toLowerCase();

  let colorClasses = 'bg-slate-100 text-slate-700 border-slate-200';

  if (normalized.includes('completed') || normalized.includes('passed') || normalized.includes('delivered') || normalized.includes('issued') || normalized.includes('verified')) {
    colorClasses = 'bg-emerald-50 text-emerald-700 border-emerald-200/60';
  } else if (normalized.includes('in progress') || normalized.includes('active') || normalized.includes('on-track')) {
    colorClasses = 'bg-blue-50 text-blue-700 border-blue-200/60';
  } else if (normalized.includes('in review') || normalized.includes('testing') || normalized.includes('scheduled')) {
    colorClasses = 'bg-amber-50 text-amber-700 border-amber-200/60';
  } else if (normalized.includes('overdue') || normalized.includes('blocked') || normalized.includes('failed') || normalized.includes('at-risk')) {
    colorClasses = 'bg-rose-50 text-rose-700 border-rose-200/60';
  } else if (normalized.includes('assigned') || normalized.includes('to do') || normalized.includes('pending')) {
    colorClasses = 'bg-purple-50 text-purple-700 border-purple-200/60';
  }

  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs';

  return (
    <span className={`inline-flex items-center font-medium rounded-full border ${sizeClasses} ${colorClasses}`}>
      <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-current opacity-70"></span>
      {status}
    </span>
  );
};

