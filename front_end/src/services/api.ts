import axios from 'axios';

const API_BASE_URL = 'https://hr-management-clso.onrender.com/api';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  signup: async (userData: {
    name: string;
    email: string;
    password: string;
    role: string;
  }) => {
    const response = await api.post('/auth/signup', userData);
    return response.data;
  },

  verifyEmail: async (token: string) => {
    const response = await api.post('/auth/verify-email', { token });
    return response.data;
  },

  forgotPassword: async (email: string) => {
    const response = await api.post('/auth/request-password-reset', { email });
    return response.data;
  },

  resetPassword: async (token: string, password: string) => {
    const response = await api.post(`/auth/reset-password/${token}`, { password });
    return response.data;
  },

  getProfile: async () => {
    const response = await api.get('/auth/profile');
    return response.data;
  },

  updateProfile: async (userData: {
    name?: string;
    email?: string;
    currentPassword?: string;
    newPassword?: string;
  }) => {
    const response = await api.put('/auth/profile', userData);
    return response.data;
  },
};

// Candidates API
export const candidatesAPI = {
  // Get all candidates with optional filters
  getAll: async (params?: {
    search?: string;
    status?: string;
    position?: string;
    location?: string;
    page?: number;
    limit?: number;
  }) => {
    const response = await api.get('/candidates', { params });
    return response.data;
  },

  // Get candidate by ID
  getById: async (id: string) => {
    const response = await api.get(`/candidates/${id}`);
    return response.data;
  },

  // Create new candidate
  create: async (candidateData: any) => {
    const response = await api.post('/candidates', candidateData);
    return response.data;
  },

  // Update candidate
  update: async (id: string, candidateData: any) => {
    const response = await api.put(`/candidates/${id}`, candidateData);
    return response.data;
  },

  // Delete candidate
  delete: async (id: string) => {
    const response = await api.delete(`/candidates/${id}`);
    return response.data;
  },

  // Get candidate statistics
  getStats: async () => {
    const response = await api.get('/candidates/stats/overview');
    return response.data;
  },

  // Get candidates by status
  getByStatus: async (status: string) => {
    const response = await api.get(`/candidates/status/${status}`);
    return response.data;
  },

  // Update candidate status
  updateStatus: async (id: string, status: string) => {
    const response = await api.patch(`/candidates/${id}/status`, { status });
    return response.data;
  },

  // Add note to candidate
  addNote: async (id: string, note: string) => {
    const response = await api.post(`/candidates/${id}/notes`, { note });
    return response.data;
  },

  // Get candidate notes
  getNotes: async (id: string) => {
    const response = await api.get(`/candidates/${id}/notes`);
    return response.data;
  },
};

// Jobs API
export const jobsAPI = {
  // Get all jobs with optional filters
  getAll: async (params?: {
    search?: string;
    status?: string;
    department?: string;
    type?: string;
    location?: string;
    page?: number;
    limit?: number;
  }) => {
    const response = await api.get('/jobs', { params });
    return response.data;
  },

  // Get job by ID
  getById: async (id: string) => {
    const response = await api.get(`/jobs/${id}`);
    return response.data;
  },

  // Create new job
  create: async (jobData: any) => {
    const response = await api.post('/jobs', jobData);
    return response.data;
  },

  // Update job
  update: async (id: string, jobData: any) => {
    const response = await api.put(`/jobs/${id}`, jobData);
    return response.data;
  },

  // Delete job
  delete: async (id: string) => {
    const response = await api.delete(`/jobs/${id}`);
    return response.data;
  },

  // Get job statistics
  getStats: async () => {
    const response = await api.get('/jobs/stats/overview');
    return response.data;
  },

  // Get jobs by status
  getByStatus: async (status: string) => {
    const response = await api.get(`/jobs/status/${status}`);
    return response.data;
  },

  // Update job status
  updateStatus: async (id: string, status: string) => {
    const response = await api.patch(`/jobs/${id}/status`, { status });
    return response.data;
  },

  // Get job applications
  getApplications: async (id: string) => {
    const response = await api.get(`/jobs/${id}/applications`);
    return response.data;
  },

  // Close job posting
  closeJob: async (id: string) => {
    const response = await api.patch(`/jobs/${id}/close`);
    return response.data;
  },

  // Reopen job posting
  reopenJob: async (id: string) => {
    const response = await api.patch(`/jobs/${id}/reopen`);
    return response.data;
  },

  // Duplicate job
  duplicate: async (id: string) => {
    const response = await api.post(`/jobs/${id}/duplicate`);
    return response.data;
  },
};

// Dashboard API
export const dashboardAPI = {
  // Get dashboard overview
  getOverview: async () => {
    const response = await api.get('/dashboard/overview');
    return response.data;
  },

  // Get recent activities
  getRecentActivities: async () => {
    const response = await api.get('/dashboard/recent-activities');
    return response.data;
  },

  // Get upcoming interviews
  getUpcomingInterviews: async () => {
    const response = await api.get('/dashboard/upcoming-interviews');
    return response.data;
  },

  // Get hiring pipeline
  getHiringPipeline: async () => {
    const response = await api.get('/dashboard/hiring-pipeline');
    return response.data;
  },
};

// Health check
export const healthAPI = {
  check: async () => {
    const response = await api.get('/health');
    return response.data;
  },
};

export default api; 