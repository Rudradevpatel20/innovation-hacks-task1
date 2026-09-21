import React, { useState, useEffect } from 'react';
import { Card } from '../common/Card';
import { Sparkles, Lightbulb, AlertCircle, RefreshCw } from 'lucide-react';
import { aiService } from '../../services/aiService';

export const AIInsightsCard = () => {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchInsights = async () => {
    setLoading(true);
    try {
      const res = await aiService.getProductivityInsights();
      if (res.success && res.data) {
        setInsights(res.data);
      }
    } catch (err) {
      console.warn('Could not fetch AI insights:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInsights();
  }, []);

  return (
    <Card className="p-6 relative overflow-hidden bg-gradient-to-br from-indigo-900 via-slate-900 to-indigo-950 text-white shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-indigo-500/20 rounded-xl text-indigo-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">AI Productivity Insights</h4>
            <p className="text-[11px] text-slate-400">Smart execution priorities synthesized by Gemini</p>
          </div>
        </div>

        <button
          onClick={fetchInsights}
          disabled={loading}
          className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
          title="Refresh AI insights"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-indigo-400' : ''}`} />
        </button>
      </div>

      {loading ? (
        <div className="py-6 text-center space-y-2">
          <Sparkles className="w-5 h-5 text-indigo-400 animate-spin mx-auto" />
          <p className="text-xs text-slate-400 animate-pulse">Synthesizing workflow patterns...</p>
        </div>
      ) : insights ? (
        <div className="space-y-3.5">
          <div className="p-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10">
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-300 block mb-1">
              Top Priority Goal
            </span>
            <p className="text-xs font-semibold text-slate-100">{insights.focus_goal}</p>
          </div>

          {insights.tips && insights.tips.length > 0 && (
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Execution Recommendations
              </span>
              {insights.tips.map((tip, i) => (
                <div key={i} className="flex items-start space-x-2 text-xs text-slate-300">
                  <Lightbulb className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5" />
                  <span>{tip}</span>
                </div>
              ))}
            </div>
          )}

          {insights.urgent_alert && (
            <div className="flex items-center space-x-2 text-xs text-rose-300 bg-rose-500/10 px-3 py-2 rounded-xl border border-rose-500/20">
              <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
              <span>{insights.urgent_alert}</span>
            </div>
          )}
        </div>
      ) : (
        <p className="text-xs text-slate-400 py-4 text-center">Unable to load insights right now.</p>
      )}
    </Card>
  );
};
