import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Response interceptor to handle 401 Unauthenticated errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('user');
      // Only redirect if we are not already on an auth/landing page to prevent loops
      const path = window.location.pathname;
      if (path !== '/' && path !== '/login' && path !== '/register' && path !== '/portals') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
