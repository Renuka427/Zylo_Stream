import React from 'react';

export const Card = ({ children, className = '', hover = false, ...props }) => {
  return (
    <div
      className={`bg-ivory rounded-2xl border border-stone-warm shadow-card p-5 md:p-6 transition-all duration-200 ${
        hover ? 'hover:shadow-luxury hover:border-champagne-gold/60' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
