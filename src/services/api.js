import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://school-payment-backend-1.onrender.com';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor for auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('school_payment_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);

    if (error.response?.status === 401) {
      localStorage.removeItem('school_payment_token');
      localStorage.removeItem('school_payment_current_user');
      window.location.href = '/login';
    }

    if (error.code === 'NETWORK_ERROR' || !error.response) {
      error.message = 'Backend is starting up, please wait a moment and try again.';
    }

    return Promise.reject(error);
  }
);

export const transactionAPI = {
  getTransactions: (params = {}) => api.get('/api/transactions', { params }),
  getSchoolTransactions: (schoolId, params = {}) => api.get(`/api/transactions/${schoolId}`, { params }),
  checkTransactionStatus: (data) => api.post('/api/check-status', data),
  createPayment: (paymentData) => api.post('/api/payment/create-payment', paymentData),
};

export default api;
