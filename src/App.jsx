import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/common/Layout';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import SchoolTransactions from './pages/SchoolTransactions';
import TransactionStatus from './pages/TransactionStatus';
import useStore from './store/useStore';
import Payment from './pages/Payment';
// Mock Login component (you can replace with actual login)
const Login = () => {
  const { setUser, setToken } = useStore();

  const handleLogin = () => {
    // Mock login - replace with actual authentication
    setUser({ name: 'Admin User', email: 'admin@schoolpay.com' });
    setToken('mock-jwt-token');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">School Pay</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Payment Dashboard</p>
        </div>
        
        <button
          onClick={handleLogin}
          className="w-full bg-primary-500 text-white py-3 px-4 rounded-lg hover:bg-primary-600 font-medium"
        >
          Login as Admin
        </button>
      </div>
    </div>
  );
};

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { token } = useStore();
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  return <Layout>{children}</Layout>;
};

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route path="/pay" element={<Payment />} />
          
          <Route path="/" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/transactions" element={
            <ProtectedRoute>
              <Transactions />
            </ProtectedRoute>
          } />
          
          <Route path="/school-transactions" element={
            <ProtectedRoute>
              <SchoolTransactions />
            </ProtectedRoute>
          } />
          
          <Route path="/transaction-status" element={
            <ProtectedRoute>
              <TransactionStatus />
            </ProtectedRoute>
          } />
          
          {/* Redirect any unknown routes to dashboard */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
