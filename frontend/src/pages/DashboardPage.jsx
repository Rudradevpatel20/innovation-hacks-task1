import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { dashboardService } from '../services/dashboardService';
import { projectService } from '../services/projectService';
import { StatCard } from '../components/dashboard/StatCard';
import { ProjectProgressChart } from '../components/dashboard/ProjectProgressChart';
import { TaskPriorityChart } from '../components/dashboard/TaskPriorityChart';
import { RecentActivityList } from '../components/dashboard/RecentActivityList';
import { AIInsightsCard } from '../components/ai/AIInsightsCard';
import { AITaskGeneratorModal } from '../components/ai/AITaskGeneratorModal';
import { Button } from '../components/common/Button';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import {
  FolderKanban,
  CheckCircle,
  Clock,
  AlertTriangle,
  Sparkles,
  Plus,
  Percent,
} from 'lucide-react';

export const DashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const navigate = useNavigate();

  const loadData = async () => {
    try {
      const [statsRes, projRes] = await Promise.all([
        dashboardService.getStats(),
        projectService.getAll(),
      ]);
      if (statsRes.success) setStats(statsRes.data);
      if (projRes.success) setProjects(projRes.data || []);
    } catch (err) {
      console.error('Failed to load dashboard metrics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return <LoadingSpinner label="Loading live SaaS metrics..." size="lg" />;
  }

  const summary = stats?.summary || {
    total_projects: 0,
    active_projects: 0,
    total_tasks: 0,
    completed_tasks: 0,
    pending_tasks: 0,
    overdue_tasks: 0,
    completion_rate: 0,
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Executive Dashboard</h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time analytics, calculated completion rates, and AI-accelerated delivery
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <Button
            variant="ai"
            size="sm"
            icon={Sparkles}
            onClick={() => setIsAiModalOpen(true)}
          >
            AI Task Breakdown
          </Button>
          <Button
            size="sm"
            icon={Plus}
            onClick={() => navigate('/projects')}
          >
            New Project
          </Button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Projects"
          value={summary.total_projects}
          subtitle={`${summary.active_projects} active in delivery`}
          icon={FolderKanban}
          color="indigo"
        />
        <StatCard
          title="Overall Completion"
          value={`${summary.completion_rate}%`}
          subtitle={`${summary.completed_tasks} of ${summary.total_tasks} tasks done`}
          icon={Percent}
          color="emerald"
        />
        <StatCard
          title="Pending Deliverables"
          value={summary.pending_tasks}
          subtitle="In Progress or Queued Todo"
          icon={Clock}
          color="amber"
        />
        <StatCard
          title="Overdue Tasks"
          value={summary.overdue_tasks}
          subtitle={summary.overdue_tasks > 0 ? "Requires attention" : "All deadlines on track"}
          icon={AlertTriangle}
          color={summary.overdue_tasks > 0 ? "rose" : "emerald"}
        />
      </div>

      {/* Charts & AI Insights Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <ProjectProgressChart projects={stats?.projects_progress || []} />
          <TaskPriorityChart priorityDistribution={stats?.priority_distribution || {}} />
        </div>

        <div className="space-y-6">
          <AIInsightsCard />
          <RecentActivityList activities={stats?.recent_activities || []} />
        </div>
      </div>

      {/* AI Task Generator Modal */}
      <AITaskGeneratorModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        projects={projects}
        onTasksCreated={loadData}
      />
    </div>
  );
};
