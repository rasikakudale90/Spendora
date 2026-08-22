import React from 'react';
import { Card } from '../common/Card';
import { SkeletonLoader } from '../common/SkeletonLoader';
import { formatCurrency } from '../../utils/formatCurrency';
import { TrendingDown, Hash, ArrowUp, ArrowDown } from 'lucide-react';

export const ExpenseSummaryCards = ({ totalAmount, totalCount, isLoading }) => {
  if (isLoading) {
    return (
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        {[0, 1].map((i) => (
          <Card key={i} style={{ flex: '1 1 200px' }}>
            <SkeletonLoader height="16px" width="60%" style={{ marginBottom: '0.5rem' }} />
            <SkeletonLoader height="32px" width="80%" />
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
      <Card style={{ flex: '1 1 200px', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{ width: '44px', height: '44px', borderRadius: 'var(--radius-xl)', background: 'color-mix(in oklab, var(--expense) 15%, transparent)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <TrendingDown size={22} color="var(--expense)" />
        </div>
        <div>
          <p className="text-caption" style={{ color: 'var(--muted-foreground)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Total Spent</p>
          <p className="text-h2 text-mono-amount" style={{ color: 'var(--expense)', marginTop: '2px' }}>
            {formatCurrency(totalAmount || 0)}
          </p>
        </div>
      </Card>

      <Card style={{ flex: '1 1 200px', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{ width: '44px', height: '44px', borderRadius: 'var(--radius-xl)', background: 'color-mix(in oklab, var(--primary) 15%, transparent)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Hash size={22} color="var(--primary)" />
        </div>
        <div>
          <p className="text-caption" style={{ color: 'var(--muted-foreground)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Total Expenses</p>
          <p className="text-h2 text-mono-amount" style={{ marginTop: '2px' }}>
            {totalCount ?? 0}
          </p>
        </div>
      </Card>
    </div>
  );
};
