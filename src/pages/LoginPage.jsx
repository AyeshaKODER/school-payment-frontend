import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, LogIn, AlertCircle, CheckCircle, GraduationCap } from 'lucide-react';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import authAPIService from '../services/authAPI';
import useStore from '../store/useStore';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser, setToken } = useStore();
  
  const [formData, setFormData] = useState({
    emailOrUsername: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  // Handle messages from registration redirect
  useEffect(() => {
    if (location.state?.message) {
      setSuccess(location.state.message);
      if (location.state.email) {
        setFormData(prev => ({ ...prev, emailOrUsername: location.state.email }));
      }
      // Clear the state
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear field error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    
    // Clear general error
    if (error) {
      setError('');
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.emailOrUsername.trim()) {
      errors.emailOrUsername = 'Email or username is required';
    }
    
    if (!formData.password) {
      errors.password = 'Password is required';
    }
    
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      const credentials = {
        emailOrUsername: formData.emailOrUsername.trim(),
        password: formData.password
      };

      const response = await authAPIService.login(credentials);
      
      // Update store with user data and token
      setUser(response.user);
      setToken(response.token);
      
      // Redirect to dashboard
      navigate('/', { replace: true });

    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setFormData({
      emailOrUsername: 'admin@gmail.com',
      password: 'admin'
    });
    
    setLoading(true);
    setError('');

    try {
      const response = await authAPIService.demoLogin();
      
      setUser(response.user);
      setToken(response.token);
      navigate('/', { replace: true });
    } catch (err) {
      setError(err.message || 'Demo login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-primary-500 rounded-full flex items-center justify-center mb-4">
            <GraduationCap className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            School Payment System
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Sign in to your account
          </p>
        </div>

        {/* Login Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 space-y-6">
            
            {/* Success Message */}
            {success && (
              <div className="flex items-center space-x-2 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                <span className="text-green-700 dark:text-green-300 text-sm">{success}</span>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="flex items-center space-x-2 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                <span className="text-red-700 dark:text-red-300 text-sm">{error}</span>
              </div>
            )}

            {/* Email/Username */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email or Username
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="text"
                  name="emailOrUsername"
                  value={formData.emailOrUsername}
                  onChange={handleChange}
                  className={`pl-10 ${fieldErrors.emailOrUsername ? 'border-red-500 focus:ring-red-500' : ''}`}
                  placeholder="Enter your email or username"
                  disabled={loading}
                  autoComplete="username"
                />
              </div>
              {fieldErrors.emailOrUsername && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{fieldErrors.emailOrUsername}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`pl-10 pr-10 ${fieldErrors.password ? 'border-red-500 focus:ring-red-500' : ''}`}
                  placeholder="Enter your password"
                  disabled={loading}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {fieldErrors.password && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{fieldErrors.password}</p>
              )}
            </div>

            {/* Sign In Button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-500 hover:bg-primary-600 text-white py-3 px-4 rounded-lg font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <LogIn className="h-4 w-4" />
                  <span>Sign In</span>
                </>
              )}
            </Button>

            {/* Register Link */}
            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Don't have an account?{' '}
                <Link 
                  to="/register" 
                  className="font-medium text-primary-500 hover:text-primary-600 dark:text-primary-400 dark:hover:text-primary-300"
                >
                  Create one here
                </Link>
              </p>
            </div>
          </div>
        </form>

        {/* Demo Login Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 text-center">
            Quick Demo Access
          </h3>
          
          <Button
            onClick={handleDemoLogin}
            disabled={loading}
            variant="outline"
            className="w-full border-primary-500 text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 py-3 px-4 rounded-lg font-medium transition-colors duration-200"
          >
            Login as Admin (Demo)
          </Button>
          
          <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">
              Demo Credentials:
            </h4>
            <div className="text-xs text-blue-700 dark:text-blue-300 space-y-1">
              <p><strong>Email:</strong> admin@gmail.com</p>
              <p><strong>Password:</strong> admin</p>
              <p className="text-blue-600 dark:text-blue-400 mt-2">
                Perfect for examiner testing and demonstration
              </p>
            </div>
          </div>
        </div>

        {/* Features Preview */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 text-center">
            What's Inside
          </h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="text-primary-500 mb-2">📊</div>
              <div className="text-gray-700 dark:text-gray-300">Transaction Dashboard</div>
            </div>
            <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="text-primary-500 mb-2">🔍</div>
              <div className="text-gray-700 dark:text-gray-300">Advanced Filters</div>
            </div>
            <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="text-primary-500 mb-2">🌙</div>
              <div className="text-gray-700 dark:text-gray-300">Dark Mode</div>
            </div>
            <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="text-primary-500 mb-2">📱</div>
              <div className="text-gray-700 dark:text-gray-300">Responsive Design</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
