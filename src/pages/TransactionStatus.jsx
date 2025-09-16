import React from 'react';
import StatusCheck from '../components/transactions/StatusCheck';

const TransactionStatus = () => {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Transaction Status</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Check the current status of any transaction using its custom order ID
        </p>
      </div>

      <StatusCheck />
    </div>
  );
};