import api from './axios';

export const authService = {
  register: (payload: unknown) => api.post('/auth/register', payload),
  login: (payload: unknown) => api.post('/auth/login', payload),
  logout: () => api.post('/auth/logout'),
  refreshToken: () => api.post('/auth/refresh-token'),
  forgotPassword: (payload: unknown) => api.post('/auth/forgot-password', payload),
  resetPassword: (payload: unknown) => api.post('/auth/reset-password', payload),
};

export default authService;
