import api from './axios';

export const userService = {
  getMe: () => api.get('/users/me'),
  updateMe: (payload: unknown) => api.put('/users/me', payload),
  deleteMe: () => api.delete('/users/me'),
  getUsers: () => api.get('/users'),
  getUserById: (id: string) => api.get(`/users/${id}`),
  updateUser: (id: string, payload: unknown) => api.put(`/users/${id}`, payload),
  deleteUser: (id: string) => api.delete(`/users/${id}`),
};

export default userService;
