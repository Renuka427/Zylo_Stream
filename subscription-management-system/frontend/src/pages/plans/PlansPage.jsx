import React, { useState } from 'react';
import {
  Layers,
  Plus,
  Check,
  Calendar,
  Clock,
  Sparkles,
  Shield,
  Zap,
  ArrowRight
} from 'lucide-react';
import { useMockData } from '../../contexts/MockDataContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';

export const PlansPage = () => {
  const { plans, products, addPlan } = useMockData();
  const [intervalFilter, setIntervalFilter] = useState('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Form State
  const [form, setForm] = useState({
    name: '',
    productId: products[0]?.id || '',
    billingInterval: 'monthly',
    price: 990,
    minQuantity: 1,
    availabilityDates: '2024-01-01 - Open',
    renewalConfig: 'Auto-renewal with 14-day notice',
    features: 'Up to 2,000 subscribers, Dedicated account rep, Priority SLA'
  });

  const filteredPlans = plans.filter(
    (p) => intervalFilter === 'all' || p.billingInterval.toLowerCase() === intervalFilter.toLowerCase()
  );

  const handleCreate = (e) => {
    e.preventDefault();
    addPlan({
      ...form,
      features: form.features.split(',').map((f) => f.trim())
    });
    setIsCreateModalOpen(false);
    setForm({
      name: '',
      productId: products[0]?.id || '',
      billingInterval: 'monthly',
      price: 990,
      minQuantity: 1,
      availabilityDates: '2024-01-01 - Open',
      renewalConfig: 'Auto-renewal with 14-day notice',
      features: 'Up to 2,000 subscribers, Dedicated account rep, Priority SLA'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-stone-warm/60">
        <div>
          <span className="text-xs uppercase font-bold tracking-widest text-champagne-gold">
            Pricing Architecture
          </span>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-espresso tracking-tight mt-0.5">
            Subscription Plans
          </h1>
          <p className="text-xs text-espresso-muted mt-1">
            Configure flexible billing cadences across daily, weekly, monthly, and annual terms.
          </p>
        </div>

        <Button
          variant="primary"
          icon={Plus}
          onClick={() => setIsCreateModalOpen(true)}
        >
          Create Pricing Plan
        </Button>
      </div>

      {/* Interval Selector Tabs */}
      <div className="flex items-center justify-center sm:justify-start">
        <div className="flex items-center gap-1.5 p-1 bg-ivory border border-stone-warm rounded-2xl shadow-sm text-xs">
          {['all', 'monthly', 'yearly', 'weekly', 'daily'].map((intv) => (
            <button
              key={intv}
              onClick={() => setIntervalFilter(intv)}
              className={`px-4 py-2 rounded-xl capitalize font-medium transition-all ${
                intervalFilter === intv
                  ? 'bg-cherry text-ivory font-bold shadow-sm'
                  : 'text-espresso-muted hover:text-espresso'
              }`}
            >
              {intv === 'all' ? 'All Intervals' : `${intv} Billing`}
            </button>
          ))}
        </div>
      </div>

      {/* Pricing Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPlans.map((plan) => {
          return (
            <Card
              key={plan.id}
              hover
              className={`flex flex-col justify-between space-y-6 relative overflow-hidden ${
                plan.highlighted ? 'border-2 border-cherry bg-ivory-surface shadow-luxury' : ''
              }`}
            >
              {plan.highlighted && (
                <div className="absolute top-0 right-0 bg-cherry text-ivory text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-bl-xl shadow-sm">
                  Recommended
                </div>
              )}

              <div className="space-y-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-champagne-gold/20 text-[#8C621E] border border-champagne-gold/40">
                      {plan.billingInterval}
                    </span>
                    <span className="text-[11px] text-stone-500 font-medium">
                      Min Qty: {plan.minQuantity}
                    </span>
                  </div>
                  <h3 className="font-display text-xl font-bold text-espresso mt-1">
                    {plan.name}
                  </h3>
                </div>

                {/* Price Display */}
                <div className="flex items-baseline gap-1.5 pb-4 border-b border-stone-warm/60">
                  <span className="font-display text-4xl font-black text-cherry-dark tracking-tight">
                    ${plan.price}
                  </span>
                  <span className="text-xs text-espresso-muted">
                    / {plan.billingInterval}
                  </span>
                </div>

                {/* Feature Bullet Points */}
                <div className="space-y-2.5">
                  <span className="text-[11px] uppercase font-bold text-espresso-muted tracking-wider block">
                    Tier Inclusions
                  </span>
                  <ul className="space-y-2 text-xs">
                    {plan.features?.map((f, i) => (
                      <li key={i} className="flex items-start gap-2 text-espresso">
                        <Check className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Renewal Terms & Card Footer */}
              <div className="pt-4 border-t border-stone-warm space-y-3">
                <div className="p-2.5 rounded-xl bg-champagne/40 border border-stone-warm text-[11px] space-y-1">
                  <p className="text-espresso-muted flex items-center gap-1 font-medium">
                    <Clock className="w-3 h-3 text-champagne-gold" />
                    {plan.renewalConfig}
                  </p>
                  <p className="text-stone-500 text-[10px]">
                    Valid: {plan.availabilityDates}
                  </p>
                </div>

                <Button
                  variant={plan.highlighted ? 'primary' : 'secondary'}
                  className="w-full text-xs"
                >
                  Configure Contracts
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Create Plan Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create Subscription Plan"
        subtitle="Establish billing rules, renewal terms, and tiered pricing."
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-espresso mb-1">Plan Title</label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full bg-ivory text-espresso text-sm p-2.5 rounded-xl border border-stone-warm focus:outline-none focus:border-cherry"
              placeholder="e.g. Enterprise Global Scale"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-espresso mb-1">Billing Interval</label>
              <select
                value={form.billingInterval}
                onChange={(e) => setForm({ ...form, billingInterval: e.target.value })}
                className="w-full bg-ivory text-espresso text-sm p-2.5 rounded-xl border border-stone-warm focus:outline-none focus:border-cherry"
              >
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
                <option value="weekly">Weekly</option>
                <option value="daily">Daily</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-espresso mb-1">Price ($)</label>
              <input
                type="number"
                required
                value={form.price}
                onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                className="w-full bg-ivory text-espresso text-sm p-2.5 rounded-xl border border-stone-warm focus:outline-none focus:border-cherry font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-espresso mb-1">Minimum Seats / Quantity</label>
              <input
                type="number"
                value={form.minQuantity}
                onChange={(e) => setForm({ ...form, minQuantity: Number(e.target.value) })}
                className="w-full bg-ivory text-espresso text-sm p-2.5 rounded-xl border border-stone-warm focus:outline-none focus:border-cherry font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-espresso mb-1">Availability Window</label>
              <input
                type="text"
                value={form.availabilityDates}
                onChange={(e) => setForm({ ...form, availabilityDates: e.target.value })}
                className="w-full bg-ivory text-espresso text-sm p-2.5 rounded-xl border border-stone-warm focus:outline-none focus:border-cherry"
                placeholder="2024-01-01 - Open"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-espresso mb-1">Renewal Configuration Policy</label>
            <input
              type="text"
              value={form.renewalConfig}
              onChange={(e) => setForm({ ...form, renewalConfig: e.target.value })}
              className="w-full bg-ivory text-espresso text-sm p-2.5 rounded-xl border border-stone-warm focus:outline-none focus:border-cherry"
              placeholder="e.g. Auto-renewal with 14-day notice"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-espresso mb-1">Feature Bullet Points (comma-separated)</label>
            <textarea
              rows={2}
              value={form.features}
              onChange={(e) => setForm({ ...form, features: e.target.value })}
              className="w-full bg-ivory text-espresso text-sm p-2.5 rounded-xl border border-stone-warm focus:outline-none focus:border-cherry"
              placeholder="Unlimited nodes, Dedicated account rep, 24/7 SLA"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-warm">
            <Button type="button" variant="secondary" onClick={() => setIsCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Publish Plan
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
