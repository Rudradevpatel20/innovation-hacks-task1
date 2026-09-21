import React, { useState, useEffect } from 'react';
import { taskService } from '../services/taskService';
import { projectService } from '../services/projectService';
import { TaskTable } from '../components/tasks/TaskTable';
import { KanbanBoard } from '../components/tasks/KanbanBoard';
import { TaskModal } from '../components/tasks/TaskModal';
import { TaskFilterBar } from '../components/tasks/TaskFilterBar';
import { AITaskGeneratorModal } from '../components/ai/AITaskGeneratorModal';
import { Button } from '../components/common/Button';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { EmptyState } from '../components/common/EmptyState';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { useToast } from '../context/ToastContext';
import { Plus, Sparkles, LayoutList, Kanban, CheckSquare } from 'lucide-react';

export const TasksPage = () => {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('list'); // 'list' | 'kanban'

  // Filters
  const [search, setSearch] = useState('');
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [status, setStatus] = useState('All');
  const [priority, setPriority] = useState('All');
  const [sortBy, setSortBy] = useState('created_at');

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [defaultStatus, setDefaultStatus] = useState('Todo');
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const { showToast } = useToast();

  const loadData = async () => {
    try {
      const [tasksRes, projRes] = await Promise.all([
        taskService.getAll({
          project_id: selectedProjectId || undefined,
          status: status !== 'All' ? status : undefined,
          priority: priority !== 'All' ? priority : undefined,
          search: search || undefined,
          sort_by: sortBy,
        }),
        projectService.getAll(),
      ]);

      if (tasksRes.success) setTasks(tasksRes.data || []);
      if (projRes.success) setProjects(projRes.data || []);
    } catch (err) {
      showToast('Failed to load tasks', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [search, selectedProjectId, status, priority, sortBy]);

  const handleSaveTask = async (formData) => {
    setSaving(true);
    try {
      if (editingTask) {
        await taskService.update(editingTask.id, formData);
        showToast('Task updated successfully!', 'success');
      } else {
        await taskService.create(formData);
        showToast('Task created successfully!', 'success');
      }
      setIsModalOpen(false);
      setEditingTask(null);
      loadData();
    } catch (err) {
      showToast(err.response?.data?.error || 'Failed to save task', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await taskService.updateStatus(taskId, newStatus);
      showToast(`Status changed to ${newStatus}`, 'success');
      loadData();
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
      setDeleteConfirmOpen(false);
      setTaskToDelete(null);
      loadData();
    } catch (err) {
      showToast(err.response?.data?.error || 'Failed to delete task', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Tasks & Deliverables</h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage granular work items with dual List and Kanban visualization
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          {/* View Toggle */}
          <div className="flex items-center rounded-xl bg-slate-200/80 p-1 border border-slate-300/60">
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                viewMode === 'list' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <LayoutList className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">List</span>
            </button>
            <button
              onClick={() => setViewMode('kanban')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                viewMode === 'kanban' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Kanban className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Kanban</span>
            </button>
          </div>

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
            onClick={() => {
              setEditingTask(null);
              setDefaultStatus('Todo');
              setIsModalOpen(true);
            }}
          >
            New Task
          </Button>
        </div>
      </div>

      {/* Filter Bar */}
      <TaskFilterBar
        search={search}
        onSearchChange={setSearch}
        projectId={selectedProjectId}
        onProjectChange={setSelectedProjectId}
        status={status}
        onStatusChange={setStatus}
        priority={priority}
        onPriorityChange={setPriority}
        sortBy={sortBy}
        onSortChange={setSortBy}
        projects={projects}
      />

      {/* Content */}
      {loading ? (
        <LoadingSpinner label="Fetching tasks..." />
      ) : tasks.length === 0 ? (
        <EmptyState
          icon={CheckSquare}
          title="No tasks found"
          description={
            search || selectedProjectId || status !== 'All' || priority !== 'All'
              ? 'No tasks match your filter criteria. Try resetting filters.'
              : 'Add your first task or use AI to generate structured tasks for a project.'
          }
          actionLabel="Create First Task"
          onAction={() => {
            setEditingTask(null);
            setDefaultStatus('Todo');
            setIsModalOpen(true);
          }}
        />
      ) : viewMode === 'list' ? (
        <TaskTable
          tasks={tasks}
          onEdit={(t) => {
            setEditingTask(t);
            setIsModalOpen(true);
          }}
          onDelete={(t) => {
            setTaskToDelete(t);
            setDeleteConfirmOpen(true);
          }}
          onStatusChange={handleStatusChange}
        />
      ) : (
        <KanbanBoard
          tasks={tasks}
          onEdit={(t) => {
            setEditingTask(t);
            setIsModalOpen(true);
          }}
          onDelete={(t) => {
            setTaskToDelete(t);
            setDeleteConfirmOpen(true);
          }}
          onStatusChange={handleStatusChange}
          onNewTask={(colStatus) => {
            setEditingTask(null);
            setDefaultStatus(colStatus);
            setIsModalOpen(true);
          }}
        />
      )}

      {/* Modals */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTask(null);
        }}
        onSave={handleSaveTask}
        task={editingTask}
        projects={projects}
        defaultStatus={defaultStatus}
        isLoading={saving}
      />

      <ConfirmDialog
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={handleDeleteTask}
        title="Delete Task"
        message={`Are you sure you want to delete "${taskToDelete?.title}"?`}
        confirmLabel="Delete Task"
        isLoading={saving}
      />

      <AITaskGeneratorModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        projects={projects}
        onTasksCreated={loadData}
      />
    </div>
  );
};
