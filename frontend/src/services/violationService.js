import api from './api';

export const violationService = {
  getAdminViolations: async (params = {}) => {
    const response = await api.get('/admin/violations', { params });
    return response.data;
  },

  getViolationById: async (id) => {
    const response = await api.get(`/admin/violations/${id}`);
    return response.data;
  },

  resolveViolation: async (id, action) => {
    const response = await api.patch(`/admin/violations/${id}/resolve`, { action });
    return response.data;
  },

  dismissViolation: async (id) => {
    const response = await api.patch(`/admin/violations/${id}/dismiss`);
    return response.data;
  }
};
