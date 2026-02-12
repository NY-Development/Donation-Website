import api from './axios';

export const userService = {
  getMe: () => api.get('/users/me'),
  getDashboard: (params?: { limit?: number; cursor?: string }) => api.get('/users/me/dashboard', { params }),
  getTrends: (params?: { days?: number }) => api.get('/users/me/trends', { params })
};

export default userService;
