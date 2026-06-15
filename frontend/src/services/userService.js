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
  }
};
