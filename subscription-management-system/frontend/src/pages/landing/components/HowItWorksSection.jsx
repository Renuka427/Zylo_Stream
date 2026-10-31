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

export const HowItWorksSection = () => {
  const workflowNodes = [
    {
      id: 'customers',
      step: '01',
      label: 'Customers',
      icon: Users,
      desc: 'Centralize contact profiles, company details, and billing contacts.'
    },
    {
      id: 'plans',
      step: '02',
      label: 'Plans',
      icon: Layers,
      desc: 'Define pricing tiers, billing cycles, and included feature sets.'
    },
    {
      id: 'subscriptions',
      step: '03',
      label: 'Subscriptions',
      icon: RefreshCw,
      desc: 'Establish active contracts with automated renewal tracking.'
    },
    {
      id: 'invoices',
      step: '04',
      label: 'Invoices',
      icon: Receipt,
      desc: 'Generate clear billing statements from subscriptions or quotations.'
    },
    {
      id: 'payments',
      step: '05',
      label: 'Payments',
      icon: CreditCard,
      desc: 'Reconcile ACH, card, and wire settlements with reference logging.'
    },
    {
      id: 'insights',
      step: '06',
      label: 'Insights',
      icon: BarChart3,
      desc: 'Understand MRR velocity, customer retention, and net churn cohorts.'
    }
  ];

  return (
    <section id="how-it-works" className="py-20 md:py-28 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <span className="text-xs uppercase font-bold tracking-widest text-champagne-gold">
            RELATIONAL LIFECYCLE
          </span>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-black text-espresso tracking-tight leading-tight">
            One workspace.{' '}
            <br />
            <span className="text-cherry font-normal italic">A clearer workflow.</span>
          </h2>
          <p className="text-base sm:text-lg text-espresso-muted leading-relaxed">
            Zylo Stream connects each operational stage into a single continuous sequence, keeping team members aligned without manual data re-entry.
          </p>
        </div>

        {/* Clean Visual Flow Diagram */}
        <div className="relative rounded-3xl bg-ivory border border-stone-warm shadow-luxury p-6 sm:p-10 space-y-8">
          <div className="text-center">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-espresso-muted">
              Standardized Operational Sequence
            </span>
          </div>

          {/* Desktop Flow (6 nodes in grid with connecting arrows) */}
          <div className="hidden lg:grid grid-cols-6 gap-3 relative items-stretch">
            {workflowNodes.map((node, index) => {
              const Icon = node.icon;
              return (
                <div
                  key={node.id}
                  className="relative flex flex-col justify-between p-4 rounded-2xl bg-champagne-light border border-stone-warm text-center group hover:border-cherry hover:bg-champagne transition-all duration-200"
                >
                  {/* Arrow to Next Node */}
                  {index < workflowNodes.length - 1 && (
                    <div className="absolute top-8 -right-3 z-20 w-6 h-6 rounded-full bg-ivory border border-stone-warm flex items-center justify-center text-champagne-gold shadow-sm">
                      <ArrowRight className="w-3.5 h-3.5 text-cherry" />
                    </div>
                  )}

                  <div className="space-y-3">
                    <span className="font-mono text-[10px] font-bold text-cherry-dark bg-champagne px-2 py-0.5 rounded-full inline-block">
                      {node.step}
                    </span>

                    <div className="w-12 h-12 mx-auto rounded-xl bg-ivory border border-stone-warm flex items-center justify-center text-cherry shadow-sm group-hover:scale-105 transition-transform">
                      <Icon className="w-5 h-5" />
                    </div>

                    <h4 className="font-display text-sm font-bold text-espresso">
                      {node.label}
                    </h4>

                    <p className="text-[11px] text-espresso-muted leading-snug">
                      {node.desc}
                    </p>
                  </div>

                  <span className="text-[9px] uppercase font-bold text-stone-400 mt-3 pt-2 border-t border-stone-warm/50 block">
                    Connected
                  </span>
                </div>
              );
            })}
          </div>

          {/* Mobile Sequence */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:hidden gap-3.5">
            {workflowNodes.map((node) => {
              const Icon = node.icon;
              return (
                <div
                  key={node.id}
                  className="p-4 rounded-xl bg-champagne-light border border-stone-warm flex items-start gap-3.5"
                >
                  <div className="w-10 h-10 rounded-lg bg-ivory border border-stone-warm flex items-center justify-center text-cherry shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono font-bold text-cherry-dark">STEP {node.step}</span>
                    <h4 className="font-display text-sm font-bold text-espresso">{node.label}</h4>
                    <p className="text-[11px] text-espresso-muted mt-0.5 leading-snug">{node.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Clarity Disclaimer Note */}
          <div className="pt-4 border-t border-stone-warm/60 flex flex-col sm:flex-row items-center justify-between text-xs text-espresso-muted gap-2 text-center sm:text-left">
            <span>Organizational workflows connect related records across the client lifecycle.</span>
            <span className="font-bold text-cherry-dark">Your Subscription, On Autopilot.</span>
          </div>
        </div>
      </div>
    </section>
  );
};
