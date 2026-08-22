import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Sun, Moon, Wallet, Menu, X } from 'lucide-react';
import { Button } from './Button';

export const Navbar = ({ pageTitle, isMobileMenuOpen, setIsMobileMenuOpen }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header
      style={{
        height: '64px',
        borderBottom: '1px solid var(--border)',
        backgroundColor: 'var(--card)',
        padding: '0 1.25rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <Button
          variant="ghost"
          size="sm"
          className="spd-mobile-menu-btn"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle navigation menu"
        >
          {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </Button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)' }}>
          <Wallet size={24} />
          <span style={{ fontWeight: 700, fontSize: '1.125rem', letterSpacing: '-0.02em', color: 'var(--foreground)' }}>
            Spendora
          </span>
        </div>
        <span style={{ color: 'var(--muted-foreground)' }}>/</span>
        <span className="text-sm" style={{ fontWeight: 500 }}>{pageTitle}</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Button variant="ghost" size="md" onClick={toggleTheme} aria-label="Toggle theme">
          {theme === 'dark' ? <Sun size={18} color="var(--warning)" /> : <Moon size={18} />}
        </Button>
      </div>
    </header>
  );
};
