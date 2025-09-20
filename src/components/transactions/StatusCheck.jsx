import React, { useState } from "react";
import { Search, CheckCircle, XCircle, Clock, AlertCircle } from "lucide-react";
import { transactionAPI } from "../../services/api";
import Loader from "../common/Loader";
import { formatCurrency, formatDate } from "../../utils/formatters";

const StatusCheck = () => {
  const [customOrderId, setCustomOrderId] = useState("");
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleCheckStatus = async () => {
    if (!customOrderId.trim()) return;

    setLoading(true);
    setError(null);

    try {
      // Backend expects POST /check-status with { custom_order_id }
      const response = await transactionAPI.checkTransactionStatus({
        custom_order_id: customOrderId.trim(),
      });
      setStatus(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch transaction status");
      setStatus(null);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (statusValue) => {
    switch (statusValue?.toLowerCase()) {
      case "success":
        return <CheckCircle className="h-8 w-8 text-green-500" />;
      case "failed":
        return <XCircle className="h-8 w-8 text-red-500" />;
      case "pending":
        return <Clock className="h-8 w-8 text-yellow-500" />;
      default:
        return <AlertCircle className="h-8 w-8 text-gray-500" />;
    }
  };

  const getStatusColor = (statusValue) => {
    switch (statusValue?.toLowerCase()) {
      case "success":
        return "text-green-600 bg-green-50 border-green-200";
      case "failed":
        return "text-red-600 bg-red-50 border-red-200";
      case "pending":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Check Transaction Status
        </h2>

        {/* Search Input */}
        <div className="flex space-x-4 mb-6">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Enter Custom Order ID"
              value={customOrderId}
              onChange={(e) => setCustomOrderId(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleCheckStatus()}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          <button
            onClick={handleCheckStatus}
            disabled={loading || !customOrderId.trim()}
            className="px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            <Search className="h-5 w-5" />
            <span>Check Status</span>
          </button>
        </div>

        {/* Loading */}
        {loading && <Loader text="Checking transaction status..." />}

        {/* Error */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <XCircle className="h-5 w-5 text-red-500 mr-2" />
              <span className="text-red-700 dark:text-red-300">{error}</span>
            </div>
          </div>
        )}

        {/* Status Result */}
        {status && (
          <div className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-6">
            <div className="flex items-center mb-4">
              {getStatusIcon(status.status)}
              <div className="ml-4">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Transaction Status
                </h3>
                <div
                  className={`inline-flex px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
                    status.status
                  )}`}
                >
                  {status.status?.toUpperCase() || "UNKNOWN"}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-300">
                  Order Amount
                </label>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {formatCurrency(status.order_amount)}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-300">
                  Transaction Amount
                </label>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {formatCurrency(status.transaction_amount)}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-300">
                  Payment Mode
                </label>
                <p className="text-gray-900 dark:text-white">{status.payment_mode || "N/A"}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-300">
                  Gateway
                </label>
                <p className="text-gray-900 dark:text-white">{status.gateway || "N/A"}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-300">
                  Payment Time
                </label>
                <p className="text-gray-900 dark:text-white">{formatDate(status.payment_time)}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-300">
                  Bank Reference
                </label>
                <p className="text-gray-900 dark:text-white">{status.bank_reference || "N/A"}</p>
              </div>

              {status.payment_message && (
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-300">
                    Payment Message
                  </label>
                  <p className="text-gray-900 dark:text-white">{status.payment_message}</p>
                </div>
              )}

              {status.error_message && status.error_message !== "NA" && (
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-red-600 dark:text-red-400">
                    Error Message
                  </label>
                  <p className="text-red-700 dark:text-red-300">{status.error_message}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatusCheck;
