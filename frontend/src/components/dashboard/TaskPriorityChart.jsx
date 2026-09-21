import React from 'react';
import { Card } from '../common/Card';

export const TaskPriorityChart = ({ priorityDistribution = {} }) => {
  const total = Object.values(priorityDistribution).reduce((acc, curr) => acc + curr, 0);

  const priorities = [
    { label: 'Urgent', count: priorityDistribution.Urgent || 0, color: 'bg-rose-500', barColor: 'bg-rose-500' },
    { label: 'High', count: priorityDistribution.High || 0, color: 'bg-amber-500', barColor: 'bg-amber-500' },
    { label: 'Medium', count: priorityDistribution.Medium || 0, color: 'bg-blue-500', barColor: 'bg-blue-500' },
    { label: 'Low', count: priorityDistribution.Low || 0, color: 'bg-slate-400', barColor: 'bg-slate-400' },
  ];

  return (
    <Card className="p-6">
      <div className="mb-4">
        <h4 className="text-sm font-bold text-slate-900">Task Priority Distribution</h4>
        <p className="text-xs text-slate-500">Breakdown of workload urgency</p>
      </div>

      <div className="space-y-3.5">
        {priorities.map((item) => {
          const percent = total > 0 ? Math.round((item.count / total) * 100) : 0;
          return (
            <div key={item.label} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700 flex items-center space-x-2">
                  <span className={`w-2 h-2 rounded-full ${item.color}`} />
                  <span>{item.label}</span>
                </span>
                <span className="text-slate-500 font-mono">
                  {item.count} <span className="text-slate-400">({percent}%)</span>
                </span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div
                  className={`h-2 rounded-full transition-all duration-500 ${item.barColor}`}
                  style={{ width: `${percent}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};
