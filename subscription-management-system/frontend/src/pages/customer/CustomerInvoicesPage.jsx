import React, { useState } from 'react';
import {
  Receipt,
  Search,
  Filter,
  Download,
  Printer,
  Calendar,
  CheckCircle,
  Clock,
  Eye,
  X,
  Sparkles
} from 'lucide-react';
import { useMockData } from '../../contexts/MockDataContext';
import { Button } from '../../components/ui/Button';
import { ZyloLogo } from '../../components/brand/ZyloLogo';

export const CustomerInvoicesPage = () => {
  const { customerInvoices } = useMockData();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  const filteredInvoices = customerInvoices?.filter((inv) => {
    const matchesSearch =
      inv.invoiceNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.customerName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === 'all' || inv.status?.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  }) || [];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-black text-espresso tracking-tight">
            My Invoices
          </h1>
          <p className="text-xs sm:text-sm text-espresso-muted">
            Search, review, and print invoices issued to your client account.
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-ivory rounded-2xl border border-stone-warm shadow-luxury p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search invoice number..."
            className="w-full bg-champagne-light/50 text-espresso pl-9 pr-3 py-2 rounded-xl border border-stone-warm text-xs focus:outline-none focus:border-cherry"
          />
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
          {['all', 'paid', 'pending'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all ${
                statusFilter === status
                  ? 'bg-cherry text-ivory shadow-sm'
                  : 'text-espresso-muted hover:text-espresso hover:bg-champagne/60'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Invoices Table Card */}
      <div className="bg-ivory rounded-3xl border border-stone-warm shadow-luxury overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-champagne-light border-b border-stone-warm text-[10px] font-bold uppercase tracking-wider text-espresso-muted">
                <th className="py-3 px-5">Invoice #</th>
                <th className="py-3 px-4">Issue Date</th>
                <th className="py-3 px-4">Due Date</th>
                <th className="py-3 px-4">Subtotal</th>
                <th className="py-3 px-4">Tax / Total</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-warm/60">
              {filteredInvoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-champagne-light/40 transition-colors">
                  <td className="py-4 px-5">
                    <span className="font-mono font-bold text-cherry-dark bg-champagne px-2 py-0.5 rounded">
                      {inv.invoiceNumber}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-espresso-muted font-mono">{inv.issueDate}</td>
                  <td className="py-4 px-4 text-espresso-muted font-mono">{inv.dueDate}</td>
                  <td className="py-4 px-4 text-espresso font-medium">${inv.subtotal}</td>
                  <td className="py-4 px-4 font-bold text-espresso">${inv.total}</td>
                  <td className="py-4 px-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        inv.status === 'Paid'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {inv.status === 'Paid' ? (
                        <CheckCircle className="w-3 h-3 text-emerald-600" />
                      ) : (
                        <Clock className="w-3 h-3 text-amber-600" />
                      )}
                      <span>{inv.status}</span>
                    </span>
                  </td>
                  <td className="py-4 px-5 text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs"
                      icon={Eye}
                      onClick={() => setSelectedInvoice(inv)}
                    >
                      View & Print
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredInvoices.length === 0 && (
          <div className="p-12 text-center space-y-2">
            <Receipt className="w-8 h-8 text-stone-300 mx-auto" />
            <p className="font-display text-sm font-bold text-espresso">No Invoices Found</p>
            <p className="text-xs text-espresso-muted">Try adjusting your search criteria or filter tabs.</p>
          </div>
        )}
      </div>

      {/* Printable Invoice Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-espresso/60 backdrop-blur-sm animate-in fade-in overflow-y-auto">
          <div className="bg-ivory rounded-3xl border border-stone-warm shadow-luxury max-w-2xl w-full p-8 sm:p-10 space-y-6 my-8">
            {/* Modal Actions Header */}
            <div className="flex items-center justify-between pb-4 border-b border-stone-warm print:hidden">
              <span className="text-xs font-bold text-espresso-muted uppercase tracking-wider">
                Official Billing Document
              </span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  icon={Printer}
                  className="text-xs"
                  onClick={() => window.print()}
                >
                  Print Invoice
                </Button>
                <button
                  onClick={() => setSelectedInvoice(null)}
                  className="p-1.5 rounded-lg text-espresso-muted hover:text-espresso"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Printable Document Body */}
            <div className="space-y-6">
              {/* Top Document Header */}
              <div className="flex items-start justify-between">
                <div>
                  <ZyloLogo variant="dark" size="sm" showWordmark={true} showTagline={true} />
                  <p className="text-[11px] text-espresso-muted mt-2">
                    Zylo Stream Recurring Cloud Operations<br />
                    100 Binney St, Cambridge, MA 02142<br />
                    tax-id: US-8829102-ZY
                  </p>
                </div>

                <div className="text-right">
                  <h2 className="font-display text-2xl font-black text-espresso">INVOICE</h2>
                  <p className="font-mono text-sm font-bold text-cherry-dark mt-1">
                    {selectedInvoice.invoiceNumber}
                  </p>
                  <p className="text-[11px] text-espresso-muted mt-1">
                    Issued: {selectedInvoice.issueDate}<br />
                    Due: {selectedInvoice.dueDate}
                  </p>
                </div>
              </div>

              {/* Billed To */}
              <div className="p-4 rounded-2xl bg-champagne-light border border-stone-warm flex justify-between text-xs">
                <div>
                  <span className="text-[10px] font-bold uppercase text-espresso-muted block">Billed To</span>
                  <p className="font-bold text-espresso text-sm mt-0.5">{selectedInvoice.customerName}</p>
                  <p className="text-espresso-muted">Eleanor Vance &bull; Acme Creative Studio</p>
                  <p className="text-espresso-muted">450 Lexington Ave, New York, NY 10017</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold uppercase text-espresso-muted block">Status</span>
                  <span
                    className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-bold uppercase ${
                      selectedInvoice.status === 'Paid'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {selectedInvoice.status}
                  </span>
                </div>
              </div>

              {/* Line Items Table */}
              <table className="w-full text-left text-xs border border-stone-warm rounded-xl overflow-hidden">
                <thead className="bg-champagne border-b border-stone-warm text-[10px] uppercase font-bold text-espresso">
                  <tr>
                    <th className="py-2.5 px-3">Description</th>
                    <th className="py-2.5 px-3 text-center">Qty</th>
                    <th className="py-2.5 px-3 text-right">Unit Price</th>
                    <th className="py-2.5 px-3 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-warm/50">
                  {selectedInvoice.lineItems?.map((item, idx) => (
                    <tr key={idx}>
                      <td className="py-3 px-3 font-medium text-espresso">{item.description}</td>
                      <td className="py-3 px-3 text-center text-espresso-muted">{item.quantity}</td>
                      <td className="py-3 px-3 text-right font-mono">${item.unitPrice}</td>
                      <td className="py-3 px-3 text-right font-bold text-espresso font-mono">${item.total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Calculations Totals */}
              <div className="flex justify-end">
                <div className="w-64 space-y-1.5 text-xs">
                  <div className="flex justify-between text-espresso-muted">
                    <span>Subtotal:</span>
                    <span className="font-mono font-medium">${selectedInvoice.subtotal}</span>
                  </div>
                  <div className="flex justify-between text-espresso-muted">
                    <span>Tax (8%):</span>
                    <span className="font-mono font-medium">${selectedInvoice.tax || 0}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-stone-warm font-bold text-sm text-espresso">
                    <span>Total Due:</span>
                    <span className="font-mono text-cherry">${selectedInvoice.total}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Bottom */}
            <div className="pt-4 border-t border-stone-warm flex items-center justify-between text-xs text-espresso-muted print:hidden">
              <span>Electronic demonstration statement &bull; No physical check required</span>
              <Button variant="outline" size="sm" onClick={() => setSelectedInvoice(null)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
