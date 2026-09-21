import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../common/Card';
import { StatusBadge } from '../common/Badge';
import { Calendar, CheckSquare, MoreVertical, Edit2, Trash2, ArrowRight } from 'lucide-react';

export const ProjectCard = ({ project, onEdit, onDelete }) => {
  const navigate = useNavigate();

  const handleCardClick = (e) => {
    // Don't navigate if clicking action buttons
    if (e.target.closest('button')) return;
    navigate(`/projects/${project.id}`);
  };

  return (
    <Card
      onClick={handleCardClick}
      hover={true}
      className="flex flex-col justify-between h-full relative overflow-hidden group border-t-4"
      style={{ borderTopColor: project.color || '#4F46E5' }}
    >
      <div>
        <div className="flex items-start justify-between gap-2 mb-2.5">
          <div className="flex items-center space-x-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-md">
              {project.category || 'General'}
            </span>
            <StatusBadge status={project.status} />
          </div>

          <div className="flex items-center space-x-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(project);
              }}
              className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-colors"
              title="Edit project"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(project);
              }}
              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
              title="Delete project"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
          {project.title}
        </h3>
        <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
          {project.description || 'No description provided.'}
        </p>
      </div>

      <div className="mt-5 pt-4 border-t border-slate-100">
        <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
          <span className="text-slate-600 flex items-center space-x-1.5">
            <CheckSquare className="w-3.5 h-3.5 text-slate-400" />
            <span>
              {project.completed_task_count || 0}/{project.task_count || 0} Tasks
            </span>
          </span>
          <span className="font-mono text-slate-800">{project.progress || 0}%</span>
        </div>

        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden mb-3">
          <div
            className="h-2 rounded-full transition-all duration-500"
            style={{
              width: `${project.progress || 0}%`,
              backgroundColor: project.color || '#4F46E5',
            }}
          />
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center space-x-1">
            <Calendar className="w-3 h-3" />
            <span>{project.end_date ? `Due ${project.end_date}` : 'No deadline'}</span>
          </div>
          <span className="flex items-center font-semibold text-indigo-600 group-hover:translate-x-0.5 transition-transform">
            View <ArrowRight className="w-3 h-3 ml-0.5" />
          </span>
        </div>
      </div>
    </Card>
  );
};
