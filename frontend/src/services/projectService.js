import api from './api';

export const projectService = {
  async getAll(params = {}) {
    const res = await api.get('/projects', { params });
    return res.data;
  },

  async getById(id) {
    const res = await api.get(`/projects/${id}`);
    return res.data;
  },

  async create(data) {
    const res = await api.post('/projects', data);
    return res.data;
  },

  async update(id, data) {
    const res = await api.put(`/projects/${id}`, data);
    return res.data;
  },

  async delete(id) {
    const res = await api.delete(`/projects/${id}`);
    return res.data;
  },
};
