import React, { useState } from 'react';
import { Eye, Copy, ExternalLink } from 'lucide-react';
import { formatCurrency, formatDate } from '../../utils/formatters';

const TransactionRow = ({ transaction, isSelected, onSelect, getStatusColor }) => {
  const [isHovered, setIsHovered] = useState(false);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  const truncateId = (id, length = 8) => {
    if (!id) return 'N/A';
    return id.length > length ? `${id.substring(0, length)}...` : id;
  };

  return (
    <tr
      className={`transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:shadow-md transform hover:-translate-y-0.5 hover:border-primary-200 dark:hover:border-primary-700 ${
        isSelected ? 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-l-primary-500' : ''
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <td className="px-6 py-4 whitespace-nowrap">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={onSelect}
          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
        />
      </td>
      
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-mono text-gray-900 dark:text-white">
            {truncateId(transaction.collect_id)}
          </span>
          {isHovered && (
            <button
              onClick={() => copyToClipboard(transaction.collect_id)}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
            >
              <Copy className="h-3 w-3" />
            </button>
          )}
        </div>
      </td>
      
      <td className="px-6 py-4 whitespace-nowrap">
        <span className="text-sm text-gray-900 dark:text-white">
          {transaction.school_id || 'N/A'}
        </span>
      </td>
      
      <td className="px-6 py-4 whitespace-nowrap">
        <span className="text-sm text-gray-900 dark:text-white capitalize">
          {transaction.gateway || 'N/A'}
        </span>
      </td>
      
      <td className="px-6 py-4 whitespace-nowrap">
        <span className="text-sm font-medium text-gray-900 dark:text-white">
          {formatCurrency(transaction.order_amount)}
        </span>
      </td>
      
      <td className="px-6 py-4 whitespace-nowrap">
        <span className="text-sm font-medium text-gray-900 dark:text-white">
          {formatCurrency(transaction.transaction_amount)}
        </span>
      </td>
      
      <td className="px-6 py-4 whitespace-nowrap">
        <span
          className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full transition-colors ${getStatusColor(
            transaction.status
          )}`}
        >
          {transaction.status || 'Unknown'}
        </span>
      </td>
      
      <td className="px-6 py-4 whitespace-nowrap">
        <span className="text-sm text-gray-900 dark:text-white">
          {formatDate(transaction.payment_time)}
        </span>
      </td>
      
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <div className={`flex items-center justify-end space-x-2 transition-opacity duration-200 ${
          isHovered ? 'opacity-100' : 'opacity-60'
        }`}>
          <button
            onClick={() => console.log('View transaction:', transaction.collect_id)}
            className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-200 p-1 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded transition-colors"
            title="View Details"
          >
            <Eye className="h-4 w-4" />
          </button>
          <button
            onClick={() => copyToClipboard(transaction.custom_order_id || transaction.collect_id)}
            className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 p-1 hover:bg-gray-50 dark:hover:bg-gray-700 rounded transition-colors"
            title="Copy ID"
          >
            <Copy className="h-4 w-4" />
          </button>
          <button
            onClick={() => window.open(`/transaction/${transaction.collect_id}`, '_blank')}
            className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 p-1 hover:bg-gray-50 dark:hover:bg-gray-700 rounded transition-colors"
            title="Open in New Tab"
          >
            <ExternalLink className="h-4 w-4" />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default TransactionRow;
