import api from './axios';

export const authService = {
  signup: (payload: unknown) => api.post('/auth/signup', payload),
  verifyOtp: (payload: { email: string; otp: string }) => api.post('/auth/verify-otp', payload),
  login: (payload: unknown) => api.post('/auth/login', payload),
  forgotPassword: (payload: { email: string }) => api.post('/auth/forgot-password', payload),
  resetPassword: (payload: { email: string; password: string }) => api.post('/auth/reset-password', payload),
  refreshToken: (payload: { refreshToken: string }) => api.post('/auth/refresh', payload),
  me: () => api.get('/auth/me')
};

export default authService;
