import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Sparkles, Check, CheckSquare, Edit3, Trash2, Calendar, Clock, AlertCircle } from 'lucide-react';
import { aiService } from '../../services/aiService';
import { taskService } from '../../services/taskService';
import { useToast } from '../../context/ToastContext';
import { PriorityBadge } from '../common/Badge';

export const AITaskGeneratorModal = ({
  isOpen,
  onClose,
  projects = [],
  initialProjectId = null,
  onTasksCreated,
}) => {
  const { showToast } = useToast();
  const [selectedProjectId, setSelectedProjectId] = useState(initialProjectId || (projects[0]?.id || ''));
  const [prompt, setPrompt] = useState('');
  const [taskCount, setTaskCount] = useState(5);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [generatedTasks, setGeneratedTasks] = useState([]);
  const [selectedIndices, setSelectedIndices] = useState(new Set());
  const [aiNotice, setAiNotice] = useState('');

  const handleGenerate = async () => {
    if (!selectedProjectId) {
      showToast('Please select a project', 'error');
      return;
    }
    if (!prompt.trim()) {
      showToast('Please describe your project goals or feature requirements', 'error');
      return;
    }

    setIsGenerating(true);
    setAiNotice('');
    try {
      const res = await aiService.generateTasks(parseInt(selectedProjectId, 10), prompt, taskCount);
      if (res.success && res.data) {
        const tasks = res.data.tasks || [];
        setGeneratedTasks(tasks);
        setSelectedIndices(new Set(tasks.map((_, i) => i)));
        if (res.data.notice) {
          setAiNotice(res.data.notice);
        }
        showToast(`AI generated ${tasks.length} structured tasks! Please review before saving.`, 'success');
      }
    } catch (err) {
      showToast(err.response?.data?.error || 'Failed to generate tasks with AI', 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  const toggleSelect = (index) => {
    const next = new Set(selectedIndices);
    if (next.has(index)) next.delete(index);
    else next.add(index);
    setSelectedIndices(next);
  };

  const updateTaskField = (index, field, value) => {
    const updated = [...generatedTasks];
    updated[index] = { ...updated[index], [field]: value };
    setGeneratedTasks(updated);
  };

  const removeGeneratedTask = (index) => {
    const updated = generatedTasks.filter((_, i) => i !== index);
    setGeneratedTasks(updated);
    const next = new Set();
    updated.forEach((_, i) => next.add(i));
    setSelectedIndices(next);
  };

  const handleSaveToProject = async () => {
    const toSave = generatedTasks.filter((_, i) => selectedIndices.has(i));
    if (toSave.length === 0) {
      showToast('Please select at least one task to save', 'warning');
      return;
    }

    setIsSaving(true);
    try {
      await taskService.batchCreate(parseInt(selectedProjectId, 10), toSave);
      showToast(`Successfully added ${toSave.length} tasks to the project!`, 'success');
      setGeneratedTasks([]);
      setPrompt('');
      if (onTasksCreated) onTasksCreated();
      onClose();
    } catch (err) {
      showToast(err.response?.data?.error || 'Failed to save tasks', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="AI Task Breakdown Generator"
      subtitle="Transform requirements into structured, actionable team tasks powered by Gemini AI"
      maxWidth="max-w-3xl"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={isSaving || isGenerating}>
            Cancel
          </Button>
          {generatedTasks.length > 0 ? (
            <Button
              onClick={handleSaveToProject}
              isLoading={isSaving}
              icon={Check}
            >
              Save {selectedIndices.size} Reviewed Tasks to Project
            </Button>
          ) : (
            <Button
              variant="ai"
              onClick={handleGenerate}
              isLoading={isGenerating}
              icon={Sparkles}
            >
              Generate Structured Tasks
            </Button>
          )}
        </>
      }
    >
      <div className="space-y-5">
        {/* Project Selection & Prompt */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-2 space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
              Target Project *
            </label>
            <select
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              className="block w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-900 bg-white focus:border-indigo-500"
            >
              <option value="">Select project...</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
              Task Count
            </label>
            <select
              value={taskCount}
              onChange={(e) => setTaskCount(parseInt(e.target.value, 10))}
              className="block w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-900 bg-white focus:border-indigo-500"
            >
              <option value={3}>3 tasks (Focused)</option>
              <option value={5}>5 tasks (Balanced)</option>
              <option value={7}>7 tasks (Comprehensive)</option>
            </select>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
            Feature Goals / Requirements Prompt *
          </label>
          <textarea
            rows={3}
            placeholder="e.g. Build an OAuth2 Google login flow with session revocation, email verification, and security audit logging..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="block w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />
        </div>

        {/* Quick prompt suggestions */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-[11px] font-semibold text-slate-400 mr-1">Try:</span>
          {[
            'Stripe subscription checkout with webhook handlers',
            'Full-text Elasticsearch integration for projects and tasks',
            'REST API rate-limiting with Redis Token Bucket algorithm',
          ].map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              onClick={() => setPrompt(suggestion)}
              className="text-[10px] bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-600 px-2 py-1 rounded-md transition-colors text-left"
            >
              {suggestion}
            </button>
          ))}
        </div>

        {aiNotice && (
          <div className="flex items-start space-x-2 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs">
            <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <span>{aiNotice}</span>
          </div>
        )}

        {/* Generated Tasks Review Table */}
        {generatedTasks.length > 0 && (
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                  Review & Edit AI Proposed Tasks ({selectedIndices.size} selected)
                </h4>
                <p className="text-[11px] text-slate-500">
                  Modify titles, priorities, or due dates before saving directly into your database.
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setSelectedIndices(new Set(generatedTasks.map((_, i) => i)))}
                  className="text-xs text-indigo-600 hover:underline font-semibold"
                >
                  Select all
                </button>
                <span className="text-slate-300">|</span>
                <button
                  type="button"
                  onClick={() => setSelectedIndices(new Set())}
                  className="text-xs text-slate-500 hover:underline"
                >
                  Deselect all
                </button>
              </div>
            </div>

            <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
              {generatedTasks.map((t, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-xl border transition-all ${
                    selectedIndices.has(idx)
                      ? 'border-indigo-200 bg-indigo-50/20'
                      : 'border-slate-200 bg-slate-50/40 opacity-60'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <input
                      type="checkbox"
                      checked={selectedIndices.has(idx)}
                      onChange={() => toggleSelect(idx)}
                      className="mt-1 h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                    />

                    <div className="flex-1 space-y-2">
                      <input
                        type="text"
                        value={t.title}
                        onChange={(e) => updateTaskField(idx, 'title', e.target.value)}
                        className="w-full text-xs font-bold text-slate-900 bg-transparent border-b border-transparent focus:border-indigo-400 focus:outline-none"
                      />

                      <textarea
                        rows={2}
                        value={t.description}
                        onChange={(e) => updateTaskField(idx, 'description', e.target.value)}
                        className="w-full text-[11px] text-slate-600 bg-transparent border border-slate-200 rounded-lg p-1.5 focus:border-indigo-400 focus:outline-none"
                      />

                      {/* Breakdown subtasks if any */}
                      {t.breakdown && t.breakdown.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {t.breakdown.map((step, sIdx) => (
                            <span
                              key={sIdx}
                              className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded"
                            >
                              ✓ {step}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px]">
                        <div className="flex items-center space-x-1">
                          <span className="text-slate-500">Priority:</span>
                          <select
                            value={t.priority}
                            onChange={(e) => updateTaskField(idx, 'priority', e.target.value)}
                            className="bg-white border border-slate-200 rounded px-1.5 py-0.5 text-xs font-medium text-slate-700"
                          >
                            <option value="Low">Low</option>
                            <option value="Medium">Medium</option>
                            <option value="High">High</option>
                            <option value="Urgent">Urgent</option>
                          </select>
                        </div>

                        <div className="flex items-center space-x-1">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          <input
                            type="date"
                            value={t.due_date || ''}
                            onChange={(e) => updateTaskField(idx, 'due_date', e.target.value)}
                            className="bg-white border border-slate-200 rounded px-1.5 py-0.5 text-xs font-medium text-slate-700"
                          />
                        </div>

                        <div className="flex items-center space-x-1">
                          <Clock className="w-3 h-3 text-slate-400" />
                          <input
                            type="number"
                            step="0.5"
                            value={t.estimated_hours || 0}
                            onChange={(e) => updateTaskField(idx, 'estimated_hours', e.target.value)}
                            className="w-14 bg-white border border-slate-200 rounded px-1.5 py-0.5 text-xs font-medium text-slate-700"
                          />
                          <span className="text-slate-400">hrs</span>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeGeneratedTask(idx)}
                          className="ml-auto text-slate-400 hover:text-rose-600"
                          title="Discard task"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
