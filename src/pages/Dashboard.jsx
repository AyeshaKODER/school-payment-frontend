import React, { useState, useEffect } from 'react';
import { 
  Search,
  Filter,
  Calendar,
  ChevronDown,
  Copy,
  Download,
  Eye,
  CreditCard,
  TrendingUp,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';
import { transactionAPI } from '../services/api';
import { formatCurrency, formatDate } from '../utils/formatters';
import Loader from '../components/common/Loader';
import { copyToClipboard } from '../utils/helpers';

const Dashboard = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    date: '',
    institute: ''
  });
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [stats, setStats] = useState({
    totalTransactions: 0,
    successfulTransactions: 0,
    pendingTransactions: 0,
    failedTransactions: 0,
    totalAmount: 0
  });

  useEffect(() => {
    fetchDashboardData();
  }, [filters, rowsPerPage]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const params = {
        page: 1,
        limit: rowsPerPage,
        ...filters
      };
      
      const response = await transactionAPI.getTransactions(params);
      const data = response.data.transactions || [];
      
      setTransactions(data);
      
      // Calculate stats
      const calculatedStats = data.reduce((acc, transaction) => {
        acc.totalTransactions++;
        acc.totalAmount += transaction.transaction_amount || 0;

        switch (transaction.status?.toLowerCase()) {
          case 'success':
            acc.successfulTransactions++;
            break;
          case 'pending':
            acc.pendingTransactions++;
            break;
          case 'failed':
            acc.failedTransactions++;
            break;
        }
        return acc;
      }, {
        totalTransactions: 0,
        successfulTransactions: 0,
        pendingTransactions: 0,
        failedTransactions: 0,
        totalAmount: 0
      });

      setStats(calculatedStats);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleCopyOrderId = async (orderId) => {
    const success = await copyToClipboard(orderId);
    if (success) {
      // You can add a toast notification here
      console.log('Order ID copied to clipboard');
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      success: { bg: 'bg-green-100', text: 'text-green-800', label: 'Success' },
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pending' },
      failed: { bg: 'bg-red-100', text: 'text-red-800', label: 'Failed' }
    };
    
    const config = statusConfig[status?.toLowerCase()] || statusConfig.pending;
    
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <div className="flex items-center">
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Transactions"
          value={stats.totalTransactions.toLocaleString()}
          icon={CreditCard}
          color="bg-blue-500"
        />
        <StatCard
          title="Successful"
          value={stats.successfulTransactions.toLocaleString()}
          icon={CheckCircle}
          color="bg-green-500"
        />
        <StatCard
          title="Pending"
          value={stats.pendingTransactions.toLocaleString()}
          icon={Clock}
          color="bg-yellow-500"
        />
        <StatCard
          title="Total Amount"
          value={formatCurrency(stats.totalAmount)}
          icon={TrendingUp}
          color="bg-purple-500"
        />
      </div>

      {/* Main Transaction Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        {/* Search and Filter Bar */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
            {/* Search Bar */}
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search Order ID..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
              />
            </div>

            {/* Filters */}
            <div className="flex items-center space-x-3">
              <div className="relative">
                <select
                  value={filters.date}
                  onChange={(e) => handleFilterChange('date', e.target.value)}
                  className="appearance-none bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 pr-8 text-sm text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="">Date</option>
                  <option value="today">Today</option>
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>

              <div className="relative">
                <select
                  value={filters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  className="appearance-none bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 pr-8 text-sm text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="">Status</option>
                  <option value="success">Success</option>
                  <option value="pending">Pending</option>
                  <option value="failed">Failed</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>

              <div className="relative">
                <select
                  value={filters.institute}
                  onChange={(e) => handleFilterChange('institute', e.target.value)}
                  className="appearance-none bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 pr-8 text-sm text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="">Select Institute</option>
                  <option value="bhavana">Bhavana Newsprint Vidyalaya</option>
                  <option value="delhi">Delhi Public School</option>
                  <option value="mumbai">Mumbai International</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>

              <button className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
                <Filter className="h-4 w-4 text-gray-600 dark:text-gray-400" />
              </button>
            </div>
          </div>
        </div>

        {/* Rows per page selector */}
        <div className="px-6 py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
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
            <button className="flex items-center space-x-1 text-sm text-primary-600 hover:text-primary-700">
              <Download className="h-4 w-4" />
              <span>Export</span>
            </button>
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <Loader text="Loading transactions..." />
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Sr.No
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Institute Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Order Amt
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Transaction Amt
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Payment Method
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Student Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Phone No
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {transactions.map((transaction, index) => (
                  <tr 
                    key={transaction.collect_id} 
                    className="table-hover-effect hover:bg-blue-50 dark:hover:bg-gray-700"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                      <div className="max-w-xs truncate">
                        {transaction.institute_name || 'Bhavana Newsprint Vidyalaya Vellore'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {formatDate(transaction.payment_time, { 
                        day: '2-digit',
                        month: '2-digit', 
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-900 dark:text-white font-mono">
                          {transaction.collect_id || transaction.custom_order_id}
                        </span>
                        <button
                          onClick={() => handleCopyOrderId(transaction.collect_id)}
                          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                        >
                          <Copy className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      ₹{(transaction.order_amount || 0).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      ₹{(transaction.transaction_amount || 0).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      <span className="uppercase font-medium">
                        {transaction.payment_mode || 'UPI'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(transaction.status)}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">
                          {transaction.student_info?.name || 'DHANIK PRAJIL'}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {transaction.student_info?.phone || '9544373737'}
                    </td>
                  </tr>
                ))}

                {transactions.length === 0 && !loading && (
                  <tr>
                    <td colSpan={10} className="px-6 py-12 text-center">
                      <div className="text-gray-500 dark:text-gray-400">
                        <CreditCard className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                        <div className="text-lg font-medium">No transactions found</div>
                        <div className="text-sm">Try adjusting your search or filter criteria</div>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="px-6 py-8">
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <div className="flex items-center">
                <XCircle className="h-5 w-5 text-red-500 mr-2" />
                <span className="text-red-700 dark:text-red-300">{error}</span>
                <button
                  onClick={fetchDashboardData}
                  className="ml-4 px-3 py-1 bg-red-100 dark:bg-red-800 text-red-700 dark:text-red-200 rounded hover:bg-red-200 dark:hover:bg-red-700 text-sm"
                >
                  Retry
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;