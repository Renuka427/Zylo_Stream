import React, { useState, useMemo } from 'react';
import {
  CreditCard,
  Plus,
  Eye,
  CheckCircle2,
  DollarSign,
  Trash2,
  Printer,
  Calendar,
  Building,
  ArrowUpDown,
  Filter,
  Receipt
} from 'lucide-react';
import { useMockData } from '../../contexts/MockDataContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { SearchInput } from '../../components/ui/SearchInput';
import { EmptyState } from '../../components/ui/EmptyState';
import { Pagination } from '../../components/ui/Pagination';

export const PaymentsPage = () => {
  const { payments, customers, invoices, recordPayment, deletePayment } = useMockData();
  
  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [methodFilter, setMethodFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('date-desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Modals state
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [paymentToDelete, setPaymentToDelete] = useState(null);

  // Form State
  const [form, setForm] = useState({
    customerId: customers[0]?.id || '',
    customerName: customers[0]?.name || '',
    invoiceNumber: invoices[0]?.invoiceNumber || 'INV-2026-101',
    paymentMethod: 'Credit Card (Visa •••• 4242)',
    paymentDate: new Date().toISOString().split('T')[0],
    amount: invoices[0]?.outstandingAmount || 1450,
    notes: 'Captured and reconciled via payment gateway.'
  });

  // When customer changes in create modal, recommend their invoices
  const customerInvoices = useMemo(() => {
    return invoices.filter((i) => i.customerId === form.customerId);
  }, [invoices, form.customerId]);

  const handleCustomerChange = (custId) => {
    const cust = customers.find((c) => c.id === custId);
    const relatedInvs = invoices.filter((i) => i.customerId === custId);
    const defaultInv = relatedInvs[0];
    
    setForm((prev) => ({
      ...prev,
      customerId: custId,
      customerName: cust ? cust.name : '',
      invoiceNumber: defaultInv ? defaultInv.invoiceNumber : 'INV-2026-GENERAL',
      amount: defaultInv ? (defaultInv.outstandingAmount || defaultInv.total) : 1000
    }));
  };

  const handleInvoiceChange = (invNumber) => {
    const targetInv = invoices.find((i) => i.invoiceNumber === invNumber);
    setForm((prev) => ({
      ...prev,
      invoiceNumber: invNumber,
      amount: targetInv ? (targetInv.outstandingAmount || targetInv.total) : prev.amount
    }));
  };

  // Filter & Sort Logic
  const filteredAndSortedPayments = useMemo(() => {
    let result = payments.filter((p) => {
      const matchesSearch =
        p.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.paymentNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.paymentMethod.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesMethod =
        methodFilter === 'ALL' ||
        p.paymentMethod.toLowerCase().includes(methodFilter.toLowerCase());

      const matchesStatus =
        statusFilter === 'ALL' ||
        (p.status && p.status.toLowerCase() === statusFilter.toLowerCase());

      return matchesSearch && matchesMethod && matchesStatus;
    });

    // Sorting
    result.sort((a, b) => {
      if (sortBy === 'date-desc') {
        return new Date(b.paymentDate) - new Date(a.paymentDate);
      }
      if (sortBy === 'date-asc') {
        return new Date(a.paymentDate) - new Date(b.paymentDate);
      }
      if (sortBy === 'amount-desc') {
        return (Number(b.amount) || 0) - (Number(a.amount) || 0);
      }
      if (sortBy === 'amount-asc') {
        return (Number(a.amount) || 0) - (Number(b.amount) || 0);
      }
      if (sortBy === 'customer') {
        return a.customerName.localeCompare(b.customerName);
      }
      return 0;
    });

    return result;
  }, [payments, searchTerm, methodFilter, statusFilter, sortBy]);

  // Pagination calculation
  const totalItems = filteredAndSortedPayments.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const paginatedPayments = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredAndSortedPayments.slice(start, start + pageSize);
  }, [filteredAndSortedPayments, currentPage, pageSize]);

  const totalCaptured = payments.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
  const totalOutstanding = invoices.reduce((acc, curr) => acc + (Number(curr.outstandingAmount) || 0), 0);

  const handleRecord = (e) => {
    e.preventDefault();
    const cust = customers.find((c) => c.id === form.customerId);

    recordPayment({
      ...form,
      customerName: cust ? cust.name : form.customerName,
      amount: Number(form.amount)
    });
    setIsCreateModalOpen(false);
  };

  const confirmDeletePayment = () => {
    if (paymentToDelete) {
      deletePayment(paymentToDelete.id);
      setPaymentToDelete(null);
    }
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
          onClick={() => {
            if (customers.length > 0) {
              handleCustomerChange(customers[0].id);
            }
            setIsCreateModalOpen(true);
          }}
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
              Primary Settlement Channel
            </span>
            <CreditCard className="w-4 h-4 text-champagne-gold" />
          </div>
          <p className="font-display text-xl font-bold text-espresso mt-1">
            Automated ACH & Card
          </p>
          <span className="text-[11px] text-stone-500">Avg settlement time: 2 business days</span>
        </Card>
      </div>

      {/* Filter and Control Bar */}
      <Card className="p-4">
        <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between">
          <SearchInput
            value={searchTerm}
            onChange={(val) => {
              setSearchTerm(val);
              setCurrentPage(1);
            }}
            placeholder="Search payments by receipt #, customer, method or invoice..."
            className="w-full lg:max-w-md"
          />

          <div className="flex flex-wrap items-center gap-2">
            {/* Method filter */}
            <div className="flex items-center gap-1.5 bg-ivory px-3 py-1.5 rounded-xl border border-stone-warm text-xs">
              <Filter className="w-3.5 h-3.5 text-stone-400" />
              <select
                value={methodFilter}
                onChange={(e) => {
                  setMethodFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="bg-transparent text-espresso font-medium focus:outline-none cursor-pointer"
              >
                <option value="ALL">All Methods</option>
                <option value="Card">Card</option>
                <option value="ACH">ACH Debit</option>
                <option value="Wire">Wire Transfer</option>
                <option value="Check">Check / Lockbox</option>
              </select>
            </div>

            {/* Status filter */}
            <div className="flex items-center gap-1.5 bg-ivory px-3 py-1.5 rounded-xl border border-stone-warm text-xs">
              <span className="text-stone-400 font-medium">Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="bg-transparent text-espresso font-medium focus:outline-none cursor-pointer"
              >
                <option value="ALL">All Statuses</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
              </select>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5 bg-ivory px-3 py-1.5 rounded-xl border border-stone-warm text-xs">
              <ArrowUpDown className="w-3.5 h-3.5 text-stone-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent text-espresso font-medium focus:outline-none cursor-pointer"
              >
                <option value="date-desc">Newest First</option>
                <option value="date-asc">Oldest First</option>
                <option value="amount-desc">Amount: High to Low</option>
                <option value="amount-asc">Amount: Low to High</option>
                <option value="customer">Customer: A to Z</option>
              </select>
            </div>
          </div>
        </div>
      </Card>

      {/* Payments Table */}
      <Card className="p-0 overflow-hidden">
        {paginatedPayments.length === 0 ? (
          <EmptyState
            title="No payment records found"
            description="Try modifying your search criteria or resetting filters."
            actionLabel="Reset Filters"
            onAction={() => {
              setSearchTerm('');
              setMethodFilter('ALL');
              setStatusFilter('ALL');
              setCurrentPage(1);
            }}
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
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-warm/60">
                {paginatedPayments.map((p) => (
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
                    <td className="py-3.5 px-4 text-stone-500 whitespace-nowrap">
                      {p.paymentDate}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-emerald-900 whitespace-nowrap">
                      +${Number(p.amount || 0).toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge status={p.status || 'Completed'} />
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          variant="secondary"
                          size="sm"
                          icon={Receipt}
                          onClick={() => {
                            setSelectedPayment(p);
                            setIsDetailModalOpen(true);
                          }}
                        >
                          Receipt
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-stone-400 hover:text-rose-600 p-1.5"
                          onClick={() => setPaymentToDelete(p)}
                          title="Delete transaction"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Bar */}
        <div className="p-4 border-t border-stone-warm/60">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            pageSize={pageSize}
            totalItems={totalItems}
            onPageChange={setCurrentPage}
            onPageSizeChange={(newSize) => {
              setPageSize(newSize);
              setCurrentPage(1);
            }}
          />
        </div>
      </Card>

      {/* Payment Detail Receipt Modal */}
      {selectedPayment && (
        <Modal
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          title={`Settlement Receipt ${selectedPayment.paymentNumber}`}
          subtitle={`Reconciled on ${selectedPayment.paymentDate}`}
        >
          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-xl bg-champagne-light border border-stone-warm text-center space-y-1">
              <span className="text-[10px] uppercase font-bold text-espresso-muted">Captured Funds</span>
              <h3 className="font-display text-3xl font-black text-emerald-900 font-mono">
                ${Number(selectedPayment.amount || 0).toLocaleString()}
              </h3>
              <p className="text-emerald-800 font-semibold flex items-center justify-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Ledger Balanced & Gateway Verified
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-ivory border border-stone-warm">
                <span className="text-espresso-muted text-[10px] uppercase font-bold block">Payer Account</span>
                <p className="font-bold text-espresso mt-1">{selectedPayment.customerName}</p>
              </div>
              <div className="p-3 rounded-xl bg-ivory border border-stone-warm">
                <span className="text-espresso-muted text-[10px] uppercase font-bold block">Applied Invoice</span>
                <p className="font-mono font-bold text-cherry-dark mt-1">{selectedPayment.invoiceNumber}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-ivory border border-stone-warm">
                <span className="text-espresso-muted text-[10px] uppercase font-bold block">Payment Method</span>
                <p className="font-medium text-espresso mt-1">{selectedPayment.paymentMethod}</p>
              </div>
              <div className="p-3 rounded-xl bg-ivory border border-stone-warm">
                <span className="text-espresso-muted text-[10px] uppercase font-bold block">Settlement Date</span>
                <p className="font-medium text-espresso mt-1">{selectedPayment.paymentDate}</p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-ivory border border-stone-warm space-y-1">
              <span className="text-espresso-muted text-[10px] uppercase font-bold block">Transaction Reference</span>
              <p className="font-mono text-espresso text-[11px] break-all">{selectedPayment.transactionRef || 'txn_ref_982938472910'}</p>
              <p className="text-espresso-muted mt-2 text-[11px]">
                <strong className="text-espresso">Internal Notes:</strong> {selectedPayment.notes || 'Reconciled automatically.'}
              </p>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-stone-warm">
              <span className="text-[11px] text-espresso-muted">Authorized by Subscript Treasury Core</span>
              <Button
                variant="secondary"
                size="sm"
                icon={Printer}
                onClick={() => window.print()}
              >
                Print Receipt
              </Button>
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
              onChange={(e) => handleCustomerChange(e.target.value)}
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
              <label className="block text-xs font-semibold text-espresso mb-1">Apply to Invoice</label>
              {customerInvoices.length > 0 ? (
                <select
                  value={form.invoiceNumber}
                  onChange={(e) => handleInvoiceChange(e.target.value)}
                  className="w-full bg-ivory text-espresso text-sm p-2.5 rounded-xl border border-stone-warm focus:outline-none focus:border-cherry font-mono"
                >
                  {customerInvoices.map((inv) => (
                    <option key={inv.id} value={inv.invoiceNumber}>
                      {inv.invoiceNumber} (Due: ${inv.outstandingAmount || inv.total})
                    </option>
                  ))}
                  <option value="GENERAL_BALANCE">General Account Credit</option>
                </select>
              ) : (
                <input
                  type="text"
                  required
                  value={form.invoiceNumber}
                  onChange={(e) => setForm({ ...form, invoiceNumber: e.target.value })}
                  className="w-full bg-ivory text-espresso text-sm p-2.5 rounded-xl border border-stone-warm focus:outline-none focus:border-cherry font-mono"
                  placeholder="INV-2026-..."
                />
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-espresso mb-1">Amount ($)</label>
              <input
                type="number"
                min="1"
                step="0.01"
                required
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                className="w-full bg-ivory text-espresso text-sm p-2.5 rounded-xl border border-stone-warm focus:outline-none focus:border-cherry font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-espresso mb-1">Payment Method</label>
              <select
                value={form.paymentMethod}
                onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })}
                className="w-full bg-ivory text-espresso text-sm p-2.5 rounded-xl border border-stone-warm focus:outline-none focus:border-cherry"
              >
                <option value="Credit Card (Visa •••• 4242)">Credit Card (Visa •••• 4242)</option>
                <option value="ACH Direct Debit">ACH Direct Debit</option>
                <option value="Bank Wire Transfer">Bank Wire Transfer</option>
                <option value="Corporate Check / Lockbox">Corporate Check / Lockbox</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-espresso mb-1">Settlement Date</label>
              <input
                type="date"
                required
                value={form.paymentDate}
                onChange={(e) => setForm({ ...form, paymentDate: e.target.value })}
                className="w-full bg-ivory text-espresso text-sm p-2.5 rounded-xl border border-stone-warm focus:outline-none focus:border-cherry font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-espresso mb-1">Reconciliation Notes</label>
            <textarea
              rows={2}
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              className="w-full bg-ivory text-espresso text-sm p-2.5 rounded-xl border border-stone-warm focus:outline-none focus:border-cherry"
              placeholder="Bank batch reference or transaction authorization code..."
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

      {/* Delete Transaction Confirm Dialog */}
      <ConfirmDialog
        isOpen={!!paymentToDelete}
        onClose={() => setPaymentToDelete(null)}
        onConfirm={confirmDeletePayment}
        title="Delete Payment Transaction"
        message={`Are you sure you want to remove payment record ${paymentToDelete?.paymentNumber}? This transaction will be purged from the settlement journal.`}
        confirmLabel="Delete Record"
        variant="danger"
      />
    </div>
  );
};
