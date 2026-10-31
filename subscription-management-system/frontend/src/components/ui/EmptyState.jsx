import React from 'react';
import { Button } from './Button';
import { Inbox } from 'lucide-react';

export const EmptyState = ({
  icon: Icon = Inbox,
  title = 'No records found',
  description = 'Try adjusting your search criteria or create a new entry.',
  actionLabel,
  onAction,
  className = ''
}) => {
  return (
    <div className={`flex flex-col items-center justify-center p-12 text-center bg-ivory/60 rounded-2xl border border-dashed border-stone-warm/90 ${className}`}>
      <div className="w-12 h-12 rounded-2xl bg-champagne/60 border border-stone-warm flex items-center justify-center text-cherry mb-4 shadow-sm">
        <Icon className="w-6 h-6" />
      </div>
      <h4 className="font-display text-lg font-bold text-espresso mb-1">
        {title}
      </h4>
      <p className="text-xs text-espresso-muted max-w-sm mb-5 leading-relaxed">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button variant="primary" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
