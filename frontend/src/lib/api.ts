import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3101';

// Create axios instance
const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('userix_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('userix_token');
      localStorage.removeItem('userix_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authApi = {
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },
  
  getProfile: async () => {
    const response = await api.get('/auth/profile');
    return response.data;
  },
  
  logout: async () => {
    const response = await api.post('/auth/logout');
    localStorage.removeItem('userix_token');
    localStorage.removeItem('userix_user');
    return response.data;
  },
};

// Students API
export const studentsApi = {
  getAll: async (filters: {
    search?: string;
    className?: string;
    teacherId?: string;
    page?: number;
    limit?: number;
  } = {}) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        params.append(key, value.toString());
      }
    });
    
    const response = await api.get(`/students?${params.toString()}`);
    return response.data;
  },
  
  getOne: async (id: string) => {
    const response = await api.get(`/students/${id}`);
    return response.data;
  },
  
  create: async (studentData: {
    firstName: string;
    lastName: string;
    email: string;
    office365Password?: string;
    ipadCode: string;
    className: string;
    classAddition?: 'A' | 'B' | 'C';
    teacherId?: string;
    tenantId: string;
  }) => {
    const response = await api.post('/students', studentData);
    return response.data;
  },
  
  update: async (id: string, studentData: Partial<{
    firstName: string;
    lastName: string;
    email: string;
    office365Password: string;
    ipadCode: string;
    className: string;
    classAddition: 'A' | 'B' | 'C';
    teacherId: string;
  }>) => {
    const response = await api.patch(`/students/${id}`, studentData);
    return response.data;
  },
  
  delete: async (id: string) => {
    const response = await api.delete(`/students/${id}`);
    return response.data;
  },
  
  import: async (tenantId: string, students: any[]) => {
    const response = await api.post('/students/import', { tenantId, students });
    return response.data;
  },
  
  export: async (tenantId: string, format: 'csv' | 'xlsx' = 'csv') => {
    const response = await api.get(`/students/export?tenantId=${tenantId}&format=${format}`);
    return response.data;
  },
  
  getStats: async (tenantId: string) => {
    const response = await api.get(`/students/stats?tenantId=${tenantId}`);
    return response.data;
  },
};

// Teachers API
export const teachersApi = {
  getAll: async (tenantId?: string) => {
    const params = tenantId ? `?tenantId=${tenantId}` : '';
    const response = await api.get(`/teachers${params}`);
    return response.data;
  },
  
  getOne: async (id: string) => {
    const response = await api.get(`/teachers/${id}`);
    return response.data;
  },
  
  create: async (teacherData: {
    firstName: string;
    lastName: string;
    email?: string;
    tenantId: string;
  }) => {
    const response = await api.post('/teachers', teacherData);
    return response.data;
  },
  
  update: async (id: string, teacherData: Partial<{
    firstName: string;
    lastName: string;
    email: string;
  }>) => {
    const response = await api.patch(`/teachers/${id}`, teacherData);
    return response.data;
  },
  
  delete: async (id: string) => {
    const response = await api.delete(`/teachers/${id}`);
    return response.data;
  },
};

// Tenants API (Admin only)
export const tenantsApi = {
  getAll: async (page = 1, limit = 10) => {
    const response = await api.get(`/tenants?page=${page}&limit=${limit}`);
    return response.data;
  },
  
  getOne: async (id: string) => {
    const response = await api.get(`/tenants/${id}`);
    return response.data;
  },
  
  create: async (tenantData: {
    name: string;
    subdomain: string;
    maxStudents?: number;
    maxTeachers?: number;
    features?: string[];
  }) => {
    const response = await api.post('/tenants', tenantData);
    return response.data;
  },
  
  update: async (id: string, tenantData: Partial<{
    name: string;
    isActive: boolean;
    settings: {
      maxStudents: number;
      maxTeachers: number;
      features: string[];
    };
  }>) => {
    const response = await api.patch(`/tenants/${id}`, tenantData);
    return response.data;
  },
  
  delete: async (id: string) => {
    const response = await api.delete(`/tenants/${id}`);
    return response.data;
  },
  
  getStats: async (id: string) => {
    const response = await api.get(`/tenants/${id}/stats`);
    return response.data;
  },
};

// Dashboard API
export const dashboardApi = {
  getStats: async (tenantId?: string) => {
    const params = tenantId ? `?tenantId=${tenantId}` : '';
    const response = await api.get(`/dashboard/stats${params}`);
    return response.data;
  },
  
  getRecentActivity: async (tenantId?: string) => {
    const params = tenantId ? `?tenantId=${tenantId}` : '';
    const response = await api.get(`/dashboard/activity${params}`);
    return response.data;
  },
};

export default api;
