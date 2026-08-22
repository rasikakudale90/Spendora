import React from 'react';

export const Badge = ({ children, variant = 'other', className = '' }) => {
  const badgeClass = `spd-badge spd-badge-${variant.toLowerCase()}`;
  return <span className={`${badgeClass} ${className}`}>{children}</span>;
};
