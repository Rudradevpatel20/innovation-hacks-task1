import React, { useState, useEffect } from 'react';
import { projectService } from '../services/projectService';
import { aiService } from '../services/aiService';
import { AITaskGeneratorModal } from '../components/ai/AITaskGeneratorModal';
import { AIProjectSummaryModal } from '../components/ai/AIProjectSummaryModal';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Sparkles, FileText, Lightbulb, CheckCircle2, ArrowRight } from 'lucide-react';
import { useToast } from '../context/ToastContext';

export const AIHubPage = () => {
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [isTaskGenOpen, setIsTaskGenOpen] = useState(false);
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);
  const [insights, setInsights] = useState(null);
  const [loadingInsights, setLoadingInsights] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    const init = async () => {
      try {
        const [projRes, insightsRes] = await Promise.all([
          projectService.getAll(),
          aiService.getProductivityInsights(),
        ]);
        if (projRes.success && projRes.data) {
          setProjects(projRes.data);
          if (projRes.data.length > 0) {
            setSelectedProjectId(projRes.data[0].id);
          }
        }
        if (insightsRes.success) {
          setInsights(insightsRes.data);
        }
      } catch (err) {
        console.error('AI Hub init error:', err);
      } finally {
        setLoadingInsights(false);
      }
    };
    init();
  }, []);

  const selectedProject = projects.find((p) => p.id === parseInt(selectedProjectId, 10));

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 p-8 text-white shadow-xl">
        <div className="flex items-center space-x-3 mb-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md">
            <Sparkles className="h-6 w-6 text-indigo-300" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-300">
              Intelligence Center
            </span>
            <h1 className="text-2xl font-black tracking-tight">AI Productivity Hub</h1>
          </div>
        </div>
        <p className="text-xs text-indigo-100 max-w-2xl leading-relaxed mt-2">
          Accelerate your delivery cycle with Google Gemini AI. Automatically synthesize project requirements into structured tasks, audit bottlenecks, and prioritize team workflows.
        </p>
      </div>

      {/* Feature Showcase Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Capability 1: Task Breakdown Generator */}
        <Card className="p-6 flex flex-col justify-between border-t-4 border-t-indigo-600">
          <div>
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">AI Task Breakdown Generator</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Describe a feature, goal, or technical objective in natural language. Gemini AI analyzes the scope and generates ready-to-assign tasks with priority levels, estimated hours, and checklists.
            </p>

            <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-100 text-[11px] text-slate-600 space-y-1">
              <div className="flex items-center space-x-1.5 font-semibold text-slate-800">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>Full Review Workflow</span>
              </div>
              <p>You can review, edit, check, or discard any proposed task before writing to the database.</p>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100">
            <Button
              variant="ai"
              className="w-full"
              icon={Sparkles}
              onClick={() => setIsTaskGenOpen(true)}
            >
              Launch Task Generator
            </Button>
          </div>
        </Card>

        {/* Capability 2: Executive Assessment */}
        <Card className="p-6 flex flex-col justify-between border-t-4 border-t-purple-600">
          <div>
            <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Executive Project Assessment</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Synthesizes real-time status across active tasks, flagging delivery bottlenecks, overdue deadlines, and recommending tactical next actions.
            </p>

            <div className="mt-4 space-y-2">
              <label className="block text-[11px] font-semibold text-slate-700 uppercase">
                Select Project to Assess:
              </label>
              <select
                value={selectedProjectId}
                onChange={(e) => setSelectedProjectId(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs bg-white text-slate-800 focus:border-indigo-500"
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title} ({p.progress}% done)
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100">
            <Button
              variant="primary"
              className="w-full"
              icon={FileText}
              disabled={!selectedProjectId}
              onClick={() => setIsSummaryOpen(true)}
            >
              Generate Project Assessment
            </Button>
          </div>
        </Card>
      </div>

      {/* Capability 3: Daily Productivity Coach */}
      <Card className="p-6">
        <div className="flex items-center space-x-2.5 mb-4">
          <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
            <Lightbulb className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Autonomous Productivity Advisor</h3>
            <p className="text-xs text-slate-500">Live AI guidance synthesized from your active workload</p>
          </div>
        </div>

        {loadingInsights ? (
          <p className="text-xs text-slate-400 py-4 animate-pulse">Analyzing open deliverables...</p>
        ) : insights ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100">
              <span className="font-bold text-indigo-900 block mb-1">Focus Objective Today</span>
              <p className="text-slate-700 leading-relaxed">{insights.focus_goal}</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
              <span className="font-bold text-slate-900 block">Recommended Delivery Tactics</span>
              {insights.tips?.map((t, idx) => (
                <p key={idx} className="text-slate-600 flex items-start space-x-2">
                  <span className="text-indigo-600 font-bold">•</span>
                  <span>{t}</span>
                </p>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-xs text-slate-400">No active deliverables to analyze.</p>
        )}
      </Card>

      {/* Modals */}
      <AITaskGeneratorModal
        isOpen={isTaskGenOpen}
        onClose={() => setIsTaskGenOpen(false)}
        projects={projects}
        initialProjectId={selectedProjectId}
        onTasksCreated={() => showToast('AI tasks created successfully!', 'success')}
      />

      {selectedProject && (
        <AIProjectSummaryModal
          isOpen={isSummaryOpen}
          onClose={() => setIsSummaryOpen(false)}
          projectId={selectedProject.id}
          projectTitle={selectedProject.title}
        />
      )}
    </div>
  );
};
