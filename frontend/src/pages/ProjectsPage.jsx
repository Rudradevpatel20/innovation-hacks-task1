import React, { useState, useEffect } from 'react';
import { projectService } from '../services/projectService';
import { ProjectCard } from '../components/projects/ProjectCard';
import { ProjectModal } from '../components/projects/ProjectModal';
import { ProjectFilterBar } from '../components/projects/ProjectFilterBar';
import { AITaskGeneratorModal } from '../components/ai/AITaskGeneratorModal';
import { Button } from '../components/common/Button';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { EmptyState } from '../components/common/EmptyState';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { useToast } from '../context/ToastContext';
import { Plus, Sparkles, FolderPlus } from 'lucide-react';

export const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('All');
  const [category, setCategory] = useState('All');

  const [modalOpen, setModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const { showToast } = useToast();

  const loadProjects = async () => {
    try {
      const res = await projectService.getAll({
        search: search || undefined,
        status: status !== 'All' ? status : undefined,
        category: category !== 'All' ? category : undefined,
      });
      if (res.success) {
        setProjects(res.data || []);
      }
    } catch (err) {
      showToast('Failed to load projects', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, [search, status, category]);

  const handleSaveProject = async (formData) => {
    setSaving(true);
    try {
      if (editingProject) {
        await projectService.update(editingProject.id, formData);
        showToast('Project updated successfully!', 'success');
      } else {
        await projectService.create(formData);
        showToast('Project created successfully!', 'success');
      }
      setModalOpen(false);
      setEditingProject(null);
      loadProjects();
    } catch (err) {
      showToast(err.response?.data?.error || 'Failed to save project', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteProject = async () => {
    if (!projectToDelete) return;
    setSaving(true);
    try {
      await projectService.delete(projectToDelete.id);
      showToast('Project deleted successfully', 'success');
      setDeleteConfirmOpen(false);
      setProjectToDelete(null);
      loadProjects();
    } catch (err) {
      showToast(err.response?.data?.error || 'Failed to delete project', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Projects</h1>
          <p className="text-xs text-slate-500 mt-1">
            Track milestones, budgets, and automated completion rates across your initiatives
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
            onClick={() => {
              setEditingProject(null);
              setModalOpen(true);
            }}
          >
            New Project
          </Button>
        </div>
      </div>

      {/* Filter Bar */}
      <ProjectFilterBar
        search={search}
        onSearchChange={setSearch}
        status={status}
        onStatusChange={setStatus}
        category={category}
        onCategoryChange={setCategory}
      />

      {/* Projects Grid */}
      {loading ? (
        <LoadingSpinner label="Fetching projects from database..." />
      ) : projects.length === 0 ? (
        <EmptyState
          icon={FolderPlus}
          title="No projects found"
          description={
            search || status !== 'All' || category !== 'All'
              ? 'Try changing your filter settings to see matching projects.'
              : 'Create your first project to start tracking tasks and milestone progress.'
          }
          actionLabel="Create First Project"
          onAction={() => {
            setEditingProject(null);
            setModalOpen(true);
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((proj) => (
            <ProjectCard
              key={proj.id}
              project={proj}
              onEdit={(p) => {
                setEditingProject(p);
                setModalOpen(true);
              }}
              onDelete={(p) => {
                setProjectToDelete(p);
                setDeleteConfirmOpen(true);
              }}
            />
          ))}
        </div>
      )}

      {/* Create / Edit Project Modal */}
      <ProjectModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingProject(null);
        }}
        onSave={handleSaveProject}
        project={editingProject}
        isLoading={saving}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={handleDeleteProject}
        title="Delete Project"
        message={`Are you sure you want to delete "${projectToDelete?.title}"? All associated tasks will also be deleted.`}
        confirmLabel="Delete Project"
        isLoading={saving}
      />

      {/* AI Task Generator Modal */}
      <AITaskGeneratorModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        projects={projects}
        onTasksCreated={loadProjects}
      />
    </div>
  );
};
