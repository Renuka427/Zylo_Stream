import React, { useState } from 'react';
import { ChevronDown, HelpCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const FaqSection = () => {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      q: 'What is Zylo Stream?',
      a: 'Zylo Stream is a modern subscription management and recurring billing operations platform designed to bring customer profiles, tiered pricing plans, active contracts, quotations, invoices, and financial summaries together into one unified workspace.'
    },
    {
      q: 'Which subscription operations can I manage?',
      a: 'You can create and organize customer accounts, configure product catalogs and pricing tiers (daily, weekly, monthly, yearly), manage subscription lifecycles (active, paused, past-due, cancelled), trigger manual renewals, and enforce dunning grace periods.'
    },
    {
      q: 'Can I track quotations, invoices, and payments?',
      a: 'Yes. You can draft line-item estimates, convert accepted quotations directly into active subscriptions and issued invoices, track invoice payment statuses, and reconcile settlement transactions with verifiable audit reference codes.'
    },
    {
      q: 'Does Zylo Stream process real payments in this demo?',
      a: 'No. This version is a production-quality frontend demonstration built for evaluation and testing. All transactions, invoice settlements, and card charges are simulated client-side against a local mock ledger and do not charge real banking or card networks.'
    },
    {
      q: 'Is the application connected to a live backend?',
      a: 'Not yet. We strictly follow a Frontend First, Backend Last architecture for this hackathon. The current interface operates entirely against persistent local browser memory (localStorage) to validate user experience, data models, and workflows before database and server integration.'
    },
    {
      q: 'Can I explore the dashboard without setting up an account?',
      a: 'Absolutely. You can launch the live workspace immediately by clicking "View Live Demo" in the navigation bar or hero section. A 1-click demo login is also available on the sign-in page with preloaded executive test profiles.'
    }
  ];

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  return (
    <section id="faq" className="py-20 md:py-28 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center space-y-4 mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-champagne border border-stone-warm text-xs font-bold text-cherry-dark uppercase tracking-widest">
            <HelpCircle className="w-3.5 h-3.5 text-champagne-gold" />
            <span>CLARITY & TRANSPARENCY</span>
          </div>

          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-black text-espresso tracking-tight leading-tight">
            Frequently Asked{' '}
            <span className="text-cherry font-normal italic">Questions</span>
          </h2>

          <p className="text-base sm:text-lg text-espresso-muted leading-relaxed">
            Everything you need to know about the Zylo Stream workspace and demonstration prototype.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-3.5">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={faq.q}
                className="rounded-2xl border border-stone-warm bg-ivory transition-all overflow-hidden shadow-sm hover:border-champagne-gold"
              >
                <button
                  type="button"
                  onClick={() => toggleAccordion(index)}
                  className="w-full py-4 px-6 text-left flex items-center justify-between gap-4 font-display text-base sm:text-lg font-bold text-espresso hover:text-cherry transition-colors focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <span>{faq.q}</span>
                  <div
                    className={`w-7 h-7 rounded-full bg-champagne-light flex items-center justify-center shrink-0 text-espresso transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-cherry' : ''
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-6 pb-5 pt-1 text-xs sm:text-sm text-espresso-muted leading-relaxed border-t border-stone-warm/50 font-normal">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom prompt */}
        <div className="mt-10 p-5 rounded-2xl bg-champagne-light border border-stone-warm text-center space-y-2">
          <p className="text-xs font-semibold text-espresso">
            Ready to test the interactive subscription ledger?
          </p>
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-cherry hover:underline"
          >
            <span>Launch Live Interactive Prototype</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
};
