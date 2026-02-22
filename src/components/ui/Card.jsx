import React from 'react';

const Card = ({
  children,
  className = '',
  header,
  footer,
  ...props
}) => {
  return (
    <div
      className={`glass-card ${className}`}
      {...props}
    >
      {header && (
        <div className="mb-6 pb-4 border-b border-white/10">
          {header}
        </div>
      )}
      <div className="relative">
        {children}
      </div>
      {footer && (
        <div className="mt-6 pt-4 border-t border-white/10 text-sm text-gray-500">
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;