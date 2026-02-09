import axios from 'axios';

// Use environment variable for API URL, fallback to relative path for dev proxy
const API_BASE_URL = import.meta.env.VITE_API_URL 
  ? `${import.meta.env.VITE_API_URL}/api` 
  : '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Request interceptor to add auth token and handle content type
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // Only set Content-Type to JSON if it's not FormData
    if (!(config.data instanceof FormData)) {
      config.headers['Content-Type'] = 'application/json';
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
    // Only logout if 401 and not on login/register endpoints
    const isAuthEndpoint = error.config?.url?.includes('/auth/');
    if (error.response?.status === 401 && !isAuthEndpoint) {
      // Check if we have a token (means session expired, not failed login)
      const hasToken = localStorage.getItem('token');
      if (hasToken) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  login: (credentials) => api.post('/v1/auth/login', credentials),
  register: (userData) => api.post('/v1/auth/register', userData),
};

// User APIs
export const userAPI = {
  getAll: () => api.get('/users/'),
  getById: (id) => api.get(`/users/${id}`),
  create: (userData) => api.post('/users/', userData),
  update: (id, userData) => api.put(`/users/${id}`, userData),
  delete: (id) => api.delete(`/users/${id}`),
};

// Post APIs
export const postAPI = {
  getAll: (pageNumber = 0, pageSize = 10, sortBy = 'createdDate') => 
    api.get(`/posts?pageNumber=${pageNumber}&pageSize=${pageSize}&sortBy=${sortBy}`),
  getById: (id) => api.get(`/post/${id}/posts`),
  getByUser: (userId) => api.get(`/user/${userId}/posts`),
  getByCategory: (categoryId, pageNumber = 0, pageSize = 10) => 
    api.get(`/category/${categoryId}/posts?pageNumber=${pageNumber}&pageSize=${pageSize}`),
  create: (userId, categoryId, postData) => 
    api.post(`/user/${userId}/category/${categoryId}/posts`, postData),
  update: (id, postData) => api.put(`/post/${id}`, postData),
  delete: (id) => api.delete(`/post/${id}`),
  search: (keyword) => api.get(`/post/search/${keyword}`),
  uploadImage: (postId, formData) => {
    // FormData will be detected by interceptor, Content-Type set automatically
    return api.post(`/post/image/upload/${postId}`, formData);
  },
  getImageUrl: (imageName) => {
    const baseUrl = import.meta.env.VITE_API_URL || '';
    return `${baseUrl}/api/images/${imageName}`;
  },
};

// Category APIs
export const categoryAPI = {
  getAll: () => api.get('/categories/'),
  getById: (id) => api.get(`/categories/${id}`),
  create: (categoryData) => api.post('/categories/', categoryData),
  update: (id, categoryData) => api.put(`/categories/${id}`, categoryData),
  delete: (id) => api.delete(`/categories/${id}`),
};

// Comment APIs
export const commentAPI = {
  create: (postId, commentData) => api.post(`/posts/${postId}/comments`, commentData),
  delete: (commentId) => api.delete(`/comments/${commentId}`),
};

export default api;
