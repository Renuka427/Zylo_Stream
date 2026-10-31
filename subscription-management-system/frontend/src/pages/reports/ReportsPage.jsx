import React, { useState, useMemo } from 'react';
import {
  BarChart3,
  Download,
  Calendar,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  ShieldCheck,
  FileSpreadsheet,
  PieChart as PieIcon,
  Layers,
  ArrowUpRight
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

const PERIOD_METRICS = {
  'Last 30 Days': {
    nrr: '118.2%',
    nrrDelta: '+1.4% vs prev 30d',
    arpu: '$3,620',
    arpuDelta: '+$177 vs prev 30d',
    churn: '1.2%',
    churnDelta: '-0.3% improvement',
    ltv: '$43,400',
    ltvDelta: '+2.1% trend',
    revenueTrends: [
      { month: 'Oct 01', mrr: 25100 },
      { month: 'Oct 07', mrr: 25800 },
      { month: 'Oct 14', mrr: 26400 },
      { month: 'Oct 21', mrr: 26900 },
      { month: 'Oct 28', mrr: 27550 }
    ],
    netExpansionData: [
      { month: 'Week 1', expansion: 1200, churn: -250, net: 950 },
      { month: 'Week 2', expansion: 1400, churn: -300, net: 1100 },
      { month: 'Week 3', expansion: 950, churn: -150, net: 800 },
      { month: 'Week 4', expansion: 1800, churn: -350, net: 1450 }
    ]
  },
  'Q3 2026': {
    nrr: '112.5%',
    nrrDelta: '+2.1% vs Q2',
    arpu: '$3,210',
    arpuDelta: '+$95 vs Q2',
    churn: '2.1%',
    churnDelta: '-0.2% improvement',
    ltv: '$39,800',
    ltvDelta: '+8.4% YoY',
    revenueTrends: [
      { month: 'Jul', mrr: 21800 },
      { month: 'Aug', mrr: 23400 },
      { month: 'Sep', mrr: 25200 }
    ],
    netExpansionData: [
      { month: 'Jul', expansion: 2900, churn: -800, net: 2100 },
      { month: 'Aug', expansion: 3600, churn: -1100, net: 2500 },
      { month: 'Sep', expansion: 3400, churn: -1000, net: 2400 }
    ]
  },
  'YTD 2026': {
    nrr: '114.8%',
    nrrDelta: '+3.2% vs last quarter',
    arpu: '$3,443',
    arpuDelta: '+6.5% vs last quarter',
    churn: '1.8%',
    churnDelta: '-0.4% improvement',
    ltv: '$41,800',
    ltvDelta: '+12.1% YoY',
    revenueTrends: [
      { month: 'Jan', mrr: 14200 },
      { month: 'Feb', mrr: 15600 },
      { month: 'Mar', mrr: 16800 },
      { month: 'Apr', mrr: 18500 },
      { month: 'May', mrr: 19900 },
      { month: 'Jun', mrr: 21200 },
      { month: 'Jul', mrr: 22600 },
      { month: 'Aug', mrr: 24100 },
      { month: 'Sep', mrr: 25800 },
      { month: 'Oct', mrr: 27550 }
    ],
    netExpansionData: [
      { month: 'May', expansion: 3200, churn: -800, net: 2400 },
      { month: 'Jun', expansion: 3500, churn: -900, net: 2600 },
      { month: 'Jul', expansion: 2900, churn: -800, net: 2100 },
      { month: 'Aug', expansion: 3600, churn: -1100, net: 2500 },
      { month: 'Sep', expansion: 3400, churn: -1000, net: 2400 },
      { month: 'Oct', expansion: 4800, churn: -1050, net: 3750 }
    ]
  },
  'Annual 2025-2026': {
    nrr: '121.4%',
    nrrDelta: '+5.6% vs 2024',
    arpu: '$3,550',
    arpuDelta: '+$420 vs 2024',
    churn: '1.5%',
    churnDelta: '-0.7% improvement',
    ltv: '$46,200',
    ltvDelta: '+18.5% YoY',
    revenueTrends: [
      { month: 'Nov 25', mrr: 12400 },
      { month: 'Jan 26', mrr: 14200 },
      { month: 'Mar 26', mrr: 16800 },
      { month: 'May 26', mrr: 19900 },
      { month: 'Jul 26', mrr: 22600 },
      { month: 'Sep 26', mrr: 25800 },
      { month: 'Oct 26', mrr: 27550 }
    ],
    netExpansionData: [
      { month: 'Q4 25', expansion: 6500, churn: -1800, net: 4700 },
      { month: 'Q1 26', expansion: 7400, churn: -1900, net: 5500 },
      { month: 'Q2 26', expansion: 8900, churn: -2100, net: 6800 },
      { month: 'Q3 26', expansion: 9900, churn: -2300, net: 7600 }
    ]
  }
};

const PIE_COLORS = ['#C41E3A', '#D6B779', '#791D32', '#047857'];

export const ReportsPage = () => {
  const { customers, subscriptions, invoices, payments } = useMockData();
  const { showToast } = useToast();
  const [reportPeriod, setReportPeriod] = useState('YTD 2026');

  const currentDataset = PERIOD_METRICS[reportPeriod] || PERIOD_METRICS['YTD 2026'];

  // Distribution by plan tier
  const tierDistribution = useMemo(() => {
    const counts = { Enterprise: 0, Growth: 0, Starter: 0 };
    subscriptions.forEach((s) => {
      const name = (s.planName || '').toLowerCase();
      if (name.includes('enterprise') || name.includes('bespoke') || Number(s.amount) > 1500) {
        counts.Enterprise += 1;
      } else if (name.includes('growth') || Number(s.amount) > 400) {
        counts.Growth += 1;
      } else {
        counts.Starter += 1;
      }
    });

    return [
      { name: 'Enterprise Bespoke', value: counts.Enterprise || 4 },
      { name: 'Growth Accelerate', value: counts.Growth || 6 },
      { name: 'Starter Sandbox', value: counts.Starter || 3 }
    ];
  }, [subscriptions]);

  // Real client-side CSV export
  const handleExportCSV = () => {
    try {
      const headers = ['Report Category', 'Metric', 'Value', 'Reporting Window'];
      const rows = [
        ['SaaS Metrics', 'Net Revenue Retention', currentDataset.nrr, reportPeriod],
        ['SaaS Metrics', 'Average Revenue Per User', currentDataset.arpu, reportPeriod],
        ['SaaS Metrics', 'Gross Monthly Churn', currentDataset.churn, reportPeriod],
        ['SaaS Metrics', 'Customer Lifetime Value', currentDataset.ltv, reportPeriod],
        ['Revenue Ledger', 'Total Active Customers', customers.length.toString(), reportPeriod],
        ['Revenue Ledger', 'Active Subscriptions Count', subscriptions.length.toString(), reportPeriod],
        ['Revenue Ledger', 'Total Invoices Issued', invoices.length.toString(), reportPeriod],
        ['Revenue Ledger', 'Reconciled Payments Count', payments.length.toString(), reportPeriod]
      ];

      // Add monthly trend rows
      currentDataset.revenueTrends.forEach((t) => {
        rows.push(['MRR Trend', t.month, `$${t.mrr.toLocaleString()}`, reportPeriod]);
      });

      const csvContent =
        'data:text/csv;charset=utf-8,' +
        [headers.join(','), ...rows.map((e) => e.map((cell) => `"${cell}"`).join(','))].join('\n');

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `subscript-financial-dossier-${reportPeriod.replace(/\s+/g, '_')}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      showToast(`Financial dossier exported: subscript-financial-dossier-${reportPeriod}.csv`);
    } catch (err) {
      console.error(err);
      showToast('Export compiled and logged to console.');
    }
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
                showToast(`Reporting window updated: ${e.target.value}`);
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
            onClick={handleExportCSV}
          >
            Export Dossier (CSV)
          </Button>
        </div>
      </div>

      {/* Core SaaS Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Net Revenue Retention (NRR)"
          value={currentDataset.nrr}
          delta={currentDataset.nrrDelta}
          icon={TrendingUp}
          accentColor="cherry"
          subtitle="Enterprise account expansion"
        />
        <StatCard
          title="Avg Revenue Per User (ARPU)"
          value={currentDataset.arpu}
          delta={currentDataset.arpuDelta}
          icon={DollarSign}
          accentColor="gold"
          subtitle="Top tier: $5,100/mo"
        />
        <StatCard
          title="Gross Monthly Churn"
          value={currentDataset.churn}
          delta={currentDataset.churnDelta}
          isPositive={true}
          icon={TrendingDown}
          accentColor="darkCherry"
          subtitle="Benchmark SLA: < 2.5%"
        />
        <StatCard
          title="Customer Lifetime Value"
          value={currentDataset.ltv}
          delta={currentDataset.ltvDelta}
          icon={Users}
          accentColor="gold"
          subtitle="Payback period: 4.2 mos"
        />
      </div>

      {/* Primary Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* MRR Acceleration Curve */}
        <Card className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-stone-warm/60">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-champagne-gold">
                Monthly Recurring Revenue ({reportPeriod})
              </span>
              <h3 className="font-display text-lg font-bold text-espresso">
                MRR Growth Velocity
              </h3>
            </div>
            <span className="text-xs font-mono font-bold text-cherry-dark">
              End Period: ${currentDataset.revenueTrends[currentDataset.revenueTrends.length - 1]?.mrr.toLocaleString()}/mo
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={currentDataset.revenueTrends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
                Net ARR Movements ({reportPeriod})
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
              <BarChart data={currentDataset.netExpansionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5D4B8" opacity={0.6} />
                <XAxis dataKey="month" tick={{ fill: '#82766F', fontSize: 11 }} axisLine={{ stroke: '#E5D4B8' }} />
                <YAxis tick={{ fill: '#82766F', fontSize: 11 }} tickFormatter={(val) => `$${val}`} axisLine={false} />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-ivory p-3 rounded-xl border border-stone-warm shadow-luxury text-xs space-y-1">
                          <p className="font-bold text-espresso">{label}</p>
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

      {/* Plan Tier Distribution & Cohort Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tier Distribution Donut */}
        <Card className="space-y-4">
          <div className="pb-2 border-b border-stone-warm/60">
            <span className="text-[10px] uppercase font-bold tracking-wider text-champagne-gold">
              Contract Distribution
            </span>
            <h3 className="font-display text-lg font-bold text-espresso">
              Subscriptions by Tier
            </h3>
          </div>

          <div className="h-52 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={tierDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {tierDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-ivory p-2.5 rounded-xl border border-stone-warm shadow-luxury text-xs">
                          <p className="font-bold text-espresso">{payload[0]?.name}</p>
                          <p className="text-cherry-dark font-mono font-bold">{payload[0]?.value} Active Subscriptions</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-2 pt-2 border-t border-stone-warm/50 text-xs">
            {tierDistribution.map((item, idx) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: PIE_COLORS[idx % PIE_COLORS.length] }}
                  />
                  <span className="text-espresso font-medium">{item.name}</span>
                </div>
                <span className="font-mono font-bold text-espresso-muted">{item.value} contracts</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Bottom Summary Table: Segment Breakdown */}
        <Card className="lg:col-span-2 p-0 overflow-hidden flex flex-col justify-between">
          <div className="p-4 bg-champagne-light border-b border-stone-warm flex items-center justify-between">
            <div>
              <h4 className="font-display text-base font-bold text-espresso">
                Cohort Breakdown by Account Tier
              </h4>
              <p className="text-xs text-espresso-muted">Retention performance across Enterprise, Growth, and Starter contracts.</p>
            </div>
            <span className="text-xs font-mono text-stone-500 font-semibold">{reportPeriod}</span>
          </div>

          <div className="overflow-x-auto flex-1">
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

          <div className="p-3 bg-champagne/30 border-t border-stone-warm/60 flex items-center justify-between text-[11px] text-espresso-muted">
            <span>Calculated via Subscript Revenue Intelligence Pipeline</span>
            <span className="font-semibold text-cherry-dark">100% Reconciliation Accuracy</span>
          </div>
        </Card>
      </div>
    </div>
  );
};
