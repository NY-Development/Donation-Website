import api from './axios';

export const userService = {
  getMe: () => api.get('/users/me'),
  updateMe: (payload: { name?: string; email?: string }) => api.patch('/users/me', payload),
  getDashboard: (params?: { limit?: number; cursor?: string }) => api.get('/users/me/dashboard', { params }),
  getTrends: (params?: { days?: number }) => api.get('/users/me/trends', { params }),
  getMyCampaigns: (params?: { limit?: number }) => api.get('/users/me/campaigns', { params }),
  getPendingDonations: (params?: { limit?: number }) => api.get('/users/me/pending-donations', { params })
};

export default userService;
