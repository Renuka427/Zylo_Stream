import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Sparkles, ArrowLeft } from 'lucide-react';
import { ZyloLogo } from '../components/brand/ZyloLogo';

export const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-champagne text-espresso flex flex-col justify-between p-6 md:p-12 relative overflow-hidden">
      {/* Subtle luxury ambient shapes */}
      <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-cherry/5 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-champagne-gold/15 blur-3xl pointer-events-none" />

      {/* Top Brand Header */}
      <header className="max-w-6xl w-full mx-auto flex items-center justify-between z-10">
        <Link to="/" className="flex items-center gap-3">
          <ZyloLogo
            variant="dark"
            size="md"
            showWordmark={true}
            showTagline={true}
          />
        </Link>

        <Link
          to="/"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-ivory border border-stone-warm text-xs font-medium text-espresso hover:border-cherry transition-colors shadow-sm"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Landing Page</span>
        </Link>
      </header>

      {/* Center Auth Outlet */}
      <main className="max-w-md w-full mx-auto my-auto py-8 z-10">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="max-w-6xl w-full mx-auto text-center text-xs text-espresso-muted z-10 pt-6 border-t border-stone-warm/50">
        <p>Zylo Stream &copy; 2026. Your Subscription, On Autopilot.</p>
      </footer>
    </div>
  );
};
