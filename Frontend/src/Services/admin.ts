import api from './axios';

export const adminService = {
  getOverview: () => api.get('/admin/overview'),
  getTrends: (params?: { days?: number }) => api.get('/admin/trends', { params }),
  getTopCampaigns: (params?: { limit?: number }) => api.get('/admin/top-campaigns', { params }),
  getUsers: (params?: {
    search?: string;
    role?: string;
    verification?: 'pending' | 'approved' | 'rejected';
    page?: number;
    limit?: number;
  }) => api.get('/admin/users', { params }),
  deleteUser: (id: string) => api.delete(`/admin/users/${id}`),
  deleteAllUsers: () => api.delete('/admin/users'),
  verifyCampaign: (id: string, payload: { status: 'approved' | 'rejected' }) =>
    api.patch(`/admin/campaigns/${id}/verify`, payload),
  deleteCampaign: (id: string) => api.delete(`/admin/campaigns/${id}`),
  deleteAllCampaigns: () => api.delete('/admin/campaigns'),
  getCampaignRequests: (params?: { limit?: number }) => api.get('/admin/campaign-requests', { params }),
  approveCampaignRequest: (id: string) => api.post(`/admin/campaign-requests/${id}/approve`),
  rejectCampaignRequest: (id: string, payload?: { reason?: string }) =>
    api.post(`/admin/campaign-requests/${id}/reject`, payload ?? {}),
  getOrganizerVerifications: () => api.get('/admin/organizer-verifications'),
  approveOrganizer: (userId: string) => api.post(`/admin/organizer-verifications/${userId}/approve`),
  rejectOrganizer: (userId: string, payload?: { reason?: string }) =>
    api.post(`/admin/organizer-verifications/${userId}/reject`, payload ?? {}),
  getSettings: () => api.get('/admin/settings'),
  getPublicSettings: () => api.get('/admin/settings/public'),
  updateSettings: (payload: unknown) => api.put('/admin/settings', payload)
};

export default adminService;
