import React, { useState, useMemo } from 'react';
import {
  Tag,
  Plus,
  Percent,
  DollarSign,
  Copy,
  Check,
  Calendar,
  Layers,
  Sparkles,
  Edit2,
  Trash2,
  Power,
  PowerOff,
  Filter
} from 'lucide-react';
import { useMockData } from '../../contexts/MockDataContext';
import { useToast } from '../../contexts/ToastContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { SearchInput } from '../../components/ui/SearchInput';
import { EmptyState } from '../../components/ui/EmptyState';

export const DiscountsPage = () => {
  const { discounts, addDiscount, updateDiscount, toggleDiscountStatus, deleteDiscount } = useMockData();
  const { showToast } = useToast();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedDiscount, setSelectedDiscount] = useState(null);
  const [discountToDelete, setDiscountToDelete] = useState(null);
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

  const handleOpenCreate = () => {
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
    setIsCreateModalOpen(true);
  };

  const handleOpenEdit = (disc) => {
    setSelectedDiscount(disc);
    setForm({
      code: disc.code,
      name: disc.name,
      type: disc.type || 'percentage',
      value: disc.value || 0,
      minPurchase: disc.minPurchase || 0,
      validUntil: disc.validUntil || '2026-12-31',
      usageLimit: disc.usageLimit || 50,
      applicableProducts: Array.isArray(disc.applicableProducts)
        ? disc.applicableProducts.join(', ')
        : disc.applicableProducts || 'All Products'
    });
    setIsEditModalOpen(true);
  };

  const handleCreate = (e) => {
    e.preventDefault();
    if (!form.code) return;

    // Validation
    const cleanValue = form.type === 'percentage'
      ? Math.min(100, Math.max(1, Number(form.value) || 1))
      : Math.max(1, Number(form.value) || 1);

    addDiscount({
      ...form,
      value: cleanValue,
      code: form.code.toUpperCase().replace(/\s+/g, ''),
      applicableProducts: form.applicableProducts.split(',').map((p) => p.trim())
    });

    setIsCreateModalOpen(false);
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    if (!selectedDiscount) return;

    const cleanValue = form.type === 'percentage'
      ? Math.min(100, Math.max(1, Number(form.value) || 1))
      : Math.max(1, Number(form.value) || 1);

    updateDiscount(selectedDiscount.id, {
      ...form,
      value: cleanValue,
      code: form.code.toUpperCase().replace(/\s+/g, ''),
      applicableProducts: form.applicableProducts.split(',').map((p) => p.trim())
    });

    setIsEditModalOpen(false);
    setSelectedDiscount(null);
  };

  const confirmDelete = () => {
    if (discountToDelete) {
      deleteDiscount(discountToDelete.id);
      setDiscountToDelete(null);
    }
  };

  // Filtered vouchers
  const filteredDiscounts = useMemo(() => {
    return discounts.filter((d) => {
      const matchesSearch =
        d.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.name.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === 'ALL' ||
        (d.status && d.status.toLowerCase() === statusFilter.toLowerCase());

      return matchesSearch && matchesStatus;
    });
  }, [discounts, searchTerm, statusFilter]);

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
          onClick={handleOpenCreate}
        >
          Create Voucher
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          <SearchInput
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search vouchers by coupon code or campaign name..."
            className="w-full sm:max-w-md"
          />

          <div className="flex items-center gap-2">
            <span className="text-xs text-stone-500 font-medium">Status:</span>
            <div className="flex rounded-xl bg-champagne-light p-1 border border-stone-warm">
              {['ALL', 'Active', 'Expired'].map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                    statusFilter === st
                      ? 'bg-cherry text-ivory shadow-sm'
                      : 'text-espresso hover:text-cherry'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Discounts Grid */}
      {filteredDiscounts.length === 0 ? (
        <EmptyState
          title="No promotional vouchers found"
          description="Try adjusting your search criteria or create a new campaign coupon."
          actionLabel="Create Voucher"
          onAction={handleOpenCreate}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredDiscounts.map((disc) => {
            const isPercentage = disc.type === 'percentage';
            const percentUsed = Math.min(100, Math.round(((disc.usageCount || 0) / (disc.usageLimit || 1)) * 100));
            const isActive = disc.status === 'Active';

            return (
              <Card
                key={disc.id}
                className={`flex flex-col justify-between space-y-4 border transition-all ${
                  isActive ? 'border-stone-warm bg-ivory' : 'border-stone-warm/50 bg-stone-100/50 opacity-80'
                }`}
              >
                <div className="space-y-3">
                  {/* Top Bar */}
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-champagne font-mono font-bold text-xs text-cherry-dark border border-stone-warm">
                      <Tag className="w-3.5 h-3.5 text-cherry" />
                      {disc.code}
                    </span>
                    
                    <div className="flex items-center gap-2">
                      <Badge status={disc.status} />
                      <button
                        type="button"
                        onClick={() => toggleDiscountStatus(disc.id)}
                        className={`p-1 rounded-lg transition-colors ${
                          isActive
                            ? 'text-emerald-700 hover:bg-emerald-100'
                            : 'text-stone-400 hover:bg-stone-200'
                        }`}
                        title={isActive ? 'Deactivate voucher' : 'Activate voucher'}
                      >
                        {isActive ? <Power className="w-3.5 h-3.5" /> : <PowerOff className="w-3.5 h-3.5" />}
                      </button>
                    </div>
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
                        {disc.usageCount || 0} / {disc.usageLimit || 50}
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-stone-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-cherry rounded-full transition-all"
                        style={{ width: `${percentUsed}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-3 border-t border-stone-warm flex items-center gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="flex-1 text-xs"
                    icon={copiedCode === disc.code ? Check : Copy}
                    onClick={() => handleCopy(disc.code)}
                  >
                    {copiedCode === disc.code ? 'Copied!' : 'Copy Code'}
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="p-1.5 text-stone-500 hover:text-cherry"
                    onClick={() => handleOpenEdit(disc)}
                    title="Edit voucher"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="p-1.5 text-stone-400 hover:text-rose-600"
                    onClick={() => setDiscountToDelete(disc)}
                    title="Delete voucher"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Create Discount Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create Promotional Voucher"
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
                min="1"
                max={form.type === 'percentage' ? '100' : '99999'}
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
                min="0"
                value={form.minPurchase}
                onChange={(e) => setForm({ ...form, minPurchase: Number(e.target.value) })}
                className="w-full bg-ivory text-espresso text-sm p-2.5 rounded-xl border border-stone-warm focus:outline-none focus:border-cherry font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-espresso mb-1">Usage Limit (Max Uses)</label>
              <input
                type="number"
                min="1"
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

      {/* Edit Discount Modal */}
      {selectedDiscount && (
        <Modal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedDiscount(null);
          }}
          title={`Edit Voucher: ${selectedDiscount.code}`}
          subtitle="Modify redemption parameters or discount percentages."
        >
          <form onSubmit={handleUpdate} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-espresso mb-1">Coupon Code</label>
                <input
                  type="text"
                  required
                  value={form.code}
                  onChange={(e) => setForm({ ...form, code: e.target.value })}
                  className="w-full bg-ivory text-espresso text-sm p-2.5 rounded-xl border border-stone-warm focus:outline-none focus:border-cherry font-mono uppercase"
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
                  min="1"
                  max={form.type === 'percentage' ? '100' : '99999'}
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
                  min="0"
                  value={form.minPurchase}
                  onChange={(e) => setForm({ ...form, minPurchase: Number(e.target.value) })}
                  className="w-full bg-ivory text-espresso text-sm p-2.5 rounded-xl border border-stone-warm focus:outline-none focus:border-cherry font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-espresso mb-1">Usage Limit (Max Uses)</label>
                <input
                  type="number"
                  min="1"
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
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-warm">
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  setIsEditModalOpen(false);
                  setSelectedDiscount(null);
                }}
              >
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                Save Changes
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!discountToDelete}
        onClose={() => setDiscountToDelete(null)}
        onConfirm={confirmDelete}
        title="Delete Promotional Voucher"
        message={`Are you sure you want to permanently delete coupon ${discountToDelete?.code}? Any existing orders already using this code will not be modified.`}
        confirmLabel="Delete Coupon"
        variant="danger"
      />
    </div>
  );
};
