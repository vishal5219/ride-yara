import axios from 'axios';

const API_GATEWAY = process.env.REACT_APP_API_GATEWAY_URL;

// Booking APIs
export const createBooking = (data, token) => axios.post(`${API_GATEWAY}/api/bookings`, data, { headers: { Authorization: `Bearer ${token}` } });
export const listBookings = (token) => axios.get(`${API_GATEWAY}/api/bookings`, { headers: { Authorization: `Bearer ${token}` } });

// Driver APIs
export const registerDriver = (data) => axios.post(`${API_GATEWAY}/api/drivers/register`, data);
export const loginDriver = (data) => axios.post(`${API_GATEWAY}/api/drivers/login`, data);

// User APIs
export const registerUser = (data) => axios.post(`${API_GATEWAY}/api/users/register`, data);
export const loginUser = (data) => axios.post(`${API_GATEWAY}/api/users/login`, data);

// Payment APIs
export const initiatePayment = (data, token) => axios.post(`${API_GATEWAY}/api/payments/initiate`, data, { headers: { Authorization: `Bearer ${token}` } });
export const verifyPayment = (data, token) => axios.post(`${API_GATEWAY}/api/payments/verify`, data, { headers: { Authorization: `Bearer ${token}` } });
export const refundPayment = (data, token) => axios.post(`${API_GATEWAY}/api/payments/refund`, data, { headers: { Authorization: `Bearer ${token}` } });

// Notification APIs
export const getNotifications = (token) => axios.get(`${API_GATEWAY}/api/notifications`, { headers: { Authorization: `Bearer ${token}` } });
export const markNotificationRead = (id, token) => axios.post(`${API_GATEWAY}/api/notifications/${id}/read`, {}, { headers: { Authorization: `Bearer ${token}` } }); 