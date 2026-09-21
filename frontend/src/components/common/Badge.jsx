import React from 'react';

export const StatusBadge = ({ status }) => {
  const styles = {
    'Todo': 'bg-slate-100 text-slate-700 border-slate-200',
    'In Progress': 'bg-sky-50 text-sky-700 border-sky-200',
    'Done': 'bg-emerald-50 text-emerald-700 border-emerald-200',
    'Active': 'bg-indigo-50 text-indigo-700 border-indigo-200',
    'Completed': 'bg-emerald-50 text-emerald-700 border-emerald-200',
    'On Hold': 'bg-amber-50 text-amber-700 border-amber-200',
    'Archived': 'bg-slate-100 text-slate-500 border-slate-200',
  };

  const currentStyle = styles[status] || 'bg-slate-100 text-slate-700 border-slate-200';

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${currentStyle}`}>
      <span className="w-1.5 h-1.5 mr-1.5 rounded-full bg-current opacity-70" />
      {status}
    </span>
  );
};

export const PriorityBadge = ({ priority }) => {
  const styles = {
    'Low': 'bg-slate-100 text-slate-600 border-slate-200',
    'Medium': 'bg-blue-50 text-blue-700 border-blue-200',
    'High': 'bg-amber-50 text-amber-700 border-amber-200',
    'Urgent': 'bg-rose-50 text-rose-700 border-rose-200',
  };

  const currentStyle = styles[priority] || 'bg-slate-100 text-slate-600 border-slate-200';

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold border ${currentStyle}`}>
      {priority}
    </span>
  );
};
