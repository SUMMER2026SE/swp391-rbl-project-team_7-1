import api from './api';

export const aiChatService = {
  getSessions: async () => {
    const response = await api.get('/ai/sessions');
    return response.data;
  },

  createSession: async () => {
    const response = await api.post('/ai/sessions');
    return response.data;
  },

  getMessages: async (sessionId) => {
    const response = await api.get(`/ai/sessions/${sessionId}/messages`);
    return response.data;
  },

  sendMessage: async (sessionId, message) => {
    const response = await api.post('/ai/chat', { sessionId, message });
    return response.data;
  },

  deleteSession: async (sessionId) => {
    const response = await api.delete(`/ai/sessions/${sessionId}`);
    return response.data;
  }
};