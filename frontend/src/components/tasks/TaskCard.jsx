import React from 'react';
import { StatusBadge, PriorityBadge } from '../common/Badge';
import { Calendar, Clock, Edit2, Trash2, ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';

export const TaskCard = ({ task, onEdit, onDelete, onStatusChange }) => {
  const isOverdue = task.due_date && new Date(task.due_date) < new Date() && task.status !== 'Done';

  return (
    <div className="rounded-xl border border-slate-200/90 bg-white p-4 shadow-sm hover:shadow-md transition-all group">
      <div className="flex items-start justify-between gap-2 mb-2">
        <PriorityBadge priority={task.priority} />
        <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(task)}
            className="p-1 text-slate-400 hover:text-indigo-600 rounded hover:bg-slate-50 transition-colors"
            title="Edit task"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onDelete(task)}
            className="p-1 text-slate-400 hover:text-rose-600 rounded hover:bg-rose-50 transition-colors"
            title="Delete task"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <h4 className={`text-sm font-semibold ${task.status === 'Done' ? 'line-through text-slate-400' : 'text-slate-800'} mb-1`}>
        {task.title}
      </h4>

      {task.description && (
        <p className="text-xs text-slate-500 line-clamp-2 mb-3 leading-relaxed">
          {task.description}
        </p>
      )}

      {task.project_title && (
        <div className="mb-3">
          <span
            className="inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded text-white"
            style={{ backgroundColor: task.project_color || '#4F46E5' }}
          >
            {task.project_title}
          </span>
        </div>
      )}

      <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-[11px] text-slate-500">
        <div className="flex items-center space-x-2">
          {task.due_date && (
            <span className={`flex items-center space-x-1 ${isOverdue ? 'text-rose-600 font-semibold' : ''}`}>
              <Calendar className="w-3 h-3" />
              <span>{task.due_date}</span>
            </span>
          )}
          {task.estimated_hours > 0 && (
            <span className="flex items-center space-x-0.5 text-slate-400">
              <Clock className="w-3 h-3" />
              <span>{task.estimated_hours}h</span>
            </span>
          )}
        </div>

        {/* Quick status cycle buttons */}
        <div className="flex items-center space-x-1">
          {task.status === 'In Progress' && (
            <button
              onClick={() => onStatusChange(task.id, 'Todo')}
              className="p-1 hover:bg-slate-100 rounded text-slate-500"
              title="Move to Todo"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
            </button>
          )}
          {task.status === 'Todo' && (
            <button
              onClick={() => onStatusChange(task.id, 'In Progress')}
              className="px-2 py-0.5 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 rounded text-[10px] font-medium flex items-center space-x-1"
            >
              <span>Start</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          )}
          {task.status === 'In Progress' && (
            <button
              onClick={() => onStatusChange(task.id, 'Done')}
              className="px-2 py-0.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded text-[10px] font-medium flex items-center space-x-1"
            >
              <CheckCircle2 className="w-3 h-3" />
              <span>Done</span>
            </button>
          )}
          {task.status === 'Done' && (
            <button
              onClick={() => onStatusChange(task.id, 'In Progress')}
              className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 rounded text-[10px] font-medium text-slate-600"
            >
              Reopen
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
