import React from 'react';
import { Store, Laptop, Briefcase, Calculator, ArrowRight } from 'lucide-react';
import { Card } from '../../../components/ui/Card';

export const SolutionsSection = () => {
  const solutions = [
    {
      id: 'smb',
      title: 'Small Businesses',
      icon: Store,
      tagline: 'Streamlined Client Accounts',
      description: 'Organize recurring services, customer relationships, and subscription records.',
      points: [
        'Centralize client contact profiles and active contract terms.',
        'Eliminate spreadsheet tracking with clear renewal schedules.',
        'Issue clear billing statements and track full settlements.'
      ]
    },
    {
      id: 'saas',
      title: 'SaaS Teams',
      icon: Laptop,
      tagline: 'Multi-Tier Catalog Management',
      description: 'Keep subscription plans, customer records, and recurring revenue information accessible.',
      points: [
        'Manage tiered pricing structures from Starter to Enterprise.',
        'Monitor monthly recurring revenue (MRR) expansion velocity.',
        'Track active subscriber counts and contract renewal dates.'
      ]
    },
    {
      id: 'agencies',
      title: 'Service Providers & Agencies',
      icon: Briefcase,
      tagline: 'Retainers & Custom Estimates',
      description: 'Manage recurring client services, quotations, and billing records.',
      points: [
        'Draft bespoke line-item estimates and client quotations.',
        'Seamlessly convert approved quotations into active recurring retainers.',
        'Generate printable tax invoices with transparent balance sheets.'
      ]
    },
    {
      id: 'finance',
      title: 'Finance & Operations',
      icon: Calculator,
      tagline: 'Ledger Reconciliation & Auditing',
      description: 'Monitor invoices, payment records, outstanding balances, and business summaries.',
      points: [
        'Review reconciled transaction histories and payment channels.',
        'Spot overdue balances early with clear dunning status flags.',
        'Export structured CSV dossiers for internal bookkeeper reviews.'
      ]
    }
  ];

  return (
    <section id="solutions" className="py-20 md:py-28 bg-champagne-light/50 border-t border-stone-warm/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <span className="text-xs uppercase font-bold tracking-widest text-champagne-gold">
            TAILORED FOR OPERATIONAL TEAMS
          </span>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-black text-espresso tracking-tight leading-tight">
            Made for teams that run{' '}
            <br className="hidden sm:inline" />
            <span className="text-cherry font-normal italic">on recurring revenue.</span>
          </h2>
          <p className="text-base sm:text-lg text-espresso-muted leading-relaxed">
            Practical workspace tools designed to serve distinct recurring revenue models without administrative clutter.
          </p>
        </div>

        {/* 4 Solutions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {solutions.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className="p-7 sm:p-8 rounded-3xl bg-ivory border border-stone-warm shadow-luxury hover:border-champagne-gold transition-all duration-300 flex flex-col justify-between space-y-6"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-champagne-light border border-stone-warm flex items-center justify-center text-cherry shrink-0 shadow-sm">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-3 py-1 rounded-full bg-champagne border border-stone-warm text-cherry-dark">
                      {item.tagline}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-display text-2xl font-bold text-espresso">
                      {item.title}
                    </h3>
                    <p className="text-sm font-semibold text-espresso-muted mt-1 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <ul className="space-y-2 pt-2 border-t border-stone-warm/60">
                    {item.points.map((pt, pIdx) => (
                      <li key={pIdx} className="text-xs text-stone-600 flex items-start gap-2 leading-relaxed">
                        <span className="w-1.5 h-1.5 rounded-full bg-cherry shrink-0 mt-1.5" />
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-2 text-xs font-semibold text-cherry-dark flex items-center gap-1.5">
                  <span>Standardized with Zylo Stream Core</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
