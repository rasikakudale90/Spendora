import React, { useState, useEffect } from 'react';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { Button } from '../common/Button';
import { EXPENSE_CATEGORIES } from '../../constants/expenseConstants';
import { toInputDateFormat } from '../../utils/formatDate';

export const ExpenseForm = ({ initialData, onSubmit, onCancel, isLoading }) => {
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: 'FOOD',
    expenseDate: new Date().toISOString().split('T')[0],
    description: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        amount: initialData.amount || '',
        category: initialData.category || 'FOOD',
        expenseDate: toInputDateFormat(initialData.expenseDate) || new Date().toISOString().split('T')[0],
        description: initialData.description || '',
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.amount || parseFloat(formData.amount) <= 0) newErrors.amount = 'Amount must be greater than 0';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.expenseDate) newErrors.expenseDate = 'Expense date is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({
      ...formData,
      amount: parseFloat(formData.amount),
    });
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <Input
        label="Title *"
        name="title"
        value={formData.title}
        onChange={handleChange}
        placeholder="e.g. Grocery store purchase"
        error={errors.title}
      />

      <Input
        label="Amount (₹) *"
        name="amount"
        type="number"
        step="0.01"
        value={formData.amount}
        onChange={handleChange}
        placeholder="0.00"
        error={errors.amount}
      />

      <Select
        label="Category *"
        name="category"
        value={formData.category}
        onChange={handleChange}
        options={EXPENSE_CATEGORIES}
        error={errors.category}
      />

      <Input
        label="Expense Date *"
        name="expenseDate"
        type="date"
        value={formData.expenseDate}
        onChange={handleChange}
        error={errors.expenseDate}
      />

      <Input
        label="Description (Optional)"
        name="description"
        value={formData.description}
        onChange={handleChange}
        placeholder="Additional notes..."
      />

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" variant="primary" isLoading={isLoading}>
          {initialData ? 'Update Expense' : 'Create Expense'}
        </Button>
      </div>
    </form>
  );
};
