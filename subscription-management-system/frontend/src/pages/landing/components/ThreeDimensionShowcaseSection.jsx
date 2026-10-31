import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Compass, Sparkles, LayoutDashboard } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { ThreeFeatureModel } from './ThreeFeatureModel';

export const ThreeDimensionShowcaseSection = () => {
  return (
    <section id="3d-features" className="py-20 md:py-28 relative overflow-hidden bg-champagne-light/30 border-b border-stone-warm/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-champagne border border-stone-warm text-xs font-bold text-cherry-dark uppercase tracking-widest">
            <Compass className="w-3.5 h-3.5 text-champagne-gold" />
            <span>INTERACTIVE 3D PLATFORM VISUALIZER</span>
          </div>

          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-black text-espresso tracking-tight leading-tight">
            Experience Zylo Stream{' '}
            <span className="text-cherry font-normal italic">in 3D Motion.</span>
          </h2>

          <p className="text-base sm:text-lg text-espresso-muted leading-relaxed">
            Drag to rotate the autonomous feature gyroscope, inspect the connected module nodes, and transition directly into the live Executive Overview.
          </p>
        </div>

        {/* 3D Model Interactive Component */}
        <ThreeFeatureModel />

        {/* Executive Overview Direct Quick-Access Banner */}
        <div className="mt-8 p-6 rounded-2xl bg-ivory border border-stone-warm shadow-luxury flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-cherry-dark text-champagne-gold flex items-center justify-center shrink-0 shadow-sm">
              <LayoutDashboard className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-display text-lg font-bold text-espresso">
                Ready to review real financial data?
              </h4>
              <p className="text-xs text-espresso-muted">
                Proceed directly to the Executive Overview dashboard to inspect revenue charts, customer accounts, and active subscriptions.
              </p>
            </div>
          </div>

          <Link to="/dashboard" className="shrink-0 w-full sm:w-auto">
            <Button variant="primary" size="lg" icon={ArrowRight} className="w-full sm:w-auto shadow-luxury">
              Go to Executive Overview
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};
