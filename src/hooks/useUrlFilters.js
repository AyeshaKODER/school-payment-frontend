import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import useStore from '../store/useStore';

export const useUrlFilters = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { filters, setFilters } = useStore();

  // Load filters from URL on mount
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const urlFilters = {};

    // Parse URL parameters
    const status = searchParams.get('status');
    if (status) {
      urlFilters.status = status.split(',').filter(Boolean);
    }

    const schoolId = searchParams.get('schoolId');
    if (schoolId) {
      urlFilters.schoolId = schoolId.split(',').filter(Boolean);
    }

    const gateway = searchParams.get('gateway');
    if (gateway) {
      urlFilters.gateway = gateway;
    }

    const dateFrom = searchParams.get('dateFrom');
    if (dateFrom) {
      urlFilters.dateFrom = dateFrom;
    }

    const dateTo = searchParams.get('dateTo');
    if (dateTo) {
      urlFilters.dateTo = dateTo;
    }

    const search = searchParams.get('search');
    if (search) {
      urlFilters.search = search;
    }

    const page = searchParams.get('page');
    if (page) {
      urlFilters.page = parseInt(page, 10);
    }

    const limit = searchParams.get('limit');
    if (limit) {
      urlFilters.limit = parseInt(limit, 10);
    }

    // Only update if there are URL filters
    if (Object.keys(urlFilters).length > 0) {
      setFilters(urlFilters);
    }
  }, [location.search, setFilters]);

  // Update URL when filters change
  const updateUrlWithFilters = (newFilters, currentPage = 1, limit = 10) => {
    const searchParams = new URLSearchParams();

    // Add filters to URL
    if (newFilters.status && newFilters.status.length > 0) {
      searchParams.set('status', newFilters.status.join(','));
    }

    if (newFilters.schoolId && newFilters.schoolId.length > 0) {
      searchParams.set('schoolId', newFilters.schoolId.join(','));
    }

    if (newFilters.gateway) {
      searchParams.set('gateway', newFilters.gateway);
    }

    if (newFilters.dateFrom) {
      searchParams.set('dateFrom', newFilters.dateFrom);
    }

    if (newFilters.dateTo) {
      searchParams.set('dateTo', newFilters.dateTo);
    }

    if (newFilters.search) {
      searchParams.set('search', newFilters.search);
    }

    // Add pagination
    if (currentPage > 1) {
      searchParams.set('page', currentPage.toString());
    }

    if (limit !== 10) {
      searchParams.set('limit', limit.toString());
    }

    // Update URL
    const newSearch = searchParams.toString();
    navigate(`${location.pathname}${newSearch ? `?${newSearch}` : ''}`, { replace: true });
  };

  return {
    updateUrlWithFilters,
  };
};