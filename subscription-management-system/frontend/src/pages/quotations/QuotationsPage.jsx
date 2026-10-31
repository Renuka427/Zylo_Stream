import React, { useState, useMemo } from 'react';
import {
  FileText,
  Plus,
  Eye,
  CheckCircle2,
  XCircle,
  Calendar,
  Send,
  Printer,
  DollarSign,
  ArrowRight,
  Edit2,
  Trash2,
  Sparkles,
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

export const QuotationsPage = () => {
  const {
    quotations,
    customers,
    products,
    addQuotation,
    updateQuotation,
    updateQuotationStatus,
    convertQuotationToSubscription,
    deleteQuotation
  } = useMockData();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedQuote, setSelectedQuote] = useState(null);
  const [editingQuote, setEditingQuote] = useState(null);
  const [deletingQuoteId, setDeletingQuoteId] = useState(null);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Sorting and Pagination
  const [sortField, setSortField] = useState('quotationNumber');
  const [sortDirection, setSortDirection] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  // Form State for Create
  const [form, setForm] = useState({
    customerId: customers[0]?.id || '',
    customerName: customers[0]?.name || '',
    validUntil: '2026-11-30',
    itemDesc: 'Enterprise Platform Cluster Provisioning',
    itemQty: 1,
    itemPrice: 3200,
    discount: 200,
    notes: '30-day payment term upon signature.'
  });

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filteredAndSortedQuotes = useMemo(() => {
    let result = quotations.filter((q) => {
      const matchesSearch =
        q.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.quotationNumber.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === 'all' || q.status.toLowerCase() === statusFilter.toLowerCase();
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
  }, [quotations, searchTerm, statusFilter, sortField, sortDirection]);

  const paginatedQuotes = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredAndSortedQuotes.slice(start, start + pageSize);
  }, [filteredAndSortedQuotes, currentPage, pageSize]);

  const handleCreate = (e) => {
    e.preventDefault();
    const cust = customers.find((c) => c.id === form.customerId);
    const subtotal = form.itemQty * form.itemPrice;
    const tax = Math.round(subtotal * 0.08);
    const total = subtotal + tax - form.discount;

    addQuotation({
      customerId: form.customerId,
      customerName: cust ? cust.name : form.customerName,
      validUntil: form.validUntil,
      lineItems: [
        {
          description: form.itemDesc,
          quantity: form.itemQty,
          unitPrice: form.itemPrice,
          total: subtotal
        }
      ],
      subtotal,
      tax,
      discount: form.discount,
      total,
      notes: form.notes
    });

    setIsCreateModalOpen(false);
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    if (!editingQuote) return;
    const subtotal = editingQuote.lineItems?.reduce((acc, item) => acc + (item.total || 0), 0) || editingQuote.subtotal;
    const tax = Math.round(subtotal * 0.08);
    const total = subtotal + tax - (Number(editingQuote.discount) || 0);

    updateQuotation(editingQuote.id, {
      ...editingQuote,
      subtotal,
      tax,
      total
    });
    setEditingQuote(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-stone-warm/60">
        <div>
          <span className="text-xs uppercase font-bold tracking-widest text-champagne-gold">
            Commercial Estimates
          </span>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-espresso tracking-tight mt-0.5">
            Quotations & Proposals
          </h1>
          <p className="text-xs text-espresso-muted mt-1">
            Generate customized pricing estimates, track client approvals, and transition to active subscriptions.
          </p>
        </div>

        <Button
          variant="primary"
          icon={Plus}
          onClick={() => setIsCreateModalOpen(true)}
        >
          Draft Quotation
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <Card className="p-4 space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <SearchInput
            value={searchTerm}
            onChange={(val) => {
              setSearchTerm(val);
              setCurrentPage(1);
            }}
            placeholder="Search by quote number or client..."
            className="w-full md:max-w-md"
          />

          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-champagne/50 border border-stone-warm rounded-xl text-xs">
            {['all', 'Draft', 'Sent', 'Accepted', 'Rejected'].map((st) => (
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

      {/* Table Card */}
      <Card className="p-0 overflow-hidden">
        {filteredAndSortedQuotes.length === 0 ? (
          <EmptyState
            title="No quotations found"
            description="No proposals match your search or filter settings."
            actionLabel="Reset Search"
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
                      onClick={() => handleSort('quotationNumber')}
                    >
                      <div className="flex items-center gap-1">
                        <span>Quotation #</span>
                        {sortField === 'quotationNumber' && (
                          sortDirection === 'asc' ? <ArrowUp className="w-3 h-3 text-cherry" /> : <ArrowDown className="w-3 h-3 text-cherry" />
                        )}
                      </div>
                    </th>
                    <th
                      className="py-3 px-4 cursor-pointer hover:text-cherry"
                      onClick={() => handleSort('customerName')}
                    >
                      <div className="flex items-center gap-1">
                        <span>Client</span>
                        {sortField === 'customerName' && (
                          sortDirection === 'asc' ? <ArrowUp className="w-3 h-3 text-cherry" /> : <ArrowDown className="w-3 h-3 text-cherry" />
                        )}
                      </div>
                    </th>
                    <th className="py-3 px-4">Issue Date</th>
                    <th className="py-3 px-4">Valid Until</th>
                    <th className="py-3 px-4 text-right">Subtotal</th>
                    <th
                      className="py-3 px-4 text-right cursor-pointer hover:text-cherry"
                      onClick={() => handleSort('total')}
                    >
                      <div className="flex items-center justify-end gap-1">
                        <span>Net Total</span>
                        {sortField === 'total' && (
                          sortDirection === 'asc' ? <ArrowUp className="w-3 h-3 text-cherry" /> : <ArrowDown className="w-3 h-3 text-cherry" />
                        )}
                      </div>
                    </th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-warm/60">
                  {paginatedQuotes.map((q) => (
                    <tr key={q.id} className="hover:bg-champagne/20 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-cherry-dark">
                        {q.quotationNumber}
                      </td>
                      <td className="py-3.5 px-4 font-medium text-espresso">
                        {q.customerName}
                      </td>
                      <td className="py-3.5 px-4 text-espresso-muted">
                        {q.issueDate}
                      </td>
                      <td className="py-3.5 px-4 text-stone-500">
                        {q.validUntil}
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono text-espresso-muted">
                        ${q.subtotal?.toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono font-bold text-espresso">
                        ${q.total?.toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4">
                        <Badge status={q.status} />
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => {
                              setSelectedQuote(q);
                              setIsPreviewModalOpen(true);
                            }}
                            className="p-1.5 rounded-lg text-stone-500 hover:text-cherry hover:bg-champagne/40"
                            title="Preview Quotation"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          {q.status === 'Draft' && (
                            <button
                              onClick={() => setEditingQuote({ ...q })}
                              className="p-1.5 rounded-lg text-stone-500 hover:text-champagne-gold hover:bg-champagne/40"
                              title="Edit Quotation"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                          <button
                            onClick={() => setDeletingQuoteId(q.id)}
                            className="p-1.5 rounded-lg text-stone-500 hover:text-red-700 hover:bg-red-50"
                            title="Delete Quotation"
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
              totalItems={filteredAndSortedQuotes.length}
              pageSize={pageSize}
              onPageChange={setCurrentPage}
              onPageSizeChange={setPageSize}
            />
          </div>
        )}
      </Card>

      {/* Quotation Preview Modal (Printable Luxury Document) */}
      {selectedQuote && (
        <Modal
          isOpen={isPreviewModalOpen}
          onClose={() => setIsPreviewModalOpen(false)}
          title={`Quotation ${selectedQuote.quotationNumber}`}
          subtitle={`Prepared for ${selectedQuote.customerName}`}
          maxWidth="max-w-2xl"
        >
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-ivory border border-stone-warm shadow-sm space-y-4">
              <div className="flex items-start justify-between pb-4 border-b border-stone-warm">
                <div>
                  <h3 className="font-display text-2xl font-black text-cherry-dark">SUBSCRIPT</h3>
                  <p className="text-xs text-espresso-muted mt-0.5">Recurring Enterprise Solutions</p>
                  <p className="text-[11px] text-stone-400">450 Lexington Ave, New York, NY</p>
                </div>
                <div className="text-right">
                  <Badge status={selectedQuote.status} className="mb-1" />
                  <p className="text-xs font-mono font-bold text-espresso">{selectedQuote.quotationNumber}</p>
                  <p className="text-[11px] text-stone-500">Issued: {selectedQuote.issueDate}</p>
                  <p className="text-[11px] text-stone-500">Valid Until: {selectedQuote.validUntil}</p>
                </div>
              </div>

              {/* Customer Info */}
              <div className="text-xs">
                <span className="text-[10px] uppercase font-bold text-espresso-muted block">Quotation For:</span>
                <p className="font-bold text-espresso text-sm mt-0.5">{selectedQuote.customerName}</p>
                <p className="text-espresso-muted">Attention: Procurement & Finance Department</p>
              </div>

              {/* Line Items Table */}
              <div className="overflow-x-auto pt-2">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-stone-warm text-espresso-muted uppercase font-semibold">
                      <th className="py-2">Item Description</th>
                      <th className="py-2 text-center">Qty</th>
                      <th className="py-2 text-right">Unit Price</th>
                      <th className="py-2 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-warm/50">
                    {selectedQuote.lineItems?.map((item, idx) => (
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

              {/* Totals Breakdown */}
              <div className="pt-3 border-t border-stone-warm flex justify-end">
                <div className="w-64 space-y-1.5 text-xs">
                  <div className="flex justify-between text-espresso-muted">
                    <span>Subtotal:</span>
                    <span className="font-mono">${selectedQuote.subtotal?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-espresso-muted">
                    <span>Tax (8%):</span>
                    <span className="font-mono">${selectedQuote.tax?.toLocaleString()}</span>
                  </div>
                  {selectedQuote.discount > 0 && (
                    <div className="flex justify-between text-emerald-800">
                      <span>Discount Applied:</span>
                      <span className="font-mono">-${selectedQuote.discount?.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-sm text-espresso pt-2 border-t border-stone-warm">
                    <span>Total Estimated:</span>
                    <span className="font-mono text-cherry-dark font-black">
                      ${selectedQuote.total?.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-stone-warm">
              <div className="flex flex-wrap items-center gap-2">
                {selectedQuote.status === 'Draft' && (
                  <Button
                    variant="primary"
                    size="sm"
                    icon={Send}
                    onClick={() => {
                      updateQuotationStatus(selectedQuote.id, 'Sent');
                      setSelectedQuote({ ...selectedQuote, status: 'Sent' });
                    }}
                  >
                    Mark Sent to Client
                  </Button>
                )}

                {selectedQuote.status === 'Sent' && (
                  <>
                    <Button
                      variant="primary"
                      size="sm"
                      icon={CheckCircle2}
                      onClick={() => {
                        updateQuotationStatus(selectedQuote.id, 'Accepted');
                        setSelectedQuote({ ...selectedQuote, status: 'Accepted' });
                      }}
                    >
                      Client Accepted
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      icon={XCircle}
                      onClick={() => {
                        updateQuotationStatus(selectedQuote.id, 'Rejected');
                        setSelectedQuote({ ...selectedQuote, status: 'Rejected' });
                      }}
                    >
                      Client Rejected
                    </Button>
                  </>
                )}

                {selectedQuote.status === 'Accepted' && (
                  <Button
                    variant="primary"
                    size="sm"
                    icon={Sparkles}
                    onClick={() => {
                      convertQuotationToSubscription(selectedQuote.id);
                      setIsPreviewModalOpen(false);
                    }}
                  >
                    Convert to Active Subscription & Invoice
                  </Button>
                )}
              </div>

              <Button
                variant="secondary"
                size="sm"
                icon={Printer}
                onClick={() => window.print()}
              >
                Print / Export
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Edit Quotation Modal (for Drafts) */}
      {editingQuote && (
        <Modal
          isOpen={Boolean(editingQuote)}
          onClose={() => setEditingQuote(null)}
          title={`Edit Quotation: ${editingQuote.quotationNumber}`}
          subtitle={`Client: ${editingQuote.customerName}`}
        >
          <form onSubmit={handleUpdate} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-espresso mb-1">Validity Date</label>
                <input
                  type="date"
                  value={editingQuote.validUntil}
                  onChange={(e) => setEditingQuote({ ...editingQuote, validUntil: e.target.value })}
                  className="w-full bg-ivory text-espresso text-sm p-2.5 rounded-xl border border-stone-warm focus:outline-none focus:border-cherry"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-espresso mb-1">Discount ($)</label>
                <input
                  type="number"
                  value={editingQuote.discount}
                  onChange={(e) => setEditingQuote({ ...editingQuote, discount: Number(e.target.value) })}
                  className="w-full bg-ivory text-espresso text-sm p-2.5 rounded-xl border border-stone-warm focus:outline-none focus:border-cherry font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-espresso mb-1">Internal Notes</label>
              <textarea
                rows={2}
                value={editingQuote.notes || ''}
                onChange={(e) => setEditingQuote({ ...editingQuote, notes: e.target.value })}
                className="w-full bg-ivory text-espresso text-sm p-2.5 rounded-xl border border-stone-warm focus:outline-none focus:border-cherry"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-warm">
              <Button type="button" variant="secondary" onClick={() => setEditingQuote(null)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                Save Quotation
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Create Quotation Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Draft Commercial Quotation"
        subtitle="Prepare an estimate with line items, tax rates, and discount vouchers."
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-espresso mb-1">Select Client</label>
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
              <label className="block text-xs font-semibold text-espresso mb-1">Validity Expiration Date</label>
              <input
                type="date"
                required
                value={form.validUntil}
                onChange={(e) => setForm({ ...form, validUntil: e.target.value })}
                className="w-full bg-ivory text-espresso text-sm p-2.5 rounded-xl border border-stone-warm focus:outline-none focus:border-cherry"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-espresso mb-1">Discount Deduction ($)</label>
              <input
                type="number"
                value={form.discount}
                onChange={(e) => setForm({ ...form, discount: Number(e.target.value) })}
                className="w-full bg-ivory text-espresso text-sm p-2.5 rounded-xl border border-stone-warm focus:outline-none focus:border-cherry font-mono"
              />
            </div>
          </div>

          <div className="p-3 rounded-xl bg-champagne-light border border-stone-warm space-y-3">
            <span className="text-xs font-bold text-espresso block">Primary Line Item</span>
            <div>
              <label className="block text-[11px] text-espresso-muted mb-1">Service / Product Description</label>
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
                <label className="block text-[11px] text-espresso-muted mb-1">Quantity / Nodes</label>
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
              Generate Quotation
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(deletingQuoteId)}
        onClose={() => setDeletingQuoteId(null)}
        onConfirm={() => {
          if (deletingQuoteId) {
            deleteQuotation(deletingQuoteId);
            setDeletingQuoteId(null);
          }
        }}
        title="Delete Quotation"
        description="Are you sure you wish to delete this proposal? This action cannot be reversed."
        confirmText="Confirm Delete"
        danger={true}
      />
    </div>
  );
};
