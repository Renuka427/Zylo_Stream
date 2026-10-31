import React, { useState, useMemo } from 'react';
import {
  RefreshCw,
  Plus,
  Search,
  Filter,
  Play,
  Pause,
  RotateCw,
  XCircle,
  Eye,
  CheckCircle2,
  Calendar,
  CreditCard,
  Building
} from 'lucide-react';
import { useMockData } from '../../contexts/MockDataContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { SearchInput } from '../../components/ui/SearchInput';
import { Modal } from '../../components/ui/Modal';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { EmptyState } from '../../components/ui/EmptyState';

export const SubscriptionsPage = () => {
  const {
    subscriptions,
    customers,
    plans,
    addSubscription,
    updateSubscriptionStatus,
    renewSubscription
  } = useMockData();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedSub, setSelectedSub] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [confirmCancelSubId, setConfirmCancelSubId] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    customerId: customers[0]?.id || '',
    customerName: customers[0]?.name || '',
    planId: plans[0]?.id || '',
    planName: plans[0]?.name || '',
    amount: plans[0]?.price || 499,
    billingCycle: 'Monthly',
    paymentMethod: 'Credit Card (Visa •••• 4242)',
    notes: 'Standard recurring contract.'
  });

  const filteredSubscriptions = useMemo(() => {
    return subscriptions.filter((sub) => {
      const matchesSearch =
        sub.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sub.subscriptionNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sub.planName.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === 'all' || sub.status.toLowerCase() === statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [subscriptions, searchTerm, statusFilter]);

  const handleCreate = (e) => {
    e.preventDefault();
    const cust = customers.find((c) => c.id === formData.customerId);
    const pln = plans.find((p) => p.id === formData.planId);

    addSubscription({
      ...formData,
      customerName: cust ? cust.name : formData.customerName,
      planName: pln ? pln.name : formData.planName,
      amount: pln ? pln.price : formData.amount,
      renewalDate: '2026-11-30'
    });
    setIsCreateModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-stone-warm/60">
        <div>
          <span className="text-xs uppercase font-bold tracking-widest text-champagne-gold">
            Lifecycle Management
          </span>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-espresso tracking-tight mt-0.5">
            Subscriptions Ledger
          </h1>
          <p className="text-xs text-espresso-muted mt-1">
            Manage active contracts, renewal dates, automated debits, and status transitions.
          </p>
        </div>

        <Button
          variant="primary"
          icon={Plus}
          onClick={() => setIsCreateModalOpen(true)}
        >
          Provision Subscription
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <Card className="p-4 space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <SearchInput
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search by customer, plan or subscription number..."
            className="w-full md:max-w-md"
          />

          {/* Status Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-champagne/50 border border-stone-warm rounded-xl text-xs">
            {['all', 'active', 'past_due', 'paused', 'closed'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-lg capitalize font-medium transition-colors ${
                  statusFilter === st
                    ? 'bg-ivory text-cherry-dark font-bold shadow-sm'
                    : 'text-espresso-muted hover:text-espresso'
                }`}
              >
                {st.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Subscriptions Table Card */}
      <Card className="p-0 overflow-hidden">
        {filteredSubscriptions.length === 0 ? (
          <EmptyState
            title="No subscriptions found"
            description="No subscriptions match your search or filter settings."
            actionLabel="Reset Filters"
            onAction={() => {
              setSearchTerm('');
              setStatusFilter('all');
            }}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-champagne/30 border-b border-stone-warm text-espresso-muted uppercase font-semibold">
                  <th className="py-3 px-4">Subscription</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Plan & Tier</th>
                  <th className="py-3 px-4">Cycle</th>
                  <th className="py-3 px-4 text-right">Amount</th>
                  <th className="py-3 px-4">Renewal Date</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-warm/60">
                {filteredSubscriptions.map((sub) => (
                  <tr key={sub.id} className="hover:bg-champagne/20 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-cherry-dark">
                      {sub.subscriptionNumber}
                    </td>
                    <td className="py-3.5 px-4 font-medium text-espresso">
                      {sub.customerName}
                    </td>
                    <td className="py-3.5 px-4 text-espresso-muted">
                      {sub.planName}
                    </td>
                    <td className="py-3.5 px-4 text-espresso-muted">
                      {sub.billingCycle}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-espresso">
                      ${sub.amount?.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 text-stone-500">
                      {sub.renewalDate}
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge status={sub.status} />
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          variant="secondary"
                          size="sm"
                          icon={Eye}
                          onClick={() => {
                            setSelectedSub(sub);
                            setIsDetailModalOpen(true);
                          }}
                        >
                          Manage
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Subscription Detail & Lifecycle Modal */}
      {selectedSub && (
        <Modal
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          title={`Subscription ${selectedSub.subscriptionNumber}`}
          subtitle={`Customer: ${selectedSub.customerName}`}
          maxWidth="max-w-2xl"
        >
          <div className="space-y-6">
            {/* Quick Stat Ribbon */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-xl bg-champagne-light border border-stone-warm text-xs">
              <div>
                <span className="text-espresso-muted block text-[10px] uppercase font-bold">Status</span>
                <Badge status={selectedSub.status} className="mt-1" />
              </div>
              <div>
                <span className="text-espresso-muted block text-[10px] uppercase font-bold">Recurring Amount</span>
                <span className="font-mono font-bold text-sm text-espresso mt-1 block">
                  ${selectedSub.amount}/mo
                </span>
              </div>
              <div>
                <span className="text-espresso-muted block text-[10px] uppercase font-bold">Billing Cycle</span>
                <span className="font-semibold text-espresso mt-1 block">{selectedSub.billingCycle}</span>
              </div>
              <div>
                <span className="text-espresso-muted block text-[10px] uppercase font-bold">Next Renewal</span>
                <span className="font-medium text-stone-600 mt-1 block">{selectedSub.renewalDate}</span>
              </div>
            </div>

            {/* Details Grid */}
            <div className="space-y-3 text-xs">
              <h4 className="font-display text-sm font-bold text-espresso border-b border-stone-warm pb-1">
                Contract Information
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3 rounded-xl bg-ivory border border-stone-warm space-y-1">
                  <span className="text-espresso-muted text-[10px] uppercase font-bold block">Assigned Plan</span>
                  <p className="font-semibold text-espresso">{selectedSub.planName}</p>
                  <p className="text-[11px] text-stone-500">Auto-renewal enabled with 14-day notice.</p>
                </div>

                <div className="p-3 rounded-xl bg-ivory border border-stone-warm space-y-1">
                  <span className="text-espresso-muted text-[10px] uppercase font-bold block">Payment Method</span>
                  <p className="font-semibold text-espresso">{selectedSub.paymentMethod || 'Default Card'}</p>
                  <p className="text-[11px] text-emerald-700 font-medium">Automatic debit enabled.</p>
                </div>
              </div>

              {selectedSub.notes && (
                <div className="p-3 rounded-xl bg-champagne/40 border border-stone-warm">
                  <span className="text-espresso-muted text-[10px] uppercase font-bold block">Internal Notes</span>
                  <p className="text-espresso mt-1">{selectedSub.notes}</p>
                </div>
              )}
            </div>

            {/* Lifecycle Control Actions */}
            <div className="space-y-2 pt-2 border-t border-stone-warm">
              <span className="text-xs font-bold text-espresso block">
                Lifecycle State Actions (Frontend Demo)
              </span>
              <div className="flex flex-wrap items-center gap-2">
                {selectedSub.status === 'active' ? (
                  <Button
                    variant="secondary"
                    size="sm"
                    icon={Pause}
                    onClick={() => {
                      updateSubscriptionStatus(selectedSub.id, 'paused');
                      setSelectedSub({ ...selectedSub, status: 'paused' });
                    }}
                  >
                    Pause Subscription
                  </Button>
                ) : (
                  <Button
                    variant="secondary"
                    size="sm"
                    icon={Play}
                    onClick={() => {
                      updateSubscriptionStatus(selectedSub.id, 'active');
                      setSelectedSub({ ...selectedSub, status: 'active' });
                    }}
                  >
                    Resume Subscription
                  </Button>
                )}

                <Button
                  variant="secondary"
                  size="sm"
                  icon={RotateCw}
                  onClick={() => {
                    renewSubscription(selectedSub.id);
                    setIsDetailModalOpen(false);
                  }}
                >
                  Trigger Renewal Now
                </Button>

                {selectedSub.status !== 'closed' && (
                  <Button
                    variant="danger"
                    size="sm"
                    icon={XCircle}
                    onClick={() => {
                      setConfirmCancelSubId(selectedSub.id);
                    }}
                  >
                    Cancel Subscription
                  </Button>
                )}
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Create Subscription Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Provision New Subscription"
        subtitle="Configure billing frequency, assigned tier, and customer account."
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-espresso mb-1">Customer</label>
            <select
              value={formData.customerId}
              onChange={(e) => {
                const c = customers.find((cust) => cust.id === e.target.value);
                setFormData({
                  ...formData,
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
            <label className="block text-xs font-semibold text-espresso mb-1">Plan Tier</label>
            <select
              value={formData.planId}
              onChange={(e) => {
                const p = plans.find((pl) => pl.id === e.target.value);
                setFormData({
                  ...formData,
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
              <label className="block text-xs font-semibold text-espresso mb-1">Billing Interval</label>
              <select
                value={formData.billingCycle}
                onChange={(e) => setFormData({ ...formData, billingCycle: e.target.value })}
                className="w-full bg-ivory text-espresso text-sm p-2.5 rounded-xl border border-stone-warm focus:outline-none focus:border-cherry"
              >
                <option value="Monthly">Monthly</option>
                <option value="Quarterly">Quarterly</option>
                <option value="Yearly">Yearly</option>
                <option value="Weekly">Weekly</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-espresso mb-1">Amount ($)</label>
              <input
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
                className="w-full bg-ivory text-espresso text-sm p-2.5 rounded-xl border border-stone-warm focus:outline-none focus:border-cherry font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-espresso mb-1">Payment Method</label>
            <input
              type="text"
              value={formData.paymentMethod}
              onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
              className="w-full bg-ivory text-espresso text-sm p-2.5 rounded-xl border border-stone-warm focus:outline-none focus:border-cherry"
              placeholder="e.g. Visa •••• 9912"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-warm">
            <Button type="button" variant="secondary" onClick={() => setIsCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Confirm & Provision
            </Button>
          </div>
        </form>
      </Modal>

      {/* Confirmation Dialog for Cancellation */}
      <ConfirmDialog
        isOpen={Boolean(confirmCancelSubId)}
        onClose={() => setConfirmCancelSubId(null)}
        onConfirm={() => {
          if (confirmCancelSubId) {
            updateSubscriptionStatus(confirmCancelSubId, 'closed');
            setIsDetailModalOpen(false);
          }
        }}
        title="Cancel Subscription"
        description="Are you sure you wish to close this subscription? Recurring charges will cease at the end of the current billing cycle."
        confirmText="Confirm Cancellation"
        danger={true}
      />
    </div>
  );
};
