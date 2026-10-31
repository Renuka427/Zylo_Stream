import React, { useState, useMemo } from 'react';
import {
  Users,
  Plus,
  Mail,
  Phone,
  MapPin,
  Eye,
  Edit2,
  Trash2,
  ArrowUpDown,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { useMockData } from '../../contexts/MockDataContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { SearchInput } from '../../components/ui/SearchInput';
import { Modal } from '../../components/ui/Modal';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { Pagination } from '../../components/ui/Pagination';
import { EmptyState } from '../../components/ui/EmptyState';

export const CustomersPage = () => {
  const { customers, subscriptions, invoices, addCustomer, updateCustomer, deleteCustomer } = useMockData();

  const [searchTerm, setSearchTerm] = useState('');
  const [tierFilter, setTierFilter] = useState('all');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [deletingCustomerId, setDeletingCustomerId] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Sorting and Pagination State
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  // Form State for Add Customer
  const [form, setForm] = useState({
    name: '',
    contactPerson: '',
    email: '',
    phone: '',
    address: '',
    tier: 'Growth'
  });

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filteredAndSortedCustomers = useMemo(() => {
    let result = customers.filter((cust) => {
      const matchesSearch =
        cust.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cust.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cust.email.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesTier =
        tierFilter === 'all' || cust.tier.toLowerCase() === tierFilter.toLowerCase();

      return matchesSearch && matchesTier;
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
  }, [customers, searchTerm, tierFilter, sortField, sortDirection]);

  // Paginated slice
  const paginatedCustomers = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredAndSortedCustomers.slice(start, start + pageSize);
  }, [filteredAndSortedCustomers, currentPage, pageSize]);

  const handleCreate = (e) => {
    e.preventDefault();
    if (!form.name || !form.email) return;

    addCustomer(form);
    setIsCreateModalOpen(false);
    setForm({
      name: '',
      contactPerson: '',
      email: '',
      phone: '',
      address: '',
      tier: 'Growth'
    });
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    if (!editingCustomer) return;
    updateCustomer(editingCustomer.id, editingCustomer);
    setEditingCustomer(null);
  };

  // Find customer's active subscriptions and invoices
  const customerSubs = selectedCustomer
    ? subscriptions.filter((s) => s.customerId === selectedCustomer.id)
    : [];

  const customerInvoices = selectedCustomer
    ? invoices.filter((i) => i.customerId === selectedCustomer.id)
    : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-stone-warm/60">
        <div>
          <span className="text-xs uppercase font-bold tracking-widest text-champagne-gold">
            Account Management
          </span>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-espresso tracking-tight mt-0.5">
            Customer Directory
          </h1>
          <p className="text-xs text-espresso-muted mt-1">
            Accounts, primary contacts, recurring subscription counts, and lifetime value.
          </p>
        </div>

        <Button
          variant="primary"
          icon={Plus}
          onClick={() => setIsCreateModalOpen(true)}
        >
          Enroll Customer
        </Button>
      </div>

      {/* Filters and Search */}
      <Card className="p-4 space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <SearchInput
            value={searchTerm}
            onChange={(val) => {
              setSearchTerm(val);
              setCurrentPage(1);
            }}
            placeholder="Search by company name, contact or email..."
            className="w-full md:max-w-md"
          />

          <div className="flex items-center gap-1.5 p-1 bg-champagne/50 border border-stone-warm rounded-xl text-xs">
            {['all', 'Enterprise', 'Growth', 'Starter'].map((t) => (
              <button
                key={t}
                onClick={() => {
                  setTierFilter(t);
                  setCurrentPage(1);
                }}
                className={`px-3 py-1.5 rounded-lg capitalize font-medium transition-colors ${
                  tierFilter === t
                    ? 'bg-ivory text-cherry-dark font-bold shadow-sm'
                    : 'text-espresso-muted hover:text-espresso'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Customers Table */}
      <Card className="p-0 overflow-hidden">
        {filteredAndSortedCustomers.length === 0 ? (
          <EmptyState
            title="No customer accounts found"
            description="No customer records match your filter criteria."
            actionLabel="Reset Search"
            onAction={() => {
              setSearchTerm('');
              setTierFilter('all');
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
                      onClick={() => handleSort('name')}
                    >
                      <div className="flex items-center gap-1">
                        <span>Organization</span>
                        {sortField === 'name' ? (
                          sortDirection === 'asc' ? <ArrowUp className="w-3 h-3 text-cherry" /> : <ArrowDown className="w-3 h-3 text-cherry" />
                        ) : <ArrowUpDown className="w-3 h-3 opacity-40" />}
                      </div>
                    </th>
                    <th className="py-3 px-4">Contact Person</th>
                    <th className="py-3 px-4">Tier</th>
                    <th
                      className="py-3 px-4 text-center cursor-pointer hover:text-cherry"
                      onClick={() => handleSort('subscriptionCount')}
                    >
                      <div className="flex items-center justify-center gap-1">
                        <span>Subs</span>
                        {sortField === 'subscriptionCount' && (
                          sortDirection === 'asc' ? <ArrowUp className="w-3 h-3 text-cherry" /> : <ArrowDown className="w-3 h-3 text-cherry" />
                        )}
                      </div>
                    </th>
                    <th
                      className="py-3 px-4 text-right cursor-pointer hover:text-cherry"
                      onClick={() => handleSort('mrr')}
                    >
                      <div className="flex items-center justify-end gap-1">
                        <span>MRR</span>
                        {sortField === 'mrr' && (
                          sortDirection === 'asc' ? <ArrowUp className="w-3 h-3 text-cherry" /> : <ArrowDown className="w-3 h-3 text-cherry" />
                        )}
                      </div>
                    </th>
                    <th
                      className="py-3 px-4 text-right cursor-pointer hover:text-cherry"
                      onClick={() => handleSort('totalSpent')}
                    >
                      <div className="flex items-center justify-end gap-1">
                        <span>Total Spent</span>
                        {sortField === 'totalSpent' && (
                          sortDirection === 'asc' ? <ArrowUp className="w-3 h-3 text-cherry" /> : <ArrowDown className="w-3 h-3 text-cherry" />
                        )}
                      </div>
                    </th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-warm/60">
                  {paginatedCustomers.map((cust) => (
                    <tr key={cust.id} className="hover:bg-champagne/20 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={cust.avatar}
                            alt={cust.name}
                            className="w-8 h-8 rounded-full object-cover border border-stone-warm shrink-0"
                          />
                          <div>
                            <p className="font-bold text-espresso">{cust.name}</p>
                            <p className="text-[11px] text-espresso-muted">{cust.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-medium text-espresso">
                        {cust.contactPerson}
                      </td>
                      <td className="py-3.5 px-4">
                        <Badge status={cust.tier} />
                      </td>
                      <td className="py-3.5 px-4 text-center font-bold text-espresso">
                        {cust.subscriptionCount}
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono font-semibold text-cherry-dark">
                        ${cust.mrr?.toLocaleString()}/mo
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono text-espresso font-medium">
                        ${cust.totalSpent?.toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4">
                        <Badge status={cust.status} />
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => {
                              setSelectedCustomer(cust);
                              setIsDetailModalOpen(true);
                            }}
                            className="p-1.5 rounded-lg text-stone-500 hover:text-cherry hover:bg-champagne/50"
                            title="View Profile"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setEditingCustomer({ ...cust })}
                            className="p-1.5 rounded-lg text-stone-500 hover:text-champagne-gold hover:bg-champagne/50"
                            title="Edit Customer"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setDeletingCustomerId(cust.id)}
                            className="p-1.5 rounded-lg text-stone-500 hover:text-red-700 hover:bg-red-50"
                            title="Delete Customer"
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

            {/* Pagination Component */}
            <Pagination
              currentPage={currentPage}
              totalItems={filteredAndSortedCustomers.length}
              pageSize={pageSize}
              onPageChange={setCurrentPage}
              onPageSizeChange={setPageSize}
            />
          </div>
        )}
      </Card>

      {/* Customer Detail Modal with History */}
      {selectedCustomer && (
        <Modal
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          title={selectedCustomer.name}
          subtitle={`Primary Contact: ${selectedCustomer.contactPerson}`}
          maxWidth="max-w-2xl"
        >
          <div className="space-y-6">
            <div className="flex items-start gap-4 p-4 rounded-xl bg-champagne-light border border-stone-warm">
              <img
                src={selectedCustomer.avatar}
                alt={selectedCustomer.name}
                className="w-14 h-14 rounded-2xl object-cover border border-champagne-gold/40 shadow-sm"
              />
              <div className="space-y-1 text-xs">
                <div className="flex items-center gap-2">
                  <h4 className="font-display text-base font-bold text-espresso">{selectedCustomer.name}</h4>
                  <Badge status={selectedCustomer.status} />
                  <Badge status={selectedCustomer.tier} />
                </div>
                <p className="text-espresso flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-cherry" />
                  {selectedCustomer.email}
                </p>
                <p className="text-espresso-muted flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-champagne-gold" />
                  {selectedCustomer.phone}
                </p>
                <p className="text-espresso-muted flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-stone-400" />
                  {selectedCustomer.address}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 rounded-xl bg-ivory border border-stone-warm">
                <span className="text-[10px] text-espresso-muted uppercase font-bold">Active Subscriptions</span>
                <span className="font-display text-xl font-bold text-cherry mt-1 block">
                  {selectedCustomer.subscriptionCount}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-ivory border border-stone-warm">
                <span className="text-[10px] text-espresso-muted uppercase font-bold">Monthly MRR</span>
                <span className="font-display text-xl font-bold text-espresso mt-1 block font-mono">
                  ${selectedCustomer.mrr?.toLocaleString()}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-ivory border border-stone-warm">
                <span className="text-[10px] text-espresso-muted uppercase font-bold">Lifetime Total</span>
                <span className="font-display text-xl font-bold text-espresso mt-1 block font-mono">
                  ${selectedCustomer.totalSpent?.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Customer Subscriptions History */}
            <div className="space-y-2">
              <h5 className="font-display text-sm font-bold text-espresso border-b border-stone-warm pb-1">
                Associated Subscriptions ({customerSubs.length})
              </h5>
              {customerSubs.length === 0 ? (
                <p className="text-xs text-espresso-muted italic">No active contracts linked.</p>
              ) : (
                <div className="space-y-1.5">
                  {customerSubs.map((s) => (
                    <div
                      key={s.id}
                      className="p-2.5 rounded-lg bg-champagne/40 border border-stone-warm flex items-center justify-between text-xs"
                    >
                      <div>
                        <span className="font-mono font-bold text-cherry-dark">{s.subscriptionNumber}</span>
                        <span className="text-espresso font-medium ml-2">{s.planName}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-mono font-bold text-espresso">${s.amount}/mo</span>
                        <Badge status={s.status} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Customer Invoices History */}
            <div className="space-y-2">
              <h5 className="font-display text-sm font-bold text-espresso border-b border-stone-warm pb-1">
                Billing & Invoice History ({customerInvoices.length})
              </h5>
              {customerInvoices.length === 0 ? (
                <p className="text-xs text-espresso-muted italic">No invoices issued yet.</p>
              ) : (
                <div className="space-y-1.5">
                  {customerInvoices.map((inv) => (
                    <div
                      key={inv.id}
                      className="p-2.5 rounded-lg bg-champagne/40 border border-stone-warm flex items-center justify-between text-xs"
                    >
                      <div>
                        <span className="font-mono font-medium text-espresso">{inv.invoiceNumber}</span>
                        <span className="text-stone-500 ml-2">Due: {inv.dueDate}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-mono font-bold text-espresso">${inv.total}</span>
                        <Badge status={inv.status} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </Modal>
      )}

      {/* Edit Customer Modal */}
      {editingCustomer && (
        <Modal
          isOpen={Boolean(editingCustomer)}
          onClose={() => setEditingCustomer(null)}
          title={`Edit Account: ${editingCustomer.name}`}
          subtitle="Update primary contact and account tier details."
        >
          <form onSubmit={handleUpdate} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-espresso mb-1">Company / Organization Name</label>
              <input
                type="text"
                required
                value={editingCustomer.name}
                onChange={(e) => setEditingCustomer({ ...editingCustomer, name: e.target.value })}
                className="w-full bg-ivory text-espresso text-sm p-2.5 rounded-xl border border-stone-warm focus:outline-none focus:border-cherry"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-espresso mb-1">Contact Person</label>
                <input
                  type="text"
                  required
                  value={editingCustomer.contactPerson}
                  onChange={(e) => setEditingCustomer({ ...editingCustomer, contactPerson: e.target.value })}
                  className="w-full bg-ivory text-espresso text-sm p-2.5 rounded-xl border border-stone-warm focus:outline-none focus:border-cherry"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-espresso mb-1">Account Tier</label>
                <select
                  value={editingCustomer.tier}
                  onChange={(e) => setEditingCustomer({ ...editingCustomer, tier: e.target.value })}
                  className="w-full bg-ivory text-espresso text-sm p-2.5 rounded-xl border border-stone-warm focus:outline-none focus:border-cherry"
                >
                  <option value="Enterprise">Enterprise</option>
                  <option value="Growth">Growth</option>
                  <option value="Starter">Starter</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-espresso mb-1">Billing Email</label>
                <input
                  type="email"
                  required
                  value={editingCustomer.email}
                  onChange={(e) => setEditingCustomer({ ...editingCustomer, email: e.target.value })}
                  className="w-full bg-ivory text-espresso text-sm p-2.5 rounded-xl border border-stone-warm focus:outline-none focus:border-cherry"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-espresso mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={editingCustomer.phone}
                  onChange={(e) => setEditingCustomer({ ...editingCustomer, phone: e.target.value })}
                  className="w-full bg-ivory text-espresso text-sm p-2.5 rounded-xl border border-stone-warm focus:outline-none focus:border-cherry"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-espresso mb-1">Address</label>
              <input
                type="text"
                value={editingCustomer.address}
                onChange={(e) => setEditingCustomer({ ...editingCustomer, address: e.target.value })}
                className="w-full bg-ivory text-espresso text-sm p-2.5 rounded-xl border border-stone-warm focus:outline-none focus:border-cherry"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-warm">
              <Button type="button" variant="secondary" onClick={() => setEditingCustomer(null)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                Save Changes
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Enroll Customer Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Enroll New Customer"
        subtitle="Create an enterprise or growth customer profile."
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-espresso mb-1">Company / Organization Name</label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full bg-ivory text-espresso text-sm p-2.5 rounded-xl border border-stone-warm focus:outline-none focus:border-cherry"
              placeholder="e.g. Apex Meridian Dynamics"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-espresso mb-1">Contact Person</label>
              <input
                type="text"
                required
                value={form.contactPerson}
                onChange={(e) => setForm({ ...form, contactPerson: e.target.value })}
                className="w-full bg-ivory text-espresso text-sm p-2.5 rounded-xl border border-stone-warm focus:outline-none focus:border-cherry"
                placeholder="e.g. Rachel Sterling"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-espresso mb-1">Account Tier</label>
              <select
                value={form.tier}
                onChange={(e) => setForm({ ...form, tier: e.target.value })}
                className="w-full bg-ivory text-espresso text-sm p-2.5 rounded-xl border border-stone-warm focus:outline-none focus:border-cherry"
              >
                <option value="Enterprise">Enterprise</option>
                <option value="Growth">Growth</option>
                <option value="Starter">Starter</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-espresso mb-1">Billing Email</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full bg-ivory text-espresso text-sm p-2.5 rounded-xl border border-stone-warm focus:outline-none focus:border-cherry"
                placeholder="billing@company.com"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-espresso mb-1">Phone Number</label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full bg-ivory text-espresso text-sm p-2.5 rounded-xl border border-stone-warm focus:outline-none focus:border-cherry"
                placeholder="+1 (555) 000-0000"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-espresso mb-1">Registered Address</label>
            <input
              type="text"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              className="w-full bg-ivory text-espresso text-sm p-2.5 rounded-xl border border-stone-warm focus:outline-none focus:border-cherry"
              placeholder="e.g. 100 Main St, New York, NY"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-warm">
            <Button type="button" variant="secondary" onClick={() => setIsCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Enroll Account
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(deletingCustomerId)}
        onClose={() => setDeletingCustomerId(null)}
        onConfirm={() => {
          if (deletingCustomerId) {
            deleteCustomer(deletingCustomerId);
            setDeletingCustomerId(null);
          }
        }}
        title="Remove Customer Account"
        description="Are you sure you wish to delete this customer? This action will remove their record from the directory."
        confirmText="Confirm Deletion"
        danger={true}
      />
    </div>
  );
};
