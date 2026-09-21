import api from './api';

export const aiService = {
  async generateTasks(projectId, prompt, count = 5) {
    const res = await api.post('/ai/generate-tasks', {
      project_id: projectId,
      prompt,
      count,
    });
    return res.data;
  },

  async getProjectSummary(projectId) {
    const res = await api.post('/ai/project-summary', { project_id: projectId });
    return res.data;
  },

  async getProductivityInsights() {
    const res = await api.get('/ai/productivity-insights');
    return res.data;
  },
};
