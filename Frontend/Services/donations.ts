import api from './axios';

export const donationService = {
  getAll: () => api.get('/donations'),
  getStats: () => api.get('/donations/stats'),
  getById: (id: string) => api.get(`/donations/${id}`),
  create: (payload: unknown) => api.post('/donations', payload),
  getUserHistory: () => api.get('/donations/user/history'),
};

export default donationService;
