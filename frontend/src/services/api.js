import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

api.interceptors.request.use(cfg => {
  cfg.headers = cfg.headers || {};
  const t = localStorage.getItem('sc_token') || localStorage.getItem('token');
  if (t) cfg.headers.Authorization = `Bearer ${t}`;
  return cfg;
});

api.interceptors.response.use(res => res, err => {
  if (err.response?.status === 401) {
    localStorage.removeItem('sc_token');
    localStorage.removeItem('sc_user');
    window.location.href = '/login';
  }
  return Promise.reject(err);
});

// Auth (Module E)
export const authService = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
};

// Resources (Module A)
export const resourceService = {
  getAll: (params) => api.get('/resources', { params }),
  getById: (id) => api.get(`/resources/${id}`),
  create: (data) => api.post('/resources', data),
  update: (id, data) => api.put(`/resources/${id}`, data),
  delete: (id) => api.delete(`/resources/${id}`),
};

// Bookings (Module B)
export const bookingService = {
  getAll: (params) => api.get('/bookings', { params }),
  getMy: () => api.get('/bookings/my'),
  getById: (id) => api.get(`/bookings/${id}`),
  create: (data) => api.post('/bookings', data),
  review: (id, data) => api.patch(`/bookings/${id}/review`, data),
  cancel: (id) => api.patch(`/bookings/${id}/cancel`),
};

// Tickets (Module C)
export const ticketService = {
  getAll: (params) => api.get('/tickets', { params }),
  getById: (id) => api.get(`/tickets/${id}`),
  create: (data) => api.post('/tickets', data),
  updateStatus: (id, data) => api.patch(`/tickets/${id}/status`, data),
  delete: (id) => api.delete(`/tickets/${id}`),
  getAnalytics: () => api.get('/tickets/analytics'),
  uploadImages: (id, files) => {
    const fd = new FormData();
    files.forEach(f => fd.append('files', f));
    return api.post(`/tickets/${id}/images`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
  },
  addComment: (id, data) => api.post(`/tickets/${id}/comments`, data),
  editComment: (id, cid, data) => api.put(`/tickets/${id}/comments/${cid}`, data),
  deleteComment: (id, cid) => api.delete(`/tickets/${id}/comments/${cid}`),
};

// Notifications (Module D)
export const notificationService = {
  getAll: () => api.get('/notifications'),
  getUnreadCount: () => api.get('/notifications/unread-count'),
  markRead: (id) => api.patch(`/notifications/${id}/read`),
  markAllRead: () => api.patch('/notifications/read-all'),
};

// Admin
export const adminService = {
  getTicketAnalytics: () => api.get('/tickets/analytics'),
};

export default api;
