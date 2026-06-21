import api from './api';

export const contractService = {
  getContractById: async (contractId) => {
    const response = await api.get(`/contracts/${contractId}`);
    return response.data;
  },

  getActiveContracts: async () => {
    const response = await api.get('/contracts');
    return response.data;
  },

  getContractByProjectId: async (projectId) => {
    const response = await api.get(`/contracts/project/${projectId}`);
    return response.data;
  },

  submitWork: async (contractId, formData) => {
    const response = await api.post(`/contracts/${contractId}/submissions`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },

  getContractSubmissions: async (contractId) => {
    const response = await api.get(`/contracts/${contractId}/submissions`);
    return response.data;
  },

  approveSubmission: async (submissionId) => {
    const response = await api.post(`/contracts/submissions/${submissionId}/approve`);
    return response.data;
  },

  requestRevision: async (submissionId, note) => {
    const response = await api.post(`/contracts/submissions/${submissionId}/revision`, { note });
    return response.data;
  },

  submitReview: async (contractId, rating, comment) => {
    const response = await api.post(`/contracts/${contractId}/review`, { rating, comment });
    return response.data;
  }
};
