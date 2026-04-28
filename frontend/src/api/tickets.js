import api from './axios';
export const getTickets = (params) => api.get('/tickets', { params });
export const getTicket = (id) => api.get(`/tickets/${id}`);
export const createTicket = (data) => api.post('/tickets', data);
export const updateTicketStatus = (id, data) => api.patch(`/tickets/${id}/status`, data);
export const deleteTicket = (id) => api.delete(`/tickets/${id}`);
export const getTicketAnalytics = () => api.get('/tickets/analytics');
export const addComment = (id, data) => api.post(`/tickets/${id}/comments`, data);
export const editComment = (id, cid, data) => api.put(`/tickets/${id}/comments/${cid}`, data);
export const deleteComment = (id, cid) => api.delete(`/tickets/${id}/comments/${cid}`);
export const uploadImages = (id, files) => {
  const fd = new FormData();
  files.forEach(f => fd.append('files', f));
  return api.post(`/tickets/${id}/images`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
};
