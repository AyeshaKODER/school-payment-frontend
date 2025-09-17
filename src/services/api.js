import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: "https://school-payment-backend-1.onrender.com",
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API methods
export const transactionAPI = {
  // Get all transactions with filters
  getTransactions: (params = {}) => 
    api.get('/transactions', { params }),
  
  // Get transactions by school ID
  getSchoolTransactions: (schoolId, params = {}) => 
    api.get(`/transactions/school/${schoolId}`, { params }),
  
  // Check transaction status
  getTransactionStatus: (customOrderId) => 
    api.get(`/transaction-status/${customOrderId}`),
  
  // Create payment
  createPayment: (paymentData) => 
    api.post('/create-payment', paymentData),
};

export default api;