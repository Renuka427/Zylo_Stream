import React from 'react';

export const Badge = ({ children, status, variant = 'default', className = '' }) => {
  const normalized = (status || children || '').toString().toLowerCase().replace(/\s+/g, '_');

  let style = 'bg-champagne/60 text-espresso border-stone-warm';

  if (['active', 'paid', 'completed', 'accepted'].includes(normalized)) {
    style = 'bg-emerald-50 text-emerald-900 border-emerald-200/80';
  } else if (['pending', 'confirmed', 'sent', 'growth'].includes(normalized)) {
    style = 'bg-[#FEF8ED] text-[#8C621E] border-champagne-gold/40';
  } else if (['paused', 'draft', 'starter', 'weekly', 'daily'].includes(normalized)) {
    style = 'bg-[#F2ECE1] text-espresso-muted border-stone-warm';
  } else if (['overdue', 'past_due', 'closed', 'cancelled', 'expired'].includes(normalized)) {
    style = 'bg-cherry-light text-cherry-dark border-cherry/25 font-semibold';
  } else if (['enterprise'].includes(normalized)) {
    style = 'bg-cherry-dark text-ivory border-cherry-dark';
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border capitalize select-none tracking-tight ${style} ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
      {children || status}
    </span>
  );
};
