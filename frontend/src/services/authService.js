import api from './api';

const authService = {
  getCsrfCookie: () => api.get('../sanctum/csrf-cookie'),
  
  login: async (credentials) => {
    await authService.getCsrfCookie();
    const response = await api.post('/login', credentials);
    if (response.data.user) {
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },
  
  register: async (data) => {
    const response = await api.post('/register', data);
    if (response.data.user) {
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },
  
  logout: async () => {
    await api.post('/logout');
    localStorage.removeItem('user');
  },
  
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
  
  me: () => api.get('/user'),
};

export default authService;
