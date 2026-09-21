import React from 'react';
import { TaskCard } from './TaskCard';
import { Plus } from 'lucide-react';

export const KanbanBoard = ({ tasks = [], onEdit, onDelete, onStatusChange, onNewTask }) => {
  const columns = [
    { status: 'Todo', title: 'To Do', color: 'bg-slate-500', headerBg: 'bg-slate-100' },
    { status: 'In Progress', title: 'In Progress', color: 'bg-sky-500', headerBg: 'bg-sky-50' },
    { status: 'Done', title: 'Completed', color: 'bg-emerald-500', headerBg: 'bg-emerald-50' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {columns.map((col) => {
        const colTasks = tasks.filter((t) => t.status === col.status);
        return (
          <div key={col.status} className="flex flex-col rounded-2xl bg-slate-100/70 p-4 border border-slate-200/60 min-h-[500px]">
            {/* Column Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <span className={`w-2.5 h-2.5 rounded-full ${col.color}`} />
                <h3 className="text-sm font-bold text-slate-800">{col.title}</h3>
                <span className="rounded-full bg-white border border-slate-200 px-2 py-0.5 text-xs font-mono font-semibold text-slate-600">
                  {colTasks.length}
                </span>
              </div>
              <button
                onClick={() => onNewTask(col.status)}
                className="p-1 text-slate-500 hover:text-indigo-600 hover:bg-white rounded-lg transition-colors"
                title={`Add task to ${col.title}`}
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Task list in column */}
            <div className="flex-1 space-y-3 overflow-y-auto pr-1">
              {colTasks.length === 0 ? (
                <div className="flex h-32 items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-white/50 text-xs text-slate-400 font-medium">
                  No tasks in {col.title}
                </div>
              ) : (
                colTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onStatusChange={onStatusChange}
                  />
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
