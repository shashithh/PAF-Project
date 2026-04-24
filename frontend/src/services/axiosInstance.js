import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080',
  headers: { 'Content-Type': 'application/json' }
});

// Interceptor: attach JWT automatically
api.interceptors.request.use(config => {
  const token = localStorage.getItem('jwt'); // read from localStorage
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
