import axios from 'axios';
import { useStore } from '@/store/useStore';

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor
api.interceptors.request.use(
  (config) => {
    // 1. Get Token (assuming it's stored in localStorage for now)
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('access_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    // 2. Attach Global State if needed (e.g., Role-based access or multi-tenant)
    const state = useStore.getState();
    if (state.role) {
      config.headers['X-User-Role'] = state.role;
    }
    if (state.tenantName) {
      config.headers['X-Tenant-Name'] = state.tenantName;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor
api.interceptors.response.use(
  (response) => {
    // Any status code that lie within the range of 2xx cause this function to trigger
    return response;
  },
  (error) => {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    if (error.response?.status === 401) {
      // Handle Unauthorized error globally
      if (typeof window !== 'undefined') {
        localStorage.removeItem('access_token');
        // Redirect to login if not already there
        if (window.location.pathname !== '/auth/login') {
          window.location.href = '/auth/login';
        }
      }
    }
    return Promise.reject(error);
  }
);
