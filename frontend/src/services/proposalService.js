import api from './api';

export const proposalService = {
  submitProposal: async (projectId, proposalData) => {
    const config = proposalData instanceof FormData ? {
      headers: { 'Content-Type': 'multipart/form-data' }
    } : {};
    const response = await api.post(`/projects/${projectId}/proposals`, proposalData, config);
    return response.data;
  },
  
  submitWork: async (contractId, workData) => {
    // Handling form data if there are file attachments
    const config = workData instanceof FormData ? {
      headers: { 'Content-Type': 'multipart/form-data' }
    } : {};
    
    const response = await api.post(`/contracts/${contractId}/submissions`, workData, config);
    return response.data;
  },

  getProjectProposals: async (projectId) => {
    const response = await api.get(`/projects/${projectId}/proposals`);
    return response.data;
  },

  updateProposalStatus: async (proposalId, status) => {
    const response = await api.put(`/projects/proposals/${proposalId}/status`, { status });
    return response.data;
  }
};
