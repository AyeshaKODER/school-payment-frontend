// Authentication service integrated with backend API
// Uses the deployed backend at https://school-payment-backend-1.onrender.com

class AuthService {
  constructor() {
    this.USERS_KEY = 'school_payment_users';
    this.CURRENT_USER_KEY = 'school_payment_current_user';
    this.TOKEN_KEY = 'school_payment_token';
    
    // Initialize with default admin user for examiner testing
    this.initializeDefaultUsers();
  }

  initializeDefaultUsers() {
    const existingUsers = this.getUsers();
    const adminExists = existingUsers.some(user => user.email === 'admin@gmail.com');
    
    if (!adminExists) {
      const defaultUsers = [
        {
          id: 'admin-001',
          username: 'admin',
          email: 'admin@gmail.com',
          password: 'admin', // In real app, this would be hashed
          name: 'Administrator',
          role: 'admin',
          createdAt: new Date().toISOString(),
          isActive: true
        }
      ];
      
      const allUsers = [...existingUsers, ...defaultUsers];
      localStorage.setItem(this.USERS_KEY, JSON.stringify(allUsers));
    }
  }

  getUsers() {
    try {
      const users = localStorage.getItem(this.USERS_KEY);
      return users ? JSON.parse(users) : [];
    } catch (error) {
      console.error('Error loading users:', error);
      return [];
    }
  }

  saveUsers(users) {
    try {
      localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
      return true;
    } catch (error) {
      console.error('Error saving users:', error);
      return false;
    }
  }

  // Registration functionality
  async register(userData) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const { username, email, password, name } = userData;
          
          // Validation
          if (!username || !email || !password || !name) {
            reject(new Error('All fields are required'));
            return;
          }

          if (password.length < 4) {
            reject(new Error('Password must be at least 4 characters long'));
            return;
          }

          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(email)) {
            reject(new Error('Please enter a valid email address'));
            return;
          }

          const users = this.getUsers();
          
          // Check if user already exists
          const existingUser = users.find(user => 
            user.email.toLowerCase() === email.toLowerCase() || 
            user.username.toLowerCase() === username.toLowerCase()
          );
          
          if (existingUser) {
            reject(new Error('User with this email or username already exists'));
            return;
          }

          // Create new user
          const newUser = {
            id: `user-${Date.now()}`,
            username: username.trim(),
            email: email.toLowerCase().trim(),
            password: password, // In real app, hash this
            name: name.trim(),
            role: 'user',
            createdAt: new Date().toISOString(),
            isActive: true
          };

          const updatedUsers = [...users, newUser];
          
          if (this.saveUsers(updatedUsers)) {
            // Return user without password
            const { password: _, ...userWithoutPassword } = newUser;
            resolve(userWithoutPassword);
          } else {
            reject(new Error('Failed to save user data'));
          }
        } catch (error) {
          reject(new Error('Registration failed: ' + error.message));
        }
      }, 500); // Simulate API delay
    });
  }

  // Login functionality
  async login(credentials) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const { emailOrUsername, password } = credentials;
          
          if (!emailOrUsername || !password) {
            reject(new Error('Email/Username and password are required'));
            return;
          }

          const users = this.getUsers();
          const user = users.find(u => 
            (u.email.toLowerCase() === emailOrUsername.toLowerCase() || 
             u.username.toLowerCase() === emailOrUsername.toLowerCase()) &&
            u.password === password &&
            u.isActive
          );

          if (!user) {
            reject(new Error('Invalid credentials. Please check your email/username and password.'));
            return;
          }

          // Generate mock token
          const token = `mock-jwt-token-${user.id}-${Date.now()}`;
          
          // Store current user and token
          const { password: _, ...userWithoutPassword } = user;
          localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(userWithoutPassword));
          localStorage.setItem(this.TOKEN_KEY, token);

          resolve({
            user: userWithoutPassword,
            token: token
          });
        } catch (error) {
          reject(new Error('Login failed: ' + error.message));
        }
      }, 500); // Simulate API delay
    });
  }

  // Logout functionality
  logout() {
    localStorage.removeItem(this.CURRENT_USER_KEY);
    localStorage.removeItem(this.TOKEN_KEY);
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

  // Validate token (mock validation)
  async validateToken(token) {
    return new Promise((resolve) => {
      setTimeout(() => {
        // In a real app, this would validate with the server
        const currentToken = this.getToken();
        const currentUser = this.getCurrentUser();
        
        resolve(!!(token && currentToken === token && currentUser));
      }, 200);
    });
  }
}

// Create singleton instance
const authService = new AuthService();
export default authService;