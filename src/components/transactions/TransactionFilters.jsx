import React, { useState, useRef, useEffect } from 'react';
import { Search, Filter, X, Calendar, ChevronDown } from 'lucide-react';
import useStore from '../../store/useStore';
import { TRANSACTION_STATUS, PAYMENT_GATEWAYS } from '../../utils/constants';

const TransactionFilters = ({ onApplyFilters, onClearFilters, loading }) => {
  const { filters, setFilters } = useStore();
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const [schoolDropdownOpen, setSchoolDropdownOpen] = useState(false);
  
  const statusDropdownRef = useRef(null);
  const schoolDropdownRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (statusDropdownRef.current && !statusDropdownRef.current.contains(event.target)) {
        setStatusDropdownOpen(false);
      }
      if (schoolDropdownRef.current && !schoolDropdownRef.current.contains(event.target)) {
        setSchoolDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onApplyFilters(newFilters);
  };

  const handleMultiSelectChange = (key, value, isSelected) => {
    const currentValues = filters[key] || [];
    let newValues;
    
    if (isSelected) {
      newValues = currentValues.filter(v => v !== value);
    } else {
      newValues = [...currentValues, value];
    }
    
    const newFilters = { ...filters, [key]: newValues };
    setFilters(newFilters);
    onApplyFilters(newFilters);
  };

  const handleClearFilters = () => {
    onClearFilters();
    setShowAdvanced(false);
  };

  const activeFiltersCount = Object.values(filters).filter(Boolean).length;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
      {/* Search Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4 mb-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search transactions..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
          >
            <Filter className="h-4 w-4" />
            <span>Filters</span>
            {activeFiltersCount > 0 && (
              <span className="bg-primary-500 text-white text-xs rounded-full px-2 py-1">
                {activeFiltersCount}
              </span>
            )}
          </button>
          
          {activeFiltersCount > 0 && (
            <button
              onClick={handleClearFilters}
              className="flex items-center space-x-1 px-3 py-2 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400"
            >
              <X className="h-4 w-4" />
              <span>Clear</span>
            </button>
          )}
        </div>
      </div>

      {/* Advanced Filters */}
      {showAdvanced && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          {/* Status Filter - Multi-select */}
          <div className="relative" ref={statusDropdownRef}>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Status
            </label>
            <button
              onClick={() => setStatusDropdownOpen(!statusDropdownOpen)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-left flex items-center justify-between"
            >
              <span>
                {(filters.status || []).length > 0 
                  ? `${(filters.status || []).length} selected`
                  : 'Select Status'
                }
              </span>
              <ChevronDown className="h-4 w-4" />
            </button>
            
            {statusDropdownOpen && (
              <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg">
                {[TRANSACTION_STATUS.SUCCESS, TRANSACTION_STATUS.PENDING, TRANSACTION_STATUS.FAILED].map((status) => {
                  const isSelected = (filters.status || []).includes(status);
                  return (
                    <label key={status} className="flex items-center px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-600 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleMultiSelectChange('status', status, isSelected)}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded mr-3"
                      />
                      <span className="text-sm text-gray-900 dark:text-white capitalize">
                        {status.toLowerCase()}
                      </span>
                    </label>
                  );
                })}
              </div>
            )}
          </div>

          {/* Gateway Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Gateway
            </label>
            <select
              value={filters.gateway}
              onChange={(e) => handleFilterChange('gateway', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="">All Gateways</option>
              {PAYMENT_GATEWAYS.map((gateway) => (
                <option key={gateway} value={gateway}>
                  {gateway}
                </option>
              ))}
            </select>
          </div>

          {/* School ID Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              School ID
            </label>
            <input
              type="text"
              placeholder="Enter School ID"
              value={filters.schoolId}
              onChange={(e) => handleFilterChange('schoolId', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          {/* Date Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Date From
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="date"
                value={filters.dateFrom}
                onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Date To
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="date"
                value={filters.dateTo}
                onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionFilters;
