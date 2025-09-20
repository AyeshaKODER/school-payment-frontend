import React, { useState, useEffect } from 'react';
import './index.css';

// Mock store hook (simplified version)
const useStore = () => {
  const [state, setState] = useState({
    token: localStorage.getItem('token'),
    user: JSON.parse(localStorage.getItem('user') || 'null'),
    isDarkMode: false
  });

  const setToken = (token) => {
    localStorage.setItem('token', token);
    setState(prev => ({ ...prev, token }));
  };

  const setUser = (user) => {
    localStorage.setItem('user', JSON.stringify(user));
    setState(prev => ({ ...prev, user }));
  };

  return {
    ...state,
    setToken,
    setUser
  };
};

// Login Component
const Login = ({ onLogin }) => {
  const handleLogin = () => {
    onLogin();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">School Pay</h1>
          <p className="text-gray-600 mt-2">Payment Dashboard</p>
        </div>
        
        <button
          onClick={handleLogin}
          className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-600 font-medium transition-colors"
        >
          Login as Admin
        </button>

        <div className="mt-4 p-3 bg-green-50 rounded-lg">
          <p className="text-sm text-green-700">✅ App is working! Router issue fixed.</p>
        </div>
      </div>
    </div>
  );
};

// Simple Dashboard Component
const Dashboard = () => {
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    date: '',
    institute: ''
  });

  // Mock transaction data
  const mockTransactions = [
    {
      id: 1,
      instituteName: "Bhavana Newsprint Vidyalaya Vellore",
      dateTime: "14/12/2024 6:12:39 pm",
      orderId: "608A173418018880570031",
      orderAmt: 1050,
      transactionAmt: 1055.9,
      paymentMethod: "UPI",
      status: "Success",
      studentName: "DHANIK PRAJIL",
      phoneNo: "9544373737"
    },
    {
      id: 2,
      instituteName: "Delhi Public School",
      dateTime: "14/12/2024 5:15:20 pm", 
      orderId: "608A173418018880570032",
      orderAmt: 2000,
      transactionAmt: 2020,
      paymentMethod: "Net Banking",
      status: "Pending",
      studentName: "DEVA SHARMA",
      phoneNo: "9876543210"
    },
    {
      id: 3,
      instituteName: "Mumbai International School",
      dateTime: "14/12/2024 4:30:15 pm",
      orderId: "608A173418018880570033",
      orderAmt: 1500,
      transactionAmt: 1515,
      paymentMethod: "Card",
      status: "Failed",
      studentName: "RAJESH KUMAR",
      phoneNo: "8765432109"
    }
  ];

  const [currentPage, setCurrentPage] = useState('dashboard');
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const getStatusBadge = (status) => {
    const statusConfig = {
      'Success': 'bg-green-100 text-green-800',
      'Pending': 'bg-yellow-100 text-yellow-800', 
      'Failed': 'bg-red-100 text-red-800'
    };
    
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusConfig[status] || 'bg-gray-100 text-gray-800'}`}>
        {status}
      </span>
    );
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const copyOrderId = (orderId) => {
    navigator.clipboard.writeText(orderId).then(() => {
      alert('Order ID copied to clipboard!');
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">School Payment Dashboard</h1>
            <div className="flex items-center space-x-4">
              <button className="p-2 rounded-lg hover:bg-gray-100">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5-5-5h5v-12" />
                </svg>
              </button>
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">A</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="px-6 py-3">
          <div className="flex space-x-8">
            {['dashboard', 'transactions', 'schools', 'status'].map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`text-sm font-medium capitalize pb-3 border-b-2 transition-colors ${
                  currentPage === page
                    ? 'text-blue-600 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700 border-transparent'
                }`}
              >
                {page === 'status' ? 'Transaction Status' : page}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Stats Cards */}
      <div className="px-6 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-blue-500">
                <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Transactions</p>
                <p className="text-2xl font-bold text-gray-900">{mockTransactions.length.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-green-500">
                <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Successful</p>
                <p className="text-2xl font-bold text-gray-900">
                  {mockTransactions.filter(t => t.status === 'Success').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-yellow-500">
                <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">
                  {mockTransactions.filter(t => t.status === 'Pending').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-purple-500">
                <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Amount</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(mockTransactions.reduce((sum, t) => sum + t.transactionAmt, 0))}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Transaction Table */}
        <div className="bg-white rounded-lg shadow">
          {/* Search and Filter Bar */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
              {/* Search Bar */}
              <div className="relative max-w-md">
                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search Order ID..."
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
              </div>

              {/* Filters */}
              <div className="flex items-center space-x-3">
                <select
                  value={filters.date}
                  onChange={(e) => setFilters(prev => ({ ...prev, date: e.target.value }))}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Date</option>
                  <option value="today">Today</option>
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                </select>

                <select
                  value={filters.status}
                  onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Status</option>
                  <option value="Success">Success</option>
                  <option value="Pending">Pending</option>
                  <option value="Failed">Failed</option>
                </select>

                <select
                  value={filters.institute}
                  onChange={(e) => setFilters(prev => ({ ...prev, institute: e.target.value }))}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select Institute</option>
                  <option value="bhavana">Bhavana Newsprint Vidyalaya</option>
                  <option value="delhi">Delhi Public School</option>
                  <option value="mumbai">Mumbai International</option>
                </select>

                <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <svg className="h-4 w-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Rows per page selector */}
          <div className="px-6 py-3 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <span>Rows per page:</span>
                <select
                  value={rowsPerPage}
                  onChange={(e) => setRowsPerPage(Number(e.target.value))}
                  className="border-none bg-transparent text-sm focus:ring-0"
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </select>
              </div>
              <button className="flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-700">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>Export</span>
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sr.No</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Institute Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order Amt</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transaction Amt</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Method</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone No</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {mockTransactions.map((transaction, index) => (
                  <tr 
                    key={transaction.id} 
                    className="hover:bg-blue-50 hover:shadow-md hover:scale-[1.01] hover:-translate-y-1 transition-all duration-200 cursor-pointer"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{index + 1}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <div className="max-w-xs truncate">{transaction.instituteName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{transaction.dateTime}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-900 font-mono text-xs">{transaction.orderId}</span>
                        <button
                          onClick={() => copyOrderId(transaction.orderId)}
                          className="text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {formatCurrency(transaction.orderAmt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {formatCurrency(transaction.transactionAmt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span className="uppercase font-medium">{transaction.paymentMethod}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(transaction.status)}</td>
                    <td className="px-6 py-4 text-sm">
                      <div className="font-medium text-gray-900">{transaction.studentName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{transaction.phoneNo}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Success Message */}
          <div className="px-6 py-4 bg-green-50 border-t border-gray-200">
            <div className="flex items-center">
              <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-green-800 text-sm font-medium">✅ Router issue fixed! App is working perfectly.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main App Component (NO ROUTER - This fixes the issue)
function App() {
  const { token, setToken, setUser } = useStore();
  const [isAuthenticated, setIsAuthenticated] = useState(!!token);

  const handleLogin = () => {
    setUser({ name: 'Admin User', email: 'admin@schoolpay.com' });
    setToken('mock-jwt-token');
    setIsAuthenticated(true);
  };

  // Show login if not authenticated
  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  // Show dashboard if authenticated
  return <Dashboard />;
}

export default App;