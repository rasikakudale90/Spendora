import React, { useState, useEffect } from 'react';
import { AnalyticsStatCards } from '../components/analytics/AnalyticsStatCards';
import { SpendingTrendChart } from '../components/analytics/SpendingTrendChart';
import { CategoryBreakdownChart } from '../components/analytics/CategoryBreakdownChart';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { analyticsService } from '../services/analyticsService';
import { useApp } from '../context/AppContext';
import { RefreshCw } from 'lucide-react';

export const AnalyticsPage = () => {
  const { addToast } = useApp();
  const [analytics, setAnalytics] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1).toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState(() => new Date().toISOString().split('T')[0]);

  const fetchAnalytics = async () => {
    setIsLoading(true);
    try {
      const data = await analyticsService.getAnalytics(startDate, endDate);
      setAnalytics(data);
    } catch (err) {
      addToast(err.message || 'Failed to load analytics', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="text-h1">Analytics</h1>
          <p className="text-sm" style={{ color: 'var(--muted-foreground)', marginTop: '4px' }}>
            Understand your spending patterns
          </p>
        </div>
        {/* Date Range Selector */}
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-end', flexWrap: 'wrap' }}>
          <Input label="From" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} style={{ width: '150px' }} />
          <Input label="To" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} style={{ width: '150px' }} />
          <Button variant="primary" onClick={fetchAnalytics} isLoading={isLoading} style={{ alignSelf: 'flex-end' }}>
            <RefreshCw size={15} /> Apply
          </Button>
        </div>
      </div>

      {/* Stat Cards */}
      <AnalyticsStatCards analytics={analytics} isLoading={isLoading} />

      {/* Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr minmax(260px, 380px)', gap: '1.25rem' }}>
        <SpendingTrendChart data={analytics?.dailyTrend || []} isLoading={isLoading} />
        <CategoryBreakdownChart data={analytics?.categoryBreakdown || {}} isLoading={isLoading} />
      </div>
    </div>
  );
};
