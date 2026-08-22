import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Receipt, BarChart3, PiggyBank } from 'lucide-react';

export const Sidebar = ({ isOpen, onClose }) => {
  const navItems = [
    { to: '/', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/expenses', label: 'Expenses', icon: Receipt },
    { to: '/analytics', label: 'Analytics', icon: BarChart3 },
    { to: '/budgets', label: 'Budgets', icon: PiggyBank },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="spd-sidebar-backdrop"
          onClick={onClose}
        />
      )}

      <aside
        className={`spd-sidebar ${isOpen ? 'open' : ''}`}
      >
        <div style={{ padding: '0 0.75rem 1.25rem 0.75rem', borderBottom: '1px solid var(--border)', marginBottom: '0.5rem' }}>
          <span className="text-caption" style={{ textTransform: 'uppercase', color: 'var(--muted-foreground)', letterSpacing: '0.08em' }}>
            Navigation
          </span>
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              onClick={onClose}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-md)',
                textDecoration: 'none',
                fontSize: '0.875rem',
                fontWeight: 500,
                color: isActive ? 'var(--primary)' : 'var(--foreground)',
                backgroundColor: isActive ? 'color-mix(in oklab, var(--primary) 12%, transparent)' : 'transparent',
                borderLeft: isActive ? '3px solid var(--primary)' : '3px solid transparent',
                transition: 'all var(--dur-fast) var(--ease-out)',
              })}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </aside>
    </>
  );
};
