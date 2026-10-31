import React from 'react';
import {
  Users,
  Layers,
  RefreshCw,
  Receipt,
  CreditCard,
  BarChart3,
  ArrowRight,
  Sparkles
} from 'lucide-react';

export const AutopilotFlowSection = () => {
  const flowNodes = [
    {
      id: 'customers',
      label: 'Customers',
      icon: Users,
      sub: 'Enrolled profiles'
    },
    {
      id: 'plans',
      label: 'Plans',
      icon: Layers,
      sub: 'Pricing tiers'
    },
    {
      id: 'subscriptions',
      label: 'Subscriptions',
      icon: RefreshCw,
      sub: 'Active contracts'
    },
    {
      id: 'invoices',
      label: 'Invoices',
      icon: Receipt,
      sub: 'Generated statements'
    },
    {
      id: 'payments',
      label: 'Payments',
      icon: CreditCard,
      sub: 'Settled records'
    },
    {
      id: 'insights',
      label: 'Insights',
      icon: BarChart3,
      sub: 'Executive metrics'
    }
  ];

  return (
    <section className="py-20 md:py-28 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-champagne border border-stone-warm text-xs font-bold text-cherry-dark uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5 text-champagne-gold" />
            <span>THE AUTOPILOT PHILOSOPHY</span>
          </div>

          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-black text-espresso tracking-tight leading-tight">
            Less chasing.{' '}
            <br />
            <span className="text-cherry font-normal italic">More clarity.</span>
          </h2>

          <p className="text-base sm:text-lg text-espresso-muted leading-relaxed">
            Zylo Stream brings subscription records, billing workflows, and business insights together so your team can spend less time navigating scattered information.
          </p>
        </div>

        {/* Visual Sequence Chain */}
        <div className="relative rounded-3xl bg-ivory border border-stone-warm shadow-luxury p-6 sm:p-10">
          <div className="text-center mb-8">
            <span className="text-[11px] uppercase font-bold tracking-widest text-espresso-muted block">
              Continuous Operational Data Flow
            </span>
          </div>

          {/* Desktop Flow (6 Horizontal Steps with Connecting Arrows) */}
          <div className="hidden lg:grid grid-cols-6 gap-3 relative">
            {flowNodes.map((node, index) => {
              const Icon = node.icon;
              return (
                <div key={node.id} className="relative flex flex-col items-center text-center group">
                  {/* Arrow to Next Node */}
                  {index < flowNodes.length - 1 && (
                    <div className="absolute top-6 left-1/2 w-full h-[2px] bg-gradient-to-r from-stone-warm via-champagne-gold to-stone-warm -z-0">
                      <ArrowRight className="w-3 h-3 text-champagne-gold absolute right-0 -top-[5px]" />
                    </div>
                  )}

                  {/* Node Circle Box */}
                  <div className="relative z-10 w-14 h-14 rounded-2xl bg-champagne-light border border-stone-warm flex items-center justify-center text-cherry shadow-sm group-hover:scale-105 group-hover:border-cherry group-hover:bg-champagne transition-all duration-200">
                    <Icon className="w-6 h-6" />
                  </div>

                  <span className="font-display text-sm font-bold text-espresso mt-3">
                    {node.label}
                  </span>

                  <span className="text-[10px] text-espresso-muted mt-0.5 font-medium">
                    {node.sub}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Mobile / Tablet Flow (Grid of 2 or 3) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:hidden gap-4">
            {flowNodes.map((node, index) => {
              const Icon = node.icon;
              return (
                <div
                  key={node.id}
                  className="p-4 rounded-2xl bg-champagne-light border border-stone-warm flex flex-col items-center text-center space-y-2"
                >
                  <div className="w-10 h-10 rounded-xl bg-ivory border border-stone-warm flex items-center justify-center text-cherry">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="font-display text-sm font-bold text-espresso">{node.label}</span>
                  <span className="text-[10px] text-espresso-muted">{node.sub}</span>
                </div>
              );
            })}
          </div>

          {/* Explanatory Footnote Note */}
          <div className="mt-8 pt-6 border-t border-stone-warm/60 flex flex-col sm:flex-row items-center justify-between text-xs text-espresso-muted gap-2 text-center sm:text-left">
            <span>Unified relational architecture ensures actions cascade without manual reentry.</span>
            <span className="font-bold text-cherry-dark">Your Subscription, On Autopilot.</span>
          </div>
        </div>
      </div>
    </section>
  );
};
