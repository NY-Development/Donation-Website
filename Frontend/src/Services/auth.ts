import api from './axios';

export const authService = {
  signup: (payload: unknown) => api.post('/auth/signup', payload),
  login: (payload: unknown) => api.post('/auth/login', payload),
  refreshToken: (payload: { refreshToken: string }) => api.post('/auth/refresh', payload),
  me: () => api.get('/auth/me')
};

export default authService;
