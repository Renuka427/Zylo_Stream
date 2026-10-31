import React, { useEffect } from 'react';
import { LandingNavbar } from './components/LandingNavbar';
import { HeroSection } from './components/HeroSection';
import { ValueStrip } from './components/ValueStrip';
import { FeaturesSection } from './components/FeaturesSection';
import { ProductShowcase } from './components/ProductShowcase';
import { HowItWorksSection } from './components/HowItWorksSection';
import { SolutionsSection } from './components/SolutionsSection';
import { AutopilotFlowSection } from './components/AutopilotFlowSection';
import { FaqSection } from './components/FaqSection';
import { FinalCtaSection } from './components/FinalCtaSection';
import { LandingFooter } from './components/LandingFooter';

export const LandingPage = () => {
  useEffect(() => {
    // Scroll to top on initial page load
    window.scrollTo(0, 0);
    document.title = 'Zylo Stream — Your Subscription, On Autopilot.';
  }, []);

  return (
    <div className="min-h-screen bg-champagne text-espresso font-sans selection:bg-cherry selection:text-ivory">
      {/* 1. Navigation Bar */}
      <LandingNavbar />

      {/* Main Page Flow */}
      <main>
        {/* 2. Hero Section with Live UI Preview */}
        <HeroSection />

        {/* 3. Value Statements Strip */}
        <ValueStrip />

        {/* 4. Six Core Platform Features */}
        <FeaturesSection />

        {/* 5. Signature Product Showcase (Browser Framed Dashboard Canvas) */}
        <ProductShowcase />

        {/* 6. How It Works (Organize -> Manage -> Understand) */}
        <HowItWorksSection />

        {/* 7. Solutions for Teams Running on Recurring Revenue */}
        <SolutionsSection />

        {/* 8. The Autopilot Philosophy (Connected Relational Cycle) */}
        <AutopilotFlowSection />

        {/* 9. Frequently Asked Questions (Accordion) */}
        <FaqSection />

        {/* 10. Final Call to Action */}
        <FinalCtaSection />
      </main>

      {/* 11. Footer */}
      <LandingFooter />
    </div>
  );
};
