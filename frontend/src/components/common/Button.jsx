import React from 'react';

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  className = '',
  ...props
}) => {
  const variantClass = `spd-btn-${variant}`;
  const sizeClass = `spd-btn-${size}`;

  return (
    <button
      className={`spd-btn ${variantClass} ${sizeClass} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <span style={{ display: 'inline-block', width: '14px', height: '14px', border: '2px solid currentColor', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.6s linear infinite' }} />
          Loading...
        </>
      ) : (
        children
      )}
    </button>
  );
};
