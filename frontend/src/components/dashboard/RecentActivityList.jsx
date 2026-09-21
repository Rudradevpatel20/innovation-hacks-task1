import React from 'react';
import { Card } from '../common/Card';
import { Activity, Clock } from 'lucide-react';

export const RecentActivityList = ({ activities = [] }) => {
  const formatTime = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    return date.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Card className="p-6">
      <div className="flex items-center space-x-2 mb-4">
        <Activity className="w-4 h-4 text-indigo-600" />
        <h4 className="text-sm font-bold text-slate-900">Audit & Recent Activity</h4>
      </div>

      {activities.length === 0 ? (
        <p className="text-xs text-slate-400 py-6 text-center">No recent actions recorded</p>
      ) : (
        <div className="space-y-3">
          {activities.map((act) => (
            <div
              key={act.id}
              className="flex items-start justify-between border-b border-slate-100 pb-3 last:border-0 last:pb-0"
            >
              <div>
                <p className="text-xs font-semibold text-slate-800">{act.action}</p>
                {act.details && <p className="text-xs text-slate-500 mt-0.5">{act.details}</p>}
                {act.project_title && (
                  <span className="inline-block mt-1 text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-medium">
                    Project: {act.project_title}
                  </span>
                )}
              </div>
              <div className="flex items-center text-[11px] text-slate-400 font-mono whitespace-nowrap ml-4">
                <Clock className="w-3 h-3 mr-1" />
                {formatTime(act.created_at)}
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};
