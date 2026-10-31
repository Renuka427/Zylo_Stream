import React from 'react';
import { Card } from './Card';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

export const StatCard = ({
  title,
  value,
  delta,
  isPositive = true,
  icon: Icon,
  subtitle,
  badgeText,
  accentColor = 'cherry',
  className = ''
}) => {
  return (
    <Card hover className={`relative overflow-hidden ${className}`}>
      {/* Decorative top accent line */}
      <div
        className={`absolute top-0 left-0 right-0 h-1 ${
          accentColor === 'cherry'
            ? 'bg-cherry'
            : accentColor === 'gold'
            ? 'bg-champagne-gold'
            : accentColor === 'darkCherry'
            ? 'bg-cherry-dark'
            : 'bg-stone-warm'
        }`}
      />

      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <p className="text-xs font-semibold tracking-wider text-espresso-muted uppercase">
            {title}
          </p>
          <div className="flex items-baseline gap-2">
            <h3 className="font-display text-2xl md:text-3xl font-bold text-espresso tracking-tight">
              {value}
            </h3>
            {badgeText && (
              <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-champagne-gold/20 text-[#8C621E] border border-champagne-gold/40">
                {badgeText}
              </span>
            )}
          </div>
        </div>

        {Icon && (
          <div className="p-3 rounded-xl bg-champagne/50 border border-stone-warm text-cherry shrink-0">
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      {(delta || subtitle) && (
        <div className="mt-4 pt-3 border-t border-stone-warm/60 flex items-center justify-between text-xs">
          {delta && (
            <div className="flex items-center gap-1 font-medium text-emerald-800">
              {isPositive ? (
                <ArrowUpRight className="w-3.5 h-3.5" />
              ) : (
                <ArrowDownRight className="w-3.5 h-3.5 text-cherry" />
              )}
              <span className={isPositive ? 'text-emerald-800' : 'text-cherry'}>
                {delta}
              </span>
            </div>
          )}
          {subtitle && (
            <span className="text-espresso-muted text-[11px] truncate max-w-[180px]">
              {subtitle}
            </span>
          )}
        </div>
      )}
    </Card>
  );
};
