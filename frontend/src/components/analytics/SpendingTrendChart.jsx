import React from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { Card } from '../common/Card';
import { SkeletonLoader } from '../common/SkeletonLoader';
import { formatCurrency } from '../../utils/formatCurrency';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="spd-card" style={{ padding: '0.75rem 1rem', minWidth: '160px', boxShadow: 'var(--shadow-popover)' }}>
        <p className="text-caption" style={{ color: 'var(--muted-foreground)', marginBottom: '4px' }}>{label}</p>
        <p className="text-mono-amount" style={{ color: 'var(--expense)', fontWeight: 600 }}>
          {formatCurrency(payload[0].value)}
        </p>
      </div>
    );
  }
  return null;
};

export const SpendingTrendChart = ({ data = [], isLoading }) => {
  if (isLoading) {
    return (
      <Card>
        <SkeletonLoader height="240px" borderRadius="var(--radius-lg)" />
      </Card>
    );
  }

  const chartData = data.map((point) => ({
    date: point.date,
    amount: parseFloat(point.amount),
  }));

  return (
    <Card>
      <h3 className="text-h3" style={{ marginBottom: '1.25rem' }}>Spending Trend</h3>
      {chartData.length === 0 ? (
        <div style={{ height: '240px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--muted-foreground)' }}>
          No data for this period
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={240}>
          <AreaChart data={chartData} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--expense)" stopOpacity={0.25} />
                <stop offset="95%" stopColor="var(--expense)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
            <XAxis dataKey="date" tick={{ fontSize: 12, fill: 'var(--muted-foreground)', fontFamily: 'Inter' }} axisLine={false} tickLine={false} />
            <YAxis tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 12, fill: 'var(--muted-foreground)', fontFamily: 'Inter' }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="amount" stroke="var(--expense)" strokeWidth={2} fill="url(#expenseGradient)" />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </Card>
  );
};
