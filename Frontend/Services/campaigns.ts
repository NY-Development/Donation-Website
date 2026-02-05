import api from './axios';

export const campaignService = {
  getAll: () => api.get('/campaigns'),
  getFeatured: () => api.get('/campaigns/featured'),
  getById: (id: string) => api.get(`/campaigns/${id}`),
  create: (payload: unknown) => api.post('/campaigns', payload),
  update: (id: string, payload: unknown) => api.put(`/campaigns/${id}`, payload),
  delete: (id: string) => api.delete(`/campaigns/${id}`),
};

export default campaignService;
