import React, { useState } from 'react';
import {
  BarChart3,
  Download,
  Calendar,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  ShieldCheck,
  FileSpreadsheet
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { useMockData } from '../../contexts/MockDataContext';
import { useToast } from '../../contexts/ToastContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { StatCard } from '../../components/ui/StatCard';

export const ReportsPage = () => {
  const { revenueTrends, statusDistribution, kpis } = useMockData();
  const { showToast } = useToast();
  const [reportPeriod, setReportPeriod] = useState('YTD 2026');

  // Expansion vs Churn Breakdown for BarChart
  const netExpansionData = [
    { month: 'May', expansion: 3200, churn: -800, net: 2400 },
    { month: 'Jun', expansion: 3500, churn: -900, net: 2600 },
    { month: 'Jul', expansion: 2900, churn: -800, net: 2100 },
    { month: 'Aug', expansion: 3600, churn: -1100, net: 2500 },
    { month: 'Sep', expansion: 3400, churn: -1000, net: 2400 },
    { month: 'Oct', expansion: 4800, churn: -1050, net: 3750 },
  ];

  const handleExport = () => {
    showToast('Compiling executive financial report digest (CSV/PDF)...');
    setTimeout(() => {
      showToast('Report generated and downloaded to your local device.');
    }, 1200);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-stone-warm/60">
        <div>
          <span className="text-xs uppercase font-bold tracking-widest text-champagne-gold">
            Financial Intelligence
          </span>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-espresso tracking-tight mt-0.5">
            Revenue & Retention Reports
          </h1>
          <p className="text-xs text-espresso-muted mt-1">
            MRR momentum, net revenue retention (NRR), churn cohorts, and invoice settlement efficiency.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-ivory border border-stone-warm text-xs text-espresso shadow-sm">
            <Calendar className="w-3.5 h-3.5 text-champagne-gold" />
            <select
              value={reportPeriod}
              onChange={(e) => {
                setReportPeriod(e.target.value);
                showToast(`Reporting window: ${e.target.value}`);
              }}
              className="bg-transparent font-medium focus:outline-none cursor-pointer"
            >
              <option value="Last 30 Days">Last 30 Days</option>
              <option value="Q3 2026">Q3 2026</option>
              <option value="YTD 2026">Year-to-Date 2026</option>
              <option value="Annual 2025-2026">Trailing 12 Months</option>
            </select>
          </div>

          <Button
            variant="secondary"
            icon={Download}
            onClick={handleExport}
          >
            Export Dossier
          </Button>
        </div>
      </div>

      {/* Core SaaS Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Net Revenue Retention (NRR)"
          value="114.8%"
          delta="+3.2% vs last quarter"
          icon={TrendingUp}
          accentColor="cherry"
          subtitle="Enterprise account expansion"
        />
        <StatCard
          title="Avg Revenue Per User (ARPU)"
          value="$3,443"
          delta="+6.5% vs last quarter"
          icon={DollarSign}
          accentColor="gold"
          subtitle="Top tier: $5,100/mo"
        />
        <StatCard
          title="Gross Monthly Churn"
          value="1.8%"
          delta="-0.4% improvement"
          isPositive={true}
          icon={TrendingDown}
          accentColor="darkCherry"
          subtitle="Benchmark SLA: < 2.5%"
        />
        <StatCard
          title="Customer Lifetime Value"
          value="$41,800"
          delta="+12.1% YoY"
          icon={Users}
          accentColor="gold"
          subtitle="Payback period: 4.2 mos"
        />
      </div>

      {/* Primary Analytics Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* MRR Acceleration Curve */}
        <Card className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-stone-warm/60">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-champagne-gold">
                Monthly Recurring Revenue
              </span>
              <h3 className="font-display text-lg font-bold text-espresso">
                MRR Growth Velocity
              </h3>
            </div>
            <span className="text-xs font-mono font-bold text-cherry-dark">
              Latest: $27,550/mo
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueTrends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="mrrGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#C41E3A" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#C41E3A" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5D4B8" opacity={0.6} />
                <XAxis dataKey="month" tick={{ fill: '#82766F', fontSize: 11 }} axisLine={{ stroke: '#E5D4B8' }} />
                <YAxis tick={{ fill: '#82766F', fontSize: 11 }} tickFormatter={(val) => `$${val / 1000}k`} axisLine={false} />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-ivory p-3 rounded-xl border border-stone-warm shadow-luxury text-xs">
                          <p className="font-bold text-espresso">{label}</p>
                          <p className="text-cherry font-bold">MRR: ${payload[0]?.value?.toLocaleString()}</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area type="monotone" dataKey="mrr" stroke="#C41E3A" strokeWidth={2.5} fill="url(#mrrGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Net Expansion vs Churn Breakdown (BarChart) */}
        <Card className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-stone-warm/60">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-champagne-gold">
                Net ARR Movements
              </span>
              <h3 className="font-display text-lg font-bold text-espresso">
                Account Expansion vs Churn
              </h3>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 text-emerald-800">
                <span className="w-2.5 h-2.5 rounded-sm bg-emerald-700" />
                Expansion
              </span>
              <span className="flex items-center gap-1.5 text-cherry">
                <span className="w-2.5 h-2.5 rounded-sm bg-cherry" />
                Contraction/Churn
              </span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={netExpansionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5D4B8" opacity={0.6} />
                <XAxis dataKey="month" tick={{ fill: '#82766F', fontSize: 11 }} axisLine={{ stroke: '#E5D4B8' }} />
                <YAxis tick={{ fill: '#82766F', fontSize: 11 }} tickFormatter={(val) => `$${val}`} axisLine={false} />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-ivory p-3 rounded-xl border border-stone-warm shadow-luxury text-xs space-y-1">
                          <p className="font-bold text-espresso">{label} 2026</p>
                          <p className="text-emerald-800 font-semibold">Expansion: +${payload[0]?.value}</p>
                          <p className="text-cherry font-semibold">Churn: ${payload[1]?.value}</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="expansion" fill="#047857" radius={[4, 4, 0, 0]} />
                <Bar dataKey="churn" fill="#C41E3A" radius={[0, 0, 4, 4]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Bottom Summary Table: Segment Breakdown */}
      <Card className="p-0 overflow-hidden">
        <div className="p-4 bg-champagne-light border-b border-stone-warm flex items-center justify-between">
          <div>
            <h4 className="font-display text-base font-bold text-espresso">
              Cohort Breakdown by Account Tier
            </h4>
            <p className="text-xs text-espresso-muted">Retention performance across Enterprise, Growth, and Starter contracts.</p>
          </div>
          <span className="text-xs font-mono text-stone-500 font-semibold">Audited: Oct 2026</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-stone-warm text-espresso-muted uppercase font-semibold">
                <th className="py-3 px-4">Segment Tier</th>
                <th className="py-3 px-4 text-center">Accounts</th>
                <th className="py-3 px-4 text-right">Aggregate MRR</th>
                <th className="py-3 px-4 text-right">Expansion Rate</th>
                <th className="py-3 px-4 text-right">Net Churn</th>
                <th className="py-3 px-4 text-right">Risk Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-warm/60">
              <tr>
                <td className="py-3 px-4 font-bold text-cherry-dark">Enterprise Bespoke</td>
                <td className="py-3 px-4 text-center font-bold">14</td>
                <td className="py-3 px-4 text-right font-mono font-bold">$18,400</td>
                <td className="py-3 px-4 text-right font-semibold text-emerald-800">+19.2%</td>
                <td className="py-3 px-4 text-right font-mono">0.0%</td>
                <td className="py-3 px-4 text-right"><span className="text-emerald-800 font-bold">Minimal</span></td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-bold text-espresso">Growth Accelerate</td>
                <td className="py-3 px-4 text-center font-bold">28</td>
                <td className="py-3 px-4 text-right font-mono font-bold">$7,650</td>
                <td className="py-3 px-4 text-right font-semibold text-emerald-800">+11.4%</td>
                <td className="py-3 px-4 text-right font-mono">1.2%</td>
                <td className="py-3 px-4 text-right"><span className="text-emerald-800 font-bold">Low</span></td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-bold text-espresso-muted">Starter Sandbox</td>
                <td className="py-3 px-4 text-center font-bold">36</td>
                <td className="py-3 px-4 text-right font-mono font-bold">$1,500</td>
                <td className="py-3 px-4 text-right font-semibold text-espresso-muted">+3.0%</td>
                <td className="py-3 px-4 text-right font-mono text-cherry">4.5%</td>
                <td className="py-3 px-4 text-right"><span className="text-[#8C621E] font-bold">Moderate</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
