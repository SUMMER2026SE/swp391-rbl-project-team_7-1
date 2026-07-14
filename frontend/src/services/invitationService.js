import api from './api';

export const invitationService = {
  /**
   * Send invitation to freelancer
   */
  inviteFreelancer: async (projectId, freelancerId, message) => {
    const response = await api.post('/invitations/invite', { projectId, freelancerId, message });
    return response.data;
  },

  /**
   * Get all invitations received by freelancer
   */
  getFreelancerInvitations: async () => {
    const response = await api.get('/invitations/freelancer');
    return response.data;
  },

  /**
   * Respond to invitation (ACCEPTED or DECLINED)
   */
  respondToInvitation: async (invitationId, status) => {
    const response = await api.put(`/invitations/${invitationId}/respond`, { status });
    return response.data;
  },

  /**
   * Auto draft invitation using Gemini AI
   */
  draftAIInvitation: async (projectId, freelancerId) => {
    const response = await api.post('/invitations/draft-ai', { projectId, freelancerId });
    return response.data;
  }
};
