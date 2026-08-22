import React from 'react';

export const Input = ({ label, error, className = '', ...props }) => {
  return (
    <div className="spd-input-group">
      {label && <label className="spd-label">{label}</label>}
      <input className={`spd-input ${className}`} {...props} />
      {error && <span style={{ fontSize: '0.75rem', color: 'var(--destructive)', marginTop: '2px' }}>{error}</span>}
    </div>
  );
};
