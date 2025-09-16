import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useStore = create(
  persist(
    (set, get) => ({
      // Theme state
      isDarkMode: false,
      toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
      
      // User state
      user: null,
      token: null,
      setUser: (user) => set({ user }),
      setToken: (token) => set({ token }),
      logout: () => set({ user: null, token: null }),
      
      // Transactions state
      transactions: [],
      loading: false,
      error: null,
      totalPages: 0,
      currentPage: 1,
      
      setTransactions: (transactions) => set({ transactions }),
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),
      setPagination: (currentPage, totalPages) => set({ currentPage, totalPages }),
      
      // Filters state
      filters: {
        status: '',
        schoolId: '',
        gateway: '',
        dateFrom: '',
        dateTo: '',
        search: ''
      },
      setFilters: (filters) => set((state) => ({ 
        filters: { ...state.filters, ...filters } 
      })),
      clearFilters: () => set({
        filters: {
          status: '',
          schoolId: '',
          gateway: '',
          dateFrom: '',
          dateTo: '',
          search: ''
        }
      }),
    }),
    {
      name: 'school-payment-storage',
      partialize: (state) => ({
        isDarkMode: state.isDarkMode,
        user: state.user,
        token: state.token,
      }),
    }
  )
);

export default useStore;