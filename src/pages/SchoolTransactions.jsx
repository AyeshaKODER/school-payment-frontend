import React, { useState, useEffect } from "react";
import { Search, School, ChevronDown } from "lucide-react";
import TransactionTable from "../components/transactions/TransactionTable.jsx"; // Add .jsx
import { useSchoolTransactions } from "../hooks/useApi";
import { usePagination } from "../hooks/usePagination";
import Loader from "../components/common/Loader.jsx"; // Add .jsx if needed

const SchoolTransactions = () => {
  const [selectedSchool, setSelectedSchool] = useState('');
  const [schoolSearch, setSchoolSearch] = useState('');
  const [sortField, setSortField] = useState('payment_time');
  const [sortOrder, setSortOrder] = useState('desc');
  const [availableSchools] = useState([
    // Mock data - replace with actual school list from API
    { id: '65b0e6293e9f76a9694d84b4', name: 'Mumbai International School' },
    { id: '65b0e6293e9f76a9694d84b5', name: 'Delhi Public School' },
    { id: '65b0e6293e9f76a9694d84b6', name: 'Bangalore Modern School' },
    { id: '65b0e6293e9f76a9694d84b7', name: 'Chennai Elite Academy' },
  ]);

  const { currentPage, limit, goToPage } = usePagination();

  const { 
    transactions, 
    totalPages, 
    totalCount, 
    loading, 
    error, 
    refetch 
  } = useSchoolTransactions(
    selectedSchool,
    { sort: sortField, order: sortOrder }, 
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

  const filteredSchools = availableSchools.filter(school =>
    school.name.toLowerCase().includes(schoolSearch.toLowerCase())
  );

  const selectedSchoolName = availableSchools.find(s => s.id === selectedSchool)?.name || '';

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">School Transactions</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          View transactions for a specific school
        </p>
      </div>

      {/* School Selector */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="max-w-md">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Select School
          </label>
          <div className="relative">
            <select
              value={selectedSchool}
              onChange={(e) => {
                setSelectedSchool(e.target.value);
                goToPage(1);
              }}
              className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 dark:text-white appearance-none"
            >
              <option value="">Choose a school...</option>
              {availableSchools.map((school) => (
                <option key={school.id} value={school.id}>
                  {school.name}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {selectedSchoolName && (
          <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-center">
              <School className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />
              <span className="text-blue-800 dark:text-blue-200 font-medium">
                Showing transactions for: {selectedSchoolName}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Transactions */}
      {!selectedSchool ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="px-6 py-12 text-center">
            <School className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Select a School
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Choose a school from the dropdown above to view their transactions
            </p>
          </div>
        </div>
      ) : (
        <div>
          <TransactionTable
            transactions={transactions}
            loading={loading}
            onSort={handleSort}
            sortField={sortField}
            sortOrder={sortOrder}
          />

          {/* Simple Pagination for School Transactions */}
          {totalPages > 1 && (
            <div className="bg-white dark:bg-gray-800 px-6 py-4 border-t border-gray-200 dark:border-gray-700 rounded-b-lg">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Showing {((currentPage - 1) * limit) + 1} to {Math.min(currentPage * limit, totalCount)} of {totalCount} results
                </p>
                <div className="flex items-center space-x-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => goToPage(page)}
                      className={`px-3 py-2 text-sm font-medium rounded-lg ${
                        page === currentPage
                          ? 'bg-primary-500 text-white'
                          : 'text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="text-red-700 dark:text-red-300">{error}</div>
            <button
              onClick={refetch}
              className="px-3 py-1 bg-red-100 dark:bg-red-800 text-red-700 dark:text-red-200 rounded hover:bg-red-200 dark:hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SchoolTransactions;