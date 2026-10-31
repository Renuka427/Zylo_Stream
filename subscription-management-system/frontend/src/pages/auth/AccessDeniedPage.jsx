import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, LogIn, Lock, Sparkles, UserCheck } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../../components/ui/Button';
import { ZyloLogo } from '../../components/brand/ZyloLogo';

export const AccessDeniedPage = () => {
  const { user, role, switchRole } = useAuth();
  const location = useLocation();
  const state = location.state || {};
  const currentRole = state.currentRole || role || 'unassigned';
  const requiredRole = (state.requiredRoles && state.requiredRoles[0]) || 'admin';

  return (
    <div className="min-h-screen bg-champagne text-espresso flex flex-col justify-between p-6 md:p-12 relative overflow-hidden selection:bg-cherry selection:text-ivory">
      {/* Ambient background glows */}
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-cherry/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-champagne-gold/15 blur-3xl pointer-events-none" />

      {/* Header */}
      <header className="max-w-6xl w-full mx-auto flex items-center justify-between z-10">
        <Link to="/" className="flex items-center gap-3">
          <ZyloLogo variant="dark" size="md" showWordmark={true} showTagline={true} />
        </Link>

        <Link
          to="/"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-ivory border border-stone-warm text-xs font-semibold text-espresso hover:border-cherry transition-colors shadow-sm"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Public Landing Page</span>
        </Link>
      </header>

      {/* Center Access Denied Card */}
      <main className="max-w-lg w-full mx-auto my-auto py-10 z-10">
        <div className="bg-ivory rounded-3xl border border-stone-warm shadow-luxury p-8 sm:p-10 text-center space-y-6">
          {/* Shield Badge */}
          <div className="w-16 h-16 rounded-2xl bg-cherry-light border border-cherry/20 text-cherry flex items-center justify-center mx-auto shadow-sm">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="text-[10px] font-mono font-bold tracking-widest text-cherry uppercase">
              HTTP 403 &bull; RESTRICTED WORKSPACE
            </span>
            <h1 className="font-display text-3xl font-black text-espresso tracking-tight">
              Access Restricted
            </h1>
            <p className="text-xs sm:text-sm text-espresso-muted leading-relaxed max-w-md mx-auto">
              You are currently signed in as a{' '}
              <span className="font-bold text-cherry-dark capitalize bg-champagne px-1.5 py-0.5 rounded">
                {currentRole}
              </span>
              . This section requires authorized{' '}
              <span className="font-bold text-espresso capitalize">{requiredRole}</span> privileges.
            </p>
          </div>

          {/* Current Identity Verification Box */}
          <div className="p-4 rounded-2xl bg-champagne-light border border-stone-warm text-left space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-espresso">
              <span>Signed In As:</span>
              <span className="font-mono text-[11px] text-espresso-muted">{user?.email || 'N/A'}</span>
            </div>
            <div className="flex items-center justify-between text-xs text-espresso-muted">
              <span>Assigned Role:</span>
              <span className="font-bold text-cherry-dark uppercase text-[10px] tracking-wider">
                {currentRole}
              </span>
            </div>
          </div>

          {/* Action Links */}
          <div className="space-y-3 pt-2">
            {currentRole === 'customer' ? (
              <>
                <Link to="/customer/dashboard" className="block">
                  <Button variant="primary" className="w-full text-xs">
                    Return to Customer Portal
                  </Button>
                </Link>
                <Link to="/admin/login" className="block">
                  <Button variant="secondary" className="w-full text-xs" icon={LogIn}>
                    Sign in with Administrator Credentials
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link to="/admin/dashboard" className="block">
                  <Button variant="primary" className="w-full text-xs">
                    Return to Administrator Dashboard
                  </Button>
                </Link>
                <Link to="/customer/dashboard" className="block">
                  <Button variant="secondary" className="w-full text-xs">
                    Visit Customer Portal
                  </Button>
                </Link>
              </>
            )}

            {/* Quick Demo Role Switcher for Hackathon Judges */}
            <div className="pt-4 border-t border-stone-warm/80">
              <p className="text-[11px] text-espresso-muted mb-2">
                Hackathon Evaluation Shortcut:
              </p>
              <div className="flex items-center justify-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-[11px] py-1"
                  onClick={() => switchRole('admin')}
                >
                  <Sparkles className="w-3 h-3 mr-1 text-champagne-gold" />
                  Simulate Admin Login
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-[11px] py-1"
                  onClick={() => switchRole('customer')}
                >
                  <UserCheck className="w-3 h-3 mr-1 text-cherry" />
                  Simulate Customer Login
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-6xl w-full mx-auto text-center text-xs text-espresso-muted z-10 pt-6 border-t border-stone-warm/50">
        <p>Zylo Stream &copy; 2026. Security Architecture &amp; Role-Based Boundary Protection.</p>
      </footer>
    </div>
  );
};
