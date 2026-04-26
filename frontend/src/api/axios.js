import axios from 'axios';
const api = axios.create({ baseURL: '/api', timeout: 15000 });
api.interceptors.request.use(cfg => {
  const t = localStorage.getItem('sc_token') || localStorage.getItem('token');
  if (t) cfg.headers.Authorization = `Bearer ${t}`;
  return cfg;
});
api.interceptors.response.use(res => res, err => {
  if (err.response?.status === 401) {
    localStorage.removeItem('sc_token');
    localStorage.removeItem('sc_user');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  }
  return Promise.reject(err);
});
export default api;
