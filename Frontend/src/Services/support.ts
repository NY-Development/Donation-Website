import api from './axios';

export type CreateSupportPayload = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

export const supportService = {
  create: (payload: CreateSupportPayload) => api.post('/support', payload),
  getPublicByUserId: (userId: string) => api.get(`/support/public/${userId}`),
  listForAdmin: (params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: 'open' | 'resolved';
  }) => api.get('/support', { params }),
  getByIdForAdmin: (id: string) => api.get(`/support/${id}`),
  replyForAdmin: (id: string, payload: { subject: string; content: string }) =>
    api.post(`/support/${id}/reply`, payload)
};

export default supportService;
