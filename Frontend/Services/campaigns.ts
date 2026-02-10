import api from './axios';

export type CampaignListParams = {
  category?: string;
  location?: string;
  urgent?: boolean;
  status?: string;
  limit?: number;
  cursor?: string;
  sort?: 'asc' | 'desc';
};

export const campaignService = {
  getAll: (params?: CampaignListParams) =>
    api.get('/campaigns', {
      params: {
        ...params,
        urgent: typeof params?.urgent === 'boolean' ? String(params.urgent) : undefined
      }
    }),
  getFeatured: () => api.get('/campaigns/featured'),
  getById: (id: string) => api.get(`/campaigns/${id}`),
  getDonors: (id: string) => api.get(`/campaigns/${id}/donors`),
  create: (payload: unknown) => api.post('/campaigns', payload),
  update: (id: string, payload: unknown) => api.patch(`/campaigns/${id}`, payload),
  uploadMedia: (id: string, payload: unknown) => api.post(`/campaigns/${id}/media`, payload),
  submit: (id: string) => api.post(`/campaigns/${id}/submit`),
  getGlobalStats: () => api.get('/stats/global')
};

export default campaignService;
