import React from 'react';
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { Card } from '../common/Card';
import { SkeletonLoader } from '../common/SkeletonLoader';
import { formatCurrency } from '../../utils/formatCurrency';
import { EXPENSE_CATEGORIES } from '../../constants/expenseConstants';

const CATEGORY_COLORS = {
  FOOD: 'var(--cat-2)',
  TRANSPORT: 'var(--cat-1)',
  SHOPPING: 'var(--cat-3)',
  BILLS: 'var(--cat-4)',
  HEALTH: 'var(--cat-5)',
  ENTERTAINMENT: 'var(--cat-4)',
  OTHER: 'var(--cat-6)',
};

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="spd-card" style={{ padding: '0.75rem 1rem', boxShadow: 'var(--shadow-popover)' }}>
        <p style={{ fontWeight: 600, fontSize: '0.875rem', marginBottom: '4px' }}>{payload[0].name}</p>
        <p className="text-mono-amount" style={{ color: 'var(--expense)', fontWeight: 600 }}>
          {formatCurrency(payload[0].value)}
        </p>
      </div>
    );
  }
  return null;
};

export const CategoryBreakdownChart = ({ data = {}, isLoading }) => {
  if (isLoading) {
    return (
      <Card>
        <SkeletonLoader height="300px" borderRadius="var(--radius-lg)" />
      </Card>
    );
  }

  const chartData = Object.entries(data)
    .map(([category, amount]) => ({
      name: EXPENSE_CATEGORIES.find((c) => c.value === category)?.label || category,
      value: parseFloat(amount),
      category,
    }))
    .filter((d) => d.value > 0);

  return (
    <Card>
      <h3 className="text-h3" style={{ marginBottom: '1.25rem' }}>Category Breakdown</h3>
      {chartData.length === 0 ? (
        <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--muted-foreground)' }}>
          No data for this period
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={110}
              paddingAngle={3}
              dataKey="value"
            >
              {chartData.map((entry) => (
                <Cell key={entry.category} fill={CATEGORY_COLORS[entry.category] || 'var(--cat-6)'} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend formatter={(value) => <span style={{ fontSize: '0.8125rem', color: 'var(--foreground)' }}>{value}</span>} />
          </PieChart>
        </ResponsiveContainer>
      )}
    </Card>
  );
};
