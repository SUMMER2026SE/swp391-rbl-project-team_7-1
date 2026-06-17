import api from './api';

export const chatService = {
  getConversations: async (role) => {
    const params = {};
    if (role) {
      params.role = role;
    }
    const response = await api.get('/chat/conversations', { params });
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
  },

  markMessagesAsRead: async (projectId, partnerId) => {
    const response = await api.put(`/chat/read/${projectId}`, { partnerId });
    return response.data;
  }
};
