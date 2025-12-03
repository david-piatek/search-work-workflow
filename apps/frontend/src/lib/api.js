import axios from 'axios';

const API_BASE_URL = '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const scrapersApi = {
  getAll: () => api.get('/scrapers'),
  getByName: (name) => api.get(`/scrapers/${name}`),
  createOrGet: (data) => api.post('/scrapers', data),
  execute: (scraperName, params = {}) => api.post('/scrapers/execute', { scraperName, params }),
  delete: (name) => api.delete(`/scrapers/${name}`),
};

export const jobsApi = {
  getAll: (source, limit = 100) => api.get('/jobs', { params: { source, limit } }),
  getById: (id) => api.get(`/jobs/${id}`),
  getStats: () => api.get('/jobs/stats'),
};

export default api;
