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
  },

  updateProject: async (id, projectData) => {
    const response = await api.put(`/projects/${id}`, projectData);
    return response.data;
  },

  closeProject: async (id) => {
    const response = await api.put(`/projects/${id}/close`);
    return response.data;
  },

  getEmployerProjects: async () => {
    const response = await api.get('/projects/my/employer-projects');
    return response.data;
  },

  deleteProject: async (id) => {
    const response = await api.delete(`/projects/${id}`);
    return response.data;
  }
};
