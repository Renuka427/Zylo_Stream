import React, { useState } from 'react';
import {
  User,
  Building,
  Mail,
  Phone,
  MapPin,
  Lock,
  ShieldCheck,
  Save,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { Button } from '../../components/ui/Button';

export const CustomerProfilePage = () => {
  const { user, updateCustomerProfile } = useAuth();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    name: user?.name || 'Eleanor Vance',
    email: user?.email || 'eleanor.vance@acmestudio.io',
    company: user?.company || 'Acme Creative Studio',
    phone: user?.phone || '+1 (555) 234-8901',
    address: user?.address || '450 Lexington Ave, Suite 1400, New York, NY 10017',
    taxId: user?.taxId || 'US-EIN-99218204'
  });

  const [isSaved, setIsSaved] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    updateCustomerProfile(formData);
    setIsSaved(true);
    showToast('Customer profile updated successfully!', 'success');
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-black text-espresso tracking-tight">
          My Profile &amp; Organization
        </h1>
        <p className="text-xs sm:text-sm text-espresso-muted">
          Manage your contact credentials and corporate billing identity.
        </p>
      </div>

      {/* Role Immutability Banner */}
      <div className="p-4 rounded-2xl bg-champagne-light border border-stone-warm flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-cherry shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold text-espresso text-xs">Role Enforcement Active</span>
            <p className="text-[11px] text-espresso-muted">
              Account role: <span className="font-bold text-cherry-dark uppercase">customer</span>. In accordance with zero-trust design, client roles cannot be escalated via user input or local state modification.
            </p>
          </div>
        </div>

        <span className="px-2.5 py-1 rounded-lg bg-champagne border border-stone-warm text-[10px] font-mono font-bold text-cherry-dark shrink-0">
          Role: Immutable
        </span>
      </div>

      {/* Main Profile Form */}
      <form onSubmit={handleSubmit} className="bg-ivory rounded-3xl border border-stone-warm shadow-luxury p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-4 pb-6 border-b border-stone-warm">
          <img
            src={user?.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80'}
            alt={user?.name || 'Customer'}
            className="w-16 h-16 rounded-full object-cover border-2 border-cherry"
          />
          <div>
            <h3 className="font-display text-lg font-bold text-espresso">{formData.name}</h3>
            <p className="text-xs text-espresso-muted">{formData.company}</p>
            <p className="text-[10px] text-stone-400 mt-0.5 font-mono">Customer ID: {user?.id || 'customer_demo_001'}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          {/* Full Name */}
          <div>
            <label className="block font-semibold text-espresso mb-1">Contact Name</label>
            <div className="relative">
              <User className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-white text-espresso pl-9 pr-3 py-2.5 rounded-xl border border-stone-warm focus:outline-none focus:border-cherry"
              />
            </div>
          </div>

          {/* Email (Read Only or Editable) */}
          <div>
            <label className="block font-semibold text-espresso mb-1">Corporate Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-white text-espresso pl-9 pr-3 py-2.5 rounded-xl border border-stone-warm focus:outline-none focus:border-cherry"
              />
            </div>
          </div>

          {/* Company Name */}
          <div>
            <label className="block font-semibold text-espresso mb-1">Organization Name</label>
            <div className="relative">
              <Building className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
              <input
                type="text"
                required
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                className="w-full bg-white text-espresso pl-9 pr-3 py-2.5 rounded-xl border border-stone-warm focus:outline-none focus:border-cherry"
              />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className="block font-semibold text-espresso mb-1">Direct Phone</label>
            <div className="relative">
              <Phone className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full bg-white text-espresso pl-9 pr-3 py-2.5 rounded-xl border border-stone-warm focus:outline-none focus:border-cherry"
              />
            </div>
          </div>

          {/* Billing Address (Full width) */}
          <div className="sm:col-span-2">
            <label className="block font-semibold text-espresso mb-1">Billing Headquarters Address</label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full bg-white text-espresso pl-9 pr-3 py-2.5 rounded-xl border border-stone-warm focus:outline-none focus:border-cherry"
              />
            </div>
          </div>

          {/* Tax ID */}
          <div>
            <label className="block font-semibold text-espresso mb-1">Tax ID / VAT Registration</label>
            <input
              type="text"
              value={formData.taxId}
              onChange={(e) => setFormData({ ...formData, taxId: e.target.value })}
              className="w-full bg-white text-espresso px-3 py-2.5 rounded-xl border border-stone-warm focus:outline-none focus:border-cherry"
            />
          </div>

          {/* Assigned System Role (Locked) */}
          <div>
            <label className="block font-semibold text-espresso mb-1">Assigned Security Role</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
              <input
                type="text"
                disabled
                value="customer (Client Self-Service)"
                className="w-full bg-champagne-light text-espresso-muted pl-9 pr-3 py-2.5 rounded-xl border border-stone-warm cursor-not-allowed font-medium"
              />
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="pt-4 border-t border-stone-warm flex items-center justify-between">
          {isSaved ? (
            <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4" />
              <span>Profile details updated successfully</span>
            </span>
          ) : (
            <span className="text-[11px] text-espresso-muted">
              Changes reflect immediately on invoices and receipts.
            </span>
          )}

          <Button type="submit" variant="primary" size="sm" icon={Save}>
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
};
