import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Download } from 'lucide-react';
import TransactionTable from '../components/transactions/TransactionTable';
import TransactionFilters from '../components/transactions/TransactionFilters';
import { useTransactions } from '../hooks/useApi';
import { usePagination } from '../hooks/usePagination';
import { useDebounce } from '../hooks/useDebounce';
import { useUrlFilters } from '../hooks/useUrlFilters';
import useStore from '../store/useStore';
import { downloadCSV } from '../utils/helpers';
import { ITEMS_PER_PAGE } from '../utils/constants';

const Transactions = () => {
  const { filters, setFilters, clearFilters } = useStore();
  const { currentPage, limit, goToPage, goToNextPage, goToPreviousPage, changeLimit } = usePagination();
  const { updateUrlWithFilters } = useUrlFilters();
  const [sortField, setSortField] = useState('payment_time');
  const [sortOrder, setSortOrder] = useState('desc');

  // Debounce search to avoid too many API calls
  const debouncedFilters = useDebounce(filters, 300);

  const { 
    transactions, 
    totalPages, 
    totalCount, 
    loading, 
    error, 
    refetch 
  } = useTransactions(
    { ...debouncedFilters, sort: sortField, order: sortOrder }, 
    currentPage, 
    limit
  );

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const handleApplyFilters = (newFilters) => {
    setFilters(newFilters);
    updateUrlWithFilters(newFilters, 1, limit);
    goToPage(1); // Reset to first page when filters change
  };

  const handleClearFilters = () => {
    clearFilters();
    updateUrlWithFilters({}, 1, limit);
    goToPage(1);
  };

  const handleExport = () => {
    if (transactions.length === 0) return;
    
    const exportData = transactions.map(transaction => ({
      'Collect ID': transaction.collect_id,
      'School ID': transaction.school_id,
      'Gateway': transaction.gateway,
      'Order Amount': transaction.order_amount,
      'Transaction Amount': transaction.transaction_amount,
      'Status': transaction.status,
      'Payment Mode': transaction.payment_mode,
      'Payment Time': transaction.payment_time,
      'Bank Reference': transaction.bank_reference
    }));
    
    downloadCSV(exportData, `transactions-${new Date().toISOString().split('T')[0]}.csv`);
  };

  const Pagination = () => {
    if (totalPages <= 1) return null;

    const getPageNumbers = () => {
      const delta = 2;
      const pages = [];
      const rangeStart = Math.max(2, currentPage - delta);
      const rangeEnd = Math.min(totalPages - 1, currentPage + delta);

      for (let i = rangeStart; i <= rangeEnd; i++) {
        pages.push(i);
      }

      if (rangeStart > 2) {
        pages.unshift('...');
      }
      if (rangeEnd < totalPages - 1) {
        pages.push('...');
      }

      pages.unshift(1);
      if (totalPages !== 1) {
        pages.push(totalPages);
      }

      return pages;
    };

    return (
      <div className="bg-white dark:bg-gray-800 px-6 py-4 border-t border-gray-200 dark:border-gray-700 rounded-b-lg">
        <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-4">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Showing {((currentPage - 1) * limit) + 1} to {Math.min(currentPage * limit, totalCount)} of {totalCount} results
            </p>
            <select
              value={limit}
              onChange={(e) => changeLimit(Number(e.target.value))}
              className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value={10}>10 per page</option>
              <option value={25}>25 per page</option>
              <option value={50}>50 per page</option>
              <option value={100}>100 per page</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            {getPageNumbers().map((page, index) => (
              <button
                key={index}
                onClick={() => typeof page === 'number' && goToPage(page)}
                disabled={page === '...'}
                className={`px-3 py-2 text-sm font-medium rounded-lg ${
                  page === currentPage
                    ? 'bg-primary-500 text-white'
                    : page === '...'
                    ? 'text-gray-400 cursor-default'
                    : 'text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600'
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">All Transactions</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage and monitor all payment transactions
          </p>
        </div>
        
        <button
          onClick={handleExport}
          disabled={transactions.length === 0 || loading}
          className="flex items-center space-x-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Download className="h-4 w-4" />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Filters */}
      <TransactionFilters 
        onApplyFilters={handleApplyFilters}
        onClearFilters={handleClearFilters}
        loading={loading}
      />

      {/* Transactions Table */}
      <div>
        <TransactionTable
          transactions={transactions}
          loading={loading}
          onSort={handleSort}
          sortField={sortField}
          sortOrder={sortOrder}
        />
        
        <Pagination />
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <div className="flex items-center">
            <div className="text-red-700 dark:text-red-300">{error}</div>
            <button
              onClick={refetch}
              className="ml-4 px-3 py-1 bg-red-100 dark:bg-red-800 text-red-700 dark:text-red-200 rounded hover:bg-red-200 dark:hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Transactions;