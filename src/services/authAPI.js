import api from './api';

// Authentication service that integrates with backend
class AuthAPIService {
  constructor() {
    this.CURRENT_USER_KEY = 'school_payment_current_user';
    this.TOKEN_KEY = 'school_payment_token';
  }

  // Login with backend API
  async login(credentials) {
    try {
      const { emailOrUsername, password } = credentials;
      
      // Try to login with backend
      const response = await api.post('/auth/login', {
        email: emailOrUsername, // Backend expects email field
        password: password
      });

      if (response.data && response.data.token) {
        const { token, user } = response.data;
        
        // Store token and user data
        localStorage.setItem(this.TOKEN_KEY, token);
        localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(user));
        
        return { user, token };
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Login API Error:', error);
      
      // Handle specific error cases
      if (error.response?.status === 401) {
        throw new Error('Invalid email or password');
      } else if (error.response?.status === 404) {
        throw new Error('User not found');
      } else if (error.response?.status >= 500) {
        throw new Error('Server error. Please try again later.');
      } else if (error.code === 'NETWORK_ERROR' || !error.response) {
        throw new Error('Unable to connect to server. Please check your connection.');
      } else {
        throw new Error(error.response?.data?.message || 'Login failed');
      }
    }
  }

  // Register with backend API
  async register(userData) {
    try {
      const response = await api.post('/auth/register', {
        name: userData.name,
        email: userData.email,
        password: userData.password,
        // Add other fields your backend expects
      });

      if (response.data && response.data.user) {
        // Don't auto-login after registration
        return response.data.user;
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Registration API Error:', error);
      
      // Handle specific error cases
      if (error.response?.status === 409 || error.response?.status === 400) {
        throw new Error(error.response?.data?.message || 'User already exists');
      } else if (error.response?.status >= 500) {
        throw new Error('Server error. Please try again later.');
      } else if (error.code === 'NETWORK_ERROR' || !error.response) {
        throw new Error('Unable to connect to server. Please check your connection.');
      } else {
        throw new Error(error.response?.data?.message || 'Registration failed');
      }
    }
  }

  // Logout
  logout() {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.CURRENT_USER_KEY);
  }

  // Get current user
  getCurrentUser() {
    try {
      const user = localStorage.getItem(this.CURRENT_USER_KEY);
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error('Error loading current user:', error);
      return null;
    }
  }

  // Get current token
  getToken() {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  // Check if user is authenticated
  isAuthenticated() {
    return !!(this.getCurrentUser() && this.getToken());
  }

  // Validate token with backend
  async validateToken(token) {
    try {
      const response = await api.get('/auth/validate', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      return response.data && response.data.valid;
    } catch (error) {
      console.error('Token validation error:', error);
      return false;
    }
  }

  // Refresh token if backend supports it
  async refreshToken() {
    try {
      const response = await api.post('/auth/refresh');
      
      if (response.data && response.data.token) {
        localStorage.setItem(this.TOKEN_KEY, response.data.token);
        return response.data.token;
      }
      return null;
    } catch (error) {
      console.error('Token refresh error:', error);
      return null;
    }
  }

  // Fallback to demo login for development/testing
  async demoLogin() {
    try {
      // First try backend login
      return await this.login({
        emailOrUsername: 'admin@gmail.com',
        password: 'admin'
      });
    } catch (error) {
      console.warn('Backend login failed, using demo fallback:', error.message);
      
      // Fallback to demo user for testing
      const demoUser = {
        id: 'demo-admin',
        name: 'Administrator',
        email: 'admin@gmail.com',
        role: 'admin'
      };
      
      const demoToken = `demo-token-${Date.now()}`;
      
      localStorage.setItem(this.TOKEN_KEY, demoToken);
      localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(demoUser));
      
      return { user: demoUser, token: demoToken };
    }
  }
}

// Create singleton instance
const authAPIService = new AuthAPIService();
export default authAPIService;