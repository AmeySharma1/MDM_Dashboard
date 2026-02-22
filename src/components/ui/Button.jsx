import React from 'react';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  onClick,
  disabled = false,
  type = 'button',
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center rounded-2xl font-bold transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-primary-500/20 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95';

  const variantClasses = {
    primary: 'bg-primary-600 hover:bg-primary-500 text-white shadow-lg shadow-primary-500/20',
    secondary: 'glass hover:bg-white/10 text-gray-800 dark:text-gray-100',
    outline: 'border-2 border-primary-500/30 hover:border-primary-500 text-primary-500 hover:bg-primary-500/10',
    ghost: 'hover:bg-white/5 text-gray-600 dark:text-gray-400 dark:hover:text-white',
    danger: 'bg-red-500 hover:bg-red-400 text-white shadow-lg shadow-red-500/20',
  };

  const sizeClasses = {
    sm: 'px-4 py-2 text-xs',
    md: 'px-6 py-3 text-sm',
    lg: 'px-8 py-4 text-base',
  };

  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  return (
    <button
      type={type}
      className={classes}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;