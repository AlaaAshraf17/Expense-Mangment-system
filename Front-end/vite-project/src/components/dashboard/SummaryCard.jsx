import React from 'react';

const colorMap = {
  indigo: {
    iconWrap: 'bg-indigo-50 text-indigo-600',
    badge:    'bg-indigo-100 text-indigo-600',
    dot:      'bg-indigo-500',
  },
  emerald: {
    iconWrap: 'bg-emerald-50 text-emerald-600',
    badge:    'bg-emerald-100 text-emerald-600',
    dot:      'bg-emerald-500',
  },
  rose: {
    iconWrap: 'bg-rose-50 text-rose-600',
    badge:    'bg-rose-100 text-rose-600',
    dot:      'bg-rose-500',
  },
  amber: {
    iconWrap: 'bg-amber-50 text-amber-600',
    badge:    'bg-amber-100 text-amber-600',
    dot:      'bg-amber-500',
  },
};

const SummaryCard = ({ title, value, icon: Icon, color = 'indigo', subtitle }) => {
  const theme = colorMap[color];

  return (
    <div className="group flex flex-col gap-5 rounded-2xl border border-slate-200 bg-white p-9 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">

      {/* Top row: icon + title */}
      <div className="flex items-center justify-between">
        <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${theme.iconWrap}`}>
          <Icon className="h-5 w-5" strokeWidth={2} />
        </div>
        <span className={`rounded-full px-2.5 py-1 text-[14px] font-semibold uppercase tracking-wide ${theme.badge}`}>
          {title}
        </span>
      </div>

      {/* Value */}
      <div>
        <p className="text-[32px] font-bold leading-none tracking-tight text-slate-900">
          {value}
        </p>

      </div>

    </div>
  );
};

export default SummaryCard;
