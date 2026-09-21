import React from 'react';
import { StatusBadge, PriorityBadge } from '../common/Badge';
import { Calendar, Clock, Edit2, Trash2 } from 'lucide-react';

export const TaskTable = ({ tasks = [], onEdit, onDelete, onStatusChange }) => {
  const isOverdue = (dateStr, status) => {
    if (!dateStr || status === 'Done') return false;
    return new Date(dateStr) < new Date();
  };

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200/80 bg-white shadow-sm">
      <table className="min-w-full divide-y divide-slate-200 text-left text-xs">
        <thead className="bg-slate-50 font-semibold text-slate-600 uppercase tracking-wider">
          <tr>
            <th scope="col" className="px-5 py-3.5">Task</th>
            <th scope="col" className="px-4 py-3.5">Project</th>
            <th scope="col" className="px-4 py-3.5">Status</th>
            <th scope="col" className="px-4 py-3.5">Priority</th>
            <th scope="col" className="px-4 py-3.5">Due Date</th>
            <th scope="col" className="px-4 py-3.5">Effort</th>
            <th scope="col" className="px-4 py-3.5 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
          {tasks.map((task) => (
            <tr key={task.id} className="hover:bg-slate-50/70 transition-colors">
              <td className="px-5 py-4 max-w-xs">
                <p className={`font-semibold ${task.status === 'Done' ? 'line-through text-slate-400' : 'text-slate-900'} truncate`}>
                  {task.title}
                </p>
                {task.description && (
                  <p className="text-[11px] text-slate-400 truncate mt-0.5">{task.description}</p>
                )}
              </td>

              <td className="px-4 py-4 whitespace-nowrap">
                {task.project_title ? (
                  <span
                    className="inline-block text-[10px] font-bold text-white px-2 py-0.5 rounded"
                    style={{ backgroundColor: task.project_color || '#4F46E5' }}
                  >
                    {task.project_title}
                  </span>
                ) : (
                  <span className="text-slate-400">—</span>
                )}
              </td>

              <td className="px-4 py-4 whitespace-nowrap">
                <select
                  value={task.status}
                  onChange={(e) => onStatusChange(task.id, e.target.value)}
                  className="bg-transparent border border-slate-200 rounded-lg px-2 py-1 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="Todo">Todo</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Done">Done</option>
                </select>
              </td>

              <td className="px-4 py-4 whitespace-nowrap">
                <PriorityBadge priority={task.priority} />
              </td>

              <td className="px-4 py-4 whitespace-nowrap">
                {task.due_date ? (
                  <span
                    className={`inline-flex items-center space-x-1 ${
                      isOverdue(task.due_date, task.status) ? 'text-rose-600 font-bold' : 'text-slate-600'
                    }`}
                  >
                    <Calendar className="w-3.5 h-3.5 mr-1 text-slate-400" />
                    <span>{task.due_date}</span>
                    {isOverdue(task.due_date, task.status) && (
                      <span className="ml-1 text-[9px] bg-rose-100 text-rose-700 px-1.5 py-0.2 rounded font-bold uppercase">
                        Overdue
                      </span>
                    )}
                  </span>
                ) : (
                  <span className="text-slate-400">No deadline</span>
                )}
              </td>

              <td className="px-4 py-4 whitespace-nowrap text-slate-500 font-mono">
                {task.estimated_hours ? `${task.estimated_hours} hrs` : '—'}
              </td>

              <td className="px-4 py-4 whitespace-nowrap text-right space-x-1">
                <button
                  onClick={() => onEdit(task)}
                  className="p-1.5 text-slate-400 hover:text-indigo-600 rounded hover:bg-slate-100 transition-colors"
                  title="Edit task"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDelete(task)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded hover:bg-rose-50 transition-colors"
                  title="Delete task"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
