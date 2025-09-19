import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/common/Layout';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import SchoolTransactions from './pages/SchoolTransactions';
import TransactionStatus from './pages/TransactionStatus';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import useStore from './store/useStore';
import Payment from './pages/Payment';

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
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
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
          
          <Route path="/pay" element={
            <ProtectedRoute>
              <Payment />
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
