import api from './api';

export const projectService = {
  getPublicProjects: async (params) => {
    const response = await api.get('/projects', { params });
    return response.data;
  },
  
  getProjectById: async (id) => {
    const response = await api.get(`/projects/${id}`);
    return response.data;
  },

  getCategories: async () => {
    const response = await api.get('/projects/categories');
    return response.data;
  },

  createProject: async (projectData) => {
    const response = await api.post('/projects', projectData);
    return response.data;
  }
};
