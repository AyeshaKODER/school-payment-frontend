import React, { useState } from 'react';
import { ChevronUp, ChevronDown, Eye, Download } from 'lucide-react';
import TransactionRow from './TransactionRow';
import Loader from '../common/Loader';
import { formatCurrency, formatDate } from '../../utils/formatters';

const TransactionTable = ({ 
  transactions, 
  loading, 
  onSort, 
  sortField, 
  sortOrder 
}) => {
  const [selectedTransactions, setSelectedTransactions] = useState([]);

  const columns = [
    { key: 'collect_id', label: 'Collect ID', sortable: true },
    { key: 'school_id', label: 'School ID', sortable: true },
    { key: 'gateway', label: 'Gateway', sortable: true },
    { key: 'order_amount', label: 'Order Amount', sortable: true },
    { key: 'transaction_amount', label: 'Transaction Amount', sortable: true },
    { key: 'status', label: 'Status', sortable: true },
    { key: 'payment_time', label: 'Payment Time', sortable: true },
    { key: 'actions', label: 'Actions', sortable: false },
  ];

  const handleSort = (field) => {
    if (!field) return;
    onSort(field);
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedTransactions(transactions.map(t => t.collect_id));
    } else {
      setSelectedTransactions([]);
    }
  };

  const handleSelectTransaction = (collectId) => {
    setSelectedTransactions(prev => 
      prev.includes(collectId)
        ? prev.filter(id => id !== collectId)
        : [...prev, collectId]
    );
  };

  const getSortIcon = (field) => {
    if (sortField !== field) return null;
    return sortOrder === 'asc' ? (
      <ChevronUp className="h-4 w-4" />
    ) : (
      <ChevronDown className="h-4 w-4" />
    );
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'success':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'failed':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <Loader text="Loading transactions..." />
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      {/* Table Header Actions */}
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Transactions ({transactions.length})
          </h3>
          {selectedTransactions.length > 0 && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {selectedTransactions.length} selected
              </span>
              <button className="px-3 py-1 bg-primary-500 text-white rounded-lg text-sm hover:bg-primary-600">
                <Download className="h-4 w-4 inline mr-1" />
                Export
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                <input
                  type="checkbox"
                  checked={selectedTransactions.length === transactions.length && transactions.length > 0}
                  onChange={handleSelectAll}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
              </th>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  {column.sortable ? (
                    <button
                      onClick={() => handleSort(column.key)}
                      className="flex items-center space-x-1 hover:text-gray-700 dark:hover:text-gray-200"
                    >
                      <span>{column.label}</span>
                      {getSortIcon(column.key)}
                    </button>
                  ) : (
                    column.label
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {transactions.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 1} className="px-6 py-8 text-center">
                  <div className="text-gray-500 dark:text-gray-400">
                    <div className="text-lg font-medium">No transactions found</div>
                    <div className="text-sm">Try adjusting your search or filter criteria</div>
                  </div>
                </td>
              </tr>
            ) : (
              transactions.map((transaction) => (
                <TransactionRow
                  key={transaction.collect_id}
                  transaction={transaction}
                  isSelected={selectedTransactions.includes(transaction.collect_id)}
                  onSelect={() => handleSelectTransaction(transaction.collect_id)}
                  getStatusColor={getStatusColor}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionTable;