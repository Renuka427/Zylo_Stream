import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Play, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { HeroDashboardPreview } from './HeroDashboardPreview';

export const HeroSection = () => {
  const scrollToFeatures = (e) => {
    e.preventDefault();
    const el = document.getElementById('features');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section className="relative pt-32 pb-16 md:pt-40 md:pb-24 overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-12 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-champagne-gold/15 to-transparent blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Brand Copy & CTAs */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Small Eyebrow Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-ivory border border-stone-warm shadow-sm text-xs font-bold text-espresso uppercase tracking-widest">
              <span className="w-2 h-2 rounded-full bg-cherry animate-pulse" />
              <span>INTRODUCING ZYLO STREAM</span>
            </div>

            {/* Main Headline */}
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-black text-espresso tracking-tight leading-[1.08]">
              Your Subscription,{' '}
              <br className="hidden sm:inline" />
              <span className="relative inline-block text-cherry italic font-normal">
                On Autopilot.
                <svg
                  className="absolute left-0 -bottom-2 w-full h-3 text-champagne-gold/60"
                  viewBox="0 0 200 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M 2 8 C 50 2, 150 2, 198 8"
                    stroke="currentColor"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </h1>

            {/* Supporting Paragraph */}
            <p className="text-base sm:text-lg text-espresso-muted max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
              Take control of your subscription business with one connected workspace for customers, plans, renewals, quotations, invoices, and payments.
            </p>

            {/* CTA Group */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4">
              <a href="#features" onClick={scrollToFeatures} className="w-full sm:w-auto">
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full sm:w-auto shadow-luxury"
                >
                  Explore Zylo Stream
                </Button>
              </a>

              <Link to="/dashboard" className="w-full sm:w-auto">
                <Button
                  variant="secondary"
                  size="lg"
                  icon={Play}
                  className="w-full sm:w-auto shadow-sm"
                >
                  View Live Demo
                </Button>
              </Link>
            </div>

            {/* Supporting Microcopy */}
            <div className="pt-2 flex items-center justify-center lg:justify-start gap-4 text-xs text-espresso-muted">
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-800" />
                Less manual tracking. More operational clarity.
              </span>
              <span className="hidden sm:inline text-stone-300">•</span>
              <span className="hidden sm:inline">100% Client Prototype</span>
            </div>
          </div>

          {/* Right Column: Hero Visual Dashboard Preview */}
          <div className="lg:col-span-5 w-full">
            <HeroDashboardPreview />
          </div>
        </div>
      </div>
    </section>
  );
};
