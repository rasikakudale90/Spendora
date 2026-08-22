import React from 'react';

export const Select = ({ label, options = [], error, className = '', ...props }) => {
  return (
    <div className="spd-input-group">
      {label && <label className="spd-label">{label}</label>}
      <select className={`spd-select ${className}`} {...props}>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <span style={{ fontSize: '0.75rem', color: 'var(--destructive)', marginTop: '2px' }}>{error}</span>}
    </div>
  );
};
