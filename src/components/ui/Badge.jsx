import React from 'react';

const Badge = ({
  children,
  variant = 'default',
  className = '',
  ...props
}) => {
  const baseClasses = 'inline-flex items-center px-4 py-1.5 rounded-2xl text-[9px] font-black uppercase tracking-[0.2em] border transition-all duration-500 shadow-sm';

  const variantClasses = {
    default: 'bg-black/5 dark:bg-white/5 text-gray-600 dark:text-gray-400 border-black/5 dark:border-white/10 hover:bg-black/10 dark:hover:bg-white/10',
    primary: 'bg-primary-500/10 text-primary-600 dark:text-primary-400 border-primary-500/20 shadow-primary-500/5 hover:bg-primary-500/20',
    success: 'bg-green-500/10 text-green-600 dark:text-green-500 border-green-500/20 shadow-green-500/5 hover:bg-green-500/20',
    warning: 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-500 border-yellow-500/20 shadow-yellow-500/5 hover:bg-yellow-500/20',
    danger: 'bg-red-500/10 text-red-600 dark:text-red-500 border-red-500/20 shadow-red-500/5 hover:bg-red-500/20',
    info: 'bg-blue-500/10 text-blue-600 dark:text-blue-500 border-blue-500/20 shadow-blue-500/5 hover:bg-blue-500/20',
  };

  const classes = `${baseClasses} ${variantClasses[variant]} ${className}`;

  return (
    <span className={classes} {...props}>
      <span className="relative flex h-1.5 w-1.5 mr-2">
        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${variant === 'success' ? 'bg-green-400' : variant === 'danger' ? 'bg-red-400' : 'bg-primary-400'}`}></span>
        <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${variant === 'success' ? 'bg-green-500' : variant === 'danger' ? 'bg-red-500' : 'bg-primary-500'}`}></span>
      </span>
      {children}
    </span>
  );
};

export default Badge;