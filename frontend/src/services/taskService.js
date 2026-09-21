import api from './api';

export const taskService = {
  async getAll(params = {}) {
    const res = await api.get('/tasks', { params });
    return res.data;
  },

  async getById(id) {
    const res = await api.get(`/tasks/${id}`);
    return res.data;
  },

  async create(data) {
    const res = await api.post('/tasks', data);
    return res.data;
  },

  async batchCreate(projectId, tasks) {
    const res = await api.post('/tasks/batch', { project_id: projectId, tasks });
    return res.data;
  },

  async update(id, data) {
    const res = await api.put(`/tasks/${id}`, data);
    return res.data;
  },

  async updateStatus(id, status) {
    const res = await api.patch(`/tasks/${id}/status`, { status });
    return res.data;
  },

  async delete(id) {
    const res = await api.delete(`/tasks/${id}`);
    return res.data;
  },
};
