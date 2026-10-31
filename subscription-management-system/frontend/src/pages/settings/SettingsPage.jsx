import React, { useState } from 'react';
import {
  Settings,
  Building,
  Percent,
  CreditCard,
  Receipt,
  Bell,
  Users,
  Save,
  Plus,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { useMockData } from '../../contexts/MockDataContext';
import { useToast } from '../../contexts/ToastContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';

export const SettingsPage = () => {
  const { settings, updateSettings } = useMockData();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState('business');
  const [formData, setFormData] = useState(settings);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('Billing Ops');

  const tabs = [
    { id: 'business', label: 'Business Profile', icon: Building },
    { id: 'tax', label: 'Tax Configuration', icon: Percent },
    { id: 'billing', label: 'Billing Preferences', icon: CreditCard },
    { id: 'invoices', label: 'Invoice Rules', icon: Receipt },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'team', label: 'Team & Access', icon: Users },
  ];

  const handleSave = (e) => {
    e.preventDefault();
    updateSettings(activeTab, formData[activeTab]);
    showToast('Preferences updated and saved to mock state!');
  };

  const handleInvite = (e) => {
    e.preventDefault();
    if (!inviteEmail) return;

    const newMember = {
      id: `usr_${Date.now()}`,
      name: inviteEmail.split('@')[0],
      email: inviteEmail,
      role: inviteRole,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
    };

    setFormData((prev) => ({
      ...prev,
      team: [...(prev.team || []), newMember]
    }));

    setIsInviteModalOpen(false);
    setInviteEmail('');
    showToast(`Invitation sent to ${inviteEmail} (${inviteRole})`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-stone-warm/60">
        <div>
          <span className="text-xs uppercase font-bold tracking-widest text-champagne-gold">
            Administration
          </span>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-espresso tracking-tight mt-0.5">
            System & Billing Preferences
          </h1>
          <p className="text-xs text-espresso-muted mt-1">
            Global tax parameters, proration policies, automated dunning, and organization roles.
          </p>
        </div>

        <Button
          variant="primary"
          icon={Save}
          onClick={handleSave}
        >
          Save Changes
        </Button>
      </div>

      {/* Tabs Navigation */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 bg-champagne/60 border border-stone-warm rounded-2xl">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-ivory text-cherry-dark shadow-sm border border-stone-warm'
                  : 'text-espresso-muted hover:text-espresso hover:bg-ivory/50'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cherry' : 'text-champagne-gold'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      <Card className="p-6">
        <form onSubmit={handleSave} className="space-y-6">
          {/* 1. Business Profile */}
          {activeTab === 'business' && (
            <div className="space-y-4">
              <h3 className="font-display text-lg font-bold text-espresso border-b border-stone-warm pb-2">
                Business & Corporate Identity
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-semibold text-espresso mb-1">Legal Corporate Name</label>
                  <input
                    type="text"
                    value={formData.business.legalName}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        business: { ...formData.business, legalName: e.target.value }
                      })
                    }
                    className="w-full bg-ivory text-espresso text-sm p-2.5 rounded-xl border border-stone-warm focus:outline-none focus:border-cherry"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-espresso mb-1">Customer-Facing Brand Name</label>
                  <input
                    type="text"
                    value={formData.business.brandName}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        business: { ...formData.business, brandName: e.target.value }
                      })
                    }
                    className="w-full bg-ivory text-espresso text-sm p-2.5 rounded-xl border border-stone-warm focus:outline-none focus:border-cherry"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-espresso mb-1">Tax ID / Employer Identification (EIN)</label>
                  <input
                    type="text"
                    value={formData.business.taxId}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        business: { ...formData.business, taxId: e.target.value }
                      })
                    }
                    className="w-full bg-ivory text-espresso text-sm p-2.5 rounded-xl border border-stone-warm focus:outline-none focus:border-cherry font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-espresso mb-1">Billing Support Email</label>
                  <input
                    type="email"
                    value={formData.business.supportEmail}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        business: { ...formData.business, supportEmail: e.target.value }
                      })
                    }
                    className="w-full bg-ivory text-espresso text-sm p-2.5 rounded-xl border border-stone-warm focus:outline-none focus:border-cherry"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-espresso mb-1">Base Reporting Currency</label>
                  <select
                    value={formData.business.currency}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        business: { ...formData.business, currency: e.target.value }
                      })
                    }
                    className="w-full bg-ivory text-espresso text-sm p-2.5 rounded-xl border border-stone-warm focus:outline-none focus:border-cherry"
                  >
                    <option value="USD ($)">USD ($) — United States Dollar</option>
                    <option value="EUR (€)">EUR (€) — Euro</option>
                    <option value="GBP (£)">GBP (£) — British Pound</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-espresso mb-1">Operating Time Zone</label>
                  <input
                    type="text"
                    value={formData.business.timeZone}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        business: { ...formData.business, timeZone: e.target.value }
                      })
                    }
                    className="w-full bg-ivory text-espresso text-sm p-2.5 rounded-xl border border-stone-warm focus:outline-none focus:border-cherry"
                  />
                </div>
              </div>
            </div>
          )}

          {/* 2. Tax Configuration */}
          {activeTab === 'tax' && (
            <div className="space-y-4">
              <h3 className="font-display text-lg font-bold text-espresso border-b border-stone-warm pb-2">
                Automated Sales Tax & VAT Settings
              </h3>
              <div className="space-y-4 text-xs">
                <div className="flex items-center justify-between p-3 rounded-xl bg-champagne-light border border-stone-warm">
                  <div>
                    <p className="font-bold text-espresso">Automated Nexus Tax Calculation</p>
                    <p className="text-espresso-muted text-[11px]">Real-time destination-based calculation via tax engine.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.tax.automaticTaxCalculation}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        tax: { ...formData.tax, automaticTaxCalculation: e.target.checked }
                      })
                    }
                    className="w-4 h-4 accent-cherry rounded"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-espresso mb-1">Default Fallback Tax Rate (%)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.tax.defaultTaxRate}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          tax: { ...formData.tax, defaultTaxRate: Number(e.target.value) }
                        })
                      }
                      className="w-full bg-ivory text-espresso text-sm p-2.5 rounded-xl border border-stone-warm focus:outline-none focus:border-cherry font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-espresso mb-1">Active Nexus Jurisdictions</label>
                    <input
                      type="text"
                      value={formData.tax.nexusStates.join(', ')}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          tax: { ...formData.tax, nexusStates: e.target.value.split(',').map((s) => s.trim()) }
                        })
                      }
                      className="w-full bg-ivory text-espresso text-sm p-2.5 rounded-xl border border-stone-warm focus:outline-none focus:border-cherry"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 3. Billing Preferences */}
          {activeTab === 'billing' && (
            <div className="space-y-4">
              <h3 className="font-display text-lg font-bold text-espresso border-b border-stone-warm pb-2">
                Subscription Billing & Proration Rules
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-semibold text-espresso mb-1">Dunning Grace Period (Days)</label>
                  <input
                    type="number"
                    value={formData.billing.dunningGracePeriodDays}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        billing: { ...formData.billing, dunningGracePeriodDays: Number(e.target.value) }
                      })
                    }
                    className="w-full bg-ivory text-espresso text-sm p-2.5 rounded-xl border border-stone-warm focus:outline-none focus:border-cherry font-mono"
                  />
                  <p className="text-[11px] text-stone-500 mt-1">Days before a past-due subscription is marked paused.</p>
                </div>
                <div>
                  <label className="block font-semibold text-espresso mb-1">Failed Payment Retry Attempts</label>
                  <input
                    type="number"
                    value={formData.billing.retryAttempts}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        billing: { ...formData.billing, retryAttempts: Number(e.target.value) }
                      })
                    }
                    className="w-full bg-ivory text-espresso text-sm p-2.5 rounded-xl border border-stone-warm focus:outline-none focus:border-cherry font-mono"
                  />
                  <p className="text-[11px] text-stone-500 mt-1">Smart retries distributed across the grace window.</p>
                </div>
                <div className="md:col-span-2">
                  <label className="block font-semibold text-espresso mb-1">Plan Upgrade / Downgrade Proration Policy</label>
                  <input
                    type="text"
                    value={formData.billing.prorationPolicy}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        billing: { ...formData.billing, prorationPolicy: e.target.value }
                      })
                    }
                    className="w-full bg-ivory text-espresso text-sm p-2.5 rounded-xl border border-stone-warm focus:outline-none focus:border-cherry"
                  />
                </div>
              </div>
            </div>
          )}

          {/* 4. Invoice Rules */}
          {activeTab === 'invoices' && (
            <div className="space-y-4">
              <h3 className="font-display text-lg font-bold text-espresso border-b border-stone-warm pb-2">
                Invoice Numbering & Finalization Rules
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-semibold text-espresso mb-1">Invoice Number Prefix</label>
                  <input
                    type="text"
                    value={formData.billing.invoicePrefix}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        billing: { ...formData.billing, invoicePrefix: e.target.value }
                      })
                    }
                    className="w-full bg-ivory text-espresso text-sm p-2.5 rounded-xl border border-stone-warm focus:outline-none focus:border-cherry font-mono"
                  />
                </div>
                <div className="flex items-center gap-3 pt-6">
                  <input
                    type="checkbox"
                    checked={formData.billing.autoFinalizeDrafts}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        billing: { ...formData.billing, autoFinalizeDrafts: e.target.checked }
                      })
                    }
                    className="w-4 h-4 accent-cherry rounded"
                  />
                  <span className="font-semibold text-espresso">Auto-finalize invoices on scheduled cycle run</span>
                </div>
              </div>
            </div>
          )}

          {/* 5. Notifications */}
          {activeTab === 'notifications' && (
            <div className="space-y-4">
              <h3 className="font-display text-lg font-bold text-espresso border-b border-stone-warm pb-2">
                Automated Transactional Email Dispatches
              </h3>
              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between p-3 rounded-xl bg-champagne-light border border-stone-warm">
                  <div>
                    <p className="font-bold text-espresso">Payment Confirmation Receipts</p>
                    <p className="text-espresso-muted text-[11px]">Send receipt PDF immediately upon successful capture.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.notifications.emailOnPaymentSuccess}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        notifications: { ...formData.notifications, emailOnPaymentSuccess: e.target.checked }
                      })
                    }
                    className="w-4 h-4 accent-cherry rounded"
                  />
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-champagne-light border border-stone-warm">
                  <div>
                    <p className="font-bold text-espresso">Dunning & Failure Notices</p>
                    <p className="text-espresso-muted text-[11px]">Alert account contacts when automatic payment attempts fail.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.notifications.emailOnPaymentFailure}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        notifications: { ...formData.notifications, emailOnPaymentFailure: e.target.checked }
                      })
                    }
                    className="w-4 h-4 accent-cherry rounded"
                  />
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-champagne-light border border-stone-warm">
                  <div>
                    <p className="font-bold text-espresso">Renewal Advance Reminder Notice</p>
                    <p className="text-espresso-muted text-[11px]">Notify customers 14 days before contract auto-renewals.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={Boolean(formData.notifications.sendRenewalReminderDaysBefore)}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        notifications: { ...formData.notifications, sendRenewalReminderDaysBefore: e.target.checked ? 14 : 0 }
                      })
                    }
                    className="w-4 h-4 accent-cherry rounded"
                  />
                </div>
              </div>
            </div>
          )}

          {/* 6. Team & User Management */}
          {activeTab === 'team' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-stone-warm pb-2">
                <h3 className="font-display text-lg font-bold text-espresso">
                  Team Members & Permissions
                </h3>
                <Button
                  type="button"
                  variant="primary"
                  size="sm"
                  icon={Plus}
                  onClick={() => setIsInviteModalOpen(true)}
                >
                  Invite Teammate
                </Button>
              </div>

              <div className="divide-y divide-stone-warm">
                {formData.team?.map((member) => (
                  <div key={member.id} className="py-3 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <img
                        src={member.avatar}
                        alt={member.name}
                        className="w-9 h-9 rounded-full object-cover border border-stone-warm"
                      />
                      <div>
                        <p className="font-bold text-espresso">{member.name}</p>
                        <p className="text-espresso-muted text-[11px]">{member.email}</p>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-champagne text-cherry-dark border border-stone-warm">
                      {member.role}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Save Button */}
          <div className="pt-4 border-t border-stone-warm flex justify-end">
            <Button type="submit" variant="primary">
              Save Preferences
            </Button>
          </div>
        </form>
      </Card>

      {/* Invite Member Modal */}
      <Modal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        title="Invite Team Member"
        subtitle="Grant role-based access to the subscription ledger."
      >
        <form onSubmit={handleInvite} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-espresso mb-1">Corporate Email Address</label>
            <input
              type="email"
              required
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              className="w-full bg-ivory text-espresso text-sm p-2.5 rounded-xl border border-stone-warm focus:outline-none focus:border-cherry"
              placeholder="colleague@subscript-saas.com"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-espresso mb-1">Assigned Role</label>
            <select
              value={inviteRole}
              onChange={(e) => setInviteRole(e.target.value)}
              className="w-full bg-ivory text-espresso text-sm p-2.5 rounded-xl border border-stone-warm focus:outline-none focus:border-cherry"
            >
              <option value="Administrator">Administrator (Full Access)</option>
              <option value="VP Finance">VP Finance (Owner)</option>
              <option value="Billing Ops">Billing Operations (Invoices & Subscriptions)</option>
              <option value="Auditor">Auditor (Read-Only)</option>
            </select>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-warm">
            <Button type="button" variant="secondary" onClick={() => setIsInviteModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Send Invitation
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
