import React, { useState, useMemo } from 'react';
import {
  Receipt,
  Plus,
  Eye,
  CheckCircle,
  Printer,
  Calendar,
  DollarSign,
  AlertCircle,
  Clock,
  Edit2,
  Trash2,
  Ban,
  ArrowUpDown,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { useMockData } from '../../contexts/MockDataContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { SearchInput } from '../../components/ui/SearchInput';
import { Pagination } from '../../components/ui/Pagination';
import { EmptyState } from '../../components/ui/EmptyState';

export const InvoicesPage = () => {
  const { invoices, customers, addInvoice, updateInvoice, markInvoicePaid, voidInvoice, deleteInvoice } = useMockData();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [editingInvoice, setEditingInvoice] = useState(null);
  const [deletingInvoiceId, setDeletingInvoiceId] = useState(null);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Sorting and Pagination
  const [sortField, setSortField] = useState('invoiceNumber');
  const [sortDirection, setSortDirection] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  // Form State for Create
  const [form, setForm] = useState({
    customerId: customers[0]?.id || '',
    customerName: customers[0]?.name || '',
    dueDate: '2026-11-20',
    itemDesc: 'Monthly SaaS Recurring Service Fee',
    itemQty: 1,
    itemPrice: 1450,
    discount: 0
  });

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filteredAndSortedInvoices = useMemo(() => {
    let result = invoices.filter((inv) => {
      const matchesSearch =
        inv.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inv.customerName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === 'all' || inv.status.toLowerCase() === statusFilter.toLowerCase();
      return matchesSearch && matchesStatus;
    });

    result.sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];

      if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = (bVal || '').toLowerCase();
        return sortDirection === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }

      return sortDirection === 'asc' ? (aVal || 0) - (bVal || 0) : (bVal || 0) - (aVal || 0);
    });

    return result;
  }, [invoices, searchTerm, statusFilter, sortField, sortDirection]);

  const paginatedInvoices = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredAndSortedInvoices.slice(start, start + pageSize);
  }, [filteredAndSortedInvoices, currentPage, pageSize]);

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

  const handleUpdate = (e) => {
    e.preventDefault();
    if (!editingInvoice) return;
    updateInvoice(editingInvoice.id, editingInvoice);
    setEditingInvoice(null);
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
            onChange={(val) => {
              setSearchTerm(val);
              setCurrentPage(1);
            }}
            placeholder="Search by invoice number or customer..."
            className="w-full md:max-w-md"
          />

          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-champagne/50 border border-stone-warm rounded-xl text-xs">
            {['all', 'Paid', 'Confirmed', 'Overdue', 'Draft'].map((st) => (
              <button
                key={st}
                onClick={() => {
                  setStatusFilter(st);
                  setCurrentPage(1);
                }}
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
        {filteredAndSortedInvoices.length === 0 ? (
          <EmptyState
            title="No invoices found"
            description="No billing statements match your filter criteria."
            actionLabel="Reset Filter"
            onAction={() => {
              setSearchTerm('');
              setStatusFilter('all');
              setCurrentPage(1);
            }}
          />
        ) : (
          <div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-champagne/30 border-b border-stone-warm text-espresso-muted uppercase font-semibold">
                    <th
                      className="py-3 px-4 cursor-pointer hover:text-cherry"
                      onClick={() => handleSort('invoiceNumber')}
                    >
                      <div className="flex items-center gap-1">
                        <span>Invoice #</span>
                        {sortField === 'invoiceNumber' && (
                          sortDirection === 'asc' ? <ArrowUp className="w-3 h-3 text-cherry" /> : <ArrowDown className="w-3 h-3 text-cherry" />
                        )}
                      </div>
                    </th>
                    <th
                      className="py-3 px-4 cursor-pointer hover:text-cherry"
                      onClick={() => handleSort('customerName')}
                    >
                      <div className="flex items-center gap-1">
                        <span>Customer</span>
                        {sortField === 'customerName' && (
                          sortDirection === 'asc' ? <ArrowUp className="w-3 h-3 text-cherry" /> : <ArrowDown className="w-3 h-3 text-cherry" />
                        )}
                      </div>
                    </th>
                    <th className="py-3 px-4">Issue Date</th>
                    <th
                      className="py-3 px-4 cursor-pointer hover:text-cherry"
                      onClick={() => handleSort('dueDate')}
                    >
                      <div className="flex items-center gap-1">
                        <span>Due Date</span>
                        {sortField === 'dueDate' && (
                          sortDirection === 'asc' ? <ArrowUp className="w-3 h-3 text-cherry" /> : <ArrowDown className="w-3 h-3 text-cherry" />
                        )}
                      </div>
                    </th>
                    <th
                      className="py-3 px-4 text-right cursor-pointer hover:text-cherry"
                      onClick={() => handleSort('total')}
                    >
                      <div className="flex items-center justify-end gap-1">
                        <span>Total</span>
                        {sortField === 'total' && (
                          sortDirection === 'asc' ? <ArrowUp className="w-3 h-3 text-cherry" /> : <ArrowDown className="w-3 h-3 text-cherry" />
                        )}
                      </div>
                    </th>
                    <th
                      className="py-3 px-4 text-right cursor-pointer hover:text-cherry"
                      onClick={() => handleSort('outstandingAmount')}
                    >
                      <div className="flex items-center justify-end gap-1">
                        <span>Outstanding</span>
                        {sortField === 'outstandingAmount' && (
                          sortDirection === 'asc' ? <ArrowUp className="w-3 h-3 text-cherry" /> : <ArrowDown className="w-3 h-3 text-cherry" />
                        )}
                      </div>
                    </th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-warm/60">
                  {paginatedInvoices.map((inv) => (
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
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => {
                              setSelectedInvoice(inv);
                              setIsPreviewModalOpen(true);
                            }}
                            className="p-1.5 rounded-lg text-stone-500 hover:text-cherry hover:bg-champagne/40"
                            title="Inspect Statement"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          {inv.status !== 'Paid' && (
                            <button
                              onClick={() => setEditingInvoice({ ...inv })}
                              className="p-1.5 rounded-lg text-stone-500 hover:text-champagne-gold hover:bg-champagne/40"
                              title="Edit Invoice"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                          <button
                            onClick={() => setDeletingInvoiceId(inv.id)}
                            className="p-1.5 rounded-lg text-stone-500 hover:text-red-700 hover:bg-red-50"
                            title="Delete Invoice"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <Pagination
              currentPage={currentPage}
              totalItems={filteredAndSortedInvoices.length}
              pageSize={pageSize}
              onPageChange={setCurrentPage}
              onPageSizeChange={setPageSize}
            />
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
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-stone-warm">
              <div className="flex items-center gap-2">
                {selectedInvoice.status !== 'Paid' && (
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
                )}

                {selectedInvoice.status === 'Confirmed' && (
                  <Button
                    variant="secondary"
                    size="sm"
                    icon={Ban}
                    onClick={() => {
                      voidInvoice(selectedInvoice.id);
                      setSelectedInvoice({
                        ...selectedInvoice,
                        status: 'Draft',
                        outstandingAmount: 0
                      });
                    }}
                  >
                    Mark as Void / Draft
                  </Button>
                )}
              </div>

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

      {/* Edit Invoice Modal */}
      {editingInvoice && (
        <Modal
          isOpen={Boolean(editingInvoice)}
          onClose={() => setEditingInvoice(null)}
          title={`Edit Invoice: ${editingInvoice.invoiceNumber}`}
          subtitle={`Customer: ${editingInvoice.customerName}`}
        >
          <form onSubmit={handleUpdate} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-espresso mb-1">Due Date</label>
                <input
                  type="date"
                  value={editingInvoice.dueDate}
                  onChange={(e) => setEditingInvoice({ ...editingInvoice, dueDate: e.target.value })}
                  className="w-full bg-ivory text-espresso text-sm p-2.5 rounded-xl border border-stone-warm focus:outline-none focus:border-cherry"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-espresso mb-1">Status</label>
                <select
                  value={editingInvoice.status}
                  onChange={(e) => setEditingInvoice({ ...editingInvoice, status: e.target.value })}
                  className="w-full bg-ivory text-espresso text-sm p-2.5 rounded-xl border border-stone-warm focus:outline-none focus:border-cherry"
                >
                  <option value="Confirmed">Confirmed</option>
                  <option value="Paid">Paid</option>
                  <option value="Overdue">Overdue</option>
                  <option value="Draft">Draft</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-espresso mb-1">Discount ($)</label>
              <input
                type="number"
                value={editingInvoice.discount}
                onChange={(e) => setEditingInvoice({ ...editingInvoice, discount: Number(e.target.value) })}
                className="w-full bg-ivory text-espresso text-sm p-2.5 rounded-xl border border-stone-warm focus:outline-none focus:border-cherry font-mono"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-warm">
              <Button type="button" variant="secondary" onClick={() => setEditingInvoice(null)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                Save Invoice
              </Button>
            </div>
          </form>
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

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(deletingInvoiceId)}
        onClose={() => setDeletingInvoiceId(null)}
        onConfirm={() => {
          if (deletingInvoiceId) {
            deleteInvoice(deletingInvoiceId);
            setDeletingInvoiceId(null);
          }
        }}
        title="Remove Invoice Statement"
        description="Are you sure you wish to delete this invoice statement from the ledger?"
        confirmText="Confirm Deletion"
        danger={true}
      />
    </div>
  );
};
