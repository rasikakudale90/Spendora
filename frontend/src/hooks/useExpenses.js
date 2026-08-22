import { useState, useEffect, useCallback } from 'react';
import { expenseService } from '../services/expenseService';
import { useApp } from '../context/AppContext';

const DEFAULT_FILTERS = {
  search: '',
  category: '',
  startDate: '',
  endDate: '',
  minAmount: '',
  maxAmount: '',
  page: 0,
  size: 10,
  sortBy: 'expenseDate',
  sortDir: 'desc',
};

export const useExpenses = () => {
  const { addToast, refreshTrigger } = useApp();
  const [expenses, setExpenses] = useState([]);
  const [pagination, setPagination] = useState({ page: 0, size: 10, totalElements: 0, totalPages: 0, last: true });
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);

  const fetchExpenses = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = {};
      if (filters.search) params.search = filters.search;
      if (filters.category) params.category = filters.category;
      if (filters.startDate) params.startDate = filters.startDate;
      if (filters.endDate) params.endDate = filters.endDate;
      if (filters.minAmount) params.minAmount = filters.minAmount;
      if (filters.maxAmount) params.maxAmount = filters.maxAmount;
      params.page = filters.page;
      params.size = filters.size;
      params.sortBy = filters.sortBy;
      params.sortDir = filters.sortDir;

      const data = await expenseService.getExpenses(params);
      setExpenses(data.content || []);
      setPagination({
        page: data.page,
        size: data.size,
        totalElements: data.totalElements,
        totalPages: data.totalPages,
        last: data.last,
      });
    } catch (err) {
      addToast(err.message || 'Failed to load expenses', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [filters, refreshTrigger]);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  const createExpense = async (expenseData) => {
    const result = await expenseService.createExpense(expenseData);
    addToast('Expense created successfully!', 'success');
    await fetchExpenses();
    return result;
  };

  const updateExpense = async (id, expenseData) => {
    const result = await expenseService.updateExpense(id, expenseData);
    addToast('Expense updated successfully!', 'success');
    await fetchExpenses();
    return result;
  };

  const deleteExpense = async (id) => {
    await expenseService.deleteExpense(id);
    addToast('Expense deleted.', 'success');
    await fetchExpenses();
  };

  const updateFilters = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters, page: 0 }));
  };

  const clearFilters = () => setFilters(DEFAULT_FILTERS);

  const goToPage = (page) => setFilters((prev) => ({ ...prev, page }));

  return {
    expenses,
    pagination,
    isLoading,
    filters,
    updateFilters,
    clearFilters,
    goToPage,
    createExpense,
    updateExpense,
    deleteExpense,
  };
};
