import axios from 'axios';

// Use your deployed backend
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://school-payment-backend-1.onrender.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // Increased timeout for Render.com cold starts
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
    console.error('API Error:', error.response?.data || error.message);
    
    if (error.response?.status === 401) {
      localStorage.removeItem('school_payment_token');
      localStorage.removeItem('school_payment_current_user');
      window.location.href = '/login';
    }
    
    // Handle network errors (common with Render.com cold starts)
    if (error.code === 'NETWORK_ERROR' || !error.response) {
      console.warn('Network error - Backend might be starting up on Render.com');
      error.message = 'Backend is starting up, please wait a moment and try again.';
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