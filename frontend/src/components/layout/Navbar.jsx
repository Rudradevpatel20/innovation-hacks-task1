import React from 'react';
import { Menu, Sparkles, Bell } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export const Navbar = ({ onMobileMenuToggle }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/95 px-4 sm:px-6 backdrop-blur-md">
      <div className="flex items-center space-x-3">
        <button
          type="button"
          onClick={onMobileMenuToggle}
          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700 lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>
        <span className="hidden sm:inline-block text-xs font-medium text-slate-500">
          Innovation Hacks Full Stack Internship SaaS
        </span>
      </div>

      <div className="flex items-center space-x-3">
        {/* Fast AI shortcut button */}
        <button
          onClick={() => navigate('/ai-hub')}
          className="inline-flex items-center space-x-1.5 rounded-lg bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700 hover:bg-indigo-100 transition-colors"
        >
          <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
          <span className="hidden sm:inline">AI Task Assistant</span>
        </button>

        <div className="h-5 w-px bg-slate-200" />

        {/* User Pill */}
        <div className="flex items-center space-x-2.5">
          <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-indigo-600 to-indigo-400 text-white flex items-center justify-center font-bold text-xs shadow-sm">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <span className="text-xs font-semibold text-slate-800 hidden md:inline-block">
            {user?.name}
          </span>
        </div>
      </div>
    </header>
  );
};
