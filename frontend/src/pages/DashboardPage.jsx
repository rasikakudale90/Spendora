import React, { useState, useEffect } from 'react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { SkeletonLoader } from '../components/common/SkeletonLoader';
import { EmptyState } from '../components/common/EmptyState';
import { ExpenseTable } from '../components/expense/ExpenseTable';
import { SpendingTrendChart } from '../components/analytics/SpendingTrendChart';
import { CategoryBreakdownChart } from '../components/analytics/CategoryBreakdownChart';
import { formatCurrency } from '../utils/formatCurrency';
import { expenseService } from '../services/expenseService';
import { analyticsService } from '../services/analyticsService';
import { useApp } from '../context/AppContext';
import { TrendingDown, BarChart3, PiggyBank, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const DashboardPage = () => {
  const { addToast } = useApp();
  const navigate = useNavigate();
  const [recentExpenses, setRecentExpenses] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        const [expData, analyticsData] = await Promise.all([
          expenseService.getExpenses({ page: 0, size: 5, sortBy: 'expenseDate', sortDir: 'desc' }),
          analyticsService.getAnalytics(),
        ]);
        setRecentExpenses(expData.content || []);
        setAnalytics(analyticsData);
      } catch (err) {
        addToast('Failed to load dashboard data', 'error');
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="text-h1">Dashboard</h1>
          <p className="text-sm" style={{ color: 'var(--muted-foreground)', marginTop: '4px' }}>
            Your personal finance overview for this month
          </p>
        </div>
        <Button variant="primary" onClick={() => navigate('/expenses')}>
          <Plus size={16} /> Add Expense
        </Button>
      </div>

      {/* Summary KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem' }}>
        {[
          {
            label: 'Total Spent (Month)',
            value: formatCurrency(analytics?.totalSpending),
            icon: TrendingDown,
            color: 'var(--expense)',
          },
          {
            label: 'Transactions',
            value: analytics?.totalExpensesCount ?? '—',
            icon: BarChart3,
            color: 'var(--primary)',
          },
          {
            label: 'Average Expense',
            value: formatCurrency(analytics?.averageSpending),
            icon: PiggyBank,
            color: 'var(--info)',
          },
        ].map(({ label, value, icon: Icon, color }) => (
          isLoading ? (
            <Card key={label}>
              <SkeletonLoader height="14px" width="60%" style={{ marginBottom: '0.5rem' }} />
              <SkeletonLoader height="32px" width="75%" />
            </Card>
          ) : (
            <Card key={label} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: 'var(--radius-xl)', background: `color-mix(in oklab, ${color} 15%, transparent)`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon size={22} color={color} />
              </div>
              <div>
                <p className="text-caption" style={{ color: 'var(--muted-foreground)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>{label}</p>
                <p className="text-h3 text-mono-amount" style={{ color, marginTop: '2px' }}>{value}</p>
              </div>
            </Card>
          )
        ))}
      </div>

      {/* Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr minmax(260px, 380px)', gap: '1.25rem' }}>
        <SpendingTrendChart data={analytics?.dailyTrend || []} isLoading={isLoading} />
        <CategoryBreakdownChart data={analytics?.categoryBreakdown || {}} isLoading={isLoading} />
      </div>

      {/* Recent Expenses */}
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3 className="text-h3">Recent Expenses</h3>
          <Button variant="ghost" size="sm" onClick={() => navigate('/expenses')}>View All →</Button>
        </div>
        {isLoading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {[0, 1, 2].map((i) => <SkeletonLoader key={i} height="52px" borderRadius="var(--radius-md)" />)}
          </div>
        ) : recentExpenses.length > 0 ? (
          <ExpenseTable expenses={recentExpenses} />
        ) : (
          <EmptyState
            title="No expenses yet"
            description="Start tracking your spending by adding your first expense."
            actionText="Add Expense"
            onAction={() => navigate('/expenses')}
          />
        )}
      </Card>
    </div>
  );
};
