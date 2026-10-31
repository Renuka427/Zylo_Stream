import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';
import { Button } from '../../../components/ui/Button';

export const FinalCtaSection = () => {
  const scrollToFeatures = (e) => {
    e.preventDefault();
    const el = document.getElementById('features');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section className="py-20 md:py-28 bg-cherry-dark relative overflow-hidden text-ivory">
      {/* Background luxury ambient glow */}
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-cherry/20 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-champagne-gold/10 blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 text-xs font-bold text-champagne-gold uppercase tracking-widest">
          <Sparkles className="w-3.5 h-3.5 text-champagne-gold" />
          <span>EFFORTLESS RECURRING REVENUE</span>
        </div>

        <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-black text-ivory tracking-tight leading-[1.1]">
          Let your subscriptions{' '}
          <span className="italic font-normal text-champagne-gold underline decoration-champagne-gold/40 underline-offset-8">
            flow.
          </span>
        </h2>

        <p className="text-base sm:text-lg text-champagne/90 max-w-2xl mx-auto leading-relaxed font-normal">
          Bring your customers, subscriptions, and billing workflows into one clearer view with Zylo Stream.
        </p>

        <div className="pt-2 flex items-center justify-center">
          <Link to="/admin/login" className="w-full sm:w-auto">
            <button
              type="button"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-xl font-bold text-base transition-all duration-200 shadow-luxury hover:scale-[1.02] active:scale-[0.98] focus:outline-none"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.12)',
                color: '#FFFAF2',
                border: '1.5px solid rgba(214, 183, 121, 0.6)'
              }}
            >
              <span>Administrator Access</span>
              <ArrowRight className="w-4 h-4 text-champagne-gold shrink-0" />
            </button>
          </Link>
        </div>

        <div className="pt-4 text-xs text-champagne/70 flex items-center justify-center gap-2">
          <span>Client demonstration prototype</span>
          <span>•</span>
          <span>No credit card required</span>
        </div>
      </div>
    </section>
  );
};
