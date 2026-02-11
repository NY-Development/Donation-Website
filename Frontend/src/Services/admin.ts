import api from './axios';

export const adminService = {
  getOverview: () => api.get('/admin/overview'),
  verifyCampaign: (id: string, payload: { status: 'approved' | 'rejected' }) =>
    api.patch(`/admin/campaigns/${id}/verify`, payload)
};

export default adminService;
