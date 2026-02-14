import api from './axios';

export const donationService = {
  createCheckout: (payload: { campaignId: string; amount: number }) => api.post('/donations/checkout', payload),
  // verifyCbe: (payload: FormData) =>
  //   api.post('/donations/cbe/verify', payload, {
  //     headers: { 'Content-Type': 'multipart/form-data' }
  //   }),
  submit: (payload: FormData) =>
    api.post('/donations/submit', payload, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })

};

export default donationService;
