import api from './api';

export const reportService = {
  getAdminReports: async (params = {}) => {
    const response = await api.get('/reports', { params });
    return response.data;
  },

  resolveReport: async (reportId) => {
    const response = await api.patch(`/reports/${reportId}/resolve`);
    return response.data;
  },

  dismissReport: async (reportId) => {
    const response = await api.patch(`/reports/${reportId}/dismiss`);
    return response.data;
  }
};
