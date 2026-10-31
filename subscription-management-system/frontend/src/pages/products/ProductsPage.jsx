import React, { useState, useMemo } from 'react';
import {
  Package,
  Plus,
  Tag,
  DollarSign,
  Layers,
  FileText,
  Eye,
  Edit2,
  Trash2,
  CheckCircle2,
  TrendingUp,
  Percent
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

export const ProductsPage = () => {
  const { products, addProduct, updateProduct, deleteProduct } = useMockData();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deletingProductId, setDeletingProductId] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);

  // Form State
  const [form, setForm] = useState({
    name: '',
    type: 'Software / SaaS',
    category: 'Core Platform',
    salesPrice: 499,
    costPrice: 99,
    variants: 'Standard, High-Throughput',
    notes: 'Primary recurring service module.'
  });

  const filteredProducts = useMemo(() => {
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [products, searchTerm]);

  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredProducts.slice(start, start + pageSize);
  }, [filteredProducts, currentPage, pageSize]);

  const handleCreate = (e) => {
    e.preventDefault();
    if (!form.name) return;

    addProduct({
      ...form,
      variants: typeof form.variants === 'string'
        ? form.variants.split(',').map((v) => v.trim())
        : form.variants
    });
    setIsCreateModalOpen(false);
    setForm({
      name: '',
      type: 'Software / SaaS',
      category: 'Core Platform',
      salesPrice: 499,
      costPrice: 99,
      variants: 'Standard, High-Throughput',
      notes: ''
    });
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    if (!editingProduct) return;

    updateProduct(editingProduct.id, {
      ...editingProduct,
      variants: typeof editingProduct.variants === 'string'
        ? editingProduct.variants.split(',').map((v) => v.trim())
        : editingProduct.variants
    });
    setEditingProduct(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-stone-warm/60">
        <div>
          <span className="text-xs uppercase font-bold tracking-widest text-champagne-gold">
            Catalog Management
          </span>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-espresso tracking-tight mt-0.5">
            Products & Solutions
          </h1>
          <p className="text-xs text-espresso-muted mt-1">
            Software licenses, SaaS feature add-ons, cost bases, and profit margins.
          </p>
        </div>

        <Button
          variant="primary"
          icon={Plus}
          onClick={() => setIsCreateModalOpen(true)}
        >
          Add Product
        </Button>
      </div>

      {/* Search Bar */}
      <Card className="p-4">
        <SearchInput
          value={searchTerm}
          onChange={(val) => {
            setSearchTerm(val);
            setCurrentPage(1);
          }}
          placeholder="Search products by title or category..."
          className="w-full md:max-w-md"
        />
      </Card>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <EmptyState
          title="No products found"
          description="Try adjusting your search query."
          actionLabel="Clear Search"
          onAction={() => {
            setSearchTerm('');
            setCurrentPage(1);
          }}
        />
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {paginatedProducts.map((prod) => {
              const margin = Math.round(((prod.salesPrice - prod.costPrice) / (prod.salesPrice || 1)) * 100);

              return (
                <Card key={prod.id} hover className="flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-champagne text-cherry border border-stone-warm">
                        {prod.category}
                      </span>
                      <Badge status={prod.status} />
                    </div>

                    <div>
                      <h3 className="font-display text-lg font-bold text-espresso">
                        {prod.name}
                      </h3>
                      <p className="text-xs text-espresso-muted mt-1 line-clamp-2">
                        {prod.notes || 'Enterprise subscription service module.'}
                      </p>
                    </div>

                    {/* Financials Ribbon */}
                    <div className="p-3 rounded-xl bg-champagne/40 border border-stone-warm flex items-center justify-between text-xs">
                      <div>
                        <span className="text-espresso-muted text-[10px] uppercase font-bold block">Sales Price</span>
                        <span className="font-mono font-bold text-sm text-espresso">${prod.salesPrice}</span>
                      </div>
                      <div>
                        <span className="text-espresso-muted text-[10px] uppercase font-bold block">Cost Price</span>
                        <span className="font-mono text-espresso-muted">${prod.costPrice}</span>
                      </div>
                      <div>
                        <span className="text-espresso-muted text-[10px] uppercase font-bold block">Margin</span>
                        <span className="font-bold text-emerald-800">{margin}%</span>
                      </div>
                    </div>

                    {/* Variants */}
                    {prod.variants && prod.variants.length > 0 && (
                      <div className="space-y-1">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-espresso-muted block">
                          Variants
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {prod.variants.map((v, i) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 rounded-md bg-ivory border border-stone-warm text-[11px] text-espresso"
                            >
                              {v}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t border-stone-warm flex items-center justify-between">
                    <span className="text-[11px] text-stone-500 font-mono">ID: {prod.id}</span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => {
                          setSelectedProduct(prod);
                          setIsDetailModalOpen(true);
                        }}
                        className="p-1.5 rounded-lg text-stone-500 hover:text-cherry hover:bg-champagne/40"
                        title="View Specifications"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setEditingProduct({
                          ...prod,
                          variants: Array.isArray(prod.variants) ? prod.variants.join(', ') : prod.variants
                        })}
                        className="p-1.5 rounded-lg text-stone-500 hover:text-champagne-gold hover:bg-champagne/40"
                        title="Edit Product"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setDeletingProductId(prod.id)}
                        className="p-1.5 rounded-lg text-stone-500 hover:text-red-700 hover:bg-red-50"
                        title="Delete Product"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          <Pagination
            currentPage={currentPage}
            totalItems={filteredProducts.length}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
            onPageSizeChange={setPageSize}
          />
        </div>
      )}

      {/* Product Detail Modal */}
      {selectedProduct && (
        <Modal
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          title={selectedProduct.name}
          subtitle={`Category: ${selectedProduct.category} &bull; Type: ${selectedProduct.type}`}
        >
          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-xl bg-champagne-light border border-stone-warm space-y-2">
              <span className="text-[10px] uppercase font-bold text-espresso-muted block">Product Overview</span>
              <p className="text-espresso text-sm leading-relaxed">{selectedProduct.notes}</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-ivory border border-stone-warm">
                <span className="text-espresso-muted text-[10px] uppercase font-bold block">Catalog Sales Price</span>
                <span className="font-mono font-bold text-base text-cherry-dark mt-1 block">
                  ${selectedProduct.salesPrice}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-ivory border border-stone-warm">
                <span className="text-espresso-muted text-[10px] uppercase font-bold block">Underlying Cost Basis</span>
                <span className="font-mono font-bold text-base text-espresso mt-1 block">
                  ${selectedProduct.costPrice}
                </span>
              </div>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-espresso-muted block mb-1">
                Available Product Variants
              </span>
              <div className="space-y-1">
                {selectedProduct.variants?.map((v, i) => (
                  <div key={i} className="p-2 rounded-lg bg-champagne/40 border border-stone-warm text-espresso font-medium flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-cherry" />
                    {v}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Edit Product Modal */}
      {editingProduct && (
        <Modal
          isOpen={Boolean(editingProduct)}
          onClose={() => setEditingProduct(null)}
          title={`Edit Product: ${editingProduct.name}`}
          subtitle="Adjust catalog pricing and configuration variants."
        >
          <form onSubmit={handleUpdate} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-espresso mb-1">Product Title</label>
              <input
                type="text"
                required
                value={editingProduct.name}
                onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                className="w-full bg-ivory text-espresso text-sm p-2.5 rounded-xl border border-stone-warm focus:outline-none focus:border-cherry"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-espresso mb-1">Sales Price ($)</label>
                <input
                  type="number"
                  required
                  value={editingProduct.salesPrice}
                  onChange={(e) => setEditingProduct({ ...editingProduct, salesPrice: Number(e.target.value) })}
                  className="w-full bg-ivory text-espresso text-sm p-2.5 rounded-xl border border-stone-warm focus:outline-none focus:border-cherry font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-espresso mb-1">Cost Price ($)</label>
                <input
                  type="number"
                  required
                  value={editingProduct.costPrice}
                  onChange={(e) => setEditingProduct({ ...editingProduct, costPrice: Number(e.target.value) })}
                  className="w-full bg-ivory text-espresso text-sm p-2.5 rounded-xl border border-stone-warm focus:outline-none focus:border-cherry font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-espresso mb-1">Variants (comma-separated)</label>
              <input
                type="text"
                value={editingProduct.variants}
                onChange={(e) => setEditingProduct({ ...editingProduct, variants: e.target.value })}
                className="w-full bg-ivory text-espresso text-sm p-2.5 rounded-xl border border-stone-warm focus:outline-none focus:border-cherry"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-espresso mb-1">Description / Notes</label>
              <textarea
                rows={2}
                value={editingProduct.notes || ''}
                onChange={(e) => setEditingProduct({ ...editingProduct, notes: e.target.value })}
                className="w-full bg-ivory text-espresso text-sm p-2.5 rounded-xl border border-stone-warm focus:outline-none focus:border-cherry"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-warm">
              <Button type="button" variant="secondary" onClick={() => setEditingProduct(null)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                Save Product
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Create Product Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Add Catalog Product"
        subtitle="Introduce a billable recurring product or add-on capability."
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-espresso mb-1">Product Title</label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full bg-ivory text-espresso text-sm p-2.5 rounded-xl border border-stone-warm focus:outline-none focus:border-cherry"
              placeholder="e.g. Apex Real-time Replication Node"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-espresso mb-1">Product Type</label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="w-full bg-ivory text-espresso text-sm p-2.5 rounded-xl border border-stone-warm focus:outline-none focus:border-cherry"
              >
                <option value="Software / SaaS">Software / SaaS</option>
                <option value="SaaS Addon">SaaS Addon</option>
                <option value="Infrastructure">Infrastructure</option>
                <option value="Compliance">Compliance</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-espresso mb-1">Category</label>
              <input
                type="text"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full bg-ivory text-espresso text-sm p-2.5 rounded-xl border border-stone-warm focus:outline-none focus:border-cherry"
                placeholder="e.g. Security & Audit"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-espresso mb-1">Sales Price ($)</label>
              <input
                type="number"
                required
                value={form.salesPrice}
                onChange={(e) => setForm({ ...form, salesPrice: Number(e.target.value) })}
                className="w-full bg-ivory text-espresso text-sm p-2.5 rounded-xl border border-stone-warm focus:outline-none focus:border-cherry font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-espresso mb-1">Cost Price ($)</label>
              <input
                type="number"
                required
                value={form.costPrice}
                onChange={(e) => setForm({ ...form, costPrice: Number(e.target.value) })}
                className="w-full bg-ivory text-espresso text-sm p-2.5 rounded-xl border border-stone-warm focus:outline-none focus:border-cherry font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-espresso mb-1">Variants (comma-separated)</label>
            <input
              type="text"
              value={form.variants}
              onChange={(e) => setForm({ ...form, variants: e.target.value })}
              className="w-full bg-ivory text-espresso text-sm p-2.5 rounded-xl border border-stone-warm focus:outline-none focus:border-cherry"
              placeholder="Standard Cluster, Multi-Region Failover"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-espresso mb-1">Description / Notes</label>
            <textarea
              rows={2}
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              className="w-full bg-ivory text-espresso text-sm p-2.5 rounded-xl border border-stone-warm focus:outline-none focus:border-cherry"
              placeholder="Core value proposition and customer use-cases..."
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-warm">
            <Button type="button" variant="secondary" onClick={() => setIsCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Save Product
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(deletingProductId)}
        onClose={() => setDeletingProductId(null)}
        onConfirm={() => {
          if (deletingProductId) {
            deleteProduct(deletingProductId);
            setDeletingProductId(null);
          }
        }}
        title="Remove Product"
        description="Are you sure you wish to delete this product from the catalog? Existing subscriptions will remain intact."
        confirmText="Confirm Deletion"
        danger={true}
      />
    </div>
  );
};
