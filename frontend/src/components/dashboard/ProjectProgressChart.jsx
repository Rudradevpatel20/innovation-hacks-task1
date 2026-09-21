import React from 'react';
import { Card } from '../common/Card';
import { useNavigate } from 'react-router-dom';

export const ProjectProgressChart = ({ projects = [] }) => {
  const navigate = useNavigate();

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-sm font-bold text-slate-900">Project Completion Velocity</h4>
          <p className="text-xs text-slate-500">Calculated directly from project task completion</p>
        </div>
        <button
          onClick={() => navigate('/projects')}
          className="text-xs font-semibold text-indigo-600 hover:text-indigo-700"
        >
          View all
        </button>
      </div>

      {projects.length === 0 ? (
        <p className="text-xs text-slate-400 py-6 text-center">No active projects to display</p>
      ) : (
        <div className="space-y-4">
          {projects.map((proj) => (
            <div
              key={proj.id}
              onClick={() => navigate(`/projects/${proj.id}`)}
              className="group cursor-pointer rounded-xl p-2.5 hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
                <span className="text-slate-800 group-hover:text-indigo-600 transition-colors truncate max-w-[200px]">
                  {proj.title}
                </span>
                <span className="text-slate-600 font-mono">{proj.progress}%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div
                  className="h-2 rounded-full transition-all duration-500"
                  style={{
                    width: `${proj.progress}%`,
                    backgroundColor: proj.color || '#4F46E5',
                  }}
                />
              </div>
              <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                <span>{proj.completed_tasks} of {proj.total_tasks} tasks complete</span>
                <span className="capitalize">{proj.status}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};
