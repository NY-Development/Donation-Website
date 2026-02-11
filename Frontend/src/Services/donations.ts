import api from './axios';

export const donationService = {
  createCheckout: (payload: { campaignId: string; amount: number }) => api.post('/donations/checkout', payload)
};

export default donationService;
