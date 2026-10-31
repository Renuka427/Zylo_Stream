import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  RefreshCw,
  Calendar,
  CheckCircle,
  CreditCard,
  AlertTriangle,
  Info,
  Eye,
  Slash,
  ToggleLeft,
  ToggleRight,
  Compass,
  X
} from 'lucide-react';
import { useMockData } from '../../contexts/MockDataContext';
import { Button } from '../../components/ui/Button';

export const CustomerSubscriptionsPage = () => {
  const {
    customerSubscriptions,
    cancelCustomerSubscription,
    toggleCustomerAutoRenew
  } = useMockData();

  const [activeTab, setActiveTab] = useState('all');
  const [selectedSub, setSelectedSub] = useState(null);

  const filteredSubs = customerSubscriptions?.filter((sub) => {
    if (activeTab === 'all') return true;
    return sub.status?.toLowerCase() === activeTab.toLowerCase();
  }) || [];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-black text-espresso tracking-tight">
            My Subscriptions
          </h1>
          <p className="text-xs sm:text-sm text-espresso-muted">
            Manage your active contracted services, renewal intervals, and billing preferences.
          </p>
        </div>

        <Link to="/customer/plans">
          <Button variant="primary" size="sm" icon={Compass}>
            Explore More Plans
          </Button>
        </Link>
      </div>

      {/* Demo Simulation Notice Banner */}
      <div className="p-3.5 rounded-2xl bg-champagne-light border border-stone-warm flex items-start gap-3 text-xs">
        <Info className="w-4 h-4 text-cherry shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold text-espresso">Client Demonstration Sandbox</p>
          <p className="text-[11px] text-espresso-muted leading-relaxed">
            All subscriptions shown belong exclusively to your client account. Changes like auto-renew toggles and plan cancellations update client-side mock state instantly.
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-stone-warm pb-3 overflow-x-auto">
        {['all', 'active', 'paused', 'canceled'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all ${
              activeTab === tab
                ? 'bg-cherry text-ivory shadow-sm'
                : 'text-espresso-muted hover:text-espresso hover:bg-champagne/60'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Subscription Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredSubs.map((sub) => (
          <div
            key={sub.id}
            className="bg-ivory rounded-3xl border border-stone-warm shadow-luxury p-6 flex flex-col justify-between space-y-5"
          >
            <div className="space-y-4">
              {/* Card Top */}
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-cherry-dark bg-champagne-light px-2.5 py-1 rounded-lg border border-stone-warm">
                  {sub.subscriptionNumber}
                </span>

                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold capitalize ${
                    sub.status === 'active'
                      ? 'bg-emerald-100 text-emerald-800'
                      : sub.status === 'paused'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-stone-200 text-stone-700'
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      sub.status === 'active' ? 'bg-emerald-600' : 'bg-stone-500'
                    }`}
                  />
                  {sub.status}
                </span>
              </div>

              {/* Title & Price */}
              <div>
                <h3 className="font-display text-xl font-bold text-espresso">{sub.planName}</h3>
                <div className="mt-1 flex items-baseline gap-1">
                  <span className="font-display text-2xl font-black text-espresso">${sub.amount}</span>
                  <span className="text-xs text-espresso-muted">/ {sub.billingInterval}</span>
                </div>
              </div>

              {/* Parameters Grid */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-champagne-light/50 border border-stone-warm">
                  <span className="text-[10px] uppercase font-bold text-espresso-muted block">Next Renewal</span>
                  <span className="font-bold text-espresso mt-0.5 block">{sub.renewalDate}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-champagne-light/50 border border-stone-warm">
                  <span className="text-[10px] uppercase font-bold text-espresso-muted block">Payment Method</span>
                  <span className="font-bold text-espresso mt-0.5 block truncate">{sub.paymentMethod}</span>
                </div>
              </div>

              {/* Features List */}
              <div className="space-y-1.5 pt-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-espresso-muted block">
                  Included Privileges
                </span>
                <ul className="space-y-1 text-xs text-espresso-muted">
                  {sub.features?.map((f, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span className="truncate">{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Actions Footer */}
            <div className="pt-4 border-t border-stone-warm flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleCustomerAutoRenew(sub.id)}
                  className="inline-flex items-center gap-1.5 text-xs text-espresso-muted hover:text-espresso font-medium"
                  title="Toggle auto-renewal"
                >
                  {sub.autoRenew ? (
                    <>
                      <ToggleRight className="w-5 h-5 text-emerald-600" />
                      <span className="text-[11px]">Auto-Renew: On</span>
                    </>
                  ) : (
                    <>
                      <ToggleLeft className="w-5 h-5 text-stone-400" />
                      <span className="text-[11px]">Auto-Renew: Off</span>
                    </>
                  )}
                </button>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  onClick={() => setSelectedSub(sub)}
                >
                  Details
                </Button>

                {sub.status === 'active' && (
                  <Button
                    variant="danger"
                    size="sm"
                    className="text-xs"
                    onClick={() => cancelCustomerSubscription(sub.id)}
                  >
                    Cancel Plan
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredSubs.length === 0 && (
        <div className="bg-ivory rounded-3xl border border-stone-warm shadow-luxury p-12 text-center space-y-3">
          <RefreshCw className="w-8 h-8 text-stone-300 mx-auto" />
          <h3 className="font-display text-lg font-bold text-espresso">No Subscriptions Found</h3>
          <p className="text-xs text-espresso-muted max-w-sm mx-auto">
            You do not currently have any subscriptions matching this filter tab.
          </p>
        </div>
      )}

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
                <span className="text-espresso-muted block text-[10px] uppercase font-bold">Rate</span>
                <span className="font-bold text-espresso mt-0.5 block">${selectedSub.amount}</span>
              </div>
              <div className="p-3 rounded-xl bg-champagne-light border border-stone-warm">
                <span className="text-espresso-muted block text-[10px] uppercase font-bold">Contract Start</span>
                <span className="font-bold text-espresso mt-0.5 block">{selectedSub.startDate}</span>
              </div>
              <div className="p-3 rounded-xl bg-champagne-light border border-stone-warm">
                <span className="text-espresso-muted block text-[10px] uppercase font-bold">Renewal Date</span>
                <span className="font-bold text-espresso mt-0.5 block">{selectedSub.renewalDate}</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-champagne-light/50 border border-stone-warm text-xs space-y-1">
              <span className="text-[10px] font-bold uppercase text-espresso-muted block">Notes</span>
              <p className="text-espresso-muted">{selectedSub.notes || 'No special terms noted.'}</p>
            </div>

            <div className="pt-4 border-t border-stone-warm flex items-center justify-end gap-2">
              <Button variant="outline" size="sm" onClick={() => setSelectedSub(null)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
