import React from 'react';
import { Search, Filter } from 'lucide-react';

export const ProjectFilterBar = ({
  search,
  onSearchChange,
  status,
  onStatusChange,
  category,
  onCategoryChange,
}) => {
  const statuses = ['All', 'Active', 'Completed', 'On Hold', 'Archived'];
  const categories = ['All', 'General', 'Engineering', 'Marketing', 'Design', 'Mobile', 'Operations', 'Research'];

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-sm">
      <div className="relative w-full sm:w-80">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search projects..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-colors"
        />
      </div>

      <div className="flex items-center space-x-2.5 w-full sm:w-auto">
        <div className="flex items-center space-x-1.5 text-xs text-slate-500">
          <Filter className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Filters:</span>
        </div>

        <select
          value={status}
          onChange={(e) => onStatusChange(e.target.value)}
          className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
        >
          {statuses.map((s) => (
            <option key={s} value={s}>
              Status: {s}
            </option>
          ))}
        </select>

        <select
          value={category}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
        >
          {categories.map((c) => (
            <option key={c} value={c}>
              Category: {c}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
