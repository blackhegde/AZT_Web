import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL;

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - thêm token nếu có
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - xử lý lỗi
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

// ==================== AUTH API ====================
export const authAPI = {
  login: (credentials: { email: string; password: string }) => 
    api.post('/auth/login', credentials),
  register: (userData: { username: string; email: string; password: string }) =>
    api.post('/auth/register', userData),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (userData: any) => api.patch('/auth/profile', userData),
  changePassword: (passwordData: { currentPassword: string; newPassword: string }) =>
    api.patch('/auth/change-password', passwordData),
};

// ==================== PRODUCTS API ====================
export const productAPI = {
  // Read operations (public)
  getAll: (params?: string) => api.get(`/products${params || ''}`),
  getById: (id: string) => api.get(`/products/${id}`),
  getByCategory: (category: string, lang?: string) => 
    api.get(`/products?category=${category}&lang=${lang || 'en'}`),
  search: (query: string, lang?: string) => 
    api.get(`/products/search/${query}?lang=${lang || 'en'}`),
  
  // Admin operations (protected) - GỬI JSON
  create: (data: any) => api.post('/products', data),
  update: (id: string, data: any) => api.patch(`/products/${id}`, data),
  delete: (id: string) => api.delete(`/products/${id}`),
  
  // Image management - VẪN GIỮ FormData cho upload ảnh
  uploadImages: (id: string, formData: FormData) => 
    api.post(`/products/${id}/upload-images`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
  removeImage: (id: string, imageIndex: number) => 
    api.delete(`/products/${id}/images/${imageIndex}`),
};

// ==================== CATEGORIES API ====================
export const categoryAPI = {
  getAll: (lang?: string) => api.get(`/categories?lang=${lang || 'en'}`),
  getById: (id: string) => api.get(`/categories/${id}`),
  create: (data: any) => api.post('/categories', data),
  update: (id: string, data: any) => api.patch(`/categories/${id}`, data),
  delete: (id: string) => api.delete(`/categories/${id}`),
};

// ==================== BANNERS API ====================
export const bannerAPI = {
  getAll: (lang?: string) => api.get(`/banners?lang=${lang || 'en'}`),
  getActive: (position?: string, lang?: string) => {
    const params = new URLSearchParams();
    params.append('lang', lang || 'en');
    if (position) params.append('position', position);
    return api.get(`/banners/active?${params.toString()}`);
  },
  getById: (id: string) => api.get(`/banners/${id}`),
  create: (data: any) => api.post('/banners', data),
  update: (id: string, data: any) => api.patch(`/banners/${id}`, data),
  delete: (id: string) => api.delete(`/banners/${id}`),
};

// ==================== UPLOAD API ====================
export const uploadAPI = {
  uploadImage: (formData: FormData) => 
    api.post('/upload/image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
  uploadImages: (formData: FormData) => 
    api.post('/upload/images', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
  uploadBanner: (formData: FormData) => 
    api.post('/upload/banner', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
};

// ==================== CONTACT API ====================
export const contactAPI = {
  submit: (data: {
    name: string;
    email: string;
    phone?: string;
    subject: string;
    message: string;
  }) => api.post('/contact', data),
  
  getAll: () => api.get('/contact'),
  getById: (id: string) => api.get(`/contact/${id}`),
  markAsRead: (id: string) => api.patch(`/contact/${id}/read`),
  delete: (id: string) => api.delete(`/contact/${id}`),
};

// ==================== DASHBOARD API ====================
export const dashboardAPI = {
  getStats: () => api.get('/admin/dashboard/stats'),
  getRecentActivities: (limit?: number) => 
    api.get(`/admin/dashboard/activities?limit=${limit || 10}`),
  getSalesData: (period?: string) => 
    api.get(`/admin/dashboard/sales?period=${period || 'month'}`),
};

// ==================== HEALTH CHECK ====================
export const healthAPI = {
  check: () => api.get('/health'),
  checkDatabase: () => api.get('/health/db'),
};

// ==================== UTILITY FUNCTIONS ====================
// Helper để refresh token
export const refreshToken = async () => {
  try {
    const response = await api.post('/auth/refresh');
    const { token } = response.data;
    localStorage.setItem('adminToken', token);
    return token;
  } catch (error) {
    throw error;
  }
};

// Helper để check authentication
export const isAuthenticated = (): boolean => {
  const token = localStorage.getItem('adminToken');
  return !!token;
};

// Helper để get current user
export const getCurrentUser = () => {
  const userStr = localStorage.getItem('adminUser');
  return userStr ? JSON.parse(userStr) : null;
};

export default api;