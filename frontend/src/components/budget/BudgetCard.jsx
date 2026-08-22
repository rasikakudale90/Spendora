import React from 'react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDate } from '../../utils/formatDate';
import { EXPENSE_CATEGORIES } from '../../constants/expenseConstants';
import { Edit2, Trash2 } from 'lucide-react';

export const BudgetCard = ({ budget, onEdit, onDelete }) => {
  const { name, category, limitAmount, spentAmount, remainingAmount, utilizationPercentage, status, periodStart, periodEnd } = budget;

  const catMeta = category ? EXPENSE_CATEGORIES.find((c) => c.value === category) : null;

  const progressColor =
    status === 'EXCEEDED'
      ? 'var(--destructive)'
      : status === 'WARNING'
      ? 'var(--warning)'
      : 'var(--income)';

  return (
    <Card style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h3 className="text-h3">{name}</h3>
          <p className="text-sm" style={{ color: 'var(--muted-foreground)', marginTop: '2px' }}>
            {formatDate(periodStart)} — {formatDate(periodEnd)}
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
          {catMeta ? (
            <Badge variant={category}>{catMeta.label}</Badge>
          ) : (
            <Badge variant="other">Overall</Badge>
          )}
          <Badge variant={status.toLowerCase()}>{status}</Badge>
        </div>
      </div>

      {/* Progress Bar */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.375rem' }}>
          <span className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Utilization</span>
          <span className="text-sm text-mono-amount" style={{ fontWeight: 600, color: progressColor }}>
            {utilizationPercentage.toFixed(1)}%
          </span>
        </div>
        <div style={{ height: '8px', background: 'var(--muted)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
          <div
            style={{
              height: '100%',
              width: `${Math.min(utilizationPercentage, 100)}%`,
              background: progressColor,
              borderRadius: 'var(--radius-full)',
              transition: 'width 0.6s var(--ease-out)',
            }}
          />
        </div>
      </div>

      {/* Amounts */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
        {[
          { label: 'Limit', value: limitAmount, color: 'var(--foreground)' },
          { label: 'Spent', value: spentAmount, color: 'var(--expense)' },
          { label: 'Remaining', value: remainingAmount, color: remainingAmount < 0 ? 'var(--destructive)' : 'var(--income)' },
        ].map(({ label, value, color }) => (
          <div key={label} style={{ padding: '0.625rem', background: 'var(--muted)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
            <p className="text-caption" style={{ color: 'var(--muted-foreground)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '2px' }}>{label}</p>
            <p className="text-sm text-mono-amount" style={{ fontWeight: 600, color }}>{formatCurrency(value)}</p>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
        {onEdit && (
          <Button variant="outline" size="sm" onClick={() => onEdit(budget)}>
            <Edit2 size={14} /> Edit
          </Button>
        )}
        {onDelete && (
          <Button variant="destructive" size="sm" onClick={() => onDelete(budget.budgetId)}>
            <Trash2 size={14} /> Delete
          </Button>
        )}
      </div>
    </Card>
  );
};
