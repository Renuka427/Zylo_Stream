import React, { useState } from 'react';
import {
  Receipt,
  Plus,
  Eye,
  CheckCircle,
  Printer,
  Calendar,
  DollarSign,
  AlertCircle,
  Clock
} from 'lucide-react';
import { useMockData } from '../../contexts/MockDataContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { SearchInput } from '../../components/ui/SearchInput';
import { EmptyState } from '../../components/ui/EmptyState';

export const InvoicesPage = () => {
  const { invoices, customers, addInvoice, markInvoicePaid } = useMockData();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Form State
  const [form, setForm] = useState({
    customerId: customers[0]?.id || '',
    customerName: customers[0]?.name || '',
    dueDate: '2026-11-20',
    itemDesc: 'Monthly SaaS Recurring Service Fee',
    itemQty: 1,
    itemPrice: 1450,
    discount: 0
  });

  const filteredInvoices = invoices.filter((inv) => {
    const matchesSearch =
      inv.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.customerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === 'all' || inv.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const handleCreate = (e) => {
    e.preventDefault();
    const cust = customers.find((c) => c.id === form.customerId);
    const subtotal = form.itemQty * form.itemPrice;
    const tax = Math.round(subtotal * 0.08);
    const total = subtotal + tax - form.discount;

    addInvoice({
      customerId: form.customerId,
      customerName: cust ? cust.name : form.customerName,
      dueDate: form.dueDate,
      subtotal,
      tax,
      discount: form.discount,
      total,
      lineItems: [
        {
          description: form.itemDesc,
          quantity: form.itemQty,
          unitPrice: form.itemPrice,
          total: subtotal
        }
      ]
    });

    setIsCreateModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-stone-warm/60">
        <div>
          <span className="text-xs uppercase font-bold tracking-widest text-champagne-gold">
            Billing Operations
          </span>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-espresso tracking-tight mt-0.5">
            Invoices & Billing Ledger
          </h1>
          <p className="text-xs text-espresso-muted mt-1">
            Accounts receivable, issued statements, automated collections, and settlement records.
          </p>
        </div>

        <Button
          variant="primary"
          icon={Plus}
          onClick={() => setIsCreateModalOpen(true)}
        >
          Generate Invoice
        </Button>
      </div>

      {/* Filter and Search */}
      <Card className="p-4 space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <SearchInput
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search by invoice number or customer..."
            className="w-full md:max-w-md"
          />

          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-champagne/50 border border-stone-warm rounded-xl text-xs">
            {['all', 'Paid', 'Confirmed', 'Overdue', 'Draft'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-lg capitalize font-medium transition-colors ${
                  statusFilter === st
                    ? 'bg-ivory text-cherry-dark font-bold shadow-sm'
                    : 'text-espresso-muted hover:text-espresso'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Invoices Table Card */}
      <Card className="p-0 overflow-hidden">
        {filteredInvoices.length === 0 ? (
          <EmptyState
            title="No invoices found"
            description="No billing statements match your filter criteria."
            actionLabel="Reset Filter"
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
                  <th className="py-3 px-4">Invoice #</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Issue Date</th>
                  <th className="py-3 px-4">Due Date</th>
                  <th className="py-3 px-4 text-right">Total</th>
                  <th className="py-3 px-4 text-right">Outstanding</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-warm/60">
                {filteredInvoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-champagne/20 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-cherry-dark">
                      {inv.invoiceNumber}
                    </td>
                    <td className="py-3.5 px-4 font-medium text-espresso">
                      {inv.customerName}
                    </td>
                    <td className="py-3.5 px-4 text-espresso-muted">
                      {inv.issueDate}
                    </td>
                    <td className="py-3.5 px-4 text-stone-500">
                      {inv.dueDate}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-espresso">
                      ${inv.total?.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-cherry">
                      ${inv.outstandingAmount?.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge status={inv.status} />
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Button
                        variant="secondary"
                        size="sm"
                        icon={Eye}
                        onClick={() => {
                          setSelectedInvoice(inv);
                          setIsPreviewModalOpen(true);
                        }}
                      >
                        Review
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Invoice Detail / Printable Preview Modal */}
      {selectedInvoice && (
        <Modal
          isOpen={isPreviewModalOpen}
          onClose={() => setIsPreviewModalOpen(false)}
          title={`Statement ${selectedInvoice.invoiceNumber}`}
          subtitle={`Issued to ${selectedInvoice.customerName}`}
          maxWidth="max-w-2xl"
        >
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-ivory border border-stone-warm shadow-sm space-y-4">
              {/* Document Header */}
              <div className="flex items-start justify-between pb-4 border-b border-stone-warm">
                <div>
                  <h3 className="font-display text-2xl font-black text-cherry-dark">INVOICE</h3>
                  <p className="text-xs text-espresso font-semibold mt-0.5">SUBSCRIPT TECHNOLOGIES INC.</p>
                  <p className="text-[11px] text-espresso-muted">US-EIN-98-7654321</p>
                  <p className="text-[11px] text-stone-400">450 Lexington Ave, New York, NY</p>
                </div>
                <div className="text-right">
                  <Badge status={selectedInvoice.status} className="mb-1" />
                  <p className="text-xs font-mono font-bold text-espresso">{selectedInvoice.invoiceNumber}</p>
                  <p className="text-[11px] text-stone-500">Issued: {selectedInvoice.issueDate}</p>
                  <p className="text-[11px] font-semibold text-cherry">Due: {selectedInvoice.dueDate}</p>
                </div>
              </div>

              {/* Bill To */}
              <div className="text-xs">
                <span className="text-[10px] uppercase font-bold text-espresso-muted block">Billed To:</span>
                <p className="font-bold text-espresso text-sm mt-0.5">{selectedInvoice.customerName}</p>
                <p className="text-espresso-muted">Authorized Billing Contact</p>
              </div>

              {/* Line Items */}
              <div className="overflow-x-auto pt-2">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-stone-warm text-espresso-muted uppercase font-semibold">
                      <th className="py-2">Description</th>
                      <th className="py-2 text-center">Qty</th>
                      <th className="py-2 text-right">Rate</th>
                      <th className="py-2 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-warm/50">
                    {selectedInvoice.lineItems?.map((item, idx) => (
                      <tr key={idx}>
                        <td className="py-2.5 font-medium text-espresso">{item.description}</td>
                        <td className="py-2.5 text-center font-mono">{item.quantity}</td>
                        <td className="py-2.5 text-right font-mono">${item.unitPrice?.toLocaleString()}</td>
                        <td className="py-2.5 text-right font-mono font-bold">${item.total?.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Summary */}
              <div className="pt-3 border-t border-stone-warm flex justify-end">
                <div className="w-64 space-y-1.5 text-xs">
                  <div className="flex justify-between text-espresso-muted">
                    <span>Subtotal:</span>
                    <span className="font-mono">${selectedInvoice.subtotal?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-espresso-muted">
                    <span>Tax (8%):</span>
                    <span className="font-mono">${selectedInvoice.tax?.toLocaleString()}</span>
                  </div>
                  {selectedInvoice.discount > 0 && (
                    <div className="flex justify-between text-emerald-800">
                      <span>Discount:</span>
                      <span className="font-mono">-${selectedInvoice.discount?.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-sm text-espresso pt-2 border-t border-stone-warm">
                    <span>Total Due:</span>
                    <span className="font-mono text-cherry-dark font-black">
                      ${selectedInvoice.total?.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs font-semibold text-emerald-800">
                    <span>Amount Paid:</span>
                    <span className="font-mono">${selectedInvoice.paidAmount?.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Action Bar */}
            <div className="flex items-center justify-between pt-2 border-t border-stone-warm">
              {selectedInvoice.status !== 'Paid' ? (
                <Button
                  variant="primary"
                  size="sm"
                  icon={CheckCircle}
                  onClick={() => {
                    markInvoicePaid(selectedInvoice.id);
                    setSelectedInvoice({
                      ...selectedInvoice,
                      status: 'Paid',
                      paidAmount: selectedInvoice.total,
                      outstandingAmount: 0
                    });
                  }}
                >
                  Record Full Settlement
                </Button>
              ) : (
                <div className="flex items-center gap-2 text-xs text-emerald-800 font-bold">
                  <CheckCircle className="w-4 h-4" />
                  Settled in Full via Reconciled Transaction
                </div>
              )}

              <Button
                variant="secondary"
                size="sm"
                icon={Printer}
                onClick={() => window.print()}
              >
                Print / Download PDF
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Generate Invoice Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Generate Invoice Statement"
        subtitle="Issue an ad-hoc or cycle bill to an enrolled customer."
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-espresso mb-1">Select Customer</label>
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
              <label className="block text-xs font-semibold text-espresso mb-1">Due Date</label>
              <input
                type="date"
                required
                value={form.dueDate}
                onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                className="w-full bg-ivory text-espresso text-sm p-2.5 rounded-xl border border-stone-warm focus:outline-none focus:border-cherry"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-espresso mb-1">Promotional Discount ($)</label>
              <input
                type="number"
                value={form.discount}
                onChange={(e) => setForm({ ...form, discount: Number(e.target.value) })}
                className="w-full bg-ivory text-espresso text-sm p-2.5 rounded-xl border border-stone-warm focus:outline-none focus:border-cherry font-mono"
              />
            </div>
          </div>

          <div className="p-3 rounded-xl bg-champagne-light border border-stone-warm space-y-3">
            <span className="text-xs font-bold text-espresso block">Invoice Line Item</span>
            <div>
              <label className="block text-[11px] text-espresso-muted mb-1">Description</label>
              <input
                type="text"
                required
                value={form.itemDesc}
                onChange={(e) => setForm({ ...form, itemDesc: e.target.value })}
                className="w-full bg-ivory text-espresso text-sm p-2 rounded-lg border border-stone-warm focus:outline-none focus:border-cherry"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] text-espresso-muted mb-1">Quantity</label>
                <input
                  type="number"
                  value={form.itemQty}
                  onChange={(e) => setForm({ ...form, itemQty: Number(e.target.value) })}
                  className="w-full bg-ivory text-espresso text-sm p-2 rounded-lg border border-stone-warm focus:outline-none focus:border-cherry font-mono"
                />
              </div>
              <div>
                <label className="block text-[11px] text-espresso-muted mb-1">Unit Rate ($)</label>
                <input
                  type="number"
                  value={form.itemPrice}
                  onChange={(e) => setForm({ ...form, itemPrice: Number(e.target.value) })}
                  className="w-full bg-ivory text-espresso text-sm p-2 rounded-lg border border-stone-warm focus:outline-none focus:border-cherry font-mono"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-warm">
            <Button type="button" variant="secondary" onClick={() => setIsCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Issue Invoice
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
