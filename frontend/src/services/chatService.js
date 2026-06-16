import api from './api';

export const chatService = {
  getConversations: async () => {
    const response = await api.get('/chat/conversations');
    return response.data;
  },

  getMessages: async (projectId, type, partnerId) => {
    const params = { type };
    if (partnerId) {
      params.partnerId = partnerId;
    }
    const response = await api.get(`/chat/messages/${projectId}`, { params });
    return response.data;
  },

  sendMessage: async (messageData) => {
    const response = await api.post('/chat/messages', messageData);
    return response.data;
  }
};
