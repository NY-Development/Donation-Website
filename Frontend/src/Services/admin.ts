import api from './axios';

export const adminService = {
  getOverview: () => api.get('/admin/overview'),
  getUsers: (params?: {
    search?: string;
    role?: string;
    verification?: 'pending' | 'approved' | 'rejected';
    page?: number;
    limit?: number;
  }) => api.get('/admin/users', { params }),
  verifyCampaign: (id: string, payload: { status: 'approved' | 'rejected' }) =>
    api.patch(`/admin/campaigns/${id}/verify`, payload),
  getOrganizerVerifications: () => api.get('/admin/organizer-verifications'),
  approveOrganizer: (userId: string) => api.post(`/admin/organizer-verifications/${userId}/approve`),
  rejectOrganizer: (userId: string, payload?: { reason?: string }) =>
    api.post(`/admin/organizer-verifications/${userId}/reject`, payload ?? {}),
  getSettings: () => api.get('/admin/settings'),
  updateSettings: (payload: unknown) => api.put('/admin/settings', payload)
};

export default adminService;
