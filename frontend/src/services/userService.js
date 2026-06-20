import api from './api';

export const userService = {
  getProfile: async () => {
    const response = await api.get('/user/profile');
    return response.data;
  },

  updateProfile: async (profileData) => {
    const response = await api.put('/user/profile', profileData);
    return response.data;
  },

  changePassword: async (oldPassword, newPassword) => {
    const response = await api.put('/user/change-password', { oldPassword, newPassword });
    return response.data;
  },

  deleteAccount: async (password) => {
    const response = await api.delete('/user/account', { data: { password } });
    return response.data;
  },

  getPortfolios: async () => {
    const response = await api.get('/user/profile/portfolios');
    return response.data;
  },

  addPortfolio: async (pData) => {
    const response = await api.post('/user/profile/portfolios', pData);
    return response.data;
  },

  updatePortfolio: async (portfolioId, pData) => {
    const response = await api.put(`/user/profile/portfolios/${portfolioId}`, pData);
    return response.data;
  },

  deletePortfolio: async (portfolioId) => {
    const response = await api.delete(`/user/profile/portfolios/${portfolioId}`);
    return response.data;
  },

  getFreelancerPortfolios: async (freelancerId) => {
    const response = await api.get(`/user/${freelancerId}/portfolios`);
    return response.data;
  },

  getPublicProfile: async (id) => {
    const response = await api.get(`/user/profile/${id}`);
    return response.data;
  },

  getAllFreelancers: async () => {
    const response = await api.get('/user/freelancers');
    return response.data;
  }
};
