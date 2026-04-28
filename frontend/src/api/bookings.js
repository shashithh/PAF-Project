import api from './axios';
export const getBookings = () => api.get('/bookings');
export const getBooking = (id) => api.get(`/bookings/${id}`);
export const createBooking = (data) => api.post('/bookings', data);
export const reviewBooking = (id, data) => api.patch(`/bookings/${id}/review`, data);
export const cancelBooking = (id) => api.patch(`/bookings/${id}/cancel`);
