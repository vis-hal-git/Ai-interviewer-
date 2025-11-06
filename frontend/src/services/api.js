/**
 * Axios instance for API calls with authentication
 */
import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';
import { auth } from '../config/firebase';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add auth token to requests
api.interceptors.request.use(
  async (config) => {
    const user = auth.currentUser;
    if (user) {
      const token = await user.getIdToken();
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - redirect to login
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Resume API functions
export const resumeAPI = {
  // Upload resume
  upload: async (file, jobRole) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('job_role', jobRole);
    
    return api.post('/api/resumes/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Get resume by ID
  getById: async (resumeId) => {
    return api.get(`/api/resumes/${resumeId}`);
  },

  // Get all user resumes
  getUserResumes: async () => {
    return api.get('/api/resumes/user/all');
  },

  // Delete resume
  delete: async (resumeId) => {
    return api.delete(`/api/resumes/${resumeId}`);
  },

  // Get user profile (from latest resume)
  getProfile: async () => {
    return api.get('/api/resumes/profile');
  },

  // Update user profile
  updateProfile: async (profileData) => {
    return api.put('/api/resumes/profile', profileData);
  },
};

export default api;
