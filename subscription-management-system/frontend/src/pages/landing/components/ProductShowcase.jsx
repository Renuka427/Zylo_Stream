import React from 'react';
import { Link } from 'react-router-dom';
import {
  TrendingUp,
  DollarSign,
  Users,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Receipt,
  ArrowRight,
  ExternalLink,
  Sparkles,
  LayoutDashboard,
  RefreshCw,
  Package,
  Layers,
  FileText
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { ZyloLogo } from '../../../components/brand/ZyloLogo';

export const ProductShowcase = () => {
  const chartData = [
    { month: 'May', mrr: 19900 },
    { month: 'Jun', mrr: 21200 },
    { month: 'Jul', mrr: 22600 },
    { month: 'Aug', mrr: 24100 },
    { month: 'Sep', mrr: 25800 },
    { month: 'Oct', mrr: 27550 }
  ];

  const recentInvoices = [
    { number: 'INV-2026-101', customer: 'Meridian Analytics', amount: '$3,200', status: 'Paid', date: 'Oct 28' },
    { number: 'INV-2026-102', customer: 'Aura Logistics AI', amount: '$1,450', status: 'Paid', date: 'Oct 26' },
    { number: 'INV-2026-103', customer: 'Solace Health Systems', amount: '$4,800', status: 'Confirmed', date: 'Oct 24' },
    { number: 'INV-2026-104', customer: 'Vanguard Dynamics', amount: '$2,100', status: 'Paid', date: 'Oct 22' }
  ];

  const upcomingRenewals = [
    { client: 'Cobalt Horizon Corp', plan: 'Enterprise Bespoke', amount: '$5,400', date: 'Nov 02' },
    { client: 'Zenith Retail Tech', plan: 'Growth Tier', amount: '$1,250', date: 'Nov 05' },
    { client: 'Apex BioIntelligence', plan: 'Enterprise Bespoke', amount: '$4,600', date: 'Nov 08' }
  ];

  return (
    <section className="py-20 md:py-28 bg-champagne-light/60 border-y border-stone-warm/80 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-14">
          <span className="text-xs uppercase font-bold tracking-widest text-champagne-gold">
            SIGNATURE WORKSPACE SHOWCASE
          </span>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-black text-espresso tracking-tight leading-tight">
            Your subscription business.{' '}
            <br />
            <span className="text-cherry font-normal italic">In one clear view.</span>
          </h2>
          <p className="text-base sm:text-lg text-espresso-muted leading-relaxed">
            See the details that matter, from recurring revenue to upcoming renewals, without jumping between disconnected workflows.
          </p>
        </div>

        {/* Large Browser-Framed Showcase Canvas */}
        <div className="relative rounded-3xl bg-ivory border border-stone-warm shadow-luxury-lg overflow-hidden">
          {/* Top Window Bar */}
          <div className="px-5 py-3 bg-champagne/70 border-b border-stone-warm flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-cherry/80" />
              <span className="w-3 h-3 rounded-full bg-champagne-gold" />
              <span className="w-3 h-3 rounded-full bg-emerald-600/70" />
              <span className="ml-3 font-mono text-xs font-semibold text-espresso-muted">
                app.zylostream.io/dashboard
              </span>
            </div>

            <Link to="/dashboard">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-cherry hover:underline">
                <span>Open Live Prototype</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </span>
            </Link>
          </div>

          {/* Main App Layout Preview: Mini Sidebar + Live Canvas */}
          <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[520px]">
            {/* Left Showcase Sidebar (3 cols on lg) */}
            <div className="hidden lg:flex lg:col-span-3 bg-cherry-dark p-4 flex-col justify-between text-ivory border-r border-cherry-darker">
              <div className="space-y-6">
                <div className="py-2">
                  <ZyloLogo variant="light" size="sm" showWordmark={true} />
                </div>

                <div className="space-y-1 text-xs">
                  <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-ivory text-cherry-dark font-bold shadow-sm">
                    <LayoutDashboard className="w-4 h-4 text-cherry" />
                    <span>Executive Overview</span>
                  </div>
                  <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-champagne/80 font-medium">
                    <RefreshCw className="w-4 h-4 text-champagne-gold" />
                    <span>Subscriptions (78)</span>
                  </div>
                  <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-champagne/80 font-medium">
                    <Users className="w-4 h-4 text-champagne-gold" />
                    <span>Customer Accounts</span>
                  </div>
                  <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-champagne/80 font-medium">
                    <Receipt className="w-4 h-4 text-champagne-gold" />
                    <span>Billing Invoices</span>
                  </div>
                  <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-champagne/80 font-medium">
                    <FileText className="w-4 h-4 text-champagne-gold" />
                    <span>Quotations</span>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-[11px] text-champagne/70 space-y-1">
                <p className="font-bold text-ivory">Demo Environment</p>
                <p>Interactive client-side state synchronized to browser memory.</p>
              </div>
            </div>

            {/* Right Showcase Dashboard Content (9 cols) */}
            <div className="lg:col-span-9 p-5 sm:p-7 space-y-6 bg-champagne-light/30">
              {/* Metric Highlights Strip */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div className="p-4 rounded-2xl bg-ivory border border-stone-warm shadow-sm space-y-1">
                  <span className="text-[10px] uppercase font-bold text-espresso-muted">Monthly Recurring Revenue</span>
                  <div className="flex items-baseline justify-between">
                    <span className="font-display text-2xl font-black text-espresso font-mono">$27,550</span>
                    <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                      +14.2% MoM
                    </span>
                  </div>
                  <span className="text-[11px] text-stone-500 block">78 Active enterprise tiers</span>
                </div>

                <div className="p-4 rounded-2xl bg-ivory border border-stone-warm shadow-sm space-y-1">
                  <span className="text-[10px] uppercase font-bold text-espresso-muted">Net Revenue Retention</span>
                  <div className="flex items-baseline justify-between">
                    <span className="font-display text-2xl font-black text-cherry-dark font-mono">118.2%</span>
                    <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                      Healthy
                    </span>
                  </div>
                  <span className="text-[11px] text-stone-500 block">Expansion outpaces churn</span>
                </div>

                <div className="p-4 rounded-2xl bg-ivory border border-stone-warm shadow-sm space-y-1">
                  <span className="text-[10px] uppercase font-bold text-espresso-muted">Outstanding Balance</span>
                  <div className="flex items-baseline justify-between">
                    <span className="font-display text-2xl font-black text-espresso font-mono">$4,800</span>
                    <span className="text-xs font-semibold text-espresso-muted">1 Invoice Due</span>
                  </div>
                  <span className="text-[11px] text-stone-500 block">Auto-retry scheduled</span>
                </div>
              </div>

              {/* Chart & Upcoming Renewals Dual Grid */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                {/* Revenue Velocity Curve (7 cols) */}
                <div className="md:col-span-7 p-4 sm:p-5 rounded-2xl bg-ivory border border-stone-warm shadow-sm space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-stone-warm/60">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-champagne-gold tracking-wider">MRR Momentum</span>
                      <h4 className="font-display text-base font-bold text-espresso">Revenue Expansion Curve</h4>
                    </div>
                    <span className="font-mono text-xs font-bold text-cherry-dark">$27.5k / mo</span>
                  </div>

                  <div className="h-44 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                        <defs>
                          <linearGradient id="showcaseGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#C41E3A" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#C41E3A" stopOpacity={0.0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5D4B8" opacity={0.6} />
                        <XAxis dataKey="month" tick={{ fill: '#82766F', fontSize: 10 }} axisLine={{ stroke: '#E5D4B8' }} />
                        <YAxis tick={{ fill: '#82766F', fontSize: 10 }} tickFormatter={(v) => `$${v / 1000}k`} axisLine={false} />
                        <Area type="monotone" dataKey="mrr" stroke="#C41E3A" strokeWidth={2.5} fill="url(#showcaseGradient)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Upcoming Auto-Renewals (5 cols) */}
                <div className="md:col-span-5 p-4 sm:p-5 rounded-2xl bg-ivory border border-stone-warm shadow-sm flex flex-col justify-between space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-stone-warm/60">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-champagne-gold tracking-wider">Next 14 Days</span>
                      <h4 className="font-display text-base font-bold text-espresso">Renewals Watch</h4>
                    </div>
                    <Calendar className="w-4 h-4 text-champagne-gold" />
                  </div>

                  <div className="space-y-2 text-xs">
                    {upcomingRenewals.map((r) => (
                      <div key={r.client} className="p-2.5 rounded-xl bg-champagne-light border border-stone-warm flex items-center justify-between">
                        <div>
                          <p className="font-bold text-espresso text-[11px]">{r.client}</p>
                          <p className="text-[10px] text-espresso-muted">{r.plan}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-mono font-bold text-espresso text-[11px]">{r.amount}</p>
                          <p className="text-[9px] text-stone-500 font-semibold">{r.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="text-[10px] text-emerald-800 font-semibold flex items-center gap-1 pt-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                    All recurring contracts verified
                  </div>
                </div>
              </div>

              {/* Recent Invoices Table Preview */}
              <div className="p-4 sm:p-5 rounded-2xl bg-ivory border border-stone-warm shadow-sm space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-stone-warm/60">
                  <h4 className="font-display text-base font-bold text-espresso">Recent Billing Statements</h4>
                  <Link to="/invoices" className="text-xs font-semibold text-cherry hover:underline flex items-center gap-1">
                    <span>View All Invoices</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-stone-warm text-espresso-muted uppercase font-semibold text-[10px]">
                        <th className="py-2 px-3">Statement #</th>
                        <th className="py-2 px-3">Customer Account</th>
                        <th className="py-2 px-3">Date</th>
                        <th className="py-2 px-3 text-right">Amount</th>
                        <th className="py-2 px-3 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-warm/50">
                      {recentInvoices.map((inv) => (
                        <tr key={inv.number} className="hover:bg-champagne/20">
                          <td className="py-2.5 px-3 font-mono font-bold text-cherry-dark">{inv.number}</td>
                          <td className="py-2.5 px-3 font-medium text-espresso">{inv.customer}</td>
                          <td className="py-2.5 px-3 text-stone-500">{inv.date}</td>
                          <td className="py-2.5 px-3 text-right font-mono font-bold text-espresso">{inv.amount}</td>
                          <td className="py-2.5 px-3 text-right">
                            <Badge status={inv.status} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA Button */}
        <div className="text-center mt-10">
          <Link to="/dashboard">
            <Button variant="primary" size="lg" icon={ArrowRight} className="shadow-luxury">
              Launch Live Workspace Demo
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};
