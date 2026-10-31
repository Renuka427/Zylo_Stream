import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  RefreshCw,
  CreditCard,
  Calendar,
  Receipt,
  ArrowRight,
  CheckCircle,
  Clock,
  Compass,
  FileText,
  User,
  ShieldCheck,
  Eye,
  AlertCircle,
  X
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useMockData } from '../../contexts/MockDataContext';
import { Button } from '../../components/ui/Button';

export const CustomerDashboardPage = () => {
  const { user } = useAuth();
  const {
    customerSubscriptions,
    customerInvoices,
    customerPayments
  } = useMockData();

  const [selectedSub, setSelectedSub] = useState(null);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  // Derived KPI calculations from customer-scoped records
  const activeSubs = customerSubscriptions?.filter((s) => s.status === 'active') || [];
  const monthlyCost = customerSubscriptions
    ?.filter((s) => s.status === 'active')
    .reduce((sum, s) => {
      if (s.billingInterval?.toLowerCase() === 'weekly') return sum + s.amount * 4;
      if (s.billingInterval?.toLowerCase() === 'yearly') return sum + Math.round(s.amount / 12);
      return sum + s.amount;
    }, 0) || 0;

  const nextRenewalSub = customerSubscriptions
    ?.filter((s) => s.status === 'active')
    .sort((a, b) => new Date(a.renewalDate) - new Date(b.renewalDate))[0];

  const outstandingBalance = customerInvoices
    ?.filter((inv) => inv.status !== 'Paid')
    .reduce((sum, inv) => sum + (inv.outstandingAmount || inv.total || 0), 0) || 0;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* 1. Welcome Header */}
      <div className="bg-ivory rounded-3xl border border-stone-warm shadow-luxury p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2 z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-champagne-light border border-stone-warm text-[10px] font-bold text-cherry-dark uppercase tracking-widest">
            <span className="w-1.5 h-1.5 rounded-full bg-cherry animate-pulse" />
            <span>ACTIVE CLIENT PORTAL</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-black text-espresso tracking-tight">
            Welcome back, {user?.name || 'Eleanor Vance'}
          </h1>
          <p className="text-xs sm:text-sm text-espresso-muted max-w-xl leading-relaxed">
            Your subscriptions, all in one place. View your contracts, upcoming renewals, and payment receipts with clear operational visibility.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 z-10 shrink-0">
          <Link to="/customer/plans">
            <Button variant="primary" size="sm" icon={Compass}>
              Explore Plans
            </Button>
          </Link>
          <Link to="/customer/support">
            <Button variant="outline" size="sm">
              Need Help?
            </Button>
          </Link>
        </div>

        {/* Ambient background accent */}
        <div className="absolute right-0 top-0 w-80 h-full bg-gradient-to-l from-champagne-gold/10 to-transparent pointer-events-none" />
      </div>

      {/* 2. Four KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Card 1: Active Subscriptions */}
        <div className="bg-ivory rounded-2xl border border-stone-warm shadow-luxury p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-espresso-muted">
              Active Subscriptions
            </span>
            <div className="w-8 h-8 rounded-xl bg-champagne-light border border-stone-warm flex items-center justify-center text-cherry">
              <RefreshCw className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <span className="font-display text-2xl sm:text-3xl font-black text-espresso">
              {activeSubs.length}
            </span>
            <span className="text-xs text-espresso-muted ml-2 font-medium">contracted services</span>
          </div>
          <div className="mt-3 pt-3 border-t border-stone-warm/50 flex items-center gap-1.5 text-[11px] text-emerald-700 font-semibold">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>All active in good standing</span>
          </div>
        </div>

        {/* Card 2: Monthly Subscription Cost */}
        <div className="bg-ivory rounded-2xl border border-stone-warm shadow-luxury p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-espresso-muted">
              Monthly Cost
            </span>
            <div className="w-8 h-8 rounded-xl bg-champagne-light border border-stone-warm flex items-center justify-center text-champagne-gold">
              <CreditCard className="w-4 h-4 text-cherry" />
            </div>
          </div>
          <div className="mt-4">
            <span className="font-display text-2xl sm:text-3xl font-black text-espresso">
              ${monthlyCost.toLocaleString('en-US')}
            </span>
            <span className="text-xs text-espresso-muted ml-1">/ month</span>
          </div>
          <div className="mt-3 pt-3 border-t border-stone-warm/50 text-[11px] text-espresso-muted">
            Auto-debited on regular renewal cycles
          </div>
        </div>

        {/* Card 3: Upcoming Renewals */}
        <div className="bg-ivory rounded-2xl border border-stone-warm shadow-luxury p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-espresso-muted">
              Next Renewal
            </span>
            <div className="w-8 h-8 rounded-xl bg-champagne-light border border-stone-warm flex items-center justify-center text-champagne-gold">
              <Calendar className="w-4 h-4 text-cherry-dark" />
            </div>
          </div>
          <div className="mt-4">
            <span className="font-display text-xl sm:text-2xl font-black text-espresso">
              {nextRenewalSub ? nextRenewalSub.renewalDate : 'None'}
            </span>
            <p className="text-[11px] text-espresso-muted mt-0.5 truncate">
              {nextRenewalSub ? `${nextRenewalSub.planName} ($${nextRenewalSub.amount})` : 'All cycles up to date'}
            </p>
          </div>
          <div className="mt-3 pt-3 border-t border-stone-warm/50 flex items-center gap-1.5 text-[11px] text-cherry-dark font-medium">
            <Clock className="w-3.5 h-3.5 text-champagne-gold" />
            <span>Auto-renewal active</span>
          </div>
        </div>

        {/* Card 4: Outstanding Balance */}
        <div className="bg-ivory rounded-2xl border border-stone-warm shadow-luxury p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-espresso-muted">
              Outstanding Balance
            </span>
            <div className="w-8 h-8 rounded-xl bg-champagne-light border border-stone-warm flex items-center justify-center text-cherry">
              <Receipt className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <span className="font-display text-2xl sm:text-3xl font-black text-espresso">
              ${outstandingBalance.toLocaleString('en-US')}
            </span>
            <span className="text-xs text-espresso-muted ml-1.5">due</span>
          </div>
          <div className="mt-3 pt-3 border-t border-stone-warm/50 text-[11px] text-espresso-muted">
            {outstandingBalance > 0 ? '1 pending billing statement' : 'Zero outstanding balance'}
          </div>
        </div>
      </div>

      {/* 3. Main Dashboard Sections Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols): My Subscriptions + Recent Invoices */}
        <div className="lg:col-span-2 space-y-6">
          {/* SECTION A: MY SUBSCRIPTIONS */}
          <div className="bg-ivory rounded-3xl border border-stone-warm shadow-luxury p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display text-lg font-bold text-espresso">My Subscriptions</h3>
                <p className="text-xs text-espresso-muted">Active recurring service commitments</p>
              </div>
              <Link
                to="/customer/subscriptions"
                className="text-xs font-bold text-cherry hover:underline inline-flex items-center gap-1"
              >
                <span>Manage all</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="space-y-3">
              {customerSubscriptions?.map((sub) => (
                <div
                  key={sub.id}
                  className="p-4 rounded-2xl bg-champagne-light/60 border border-stone-warm flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-cherry/50 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] font-bold text-cherry-dark bg-champagne px-2 py-0.5 rounded">
                        {sub.subscriptionNumber}
                      </span>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold capitalize bg-emerald-100 text-emerald-800">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                        {sub.status}
                      </span>
                    </div>
                    <h4 className="font-display text-sm font-bold text-espresso">{sub.planName}</h4>
                    <p className="text-xs text-espresso-muted">
                      ${sub.amount} &bull; {sub.billingInterval} cycle &bull; Next renewal: {sub.renewalDate}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs"
                      icon={Eye}
                      onClick={() => setSelectedSub(sub)}
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION C: RECENT INVOICES */}
          <div className="bg-ivory rounded-3xl border border-stone-warm shadow-luxury p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display text-lg font-bold text-espresso">Recent Invoices</h3>
                <p className="text-xs text-espresso-muted">Billing statements and receipt summaries</p>
              </div>
              <Link
                to="/customer/invoices"
                className="text-xs font-bold text-cherry hover:underline inline-flex items-center gap-1"
              >
                <span>View all invoices</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-stone-warm text-[10px] font-bold uppercase tracking-wider text-espresso-muted">
                    <th className="pb-2.5">Invoice #</th>
                    <th className="pb-2.5">Issue Date</th>
                    <th className="pb-2.5">Due Date</th>
                    <th className="pb-2.5">Amount</th>
                    <th className="pb-2.5">Status</th>
                    <th className="pb-2.5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-warm/60">
                  {customerInvoices?.slice(0, 3).map((inv) => (
                    <tr key={inv.id} className="hover:bg-champagne-light/40 transition-colors">
                      <td className="py-3 font-mono font-bold text-espresso">{inv.invoiceNumber}</td>
                      <td className="py-3 text-espresso-muted">{inv.issueDate}</td>
                      <td className="py-3 text-espresso-muted">{inv.dueDate}</td>
                      <td className="py-3 font-bold text-espresso">${inv.total?.toLocaleString('en-US')}</td>
                      <td className="py-3">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            inv.status === 'Paid'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {inv.status}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        <button
                          onClick={() => setSelectedInvoice(inv)}
                          className="text-cherry hover:text-cherry-dark font-semibold text-xs"
                        >
                          View Invoice
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column (1 Col): Upcoming Renewals, Recent Payments, Quick Actions */}
        <div className="space-y-6">
          {/* SECTION B: UPCOMING RENEWALS */}
          <div className="bg-ivory rounded-3xl border border-stone-warm shadow-luxury p-6 space-y-4">
            <h3 className="font-display text-base font-bold text-espresso">Upcoming Renewals</h3>
            <div className="space-y-3">
              {customerSubscriptions?.map((sub) => (
                <div
                  key={sub.id}
                  className="p-3.5 rounded-2xl bg-champagne-light/50 border border-stone-warm space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-espresso">{sub.planName}</span>
                    <span className="font-bold text-cherry">${sub.amount}</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-espresso-muted">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-champagne-gold" />
                      {sub.renewalDate}
                    </span>
                    <span className="text-[10px] bg-champagne px-1.5 py-0.5 rounded font-mono">
                      {sub.autoRenew ? 'Auto-Debit' : 'Manual'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION D: RECENT PAYMENTS */}
          <div className="bg-ivory rounded-3xl border border-stone-warm shadow-luxury p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-base font-bold text-espresso">Recent Payments</h3>
              <Link to="/customer/payments" className="text-xs text-cherry hover:underline font-semibold">
                History
              </Link>
            </div>
            <div className="space-y-2.5">
              {customerPayments?.slice(0, 3).map((pay) => (
                <div
                  key={pay.id}
                  className="p-3 rounded-xl bg-white border border-stone-warm flex items-center justify-between text-xs"
                >
                  <div>
                    <p className="font-bold text-espresso">${pay.amount}</p>
                    <p className="text-[10px] text-espresso-muted">{pay.paymentMethod}</p>
                    <p className="text-[9px] font-mono text-stone-400">{pay.paymentDate}</p>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    {pay.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION E: QUICK ACTIONS */}
          <div className="bg-gradient-to-br from-cherry-dark to-cherry text-ivory rounded-3xl p-6 space-y-4 shadow-luxury">
            <h3 className="font-display text-base font-bold text-ivory">Quick Actions</h3>
            <div className="space-y-2 text-xs">
              <Link
                to="/customer/plans"
                className="flex items-center justify-between p-2.5 rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Compass className="w-4 h-4 text-champagne-gold" />
                  <span>Explore Plans</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>

              <Link
                to="/customer/invoices"
                className="flex items-center justify-between p-2.5 rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-champagne-gold" />
                  <span>View All Invoices</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>

              <Link
                to="/customer/payments"
                className="flex items-center justify-between p-2.5 rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-champagne-gold" />
                  <span>View Payment History</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>

              <Link
                to="/customer/profile"
                className="flex items-center justify-between p-2.5 rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-champagne-gold" />
                  <span>Update Profile</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Subscription Details Modal */}
      {selectedSub && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-espresso/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-ivory rounded-3xl border border-stone-warm shadow-luxury max-w-lg w-full p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-stone-warm">
              <div>
                <span className="font-mono text-xs font-bold text-cherry-dark">
                  {selectedSub.subscriptionNumber}
                </span>
                <h3 className="font-display text-xl font-bold text-espresso">{selectedSub.planName}</h3>
              </div>
              <button
                onClick={() => setSelectedSub(null)}
                className="p-1.5 rounded-lg text-espresso-muted hover:text-espresso hover:bg-champagne"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-champagne-light border border-stone-warm">
                <span className="text-espresso-muted block text-[10px] uppercase font-bold">Billing Cycle</span>
                <span className="font-bold text-espresso mt-0.5 block">{selectedSub.billingInterval}</span>
              </div>
              <div className="p-3 rounded-xl bg-champagne-light border border-stone-warm">
                <span className="text-espresso-muted block text-[10px] uppercase font-bold">Subscription Cost</span>
                <span className="font-bold text-espresso mt-0.5 block">${selectedSub.amount}</span>
              </div>
              <div className="p-3 rounded-xl bg-champagne-light border border-stone-warm">
                <span className="text-espresso-muted block text-[10px] uppercase font-bold">Start Date</span>
                <span className="font-bold text-espresso mt-0.5 block">{selectedSub.startDate}</span>
              </div>
              <div className="p-3 rounded-xl bg-champagne-light border border-stone-warm">
                <span className="text-espresso-muted block text-[10px] uppercase font-bold">Next Renewal</span>
                <span className="font-bold text-espresso mt-0.5 block">{selectedSub.renewalDate}</span>
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold text-espresso uppercase tracking-wider">Included Features</span>
              <ul className="space-y-1.5 text-xs text-espresso-muted">
                {selectedSub.features?.map((f, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-4 border-t border-stone-warm flex items-center justify-end gap-2">
              <Button variant="outline" size="sm" onClick={() => setSelectedSub(null)}>
                Close
              </Button>
              <Link to="/customer/subscriptions" onClick={() => setSelectedSub(null)}>
                <Button variant="primary" size="sm">
                  Go to Subscriptions
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Invoice Details Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-espresso/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-ivory rounded-3xl border border-stone-warm shadow-luxury max-w-lg w-full p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-stone-warm">
              <div>
                <span className="font-mono text-xs font-bold text-cherry-dark">
                  {selectedInvoice.invoiceNumber}
                </span>
                <h3 className="font-display text-xl font-bold text-espresso">Invoice Summary</h3>
              </div>
              <button
                onClick={() => setSelectedInvoice(null)}
                className="p-1.5 rounded-lg text-espresso-muted hover:text-espresso hover:bg-champagne"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-espresso-muted">Client:</span>
                <span className="font-bold text-espresso">{selectedInvoice.customerName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-espresso-muted">Issue Date:</span>
                <span className="font-mono">{selectedInvoice.issueDate}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-espresso-muted">Due Date:</span>
                <span className="font-mono">{selectedInvoice.dueDate}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-espresso-muted">Status:</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                  {selectedInvoice.status}
                </span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-stone-warm font-bold text-sm">
                <span>Total Amount:</span>
                <span className="text-cherry">${selectedInvoice.total}</span>
              </div>
            </div>

            <div className="pt-4 border-t border-stone-warm flex items-center justify-end gap-2">
              <Button variant="outline" size="sm" onClick={() => setSelectedInvoice(null)}>
                Close
              </Button>
              <Link to="/customer/invoices" onClick={() => setSelectedInvoice(null)}>
                <Button variant="primary" size="sm">
                  View Full Invoice
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
