import React from 'react';
import { Link } from 'react-router-dom';
import { ZyloLogo } from '../../../components/brand/ZyloLogo';
import { ArrowUpRight } from 'lucide-react';

export const LandingFooter = () => {
  const scrollTo = (e, id) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <footer className="bg-ivory border-t border-stone-warm py-16 text-espresso">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-stone-warm/80">
          {/* Brand Info (5 cols) */}
          <div className="md:col-span-5 space-y-4">
            <Link to="/" className="inline-block">
              <ZyloLogo variant="dark" size="md" showWordmark={true} showTagline={true} />
            </Link>

            <p className="text-xs sm:text-sm text-espresso-muted max-w-sm leading-relaxed">
              Zylo Stream is a modern subscription management platform designed to help teams organize contracts, track renewals, issue quotations, and reconcile invoices with operational clarity.
            </p>

            <p className="text-xs font-semibold text-cherry">
              Your Subscription, On Autopilot.
            </p>
          </div>

          {/* Quick Links (3 cols) */}
          <div className="md:col-span-3 space-y-3 text-xs">
            <h4 className="font-display text-sm font-bold text-espresso uppercase tracking-wider">
              Platform Sections
            </h4>
            <ul className="space-y-2 text-espresso-muted">
              <li>
                <a href="#features" onClick={(e) => scrollTo(e, 'features')} className="hover:text-cherry transition-colors">
                  Workspace Features
                </a>
              </li>
              <li>
                <a href="#how-it-works" onClick={(e) => scrollTo(e, 'how-it-works')} className="hover:text-cherry transition-colors">
                  Operational Flow
                </a>
              </li>
              <li>
                <a href="#solutions" onClick={(e) => scrollTo(e, 'solutions')} className="hover:text-cherry transition-colors">
                  Team Solutions
                </a>
              </li>
              <li>
                <a href="#faq" onClick={(e) => scrollTo(e, 'faq')} className="hover:text-cherry transition-colors">
                  Frequently Asked Questions
                </a>
              </li>
            </ul>
          </div>

          {/* Demonstration Access (4 cols) */}
          <div className="md:col-span-4 space-y-3 text-xs">
            <h4 className="font-display text-sm font-bold text-espresso uppercase tracking-wider">
              Prototype Access
            </h4>
            <ul className="space-y-2 text-espresso-muted">
              <li>
                <Link to="/dashboard" className="inline-flex items-center gap-1 hover:text-cherry font-semibold transition-colors">
                  <span>Interactive Live Dashboard</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-cherry" />
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-cherry transition-colors">
                  Sign In (1-Click Demo Available)
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-cherry transition-colors">
                  Register Organization
                </Link>
              </li>
              <li>
                <Link to="/settings" className="hover:text-cherry transition-colors">
                  System Preferences & Factory Reset
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-espresso-muted gap-4">
          <p>
            Zylo Stream &copy; 2026. All rights reserved. Subscription Management System Hackathon Project.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-cherry font-semibold">Editorial Luxury Identity</span>
            <span>•</span>
            <span>Cherry Red × Champagne</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
