import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/common/Button';
import { Wallet } from 'lucide-react';

export const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', textAlign: 'center', gap: '1.5rem' }}>
      <div style={{ width: '72px', height: '72px', borderRadius: 'var(--radius-2xl)', background: 'color-mix(in oklab, var(--primary) 15%, transparent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Wallet size={36} color="var(--primary)" />
      </div>
      <div>
        <h1 className="text-display" style={{ color: 'var(--primary)' }}>404</h1>
        <h2 className="text-h2" style={{ marginTop: '0.5rem' }}>Page not found</h2>
        <p className="text-body" style={{ color: 'var(--muted-foreground)', marginTop: '0.5rem' }}>
          The page you're looking for doesn't exist or has been moved.
        </p>
      </div>
      <Button variant="primary" onClick={() => navigate('/')}>Back to Dashboard</Button>
    </div>
  );
};
