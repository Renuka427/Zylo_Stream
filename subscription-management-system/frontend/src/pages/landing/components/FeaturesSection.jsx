import React from 'react';
import {
  Users,
  RefreshCw,
  Package,
  Receipt,
  CreditCard,
  BarChart3,
  ArrowRight,
  ShieldCheck,
  Tag
} from 'lucide-react';
import { Card } from '../../../components/ui/Card';

export const FeaturesSection = () => {
  const features = [
    {
      id: 'customers',
      title: 'Customer Management',
      description: 'Organize customer profiles, contact information, and related subscription records.',
      detail: 'Keep customer lifecycle histories, MRR contributions, and billing addresses connected under one unified account view.',
      icon: Users,
      badge: 'Account Directory',
      highlighted: true
    },
    {
      id: 'subscriptions',
      title: 'Subscription Management',
      description: 'Track active subscriptions, billing intervals, renewals, and cancellations.',
      detail: 'Manage monthly and annual contracts with real-time status transitions and automated dunning policies.',
      icon: RefreshCw,
      badge: 'Core Ledger',
      highlighted: false
    },
    {
      id: 'products-plans',
      title: 'Product and Plan Management',
      description: 'Manage products, plan features, pricing, and billing intervals.',
      detail: 'Define tier schemes from Starter Sandboxes to Enterprise Bespoke tiers with granular feature bullet checklists.',
      icon: Package,
      badge: 'Catalog & Tiers',
      highlighted: false
    },
    {
      id: 'quotations-invoices',
      title: 'Quotations and Invoices',
      description: 'Create quotations and track invoices through their respective workflows.',
      detail: 'Draft line-item estimates, convert accepted quotations to active contracts, and issue printable tax invoices.',
      icon: Receipt,
      badge: 'Billing Documents',
      highlighted: true
    },
    {
      id: 'payments',
      title: 'Payment Tracking',
      description: 'Review payment records, transaction statuses, and outstanding balances.',
      detail: 'Reconcile ACH debits, corporate wire transfers, and credit card captures with verifiable audit references.',
      icon: CreditCard,
      badge: 'Treasury Logs',
      highlighted: false
    },
    {
      id: 'reports',
      title: 'Reports and Analytics',
      description: 'Understand recurring revenue, subscription activity, and billing performance.',
      detail: 'Analyze MRR growth momentum, net revenue retention (NRR), churn cohorts, and account expansion rates.',
      icon: BarChart3,
      badge: 'Financial Intelligence',
      highlighted: false
    }
  ];

  return (
    <section id="features" className="py-20 md:py-28 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <span className="text-xs uppercase font-bold tracking-widest text-champagne-gold">
            BUILT FOR THE WAY YOU WORK
          </span>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-black text-espresso tracking-tight leading-tight">
            Everything connected.{' '}
            <br />
            <span className="text-cherry font-normal italic">Nothing overlooked.</span>
          </h2>
          <p className="text-base sm:text-lg text-espresso-muted leading-relaxed">
            Manage the subscription lifecycle from a single, organized workspace.
          </p>
        </div>

        {/* Editorial Feature Grid (Asymmetrical Layout) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            const isFeatured = feature.highlighted;

            return (
              <div
                key={feature.id}
                className={`group relative rounded-2xl p-6 sm:p-7 transition-all duration-300 border flex flex-col justify-between ${
                  isFeatured
                    ? 'bg-ivory border-cherry/30 shadow-luxury hover:border-cherry hover:shadow-luxury-lg'
                    : 'bg-ivory/80 border-stone-warm hover:border-champagne-gold hover:bg-ivory hover:shadow-luxury'
                }`}
              >
                <div className="space-y-4">
                  {/* Top Bar with Icon and Badge */}
                  <div className="flex items-center justify-between">
                    <div
                      className={`w-11 h-11 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105 ${
                        isFeatured
                          ? 'bg-cherry-dark text-champagne-gold shadow-sm'
                          : 'bg-champagne-light border border-stone-warm text-cherry'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>

                    <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full bg-champagne border border-stone-warm text-cherry-dark">
                      {feature.badge}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-display text-xl font-bold text-espresso group-hover:text-cherry transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-xs sm:text-sm font-medium text-espresso-muted mt-2 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>

                  <p className="text-xs text-stone-500 leading-relaxed pt-2 border-t border-stone-warm/50">
                    {feature.detail}
                  </p>
                </div>

                <div className="pt-4 mt-2 flex items-center text-xs font-semibold text-cherry opacity-0 group-hover:opacity-100 transition-opacity gap-1">
                  <span>Explore workspace module</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
