import React from 'react';
import {
  CreditCard,
  CheckCircle,
  ShieldCheck,
  Calendar,
  Lock,
  ArrowUpRight,
  Info
} from 'lucide-react';
import { useMockData } from '../../contexts/MockDataContext';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../../components/ui/Button';

export const CustomerPaymentsPage = () => {
  const { customerPayments } = useMockData();
  const { user } = useAuth();

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-black text-espresso tracking-tight">
          Payment History &amp; Methods
        </h1>
        <p className="text-xs sm:text-sm text-espresso-muted">
          Review processed subscription settlements and manage your preferred recurring payment credentials.
        </p>
      </div>

      {/* Payment Method Overview Card */}
      <div className="bg-ivory rounded-3xl border border-stone-warm shadow-luxury p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-cherry-light border border-cherry/20 text-cherry flex items-center justify-center shrink-0">
            <CreditCard className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-espresso-muted block">
              Default Auto-Debit Method
            </span>
            <h3 className="font-display text-lg font-bold text-espresso">
              {user?.defaultPaymentMethod || 'Visa ending in 4421'}
            </h3>
            <p className="text-xs text-espresso-muted">
              Expires 08/28 &bull; Linked to billing contact {user?.email || 'eleanor.vance@acmestudio.io'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>Verified &amp; Active</span>
          </span>
        </div>
      </div>

      {/* PCI DSS Simulation Disclaimer */}
      <div className="p-3.5 rounded-2xl bg-champagne-light border border-stone-warm flex items-start gap-3 text-xs">
        <ShieldCheck className="w-4 h-4 text-cherry shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold text-espresso">PCI-DSS Tokenization Architecture</p>
          <p className="text-[11px] text-espresso-muted leading-relaxed">
            In production, card credentials are tokenized through Stripe or Adyen vaults. In this hackathon frontend demonstration, all payment records are client-simulated and zero raw PAN data is stored.
          </p>
        </div>
      </div>

      {/* Payment Transactions Table */}
      <div className="bg-ivory rounded-3xl border border-stone-warm shadow-luxury overflow-hidden space-y-4 p-6">
        <h3 className="font-display text-lg font-bold text-espresso">
          Historical Transactions
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-stone-warm text-[10px] font-bold uppercase tracking-wider text-espresso-muted">
                <th className="pb-3">Payment #</th>
                <th className="pb-3">Date</th>
                <th className="pb-3">Transaction Reference</th>
                <th className="pb-3">Payment Method</th>
                <th className="pb-3">Amount</th>
                <th className="pb-3 text-right">Settlement Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-warm/60">
              {customerPayments?.map((pay) => (
                <tr key={pay.id} className="hover:bg-champagne-light/40 transition-colors">
                  <td className="py-4 font-mono font-bold text-espresso">{pay.paymentNumber}</td>
                  <td className="py-4 text-espresso-muted font-mono">{pay.paymentDate}</td>
                  <td className="py-4 font-mono text-[11px] text-espresso-muted">
                    {pay.transactionRef}
                  </td>
                  <td className="py-4 font-medium text-espresso">{pay.paymentMethod}</td>
                  <td className="py-4 font-bold text-espresso font-mono">${pay.amount}</td>
                  <td className="py-4 text-right">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      <CheckCircle className="w-3 h-3 text-emerald-600" />
                      <span>{pay.status}</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {customerPayments?.length === 0 && (
          <div className="py-8 text-center text-xs text-espresso-muted">
            No payment records available.
          </div>
        )}
      </div>
    </div>
  );
};
