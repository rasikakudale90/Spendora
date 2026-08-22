import { useState, useEffect, useCallback } from 'react';
import { budgetService } from '../services/budgetService';
import { useApp } from '../context/AppContext';

export const useBudgets = () => {
  const { addToast } = useApp();
  const [budgetProgress, setBudgetProgress] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchBudgets = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await budgetService.getBudgetProgressList();
      setBudgetProgress(data || []);
    } catch (err) {
      addToast(err.message || 'Failed to load budgets', 'error');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBudgets();
  }, [fetchBudgets]);

  const createBudget = async (budgetData) => {
    const result = await budgetService.createBudget(budgetData);
    addToast('Budget created successfully!', 'success');
    await fetchBudgets();
    return result;
  };

  const updateBudget = async (id, budgetData) => {
    const result = await budgetService.updateBudget(id, budgetData);
    addToast('Budget updated successfully!', 'success');
    await fetchBudgets();
    return result;
  };

  const deleteBudget = async (id) => {
    await budgetService.deleteBudget(id);
    addToast('Budget deleted.', 'success');
    await fetchBudgets();
  };

  return {
    budgetProgress,
    isLoading,
    createBudget,
    updateBudget,
    deleteBudget,
    refetch: fetchBudgets,
  };
};
