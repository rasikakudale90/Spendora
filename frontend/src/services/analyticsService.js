import api from './api';

export const analyticsService = {
  getAnalytics: async (startDate, endDate) => {
    const params = {};
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;

    const response = await api.get('/analytics', { params });
    return response.data;
  },
};
