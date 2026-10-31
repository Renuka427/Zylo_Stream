import React, { useState } from 'react';
import {
  Tag,
  Plus,
  Percent,
  DollarSign,
  Copy,
  Check,
  Calendar,
  Layers,
  Sparkles
} from 'lucide-react';
import { useMockData } from '../../contexts/MockDataContext';
import { useToast } from '../../contexts/ToastContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { EmptyState } from '../../components/ui/EmptyState';

export const DiscountsPage = () => {
  const { discounts, addDiscount } = useMockData();
  const { showToast } = useToast();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [copiedCode, setCopiedCode] = useState(null);

  // Form State
  const [form, setForm] = useState({
    code: '',
    name: '',
    type: 'percentage',
    value: 20,
    minPurchase: 500,
    validUntil: '2026-12-31',
    usageLimit: 50,
    applicableProducts: 'All Products'
  });

  const handleCopy = (code) => {
    navigator.clipboard?.writeText(code);
    setCopiedCode(code);
    showToast(`Coupon code ${code} copied to clipboard!`);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const handleCreate = (e) => {
    e.preventDefault();
    if (!form.code) return;

    addDiscount({
      ...form,
      code: form.code.toUpperCase().replace(/\s+/g, ''),
      applicableProducts: form.applicableProducts.split(',').map((p) => p.trim())
    });

    setIsCreateModalOpen(false);
    setForm({
      code: '',
      name: '',
      type: 'percentage',
      value: 20,
      minPurchase: 500,
      validUntil: '2026-12-31',
      usageLimit: 50,
      applicableProducts: 'All Products'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-stone-warm/60">
        <div>
          <span className="text-xs uppercase font-bold tracking-widest text-champagne-gold">
            Promotions & Incentives
          </span>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-espresso tracking-tight mt-0.5">
            Discount Rules & Vouchers
          </h1>
          <p className="text-xs text-espresso-muted mt-1">
            Coupon campaign codes, percentage deductions, flat credits, and redemptions.
          </p>
        </div>

        <Button
          variant="primary"
          icon={Plus}
          onClick={() => setIsCreateModalOpen(true)}
        >
          Create Voucher
        </Button>
      </div>

      {/* Discounts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {discounts.map((disc) => {
          const isPercentage = disc.type === 'percentage';
          const percentUsed = Math.min(100, Math.round((disc.usageCount / disc.usageLimit) * 100));

          return (
            <Card key={disc.id} hover className="flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-champagne font-mono font-bold text-xs text-cherry-dark border border-stone-warm">
                    <Tag className="w-3.5 h-3.5 text-cherry" />
                    {disc.code}
                  </span>
                  <Badge status={disc.status} />
                </div>

                <div>
                  <h3 className="font-display text-lg font-bold text-espresso">
                    {disc.name}
                  </h3>
                  <div className="flex items-baseline gap-1 mt-1 text-cherry-dark font-black font-display text-2xl">
                    {isPercentage ? `${disc.value}% OFF` : `$${disc.value} OFF`}
                  </div>
                </div>

                {/* Terms and Restrictions */}
                <div className="p-3 rounded-xl bg-champagne-light border border-stone-warm text-xs space-y-1.5">
                  <div className="flex justify-between text-espresso-muted">
                    <span>Min Purchase:</span>
                    <span className="font-semibold text-espresso">
                      {disc.minPurchase > 0 ? `$${disc.minPurchase}` : 'No minimum'}
                    </span>
                  </div>
                  <div className="flex justify-between text-espresso-muted">
                    <span>Valid Until:</span>
                    <span className="font-semibold text-stone-600">{disc.validUntil}</span>
                  </div>
                  <div className="text-[11px] text-espresso-muted pt-1 border-t border-stone-warm/50">
                    Applies to: {Array.isArray(disc.applicableProducts) ? disc.applicableProducts.join(', ') : disc.applicableProducts}
                  </div>
                </div>

                {/* Usage Limit Bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] text-espresso-muted">
                    <span>Redemptions</span>
                    <span className="font-mono font-bold text-espresso">
                      {disc.usageCount} / {disc.usageLimit}
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-stone-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-cherry rounded-full"
                      style={{ width: `${percentUsed}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-3 border-t border-stone-warm">
                <Button
                  variant="secondary"
                  size="sm"
                  className="w-full text-xs"
                  icon={copiedCode === disc.code ? Check : Copy}
                  onClick={() => handleCopy(disc.code)}
                >
                  {copiedCode === disc.code ? 'Copied to Clipboard!' : 'Copy Coupon Code'}
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Create Discount Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create Promotional Discount"
        subtitle="Establish coupon rules, usage limits, and redemption criteria."
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-espresso mb-1">Coupon Code</label>
              <input
                type="text"
                required
                value={form.code}
                onChange={(e) => setForm({ ...form, code: e.target.value })}
                className="w-full bg-ivory text-espresso text-sm p-2.5 rounded-xl border border-stone-warm focus:outline-none focus:border-cherry font-mono uppercase"
                placeholder="e.g. VIPANNUAL30"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-espresso mb-1">Promotion Name</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full bg-ivory text-espresso text-sm p-2.5 rounded-xl border border-stone-warm focus:outline-none focus:border-cherry"
                placeholder="e.g. Executive Partner Discount"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-espresso mb-1">Discount Type</label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="w-full bg-ivory text-espresso text-sm p-2.5 rounded-xl border border-stone-warm focus:outline-none focus:border-cherry"
              >
                <option value="percentage">Percentage (%) Off</option>
                <option value="fixed">Fixed Dollar ($) Off</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-espresso mb-1">
                Value ({form.type === 'percentage' ? '%' : '$'})
              </label>
              <input
                type="number"
                required
                value={form.value}
                onChange={(e) => setForm({ ...form, value: Number(e.target.value) })}
                className="w-full bg-ivory text-espresso text-sm p-2.5 rounded-xl border border-stone-warm focus:outline-none focus:border-cherry font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-espresso mb-1">Minimum Purchase ($)</label>
              <input
                type="number"
                value={form.minPurchase}
                onChange={(e) => setForm({ ...form, minPurchase: Number(e.target.value) })}
                className="w-full bg-ivory text-espresso text-sm p-2.5 rounded-xl border border-stone-warm focus:outline-none focus:border-cherry font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-espresso mb-1">Usage Limit (Max Uses)</label>
              <input
                type="number"
                value={form.usageLimit}
                onChange={(e) => setForm({ ...form, usageLimit: Number(e.target.value) })}
                className="w-full bg-ivory text-espresso text-sm p-2.5 rounded-xl border border-stone-warm focus:outline-none focus:border-cherry font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-espresso mb-1">Expiration Date</label>
              <input
                type="date"
                required
                value={form.validUntil}
                onChange={(e) => setForm({ ...form, validUntil: e.target.value })}
                className="w-full bg-ivory text-espresso text-sm p-2.5 rounded-xl border border-stone-warm focus:outline-none focus:border-cherry"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-espresso mb-1">Applicable Products</label>
              <input
                type="text"
                value={form.applicableProducts}
                onChange={(e) => setForm({ ...form, applicableProducts: e.target.value })}
                className="w-full bg-ivory text-espresso text-sm p-2.5 rounded-xl border border-stone-warm focus:outline-none focus:border-cherry"
                placeholder="All Products or specific plan name"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-warm">
            <Button type="button" variant="secondary" onClick={() => setIsCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Publish Voucher
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
