import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Layers, CheckCircle2, Server, Database, Sparkles, ShieldCheck } from 'lucide-react';
import { checkHealth } from './services/api';

export default function App() {
  const [healthStatus, setHealthStatus] = useState({
    loading: true,
    data: null,
    error: null
  });

  useEffect(() => {
    let isMounted = true;
    checkHealth()
      .then((res) => {
        if (isMounted) {
          setHealthStatus({ loading: false, data: res, error: null });
        }
      })
      .catch((err) => {
        if (isMounted) {
          setHealthStatus({
            loading: false,
            data: null,
            error: err.message || 'Backend not connected'
          });
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-champagne text-espresso flex flex-col justify-between p-6 md:p-12 selection:bg-cherry selection:text-ivory">
      {/* Top Navigation Bar Placeholder */}
      <header className="max-w-6xl w-full mx-auto flex items-center justify-between pb-8 border-b border-stone-warm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cherry flex items-center justify-center text-ivory font-serif font-bold text-xl shadow-md">
            S
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold tracking-tight text-cherry-dark">
              Subscription Management System
            </h1>
            <p className="text-xs uppercase tracking-widest text-champagne-gold font-semibold">
              Enterprise Foundation Architecture
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-ivory border border-stone-warm text-espresso shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Scaffold Active
          </span>
        </div>
      </header>

      {/* Main Hero & Foundation Status */}
      <main className="max-w-4xl w-full mx-auto my-auto py-12">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-ivory rounded-2xl p-8 md:p-12 border border-stone-warm shadow-xl space-y-8"
        >
          {/* Header Title with Playfair Serif */}
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#FAF3E8] border border-champagne-gold/30 text-xs font-semibold text-cherry">
              <Sparkles className="w-3.5 h-3.5 text-champagne-gold" />
              Theme: Cherry Red + Champagne
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-espresso leading-tight">
              Modular Monorepo Architecture Ready
            </h2>
            <p className="text-stone-600 text-sm md:text-base leading-relaxed">
              The full-stack directory hierarchy, theme tokens, Express feature modules, and Supabase integration foundations have been successfully prepared for your 4-developer engineering team.
            </p>
          </div>

          {/* Core Foundations Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-xl bg-champagne/40 border border-stone-warm space-y-2">
              <div className="flex items-center gap-2 text-cherry font-semibold text-sm">
                <Layers className="w-4 h-4" />
                Frontend Stack
              </div>
              <p className="text-xs text-stone-600">
                React 18, Vite, Tailwind CSS, Framer Motion, React Router & Recharts.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-champagne/40 border border-stone-warm space-y-2">
              <div className="flex items-center gap-2 text-cherry font-semibold text-sm">
                <Server className="w-4 h-4" />
                Express Backend
              </div>
              <p className="text-xs text-stone-600">
                10 domain modules, standard error handling, logger & recurring billing jobs.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-champagne/40 border border-stone-warm space-y-2">
              <div className="flex items-center gap-2 text-cherry font-semibold text-sm">
                <Database className="w-4 h-4" />
                Data & Auth
              </div>
              <p className="text-xs text-stone-600">
                Supabase Auth JWT middleware, PostgreSQL migrations, seeds & baseline schema.
              </p>
            </div>
          </div>

          {/* Backend Connectivity Check Card */}
          <div className="p-4 rounded-xl bg-champagne-light border border-stone-warm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className={`p-2.5 rounded-lg ${healthStatus.data ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-espresso">Backend API Health Status</p>
                <p className="text-xs text-stone-600 font-mono">
                  {healthStatus.loading && 'Probing /api/health...'}
                  {healthStatus.data && `Connected: ${healthStatus.data.message}`}
                  {healthStatus.error && `Offline / Standalone mode (${healthStatus.error})`}
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                setHealthStatus((prev) => ({ ...prev, loading: true }));
                checkHealth()
                  .then((res) => setHealthStatus({ loading: false, data: res, error: null }))
                  .catch((err) => setHealthStatus({ loading: false, data: null, error: err.message }));
              }}
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-cherry text-ivory hover:bg-cherry-dark transition-colors shadow-sm self-start sm:self-auto"
            >
              Recheck Health
            </button>
          </div>

          {/* Status Note */}
          <div className="flex items-start gap-3 text-xs text-stone-500 pt-2 border-t border-stone-warm/80">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <p>
              Scaffold validation complete. No business logic or premature mock data has been added. Ready for subsequent instructions.
            </p>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="max-w-6xl w-full mx-auto pt-8 border-t border-stone-warm flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
        <p>Subscription Management System &copy; 2026. All rights reserved.</p>
        <p className="font-mono">Theme: Cherry Red (#C41E3A) + Champagne (#F5E9D5)</p>
      </footer>
    </div>
  );
}
