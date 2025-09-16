import { useState } from 'react';

export const usePagination = (initialPage = 1, initialLimit = 10) => {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);

  const goToPage = (page) => {
    setCurrentPage(page);
  };

  const goToNextPage = () => {
    setCurrentPage(prev => prev + 1);
  };

  const goToPreviousPage = () => {
    setCurrentPage(prev => Math.max(1, prev - 1));
  };

  const changeLimit = (newLimit) => {
    setLimit(newLimit);
    setCurrentPage(1); // Reset to first page when changing limit
  };

  const reset = () => {
    setCurrentPage(initialPage);
    setLimit(initialLimit);
  };

  return {
    currentPage,
    limit,
    goToPage,
    goToNextPage,
    goToPreviousPage,
    changeLimit,
    reset
  };
};