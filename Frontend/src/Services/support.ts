import api from './axios';

export type CreateSupportPayload = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

export const supportService = {
  create: (payload: CreateSupportPayload) => api.post('/support', payload),
  listForAdmin: (params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: 'open' | 'resolved';
  }) => api.get('/support', { params }),
  getByIdForAdmin: (id: string) => api.get(`/support/${id}`)
};

export default supportService;
