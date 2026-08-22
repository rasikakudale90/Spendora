import React from 'react';

export const SkeletonLoader = ({ width = '100%', height = '20px', borderRadius = 'var(--radius-sm)', className = '' }) => {
  return (
    <div
      className={`spd-skeleton ${className}`}
      style={{ width, height, borderRadius }}
    />
  );
};
