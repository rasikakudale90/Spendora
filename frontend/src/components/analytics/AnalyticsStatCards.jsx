import React from 'react';
import { Card } from '../common/Card';
import { SkeletonLoader } from '../common/SkeletonLoader';
import { formatCurrency } from '../../utils/formatCurrency';
import { TrendingDown, Hash, ArrowUp, ArrowDown, Minus } from 'lucide-react';

const StatCard = ({ label, value, icon: Icon, color, isLoading }) => {
  if (isLoading) {
    return (
      <Card style={{ flex: '1 1 160px' }}>
        <SkeletonLoader height="14px" width="70%" style={{ marginBottom: '0.5rem' }} />
        <SkeletonLoader height="28px" width="85%" />
      </Card>
    );
  }

  return (
    <Card style={{ flex: '1 1 160px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
        <p className="text-caption" style={{ color: 'var(--muted-foreground)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>{label}</p>
        <div style={{ color }}>
          <Icon size={16} />
        </div>
      </div>
      <p className="text-h3 text-mono-amount" style={{ color: color || 'var(--foreground)' }}>{value}</p>
    </Card>
  );
};

export const AnalyticsStatCards = ({ analytics, isLoading }) => {
  return (
    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
      <StatCard
        label="Total Spending"
        value={formatCurrency(analytics?.totalSpending)}
        icon={TrendingDown}
        color="var(--expense)"
        isLoading={isLoading}
      />
      <StatCard
        label="# Transactions"
        value={analytics?.totalExpensesCount ?? 0}
        icon={Hash}
        color="var(--primary)"
        isLoading={isLoading}
      />
      <StatCard
        label="Average"
        value={formatCurrency(analytics?.averageSpending)}
        icon={Minus}
        color="var(--info)"
        isLoading={isLoading}
      />
      <StatCard
        label="Highest Expense"
        value={formatCurrency(analytics?.highestExpense)}
        icon={ArrowUp}
        color="var(--destructive)"
        isLoading={isLoading}
      />
      <StatCard
        label="Lowest Expense"
        value={formatCurrency(analytics?.lowestExpense)}
        icon={ArrowDown}
        color="var(--income)"
        isLoading={isLoading}
      />
    </div>
  );
};
