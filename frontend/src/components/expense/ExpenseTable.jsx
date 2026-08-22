import React from 'react';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDate } from '../../utils/formatDate';
import { Edit2, Trash2 } from 'lucide-react';
import { getCategoryMeta } from '../../constants/expenseConstants';

export const ExpenseTable = ({ expenses = [], onEdit, onDelete }) => {
  if (!expenses.length) return null;

  return (
    <div className="spd-table-container">
      <table className="spd-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Title</th>
            <th>Category</th>
            <th style={{ textAlign: 'right' }}>Amount</th>
            <th style={{ textAlign: 'center' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map((expense) => {
            const catMeta = getCategoryMeta(expense.category);
            return (
              <tr key={expense.id}>
                <td style={{ whiteSpace: 'nowrap', color: 'var(--muted-foreground)' }}>
                  {formatDate(expense.expenseDate)}
                </td>
                <td>
                  <div style={{ fontWeight: 500 }}>{expense.title}</div>
                  {expense.description && (
                    <div style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>
                      {expense.description}
                    </div>
                  )}
                </td>
                <td>
                  <Badge variant={expense.category}>{catMeta.label}</Badge>
                </td>
                <td style={{ textAlign: 'right', fontWeight: 600, color: 'var(--expense)' }} className="text-mono-amount">
                  - {formatCurrency(expense.amount)}
                </td>
                <td style={{ textAlign: 'center' }}>
                  <div style={{ display: 'inline-flex', gap: '0.25rem' }}>
                    {onEdit && (
                      <Button variant="ghost" size="sm" onClick={() => onEdit(expense)} title="Edit expense">
                        <Edit2 size={15} />
                      </Button>
                    )}
                    {onDelete && (
                      <Button variant="ghost" size="sm" onClick={() => onDelete(expense.id)} title="Delete expense" style={{ color: 'var(--destructive)' }}>
                        <Trash2 size={15} />
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
