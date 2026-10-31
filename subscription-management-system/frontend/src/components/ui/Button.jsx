import React from 'react';

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  loading = false,
  icon: Icon,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none';

  const sizeStyles = {
    sm: 'text-xs px-3 py-1.5 gap-1.5',
    md: 'text-sm px-4 py-2 gap-2',
    lg: 'text-base px-5 py-2.5 gap-2.5',
  };

  const variantStyles = {
    primary: 'bg-cherry hover:bg-cherry-hover text-ivory shadow-sm hover:shadow focus:ring-cherry',
    secondary: 'bg-ivory hover:bg-champagne-light text-espresso border border-stone-warm shadow-sm hover:border-champagne-gold/60 focus:ring-champagne-gold',
    dark: 'bg-cherry-dark hover:bg-cherry-darker text-ivory shadow-sm hover:shadow focus:ring-cherry-dark',
    gold: 'bg-champagne-gold hover:bg-[#e2c78e] text-cherry-dark font-bold shadow-md hover:shadow-lg focus:ring-champagne-gold',
    light: 'bg-ivory hover:bg-champagne text-cherry-dark font-bold shadow-md hover:shadow-lg focus:ring-champagne-gold',
    outlineWhite: 'bg-white/10 border border-white/25 text-ivory hover:bg-white/20 hover:text-white focus:ring-white/50',
    ghost: 'bg-transparent hover:bg-champagne/40 text-espresso focus:ring-stone-warm',
    danger: 'bg-red-700 hover:bg-red-800 text-white shadow-sm focus:ring-red-600',
  };

  return (
    <button
      disabled={disabled || loading}
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {loading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin shrink-0" />
      ) : Icon ? (
        <Icon className={`${size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'} shrink-0`} />
      ) : null}
      {children}
    </button>
  );
};
