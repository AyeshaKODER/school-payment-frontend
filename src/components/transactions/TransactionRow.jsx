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
      className={`table-hover-effect cursor-pointer ${
        isSelected ? 'bg-blue-50 dark:bg-blue-900/20' : ''
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <td className="px-6 py-4 whitespace-nowrap">
        <span
          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
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
        <div className="flex items-center space-x-2">
          <button
            onClick={() => console.log('View transaction:', transaction.collect_id)}
            className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-200"
          >
            <Eye className="h-4 w-4" />
          </button>
          <button
            onClick={() => window.open(`/transaction/${transaction.collect_id}`, '_blank')}
            className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <ExternalLink className="h-4 w-4" />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default TransactionRow;
