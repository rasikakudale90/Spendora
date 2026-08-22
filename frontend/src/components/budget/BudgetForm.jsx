import React, { useState, useEffect } from 'react';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { Button } from '../common/Button';
import { EXPENSE_CATEGORIES } from '../../constants/expenseConstants';
import { toInputDateFormat } from '../../utils/formatDate';

const CATEGORY_OPTIONS = [
  { value: '', label: 'All Categories (Overall)' },
  ...EXPENSE_CATEGORIES,
];

export const BudgetForm = ({ initialData, onSubmit, onCancel, isLoading }) => {
  const currentMonthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0];
  const currentMonthEnd = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toISOString().split('T')[0];

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    periodStart: currentMonthStart,
    periodEnd: currentMonthEnd,
    limitAmount: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        category: initialData.category || '',
        periodStart: toInputDateFormat(initialData.periodStart) || currentMonthStart,
        periodEnd: toInputDateFormat(initialData.periodEnd) || currentMonthEnd,
        limitAmount: initialData.limitAmount || '',
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Budget name is required';
    if (!formData.limitAmount || parseFloat(formData.limitAmount) <= 0) newErrors.limitAmount = 'Limit amount must be greater than 0';
    if (!formData.periodStart) newErrors.periodStart = 'Period start date is required';
    if (!formData.periodEnd) newErrors.periodEnd = 'Period end date is required';
    if (formData.periodStart && formData.periodEnd && formData.periodEnd < formData.periodStart) {
      newErrors.periodEnd = 'End date must be after start date';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({
      name: formData.name,
      category: formData.category || null,
      periodStart: formData.periodStart,
      periodEnd: formData.periodEnd,
      limitAmount: parseFloat(formData.limitAmount),
    });
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <Input
        label="Budget Name *"
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="e.g. Monthly Budget, Food Budget"
        error={errors.name}
      />

      <Select
        label="Category (leave blank for overall)"
        name="category"
        value={formData.category}
        onChange={handleChange}
        options={CATEGORY_OPTIONS}
      />

      <div style={{ display: 'flex', gap: '0.75rem' }}>
        <div style={{ flex: 1 }}>
          <Input label="Period Start *" name="periodStart" type="date" value={formData.periodStart} onChange={handleChange} error={errors.periodStart} />
        </div>
        <div style={{ flex: 1 }}>
          <Input label="Period End *" name="periodEnd" type="date" value={formData.periodEnd} onChange={handleChange} error={errors.periodEnd} />
        </div>
      </div>

      <Input
        label="Spending Limit (₹) *"
        name="limitAmount"
        type="number"
        step="0.01"
        value={formData.limitAmount}
        onChange={handleChange}
        placeholder="50000.00"
        error={errors.limitAmount}
      />

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        )}
        <Button type="submit" variant="primary" isLoading={isLoading}>
          {initialData ? 'Update Budget' : 'Create Budget'}
        </Button>
      </div>
    </form>
  );
};
