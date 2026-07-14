import api from './api';

export const disputeService = {
  getAdminDisputes: async (params = {}) => {
    const response = await api.get('/disputes', { params });
    return response.data;
  },

  getAdminDispute: async (disputeId) => {
    const response = await api.get(`/disputes/${disputeId}`);
    return response.data;
  },

  resolveDispute: async (disputeId, decision) => {
    const response = await api.patch(`/disputes/${disputeId}/resolve`, { decision });
    return response.data;
  },

  closeDispute: async (disputeId) => {
    const response = await api.patch(`/disputes/${disputeId}/close`);
    return response.data;
  }
};
