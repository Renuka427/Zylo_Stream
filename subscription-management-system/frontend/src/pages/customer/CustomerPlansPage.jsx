import React, { useState } from 'react';
import {
  Check,
  Zap,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Layers,
  HelpCircle,
  X
} from 'lucide-react';
import { useMockData } from '../../contexts/MockDataContext';
import { Button } from '../../components/ui/Button';

export const CustomerPlansPage = () => {
  const { plans, subscribeCustomerPlan, customerSubscriptions } = useMockData();
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [selectedPlanForModal, setSelectedPlanForModal] = useState(null);

  // Check which plans customer already has
  const activePlanIds = customerSubscriptions?.map((s) => s.planId) || [];

  const handleSubscribeConfirm = () => {
    if (selectedPlanForModal) {
      subscribeCustomerPlan(selectedPlanForModal, billingCycle);
      setSelectedPlanForModal(null);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-champagne-light border border-stone-warm text-[10px] font-bold text-cherry uppercase tracking-widest">
          <Sparkles className="w-3 h-3 text-champagne-gold" />
          <span>FLEXIBLE SUBSCRIPTION SCHEMES</span>
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-black text-espresso tracking-tight">
          Explore Available Plans
        </h1>
        <p className="text-xs sm:text-sm text-espresso-muted leading-relaxed">
          Scale your subscription operations effortlessly. Upgrade, switch, or add new capacity nodes anytime.
        </p>

        {/* Monthly / Annual Toggle */}
        <div className="pt-3 flex items-center justify-center gap-3">
          <span className={`text-xs font-semibold ${billingCycle === 'monthly' ? 'text-cherry font-bold' : 'text-espresso-muted'}`}>
            Monthly Billing
          </span>

          <button
            onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
            className="w-12 h-6 rounded-full bg-champagne border border-stone-warm relative p-0.5 transition-colors"
          >
            <span
              className={`block w-5 h-5 rounded-full bg-cherry shadow-sm transition-transform ${
                billingCycle === 'yearly' ? 'translate-x-6 bg-cherry-dark' : 'translate-x-0'
              }`}
            />
          </button>

          <span className={`text-xs font-semibold ${billingCycle === 'yearly' ? 'text-cherry font-bold' : 'text-espresso-muted'}`}>
            Annual Commitment{' '}
            <span className="font-mono text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-bold">
              Save 17%
            </span>
          </span>
        </div>
      </div>

      {/* Plan Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
        {plans?.filter(p => p.billingInterval === 'monthly' || p.billingInterval === 'yearly').slice(0, 3).map((plan) => {
          const isCurrentPlan = activePlanIds.includes(plan.id);
          const price = billingCycle === 'yearly'
            ? Math.round(plan.price * 10)
            : plan.price;

          return (
            <div
              key={plan.id}
              className={`rounded-3xl border p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 relative ${
                plan.highlighted
                  ? 'bg-ivory border-2 border-cherry shadow-xl ring-4 ring-cherry/5'
                  : 'bg-ivory border-stone-warm shadow-luxury hover:border-cherry/40'
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-cherry text-ivory text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full shadow-sm">
                  Recommended for Growth
                </div>
              )}

              <div className="space-y-5">
                <div>
                  <h3 className="font-display text-xl font-bold text-espresso">{plan.name}</h3>
                  <p className="text-xs text-espresso-muted mt-1 leading-snug">
                    {plan.renewalConfig || 'Automatic recurring cycles with flexible terms.'}
                  </p>
                </div>

                <div className="flex items-baseline gap-1">
                  <span className="font-display text-4xl font-black text-espresso">
                    ${price?.toLocaleString('en-US')}
                  </span>
                  <span className="text-xs text-espresso-muted">
                    / {billingCycle === 'yearly' ? 'year' : 'month'}
                  </span>
                </div>

                {/* Features */}
                <div className="space-y-2.5 pt-2 border-t border-stone-warm/60">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-espresso-muted block">
                    What&apos;s Included
                  </span>
                  <ul className="space-y-2 text-xs text-espresso-muted">
                    {plan.features?.map((f, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-cherry shrink-0 mt-0.5" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-6 mt-6 border-t border-stone-warm/60">
                {isCurrentPlan ? (
                  <Button variant="secondary" className="w-full text-xs" disabled>
                    Current Active Plan
                  </Button>
                ) : (
                  <Button
                    variant={plan.highlighted ? 'primary' : 'outline'}
                    className="w-full text-xs"
                    icon={ArrowRight}
                    onClick={() => setSelectedPlanForModal(plan)}
                  >
                    Subscribe to {plan.name}
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Plan Comparison Table */}
      <div className="bg-ivory rounded-3xl border border-stone-warm shadow-luxury p-6 sm:p-8 space-y-4">
        <h3 className="font-display text-lg font-bold text-espresso">
          Feature Comparison Matrix
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-stone-warm text-[10px] uppercase font-bold text-espresso-muted">
                <th className="py-2.5">Feature Specification</th>
                <th className="py-2.5">Starter Tier</th>
                <th className="py-2.5">Growth Accelerate</th>
                <th className="py-2.5">Enterprise Bespoke</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-warm/50 text-espresso-muted">
              <tr>
                <td className="py-3 font-semibold text-espresso">Subscribers Managed</td>
                <td className="py-3">Up to 500</td>
                <td className="py-3 font-bold text-cherry-dark">Up to 5,000</td>
                <td className="py-3">Unlimited</td>
              </tr>
              <tr>
                <td className="py-3 font-semibold text-espresso">Revenue Forecasting</td>
                <td className="py-3">Standard</td>
                <td className="py-3 font-bold text-cherry-dark">Advanced Multi-Period</td>
                <td className="py-3">Custom AI Modeling</td>
              </tr>
              <tr>
                <td className="py-3 font-semibold text-espresso">Tax Calculation Engine</td>
                <td className="py-3">Manual Rules</td>
                <td className="py-3 font-bold text-cherry-dark">Automated Nexus Engine</td>
                <td className="py-3">Global Multi-Jurisdiction</td>
              </tr>
              <tr>
                <td className="py-3 font-semibold text-espresso">SLA Response Support</td>
                <td className="py-3">Community / 24h</td>
                <td className="py-3 font-bold text-cherry-dark">4-hour Business SLA</td>
                <td className="py-3">15-minute 24/7 Hotline</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Subscribe Confirmation Modal */}
      {selectedPlanForModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-espresso/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-ivory rounded-3xl border border-stone-warm shadow-luxury max-w-md w-full p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-stone-warm">
              <h3 className="font-display text-xl font-bold text-espresso">Confirm Subscription</h3>
              <button
                onClick={() => setSelectedPlanForModal(null)}
                className="p-1 rounded-lg text-espresso-muted hover:text-espresso"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-xl bg-champagne-light border border-stone-warm space-y-1">
                <p className="font-bold text-espresso">{selectedPlanForModal.name}</p>
                <p className="text-cherry font-black text-lg">
                  ${(billingCycle === 'yearly' ? selectedPlanForModal.price * 10 : selectedPlanForModal.price)?.toLocaleString('en-US')}
                  <span className="text-xs text-espresso-muted font-normal"> / {billingCycle}</span>
                </p>
              </div>

              <div className="p-3 rounded-xl bg-champagne-light/50 border border-stone-warm text-[11px] text-espresso-muted">
                Demo notice: No real charge will occur. The plan will be added to your client profile and a demo invoice and receipt will be generated.
              </div>
            </div>

            <div className="pt-4 border-t border-stone-warm flex items-center justify-end gap-2">
              <Button variant="outline" size="sm" onClick={() => setSelectedPlanForModal(null)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" onClick={handleSubscribeConfirm}>
                Confirm Subscription
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
