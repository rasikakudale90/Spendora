import React from 'react';
import { Inbox } from 'lucide-react';
import { Button } from './Button';

export const EmptyState = ({ title = 'No data available', description = 'There are no items to display right now.', actionText, onAction }) => {
  return (
    <div style={{ textAlign: 'center', padding: '3rem 1.5rem', background: 'var(--card)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border)' }}>
      <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'var(--muted)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem', color: 'var(--muted-foreground)' }}>
        <Inbox size={28} />
      </div>
      <h3 className="text-h3" style={{ marginBottom: '0.375rem' }}>{title}</h3>
      <p className="text-sm" style={{ color: 'var(--muted-foreground)', marginBottom: '1.25rem' }}>{description}</p>
      {actionText && onAction && (
        <Button variant="primary" onClick={onAction}>{actionText}</Button>
      )}
    </div>
  );
};
