import React from 'react';
import { FolderTree, RefreshCw, BarChart3, ArrowRight } from 'lucide-react';

export const HowItWorksSection = () => {
  const steps = [
    {
      num: '01',
      tag: 'STEP 01: ORGANIZE',
      title: 'Organize Accounts & Plans',
      desc: 'Bring customers, products, and subscription plans into one structured workspace.',
      detail: 'Define your product catalog, establish recurring pricing intervals, and enroll customer profiles.',
      icon: FolderTree
    },
    {
      num: '02',
      tag: 'STEP 02: MANAGE',
      title: 'Manage the Active Lifecycle',
      desc: 'Keep subscriptions, renewals, quotations, invoices, and payment records organized.',
      detail: 'Issue customized estimates, convert quotations into active contracts, and log reconciled payments.',
      icon: RefreshCw
    },
    {
      num: '03',
      tag: 'STEP 03: UNDERSTAND',
      title: 'Understand Financial Health',
      desc: 'Use clear summaries and business reports to understand your subscription operations.',
      detail: 'Track MRR growth curves, churn cohorts, expansion trends, and export verified financial dossiers.',
      icon: BarChart3
    }
  ];

  return (
    <section id="how-it-works" className="py-20 md:py-28 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <span className="text-xs uppercase font-bold tracking-widest text-champagne-gold">
            OPERATIONAL METHODOLOGY
          </span>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-black text-espresso tracking-tight leading-tight">
            From scattered tasks{' '}
            <br className="hidden sm:inline" />
            <span className="text-cherry font-normal italic">to a smoother flow.</span>
          </h2>
          <p className="text-base sm:text-lg text-espresso-muted leading-relaxed">
            A cohesive three-stage operational loop designed to bring clarity to recurring billing.
          </p>
        </div>

        {/* 3 Steps: Horizontal on Desktop, Vertical on Mobile */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative">
          {/* Connector Line on Desktop */}
          <div className="hidden lg:block absolute top-1/4 left-1/6 right-1/6 h-[2px] bg-gradient-to-r from-stone-warm via-champagne-gold/60 to-stone-warm -z-0" />

          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={step.num}
                className="relative z-10 bg-ivory rounded-3xl p-7 border border-stone-warm shadow-luxury hover:border-cherry/50 transition-all duration-300 flex flex-col justify-between space-y-6"
              >
                <div className="space-y-4">
                  {/* Step Number Badge & Icon */}
                  <div className="flex items-center justify-between">
                    <span className="font-display text-3xl font-black text-cherry-dark/40 font-mono">
                      {step.num}
                    </span>
                    <div className="w-12 h-12 rounded-2xl bg-champagne-light border border-stone-warm flex items-center justify-center text-cherry shadow-sm">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-champagne-gold block">
                      {step.tag}
                    </span>
                    <h3 className="font-display text-xl font-bold text-espresso mt-1">
                      {step.title}
                    </h3>
                  </div>

                  <p className="text-sm font-semibold text-espresso leading-relaxed">
                    {step.desc}
                  </p>

                  <p className="text-xs text-espresso-muted leading-relaxed pt-2 border-t border-stone-warm/50">
                    {step.detail}
                  </p>
                </div>

                <div className="pt-2 text-[11px] font-bold text-cherry-dark flex items-center gap-1.5 uppercase tracking-wider">
                  <span>Phase {step.num} Ready</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
