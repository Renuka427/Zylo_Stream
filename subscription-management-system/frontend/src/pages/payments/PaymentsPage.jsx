import React, { useState } from 'react';
import {
  CreditCard,
  Plus,
  Eye,
  CheckCircle2,
  DollarSign,
  ArrowUpRight,
  ShieldCheck,
  Calendar,
  Building
} from 'lucide-react';
import { useMockData } from '../../contexts/MockDataContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { SearchInput } from '../../components/ui/SearchInput';
import { EmptyState } from '../../components/ui/EmptyState';

export const PaymentsPage = () => {
  const { payments, customers, invoices, recordPayment } = useMockData();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Form State
  const [form, setForm] = useState({
    customerId: customers[0]?.id || '',
    customerName: customers[0]?.name || '',
    invoiceNumber: invoices[0]?.invoiceNumber || 'INV-2026-101',
    paymentMethod: 'Credit Card (Visa •••• 4242)',
    amount: 1450,
    notes: 'Captured via payment gateway.'
  });

  const filteredPayments = payments.filter((p) => {
    return (
      p.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.paymentNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.paymentMethod.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const totalCaptured = payments.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
  const totalOutstanding = invoices.reduce((acc, curr) => acc + (Number(curr.outstandingAmount) || 0), 0);

  const handleRecord = (e) => {
    e.preventDefault();
    const cust = customers.find((c) => c.id === form.customerId);

    recordPayment({
      ...form,
      customerName: cust ? cust.name : form.customerName
    });
    setIsCreateModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-stone-warm/60">
        <div>
          <span className="text-xs uppercase font-bold tracking-widest text-champagne-gold">
            Treasury & Settlements
          </span>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-espresso tracking-tight mt-0.5">
            Payment Transactions
          </h1>
          <p className="text-xs text-espresso-muted mt-1">
            Reconciled collections, gateway transaction logs, refunds, and balance settlements.
          </p>
        </div>

        <Button
          variant="primary"
          icon={Plus}
          onClick={() => setIsCreateModalOpen(true)}
        >
          Record Transaction
        </Button>
      </div>

      {/* Metrics Ribbon */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4 bg-champagne-light">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold tracking-wider text-espresso-muted">
              Total Captured YTD
            </span>
            <CheckCircle2 className="w-4 h-4 text-emerald-700" />
          </div>
          <p className="font-display text-2xl font-bold text-espresso mt-1 font-mono">
            ${totalCaptured.toLocaleString()}
          </p>
          <span className="text-[11px] text-emerald-800 font-medium">100% gateway capture success</span>
        </Card>

        <Card className="p-4 bg-champagne-light">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold tracking-wider text-espresso-muted">
              Outstanding Balances
            </span>
            <DollarSign className="w-4 h-4 text-cherry" />
          </div>
          <p className="font-display text-2xl font-bold text-cherry-dark mt-1 font-mono">
            ${totalOutstanding.toLocaleString()}
          </p>
          <span className="text-[11px] text-espresso-muted">Pending auto-retry or bank wires</span>
        </Card>

        <Card className="p-4 bg-champagne-light">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold tracking-wider text-espresso-muted">
              Primary Channel
            </span>
            <CreditCard className="w-4 h-4 text-champagne-gold" />
          </div>
          <p className="font-display text-xl font-bold text-espresso mt-1">
            Automated ACH & Card
          </p>
          <span className="text-[11px] text-stone-500">Avg settlement time: 2 business days</span>
        </Card>
      </div>

      {/* Search Bar */}
      <Card className="p-4">
        <SearchInput
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search payments by receipt #, customer, method or invoice..."
          className="w-full md:max-w-md"
        />
      </Card>

      {/* Payments Table */}
      <Card className="p-0 overflow-hidden">
        {filteredPayments.length === 0 ? (
          <EmptyState
            title="No payment records found"
            description="Try modifying your search criteria."
            actionLabel="Reset Search"
            onAction={() => setSearchTerm('')}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-champagne/30 border-b border-stone-warm text-espresso-muted uppercase font-semibold">
                  <th className="py-3 px-4">Receipt #</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Invoice Ref</th>
                  <th className="py-3 px-4">Payment Method</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4 text-right">Amount</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-warm/60">
                {filteredPayments.map((p) => (
                  <tr key={p.id} className="hover:bg-champagne/20 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-cherry-dark">
                      {p.paymentNumber}
                    </td>
                    <td className="py-3.5 px-4 font-medium text-espresso">
                      {p.customerName}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-espresso-muted">
                      {p.invoiceNumber}
                    </td>
                    <td className="py-3.5 px-4 text-stone-600">
                      {p.paymentMethod}
                    </td>
                    <td className="py-3.5 px-4 text-stone-500">
                      {p.paymentDate}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-emerald-900">
                      +${p.amount?.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge status={p.status} />
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Button
                        variant="secondary"
                        size="sm"
                        icon={Eye}
                        onClick={() => {
                          setSelectedPayment(p);
                          setIsDetailModalOpen(true);
                        }}
                      >
                        Receipt
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Payment Detail Modal */}
      {selectedPayment && (
        <Modal
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          title={`Payment Receipt ${selectedPayment.paymentNumber}`}
          subtitle={`Settled on ${selectedPayment.paymentDate}`}
        >
          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-xl bg-champagne-light border border-stone-warm text-center space-y-1">
              <span className="text-[10px] uppercase font-bold text-espresso-muted">Amount Captured</span>
              <h3 className="font-display text-3xl font-black text-emerald-900 font-mono">
                ${selectedPayment.amount?.toLocaleString()}
              </h3>
              <p className="text-emerald-800 font-semibold flex items-center justify-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Reconciled Successfully
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-ivory border border-stone-warm">
                <span className="text-espresso-muted text-[10px] uppercase font-bold block">Payer Account</span>
                <p className="font-bold text-espresso mt-1">{selectedPayment.customerName}</p>
              </div>
              <div className="p-3 rounded-xl bg-ivory border border-stone-warm">
                <span className="text-espresso-muted text-[10px] uppercase font-bold block">Settled Statement</span>
                <p className="font-mono font-bold text-cherry-dark mt-1">{selectedPayment.invoiceNumber}</p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-ivory border border-stone-warm space-y-1">
              <span className="text-espresso-muted text-[10px] uppercase font-bold block">Transaction Reference</span>
              <p className="font-mono text-espresso text-[11px] break-all">{selectedPayment.transactionRef || 'txn_ref_verified'}</p>
              <p className="text-espresso-muted mt-2 text-[11px]">{selectedPayment.notes}</p>
            </div>
          </div>
        </Modal>
      )}

      {/* Record Payment Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Record Payment Transaction"
        subtitle="Log manual bank wire, ACH credit, or offline settlement."
      >
        <form onSubmit={handleRecord} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-espresso mb-1">Customer Account</label>
            <select
              value={form.customerId}
              onChange={(e) => {
                const c = customers.find((cust) => cust.id === e.target.value);
                setForm({
                  ...form,
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

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-espresso mb-1">Invoice Reference</label>
              <input
                type="text"
                required
                value={form.invoiceNumber}
                onChange={(e) => setForm({ ...form, invoiceNumber: e.target.value })}
                className="w-full bg-ivory text-espresso text-sm p-2.5 rounded-xl border border-stone-warm focus:outline-none focus:border-cherry font-mono"
                placeholder="INV-2026-..."
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-espresso mb-1">Amount ($)</label>
              <input
                type="number"
                required
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: Number(e.target.value) })}
                className="w-full bg-ivory text-espresso text-sm p-2.5 rounded-xl border border-stone-warm focus:outline-none focus:border-cherry font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-espresso mb-1">Payment Method</label>
            <select
              value={form.paymentMethod}
              onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })}
              className="w-full bg-ivory text-espresso text-sm p-2.5 rounded-xl border border-stone-warm focus:outline-none focus:border-cherry"
            >
              <option value="ACH Direct Debit">ACH Direct Debit</option>
              <option value="Credit Card (Visa •••• 4242)">Credit Card (Visa •••• 4242)</option>
              <option value="Bank Wire Transfer">Bank Wire Transfer</option>
              <option value="Corporate Check / Lockbox">Corporate Check / Lockbox</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-espresso mb-1">Reconciliation Notes</label>
            <textarea
              rows={2}
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              className="w-full bg-ivory text-espresso text-sm p-2.5 rounded-xl border border-stone-warm focus:outline-none focus:border-cherry"
              placeholder="Bank batch reference or transaction code..."
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-warm">
            <Button type="button" variant="secondary" onClick={() => setIsCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Confirm Receipt
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
