import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { projectService } from '../services/projectService';
import { taskService } from '../services/taskService';
import { TaskTable } from '../components/tasks/TaskTable';
import { KanbanBoard } from '../components/tasks/KanbanBoard';
import { TaskModal } from '../components/tasks/TaskModal';
import { ProjectModal } from '../components/projects/ProjectModal';
import { AITaskGeneratorModal } from '../components/ai/AITaskGeneratorModal';
import { AIProjectSummaryModal } from '../components/ai/AIProjectSummaryModal';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { Button } from '../components/common/Button';
import { StatusBadge } from '../components/common/Badge';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { useToast } from '../context/ToastContext';
import {
  ArrowLeft,
  Calendar,
  Sparkles,
  Plus,
  LayoutList,
  Kanban,
  Edit2,
  Trash2,
  FileText,
} from 'lucide-react';

export const ProjectDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('kanban'); // 'list' | 'kanban'

  // Modals
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [defaultTaskStatus, setDefaultTaskStatus] = useState('Todo');

  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isAiTaskModalOpen, setIsAiTaskModalOpen] = useState(false);
  const [isAiSummaryModalOpen, setIsAiSummaryModalOpen] = useState(false);

  const [deleteTaskConfirm, setDeleteTaskConfirm] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);

  const [deleteProjectConfirm, setDeleteProjectConfirm] = useState(false);
  const [saving, setSaving] = useState(false);

  const loadProjectData = async () => {
    try {
      const [projRes, tasksRes] = await Promise.all([
        projectService.getById(id),
        taskService.getAll({ project_id: id }),
      ]);
      if (projRes.success) setProject(projRes.data);
      if (tasksRes.success) setTasks(tasksRes.data || []);
    } catch (err) {
      showToast('Failed to load project details', 'error');
      navigate('/projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjectData();
  }, [id]);

  const handleSaveTask = async (formData) => {
    setSaving(true);
    try {
      if (editingTask) {
        await taskService.update(editingTask.id, formData);
        showToast('Task updated!', 'success');
      } else {
        await taskService.create({ ...formData, project_id: parseInt(id, 10) });
        showToast('Task created!', 'success');
      }
      setIsTaskModalOpen(false);
      setEditingTask(null);
      loadProjectData();
    } catch (err) {
      showToast(err.response?.data?.error || 'Failed to save task', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await taskService.updateStatus(taskId, newStatus);
      showToast(`Moved to ${newStatus}`, 'success');
      loadProjectData();
    } catch (err) {
      showToast('Failed to update status', 'error');
    }
  };

  const handleDeleteTask = async () => {
    if (!taskToDelete) return;
    setSaving(true);
    try {
      await taskService.delete(taskToDelete.id);
      showToast('Task deleted successfully', 'success');
      setDeleteTaskConfirm(false);
      setTaskToDelete(null);
      loadProjectData();
    } catch (err) {
      showToast('Failed to delete task', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveProject = async (formData) => {
    setSaving(true);
    try {
      await projectService.update(id, formData);
      showToast('Project updated!', 'success');
      setIsProjectModalOpen(false);
      loadProjectData();
    } catch (err) {
      showToast('Failed to update project', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteProject = async () => {
    setSaving(true);
    try {
      await projectService.delete(id);
      showToast('Project deleted successfully', 'success');
      navigate('/projects');
    } catch (err) {
      showToast('Failed to delete project', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingSpinner label="Loading project details..." size="lg" />;
  }

  if (!project) return null;

  return (
    <div className="space-y-6">
      {/* Back button & quick breadcrumb */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/projects')}
          className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Projects</span>
        </button>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsProjectModalOpen(true)}
            className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-white border border-slate-200 transition-colors"
            title="Edit Project"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setDeleteProjectConfirm(true)}
            className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-white border border-slate-200 transition-colors"
            title="Delete Project"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Project Overview Banner */}
      <div
        className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm border-t-8"
        style={{ borderTopColor: project.color || '#4F46E5' }}
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center space-x-2.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-md">
                {project.category}
              </span>
              <StatusBadge status={project.status} />
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">{project.title}</h1>
            <p className="text-xs text-slate-500 max-w-2xl leading-relaxed">
              {project.description || 'No description provided.'}
            </p>
          </div>

          {/* Progress & Milestone */}
          <div className="flex items-center space-x-6 bg-slate-50 border border-slate-100 p-4 rounded-2xl">
            <div>
              <p className="text-[11px] uppercase font-bold text-slate-400">Progress</p>
              <h3 className="text-2xl font-mono font-extrabold text-slate-900">{project.progress}%</h3>
              <p className="text-[11px] text-slate-500">{project.completed_task_count} of {project.task_count} Done</p>
            </div>

            <div className="h-10 w-px bg-slate-200" />

            <div>
              <p className="text-[11px] uppercase font-bold text-slate-400">Milestone</p>
              <p className="text-xs font-semibold text-slate-700 flex items-center space-x-1 mt-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>{project.end_date ? project.end_date : 'No deadline'}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Action bar inside banner */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-5 mt-5 border-t border-slate-100">
          <div className="flex items-center space-x-2">
            <Button
              variant="ai"
              size="sm"
              icon={Sparkles}
              onClick={() => setIsAiTaskModalOpen(true)}
            >
              AI Task Breakdown
            </Button>
            <Button
              variant="secondary"
              size="sm"
              icon={FileText}
              onClick={() => setIsAiSummaryModalOpen(true)}
            >
              AI Assessment
            </Button>
            <Button
              size="sm"
              icon={Plus}
              onClick={() => {
                setEditingTask(null);
                setDefaultTaskStatus('Todo');
                setIsTaskModalOpen(true);
              }}
            >
              Add Task
            </Button>
          </div>

          {/* View toggle */}
          <div className="flex items-center rounded-xl bg-slate-100 p-1 border border-slate-200">
            <button
              onClick={() => setViewMode('kanban')}
              className={`flex items-center space-x-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                viewMode === 'kanban' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Kanban className="w-3.5 h-3.5" />
              <span>Kanban</span>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center space-x-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                viewMode === 'list' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <LayoutList className="w-3.5 h-3.5" />
              <span>List Table</span>
            </button>
          </div>
        </div>
      </div>

      {/* Task Content */}
      {viewMode === 'kanban' ? (
        <KanbanBoard
          tasks={tasks}
          onEdit={(t) => {
            setEditingTask(t);
            setIsTaskModalOpen(true);
          }}
          onDelete={(t) => {
            setTaskToDelete(t);
            setDeleteTaskConfirm(true);
          }}
          onStatusChange={handleStatusChange}
          onNewTask={(status) => {
            setEditingTask(null);
            setDefaultTaskStatus(status);
            setIsTaskModalOpen(true);
          }}
        />
      ) : (
        <TaskTable
          tasks={tasks}
          onEdit={(t) => {
            setEditingTask(t);
            setIsTaskModalOpen(true);
          }}
          onDelete={(t) => {
            setTaskToDelete(t);
            setDeleteTaskConfirm(true);
          }}
          onStatusChange={handleStatusChange}
        />
      )}

      {/* Modals */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => {
          setIsTaskModalOpen(false);
          setEditingTask(null);
        }}
        onSave={handleSaveTask}
        task={editingTask}
        projects={[project]}
        defaultProjectId={project.id}
        defaultStatus={defaultTaskStatus}
        isLoading={saving}
      />

      <ProjectModal
        isOpen={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
        onSave={handleSaveProject}
        project={project}
        isLoading={saving}
      />

      <AITaskGeneratorModal
        isOpen={isAiTaskModalOpen}
        onClose={() => setIsAiTaskModalOpen(false)}
        projects={[project]}
        initialProjectId={project.id}
        onTasksCreated={loadProjectData}
      />

      <AIProjectSummaryModal
        isOpen={isAiSummaryModalOpen}
        onClose={() => setIsAiSummaryModalOpen(false)}
        projectId={project.id}
        projectTitle={project.title}
      />

      <ConfirmDialog
        isOpen={deleteTaskConfirm}
        onClose={() => setDeleteTaskConfirm(false)}
        onConfirm={handleDeleteTask}
        title="Delete Task"
        message={`Delete task "${taskToDelete?.title}"?`}
        confirmLabel="Delete Task"
        isLoading={saving}
      />

      <ConfirmDialog
        isOpen={deleteProjectConfirm}
        onClose={() => setDeleteProjectConfirm(false)}
        onConfirm={handleDeleteProject}
        title="Delete Project"
        message={`Are you sure you want to delete "${project.title}"?`}
        confirmLabel="Delete Project"
        isLoading={saving}
      />
    </div>
  );
};
