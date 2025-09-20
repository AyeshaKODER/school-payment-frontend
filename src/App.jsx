// src/App.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import './index.css';

import Layout from './components/common/Layout.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Transactions from './pages/Transactions.jsx';
import SchoolTransactions from './pages/SchoolTransactions.jsx';
import TransactionStatus from './pages/TransactionStatus.jsx';
import Payment from './pages/Payment.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import useStore from './store/useStore.js';

function ProtectedRoute({ children }) {
  const { token } = useStore();
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

export default function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Protected app routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout>
              {/* The nested routes will render into Layout's children */}
            </Layout>
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="transactions" element={<Transactions />} />
        <Route path="school-transactions" element={<SchoolTransactions />} />
        <Route path="transaction-status" element={<TransactionStatus />} />
        <Route path="pay" element={<Payment />} />
      </Route>

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
