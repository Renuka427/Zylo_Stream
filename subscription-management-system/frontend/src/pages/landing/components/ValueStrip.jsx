import React from 'react';
import { RefreshCw, CheckCircle2, Layers, BarChart3 } from 'lucide-react';

export const ValueStrip = () => {
  const items = [
    { title: 'Subscription Operations, Connected', icon: Layers },
    { title: 'Renewals at a Glance', icon: RefreshCw },
    { title: 'Billing Workflows, Organized', icon: CheckCircle2 },
    { title: 'Business Insights, Simplified', icon: BarChart3 }
  ];

  return (
    <div className="border-y border-stone-warm/80 bg-ivory/80 backdrop-blur-sm py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-0 divide-y sm:divide-y-0 lg:divide-x divide-stone-warm/70">
          {items.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className={`flex items-center gap-3.5 px-4 ${
                  index !== 0 ? 'pt-4 sm:pt-0' : ''
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-champagne-light border border-stone-warm flex items-center justify-center text-cherry shrink-0">
                  <Icon className="w-4 h-4" />
                </div>
                <span className="font-display text-sm font-bold text-espresso tracking-tight leading-snug">
                  {item.title}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
