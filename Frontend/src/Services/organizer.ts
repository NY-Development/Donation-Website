import api from './axios';

export const organizerService = {
  status: () => api.get('/organizer/status'),
  verify: (formData: FormData) =>
    api.post('/organizer/verify', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
};

export default organizerService;
