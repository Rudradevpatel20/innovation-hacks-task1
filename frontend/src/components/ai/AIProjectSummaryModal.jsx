import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Sparkles, AlertTriangle, CheckCircle, Target, ArrowRight } from 'lucide-react';
import { aiService } from '../../services/aiService';
import { useToast } from '../../context/ToastContext';

export const AIProjectSummaryModal = ({ isOpen, onClose, projectId, projectTitle }) => {
  const { showToast } = useToast();
  const [summary, setSummary] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFetchSummary = async () => {
    setIsLoading(true);
    try {
      const res = await aiService.getProjectSummary(projectId);
      if (res.success && res.data) {
        setSummary(res.data);
      }
    } catch (err) {
      showToast('Failed to generate project summary', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="AI Executive Project Assessment"
      subtitle={`Comprehensive delivery analysis for "${projectTitle}"`}
      maxWidth="max-w-2xl"
      footer={
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
      }
    >
      <div className="space-y-4">
        {!summary && !isLoading && (
          <div className="text-center py-8">
            <Sparkles className="w-10 h-10 text-indigo-600 mx-auto mb-3 animate-pulse" />
            <p className="text-sm text-slate-600 mb-4 max-w-md mx-auto">
              Analyze task velocity, detect delivery roadblocks, and receive actionable next steps synthesized by Gemini AI.
            </p>
            <Button variant="ai" onClick={handleFetchSummary} icon={Sparkles}>
              Generate Executive Assessment
            </Button>
          </div>
        )}

        {isLoading && (
          <div className="flex flex-col items-center justify-center py-12 space-y-3">
            <Sparkles className="w-8 h-8 text-indigo-600 animate-spin" />
            <p className="text-xs font-semibold text-slate-500 animate-pulse">
              Gemini AI is analyzing project metrics and task dependencies...
            </p>
          </div>
        )}

        {summary && !isLoading && (
          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-xl bg-indigo-50/70 border border-indigo-100">
              <h5 className="font-bold text-indigo-900 mb-1 flex items-center space-x-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                <span>Executive Summary</span>
              </h5>
              <p className="text-slate-700 leading-relaxed">{summary.executive_summary}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200/80">
                <h5 className="font-bold text-amber-900 mb-1 flex items-center space-x-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                  <span>Bottlenecks & Risks</span>
                </h5>
                <p className="text-amber-800 leading-relaxed">{summary.bottlenecks}</p>
              </div>

              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200/80">
                <h5 className="font-bold text-emerald-900 mb-1 flex items-center space-x-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Milestone Velocity</span>
                </h5>
                <p className="text-emerald-800 leading-relaxed">{summary.key_milestone}</p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900 text-white shadow-sm">
              <h5 className="font-bold text-indigo-300 mb-1 flex items-center space-x-1.5">
                <Target className="w-3.5 h-3.5 text-indigo-400" />
                <span>Recommended Action</span>
              </h5>
              <p className="text-slate-200 leading-relaxed">{summary.recommended_action}</p>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
