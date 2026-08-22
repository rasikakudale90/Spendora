import React from 'react';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { Button } from '../common/Button';
import { EXPENSE_CATEGORIES } from '../../constants/expenseConstants';
import { Search, X } from 'lucide-react';

const SORT_OPTIONS = [
  { value: 'expenseDate', label: 'Date' },
  { value: 'amount', label: 'Amount' },
  { value: 'title', label: 'Title' },
];

const DIR_OPTIONS = [
  { value: 'desc', label: 'Newest / Highest First' },
  { value: 'asc', label: 'Oldest / Lowest First' },
];

const CATEGORY_OPTIONS = [
  { value: '', label: 'All Categories' },
  ...EXPENSE_CATEGORIES,
];

export const ExpenseFilters = ({ filters, onChange, onClear }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange({ ...filters, [name]: value });
  };

  const hasFilters = filters.search || filters.category || filters.startDate || filters.endDate || filters.minAmount || filters.maxAmount;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', padding: '1rem 1.25rem', background: 'var(--muted)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border)' }}>
      {/* Row 1: Search + Category + Sort */}
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
        <div style={{ flex: '2 1 220px', position: 'relative' }}>
          <label className="spd-label">Search</label>
          <div style={{ position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted-foreground)', pointerEvents: 'none' }} />
            <input
              name="search"
              className="spd-input"
              placeholder="Search by title or description…"
              value={filters.search || ''}
              onChange={handleChange}
              style={{ paddingLeft: '2rem' }}
            />
          </div>
        </div>

        <div style={{ flex: '1 1 160px' }}>
          <Select
            label="Category"
            name="category"
            value={filters.category || ''}
            onChange={handleChange}
            options={CATEGORY_OPTIONS}
          />
        </div>

        <div style={{ flex: '1 1 140px' }}>
          <Select
            label="Sort By"
            name="sortBy"
            value={filters.sortBy || 'expenseDate'}
            onChange={handleChange}
            options={SORT_OPTIONS}
          />
        </div>

        <div style={{ flex: '1 1 160px' }}>
          <Select
            label="Direction"
            name="sortDir"
            value={filters.sortDir || 'desc'}
            onChange={handleChange}
            options={DIR_OPTIONS}
          />
        </div>
      </div>

      {/* Row 2: Date Range + Amount Range + Clear */}
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
        <div style={{ flex: '1 1 140px' }}>
          <Input label="From Date" name="startDate" type="date" value={filters.startDate || ''} onChange={handleChange} />
        </div>
        <div style={{ flex: '1 1 140px' }}>
          <Input label="To Date" name="endDate" type="date" value={filters.endDate || ''} onChange={handleChange} />
        </div>
        <div style={{ flex: '1 1 120px' }}>
          <Input label="Min Amount (₹)" name="minAmount" type="number" step="0.01" value={filters.minAmount || ''} onChange={handleChange} placeholder="0" />
        </div>
        <div style={{ flex: '1 1 120px' }}>
          <Input label="Max Amount (₹)" name="maxAmount" type="number" step="0.01" value={filters.maxAmount || ''} onChange={handleChange} placeholder="Any" />
        </div>

        {hasFilters && (
          <Button variant="outline" size="sm" onClick={onClear} style={{ alignSelf: 'flex-end', gap: '0.375rem' }}>
            <X size={14} /> Clear Filters
          </Button>
        )}
      </div>
    </div>
  );
};
