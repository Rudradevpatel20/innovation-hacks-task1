import React from 'react';
import { Card } from '../common/Card';

export const StatCard = ({ title, value, subtitle, icon: Icon, color = 'indigo' }) => {
  const colors = {
    indigo: 'bg-indigo-50 text-indigo-600 border-indigo-100',
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    amber: 'bg-amber-50 text-amber-600 border-amber-100',
    rose: 'bg-rose-50 text-rose-600 border-rose-100',
    sky: 'bg-sky-50 text-sky-600 border-sky-100',
  };

  return (
    <Card className="flex items-center justify-between p-5">
      <div>
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{title}</p>
        <h3 className="text-2xl font-extrabold text-slate-900 mt-1">{value}</h3>
        {subtitle && <p className="text-xs text-slate-500 mt-1 font-medium">{subtitle}</p>}
      </div>
      {Icon && (
        <div className={`p-3 rounded-2xl border ${colors[color] || colors.indigo}`}>
          <Icon className="w-6 h-6" />
        </div>
      )}
    </Card>
  );
};
