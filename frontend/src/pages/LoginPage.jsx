import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Layers, Mail, Lock, Sparkles, ArrowRight } from 'lucide-react';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      showToast('Please enter both email and password', 'error');
      return;
    }
    setLoading(true);
    try {
      await login(email, password);
      showToast('Welcome back to Innovation ProjectHub AI!', 'success');
      navigate('/dashboard');
    } catch (err) {
      showToast(err.response?.data?.error || err.message || 'Login failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoCredentials = () => {
    setEmail('demo@projecthub.ai');
    setPassword('Innovation2026!');
    showToast('Loaded demo credentials!', 'info');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md space-y-8 rounded-3xl border border-slate-200/80 bg-white p-8 shadow-xl">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/25">
            <Layers className="h-6 w-6" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">ProjectHub AI</h2>
          <p className="text-xs text-slate-500 font-medium">
            AI-Powered Project & Task Management SaaS
          </p>
        </div>

        {/* Demo Fast Fill Pill */}
        <div className="rounded-2xl border border-indigo-100 bg-indigo-50/60 p-3.5 text-center">
          <p className="text-xs text-indigo-900 font-medium mb-2">
            Evaluating the application? Click to auto-fill pre-seeded demo credentials:
          </p>
          <button
            type="button"
            onClick={fillDemoCredentials}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-white border border-indigo-200 text-xs font-bold text-indigo-700 hover:bg-indigo-50 shadow-sm transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>Use Demo Account (demo@projecthub.ai)</span>
          </button>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="email"
            label="Email Address"
            placeholder="you@company.com"
            icon={Mail}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <Input
            type="password"
            label="Password"
            placeholder="••••••••"
            icon={Lock}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <Button
            type="submit"
            isLoading={loading}
            className="w-full"
            size="lg"
            icon={ArrowRight}
          >
            Sign in to Workspace
          </Button>
        </form>

        <div className="text-center pt-2 border-t border-slate-100">
          <p className="text-xs text-slate-500">
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold text-indigo-600 hover:underline">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
