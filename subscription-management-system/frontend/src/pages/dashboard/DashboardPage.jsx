import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import {
  RefreshCw,
  DollarSign,
  CreditCard,
  AlertOctagon,
  Plus,
  ArrowRight,
  TrendingUp,
  Receipt,
  Clock,
  ExternalLink,
  CheckCircle2,
  Calendar
} from 'lucide-react';
import { useMockData } from '../../contexts/MockDataContext';
import { StatCard } from '../../components/ui/StatCard';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';

export const DashboardPage = () => {
  const navigate = useNavigate();
  const {
    kpis,
    subscriptions,
    invoices,
    customers,
    plans,
    revenueTrends,
    statusDistribution,
    activityLog,
    addSubscription,
    renewSubscription
  } = useMockData();

  const [dateRange, setDateRange] = useState('Last 6 Months');
  const [isNewSubModalOpen, setIsNewSubModalOpen] = useState(false);

  // New Subscription Form State
  const [newSubForm, setNewSubForm] = useState({
    customerId: customers[0]?.id || '',
    customerName: customers[0]?.name || '',
    planId: plans[0]?.id || '',
    planName: plans[0]?.name || '',
    amount: plans[0]?.price || 499,
    billingCycle: 'Monthly',
    paymentMethod: 'Credit Card (Default)'
  });

  const handleCreateSubscription = (e) => {
    e.preventDefault();
    const cust = customers.find((c) => c.id === newSubForm.customerId);
    const pln = plans.find((p) => p.id === newSubForm.planId);

    addSubscription({
      ...newSubForm,
      customerName: cust ? cust.name : newSubForm.customerName,
      planName: pln ? pln.name : newSubForm.planName,
      amount: pln ? pln.price : newSubForm.amount,
      renewalDate: '2026-11-30'
    });
    setIsNewSubModalOpen(false);
  };

  // Upcoming renewals
  const upcomingRenewals = subscriptions
    .filter((s) => s.status === 'active')
    .slice(0, 4);

  // Recent invoices
  const recentInvoices = invoices.slice(0, 5);

  return (
    <div className="space-y-8">
      {/* 1. Dashboard Heading & Action Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-2 border-b border-stone-warm/60">
        <div>
          <span className="text-xs uppercase font-bold tracking-widest text-champagne-gold">
            Executive Pulse
          </span>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-espresso tracking-tight mt-0.5">
            Your business, in rhythm.
          </h1>
          <p className="text-sm text-espresso-muted mt-1">
            Everything recurring. Everything under control.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-ivory border border-stone-warm text-xs text-espresso shadow-sm">
            <Calendar className="w-3.5 h-3.5 text-champagne-gold" />
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="bg-transparent font-medium focus:outline-none cursor-pointer"
            >
              <option value="Last 30 Days">Last 30 Days</option>
              <option value="Last 6 Months">Last 6 Months</option>
              <option value="Year to Date">Year to Date</option>
            </select>
          </div>

          <Button
            variant="primary"
            icon={Plus}
            onClick={() => setIsNewSubModalOpen(true)}
          >
            New Subscription
          </Button>
        </div>
      </div>

      {/* 2. Four Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
        <StatCard
          title="Active Subscriptions"
          value={kpis.activeSubscriptionsCount}
          delta={kpis.activeSubsDelta}
          icon={RefreshCw}
          accentColor="cherry"
          subtitle="Customer retention: 98.2%"
        />
        <StatCard
          title="Monthly Recurring Rev."
          value={kpis.mrrFormatted}
          delta={kpis.mrrDelta}
          icon={DollarSign}
          accentColor="gold"
          subtitle="ARR run rate: $330.6k"
        />
        <StatCard
          title="Outstanding Payments"
          value={kpis.outstandingFormatted}
          delta={kpis.outstandingDelta}
          isPositive={true}
          icon={CreditCard}
          accentColor="darkCherry"
          subtitle="Net-30 invoiced balances"
        />
        <StatCard
          title="Overdue Invoices"
          value={kpis.overdueInvoicesCount}
          delta={kpis.overdueDelta}
          isPositive={kpis.overdueInvoicesCount === 0}
          icon={AlertOctagon}
          accentColor={kpis.overdueInvoicesCount > 0 ? 'cherry' : 'gold'}
          subtitle="Dunning automation active"
        />
      </div>

      {/* 3. Visual Charts Section: Revenue Analytics & Subscription Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Analytics (Recharts AreaChart) */}
        <Card className="lg:col-span-2 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-stone-warm/60">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-champagne-gold">
                Financial Trajectory
              </span>
              <h3 className="font-display text-lg font-bold text-espresso">
                Revenue Trends & Forecast
              </h3>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1.5 text-espresso">
                <span className="w-2.5 h-2.5 rounded-full bg-cherry" />
                Current Cycle
              </span>
              <span className="flex items-center gap-1.5 text-espresso-muted">
                <span className="w-2.5 h-2.5 rounded-full bg-champagne-gold" />
                Previous Period
              </span>
            </div>
          </div>

          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueTrends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="currentRevGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#C41E3A" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#C41E3A" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="prevRevGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#D6B779" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#D6B779" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5D4B8" opacity={0.6} />
                <XAxis
                  dataKey="month"
                  tick={{ fill: '#82766F', fontSize: 11 }}
                  axisLine={{ stroke: '#E5D4B8' }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: '#82766F', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(val) => `$${val / 1000}k`}
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-ivory p-3 rounded-xl border border-stone-warm shadow-luxury text-xs space-y-1">
                          <p className="font-bold text-espresso font-serif">{label}</p>
                          <p className="text-cherry font-semibold">
                            Current: ${payload[0]?.value?.toLocaleString()}
                          </p>
                          <p className="text-[#8C621E]">
                            Previous: ${payload[1]?.value?.toLocaleString()}
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="currentPeriod"
                  stroke="#C41E3A"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#currentRevGrad)"
                />
                <Area
                  type="monotone"
                  dataKey="previousPeriod"
                  stroke="#D6B779"
                  strokeWidth={1.5}
                  strokeDasharray="4 4"
                  fillOpacity={1}
                  fill="url(#prevRevGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Subscription Status Distribution (PieChart) */}
        <Card className="space-y-4">
          <div className="pb-2 border-b border-stone-warm/60">
            <span className="text-[10px] uppercase font-bold tracking-wider text-champagne-gold">
              Portfolio Health
            </span>
            <h3 className="font-display text-lg font-bold text-espresso">
              Subscription Status
            </h3>
          </div>

          <div className="h-52 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {statusDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val, name) => [`${val}% of subscribers`, name]}
                  contentStyle={{ backgroundColor: '#FFFAF2', borderColor: '#E5D4B8', borderRadius: 12, fontSize: 12 }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs pt-1">
            {statusDistribution.map((item) => (
              <div key={item.name} className="flex items-center gap-2 p-1.5 rounded-lg bg-champagne/40">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                <span className="text-espresso font-medium">{item.name}</span>
                <span className="ml-auto text-espresso-muted font-mono">{item.value}%</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* 4. Bottom Grid: Recent Invoices & Upcoming Renewals / Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Invoices Table (2 cols) */}
        <Card className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-stone-warm/60">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-champagne-gold">
                Ledger Activity
              </span>
              <h3 className="font-display text-lg font-bold text-espresso">
                Recent Invoices
              </h3>
            </div>
            <Button
              variant="secondary"
              size="sm"
              icon={ArrowRight}
              onClick={() => navigate('/invoices')}
            >
              All Invoices
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-stone-warm text-espresso-muted uppercase font-semibold">
                  <th className="py-2.5 px-3">Invoice</th>
                  <th className="py-2.5 px-3">Customer</th>
                  <th className="py-2.5 px-3">Due Date</th>
                  <th className="py-2.5 px-3 text-right">Amount</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-warm/60">
                {recentInvoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-champagne/30 transition-colors">
                    <td className="py-3 px-3 font-mono font-medium text-cherry-dark">
                      {inv.invoiceNumber}
                    </td>
                    <td className="py-3 px-3 font-medium text-espresso">
                      {inv.customerName}
                    </td>
                    <td className="py-3 px-3 text-espresso-muted">
                      {inv.dueDate}
                    </td>
                    <td className="py-3 px-3 text-right font-medium text-espresso font-mono">
                      ${inv.total?.toLocaleString()}
                    </td>
                    <td className="py-3 px-3">
                      <Badge status={inv.status} />
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => navigate('/invoices')}
                        className="text-cherry hover:text-cherry-hover font-semibold text-xs inline-flex items-center gap-1"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Upcoming Renewals & Recent Activity (1 col) */}
        <div className="space-y-6">
          {/* Upcoming Renewals */}
          <Card className="space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-stone-warm/60">
              <h4 className="font-display text-base font-bold text-espresso">
                Upcoming Renewals
              </h4>
              <button
                onClick={() => navigate('/subscriptions')}
                className="text-xs text-cherry hover:underline font-semibold"
              >
                View Ledger
              </button>
            </div>

            <div className="space-y-2.5">
              {upcomingRenewals.map((sub) => (
                <div
                  key={sub.id}
                  className="p-3 rounded-xl bg-champagne-light border border-stone-warm flex items-center justify-between gap-3"
                >
                  <div className="space-y-0.5 overflow-hidden">
                    <p className="text-xs font-bold text-espresso truncate">
                      {sub.customerName}
                    </p>
                    <p className="text-[11px] text-espresso-muted">
                      {sub.planName} &bull; <span className="font-mono">${sub.amount}/mo</span>
                    </p>
                    <p className="text-[10px] text-stone-500 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-champagne-gold" />
                      Renews: {sub.renewalDate}
                    </p>
                  </div>

                  <Button
                    variant="secondary"
                    size="sm"
                    className="text-[11px] px-2.5 py-1 shrink-0"
                    onClick={() => renewSubscription(sub.id)}
                  >
                    Renew
                  </Button>
                </div>
              ))}
            </div>
          </Card>

          {/* Recent Activity Timeline */}
          <Card className="space-y-3">
            <div className="pb-2 border-b border-stone-warm/60">
              <h4 className="font-display text-base font-bold text-espresso">
                Live Activity Timeline
              </h4>
            </div>

            <div className="space-y-3">
              {activityLog.slice(0, 4).map((act) => (
                <div key={act.id} className="flex items-start gap-3 text-xs">
                  <div className="w-2 h-2 rounded-full bg-cherry mt-1.5 shrink-0" />
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-espresso">{act.title}</span>
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-champagne-gold/20 text-[#8C621E] uppercase font-bold">
                        {act.badge}
                      </span>
                    </div>
                    <p className="text-espresso-muted text-[11px] leading-snug">
                      {act.description}
                    </p>
                    <span className="text-[10px] text-stone-400 block">{act.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Modal: Create New Subscription */}
      <Modal
        isOpen={isNewSubModalOpen}
        onClose={() => setIsNewSubModalOpen(false)}
        title="Create New Subscription"
        subtitle="Provision a recurring subscription contract for an existing customer."
      >
        <form onSubmit={handleCreateSubscription} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-espresso mb-1">
              Select Customer
            </label>
            <select
              value={newSubForm.customerId}
              onChange={(e) => {
                const c = customers.find((cust) => cust.id === e.target.value);
                setNewSubForm({
                  ...newSubForm,
                  customerId: e.target.value,
                  customerName: c ? c.name : ''
                });
              }}
              className="w-full bg-ivory text-espresso text-sm p-2.5 rounded-xl border border-stone-warm focus:outline-none focus:border-cherry"
            >
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.contactPerson})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-espresso mb-1">
              Select Pricing Plan
            </label>
            <select
              value={newSubForm.planId}
              onChange={(e) => {
                const p = plans.find((pl) => pl.id === e.target.value);
                setNewSubForm({
                  ...newSubForm,
                  planId: e.target.value,
                  planName: p ? p.name : '',
                  amount: p ? p.price : 499
                });
              }}
              className="w-full bg-ivory text-espresso text-sm p-2.5 rounded-xl border border-stone-warm focus:outline-none focus:border-cherry"
            >
              {plans.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} — ${p.price} / {p.billingInterval}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-espresso mb-1">
                Billing Cycle
              </label>
              <select
                value={newSubForm.billingCycle}
                onChange={(e) => setNewSubForm({ ...newSubForm, billingCycle: e.target.value })}
                className="w-full bg-ivory text-espresso text-sm p-2.5 rounded-xl border border-stone-warm focus:outline-none focus:border-cherry"
              >
                <option value="Monthly">Monthly</option>
                <option value="Quarterly">Quarterly</option>
                <option value="Yearly">Yearly</option>
                <option value="Weekly">Weekly</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-espresso mb-1">
                Monthly Amount ($)
              </label>
              <input
                type="number"
                value={newSubForm.amount}
                onChange={(e) => setNewSubForm({ ...newSubForm, amount: Number(e.target.value) })}
                className="w-full bg-ivory text-espresso text-sm p-2.5 rounded-xl border border-stone-warm focus:outline-none focus:border-cherry font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-espresso mb-1">
              Payment Method Token
            </label>
            <input
              type="text"
              value={newSubForm.paymentMethod}
              onChange={(e) => setNewSubForm({ ...newSubForm, paymentMethod: e.target.value })}
              className="w-full bg-ivory text-espresso text-sm p-2.5 rounded-xl border border-stone-warm focus:outline-none focus:border-cherry"
              placeholder="e.g. ACH •••• 9912 or Visa •••• 4242"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-warm">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsNewSubModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Confirm & Activate Subscription
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
