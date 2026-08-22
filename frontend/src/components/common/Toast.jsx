import React from 'react';
import { useApp } from '../../context/AppContext';
import { AlertCircle, CheckCircle, Info, X } from 'lucide-react';

export const ToastContainer = () => {
  const { toasts, removeToast } = useApp();

  if (!toasts.length) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '1.5rem',
        right: '1.5rem',
        zIndex: 2000,
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
      }}
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="spd-card"
          style={{
            padding: '0.875rem 1.25rem',
            minWidth: '280px',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            borderLeft: `4px solid ${
              toast.type === 'error'
                ? 'var(--destructive)'
                : toast.type === 'success'
                ? 'var(--income)'
                : 'var(--primary)'
            }`,
            boxShadow: 'var(--shadow-popover)',
          }}
        >
          {toast.type === 'error' && <AlertCircle size={18} color="var(--destructive)" />}
          {toast.type === 'success' && <CheckCircle size={18} color="var(--income)" />}
          {toast.type === 'info' && <Info size={18} color="var(--primary)" />}
          <span style={{ fontSize: '0.875rem', flex: 1 }}>{toast.message}</span>
          <button
            onClick={() => removeToast(toast.id)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted-foreground)' }}
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
};
