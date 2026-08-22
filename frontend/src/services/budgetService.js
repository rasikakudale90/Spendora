import api from './api';

export const budgetService = {
  createBudget: async (budgetData) => {
    const response = await api.post('/budgets', budgetData);
    return response.data;
  },

  getBudgetById: async (id) => {
    const response = await api.get(`/budgets/${id}`);
    return response.data;
  },

  getAllBudgets: async () => {
    const response = await api.get('/budgets');
    return response.data;
  },

  getBudgetProgressList: async () => {
    const response = await api.get('/budgets/progress');
    return response.data;
  },

  getBudgetProgressById: async (id) => {
    const response = await api.get(`/budgets/${id}/progress`);
    return response.data;
  },

  updateBudget: async (id, budgetData) => {
    const response = await api.put(`/budgets/${id}`, budgetData);
    return response.data;
  },

  deleteBudget: async (id) => {
    await api.delete(`/budgets/${id}`);
  },
};
