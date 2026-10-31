import React from 'react';
import {
  TrendingUp,
  DollarSign,
  Users,
  Calendar,
  CheckCircle2,
  AlertCircle,
  CreditCard,
  ArrowUpRight,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  Tooltip
} from 'recharts';

export const HeroDashboardPreview = () => {
  // Sparkline data for hero preview
  const sparkData = [
    { period: 'W1', val: 18200 },
    { period: 'W2', val: 21400 },
    { period: 'W3', val: 23100 },
    { period: 'W4', val: 25600 },
    { period: 'W5', val: 27550 }
  ];

  return (
    <div className="relative w-full max-w-xl mx-auto lg:max-w-none">
      {/* Ambient backdrop glow */}
      <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-champagne-gold/30 via-cherry/20 to-champagne/40 blur-xl opacity-70 pointer-events-none" />

      {/* Main Container Card */}
      <div className="relative rounded-2xl bg-ivory border border-stone-warm shadow-luxury overflow-hidden">
        {/* Top Window Bar */}
        <div className="px-4 py-2.5 bg-champagne-light border-b border-stone-warm flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-cherry/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-champagne-gold" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600/70" />
            <span className="ml-2 font-mono text-[10px] uppercase font-bold tracking-wider text-espresso-muted">
              Zylo Stream — Live Ledger
            </span>
          </div>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
            Synced
          </span>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-5 space-y-4">
          {/* Top KPI Ribbon (3 Mini Cards) */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            <div className="p-2.5 sm:p-3 rounded-xl bg-champagne/40 border border-stone-warm/80">
              <span className="text-[9px] uppercase font-bold text-espresso-muted block">
                Monthly Recurring
              </span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="font-display text-base sm:text-lg font-black text-espresso font-mono">
                  $27,550
                </span>
                <span className="text-[10px] font-bold text-emerald-800 flex items-center">
                  +14%
                </span>
              </div>
            </div>

            <div className="p-2.5 sm:p-3 rounded-xl bg-champagne/40 border border-stone-warm/80">
              <span className="text-[9px] uppercase font-bold text-espresso-muted block">
                Active Contracts
              </span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="font-display text-base sm:text-lg font-black text-cherry-dark font-mono">
                  78
                </span>
                <span className="text-[10px] text-espresso-muted">SaaS</span>
              </div>
            </div>

            <div className="p-2.5 sm:p-3 rounded-xl bg-champagne/40 border border-stone-warm/80">
              <span className="text-[9px] uppercase font-bold text-espresso-muted block">
                Settled Rate
              </span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="font-display text-base sm:text-lg font-black text-emerald-900 font-mono">
                  98.2%
                </span>
                <CheckCircle2 className="w-3 h-3 text-emerald-700" />
              </div>
            </div>
          </div>

          {/* Mini Revenue Curve & Renewals Row */}
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
            {/* Sparkline (3 cols) */}
            <div className="sm:col-span-3 p-3 rounded-xl bg-champagne-light border border-stone-warm flex flex-col justify-between">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-espresso-muted">
                  Revenue Trajectory
                </span>
                <span className="text-[10px] font-bold text-cherry font-mono">
                  +$3,450 vs Sep
                </span>
              </div>
              <div className="h-20 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={sparkData} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="heroGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#C41E3A" stopOpacity={0.35} />
                        <stop offset="100%" stopColor="#C41E3A" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <Area
                      type="monotone"
                      dataKey="val"
                      stroke="#C41E3A"
                      strokeWidth={2}
                      fill="url(#heroGradient)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Upcoming Renewals Watch (2 cols) */}
            <div className="sm:col-span-2 p-3 rounded-xl bg-champagne-light border border-stone-warm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-espresso-muted">
                  Auto-Renewals
                </span>
                <Calendar className="w-3 h-3 text-champagne-gold" />
              </div>

              <div className="space-y-1.5 text-[11px]">
                <div className="flex items-center justify-between p-1.5 rounded-lg bg-ivory border border-stone-warm/60">
                  <span className="font-semibold text-espresso truncate max-w-[80px]">
                    Meridian Corp
                  </span>
                  <span className="font-mono text-emerald-800 font-bold">$2,800</span>
                </div>
                <div className="flex items-center justify-between p-1.5 rounded-lg bg-ivory border border-stone-warm/60">
                  <span className="font-semibold text-espresso truncate max-w-[80px]">
                    Aura Systems
                  </span>
                  <span className="font-mono text-emerald-800 font-bold">$1,450</span>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Reconciled Transaction Strip */}
          <div className="p-3 rounded-xl bg-ivory border border-stone-warm/80 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-champagne flex items-center justify-center text-cherry shrink-0">
                <CreditCard className="w-3.5 h-3.5" />
              </div>
              <div>
                <p className="font-bold text-espresso text-[11px]">INV-2026-104 Auto-Settled</p>
                <p className="text-[10px] text-espresso-muted">ACH Direct Debit • Horizon Labs</p>
              </div>
            </div>
            <div className="text-right">
              <span className="font-mono font-bold text-emerald-900 text-xs">+$4,200.00</span>
              <span className="text-[9px] uppercase font-bold text-emerald-800 block">Verified</span>
            </div>
          </div>
        </div>

        {/* Bottom subtle bar */}
        <div className="px-4 py-2 bg-champagne/40 border-t border-stone-warm/60 flex items-center justify-between text-[10px] text-espresso-muted">
          <span>Continuous cycle monitoring</span>
          <span className="font-bold text-cherry-dark">Your Subscription, On Autopilot.</span>
        </div>
      </div>
    </div>
  );
};
