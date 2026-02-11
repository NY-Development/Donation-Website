import api from './axios';

export const userService = {
  getMe: () => api.get('/users/me'),
  getDashboard: (params?: { limit?: number; cursor?: string }) => api.get('/users/me/dashboard', { params })
};

export default userService;
