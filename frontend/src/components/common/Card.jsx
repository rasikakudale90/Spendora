import React from 'react';

export const Card = ({ children, interactive = false, className = '', ...props }) => {
  return (
    <div className={`spd-card ${interactive ? 'interactive' : ''} ${className}`} {...props}>
      {children}
    </div>
  );
};
