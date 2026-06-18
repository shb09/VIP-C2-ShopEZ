import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Edit3, Trash2, Package } from 'lucide-react';
import api from '../../utils/axios';
import { formatPrice } from '../../utils/helpers';
import ImageWithFallback from '../../components/ui/ImageWithFallback';
import ConfirmModal from '../../components/ui/ConfirmModal';
import { useToast } from '../../components/ui/Toast';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.03, delayChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] } },
};

export default function ManageProducts() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const addToast = useToast();

  const fetchProducts = useCallback(async (p = page, s = search) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: p, limit: '10' });
      if (s) params.set('search', s);
      const { data } = await api.get(`/products?${params}`);
      setProducts(data.products || []);
      setPages(data.pages || 1);
    } catch (err) {
      addToast('Failed to load products', 'error');
    } finally {
      setLoading(false);
    }
  }, [page, search, addToast]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await api.delete(`/products/${deleteTarget._id}`);
      addToast('Product deleted', 'success');
      setDeleteTarget(null);
      fetchProducts();
    } catch (err) {
      addToast(err?.response?.data?.message || 'Delete failed', 'error');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
        className="flex flex-wrap items-center justify-between gap-4 mb-8"
      >
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Products</h1>
          <p className="text-sm text-[var(--color-text-secondary)] mt-1">Manage your product catalog</p>
        </div>
        <Link to="/admin/products/new" className="btn-liquid text-sm group">
          <Plus className="w-4 h-4" />
          Add Product
        </Link>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}
        className="flex items-center gap-4 mb-6"
      >
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-secondary)]" />
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search products..."
            className="input-field pl-10 text-sm"
          />
        </div>
      </motion.div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="card p-4 flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl skeleton" />
              <div className="flex-1 space-y-2.5">
                <div className="h-4 w-56 skeleton rounded-lg" />
                <div className="h-3 w-32 skeleton rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center py-24"
        >
          <div className="w-16 h-16 rounded-2xl glass flex items-center justify-center mx-auto mb-6">
            <Package className="w-8 h-8 text-[var(--color-text-secondary)]" />
          </div>
          <p className="text-base font-medium text-[var(--color-text-secondary)]">No products found</p>
          <p className="text-sm text-[var(--color-text-secondary)] mt-1 opacity-60">Try adjusting your search</p>
        </motion.div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-2"
        >
          <AnimatePresence mode="popLayout">
            {products.map((product) => (
              <motion.div
                key={product._id}
                layout
                variants={itemVariants}
                exit={{ opacity: 0, y: -8, transition: { duration: 0.2 } }}
                className="card p-4 flex items-center gap-4 group hover:border-[var(--color-accent)]/20 transition-all duration-200"
              >
                <div className="w-14 h-14 rounded-xl overflow-hidden bg-[var(--color-surface)] flex-shrink-0 border border-[var(--color-border)] ring-2 ring-[var(--color-card)]">
                  <ImageWithFallback src={product.image} alt={product.name} category={product.category} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{product.name}</p>
                  <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">
                    <span className="text-[var(--color-accent)]">{product.category}</span>
                    <span className="mx-1.5 opacity-30">&middot;</span>
                    {formatPrice(product.price)}
                    <span className="mx-1.5 opacity-30">&middot;</span>
                    Stock: <span className={product.stock > 0 ? 'text-[#34d399]' : 'text-[#f87171]'}>{product.stock}</span>
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Link to={`/admin/products/${product._id}/edit`} className="btn-ghost p-2.5 rounded-xl hover:bg-[var(--color-accent)]/10 hover:text-[var(--color-accent)] transition-all duration-200">
                    <Edit3 className="w-4 h-4" />
                  </Link>
                  <button onClick={() => setDeleteTarget(product)} className="btn-ghost p-2.5 rounded-xl text-[#f87171] hover:bg-[rgba(248,113,113,0.1)] transition-all duration-200">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {pages > 1 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="flex items-center justify-center gap-3 mt-8"
        >
          <button
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
            className="btn-glass text-sm disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <div className="flex items-center gap-1.5">
            {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`w-9 h-9 rounded-xl text-xs font-medium transition-all duration-200 ${
                  page === p
                    ? 'bg-[var(--color-accent)] text-white shadow-lg shadow-[var(--glow-color)]'
                    : 'text-[var(--color-text-secondary)] hover:bg-[var(--glass-bg)] border border-[var(--color-border)]'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
          <button
            onClick={() => setPage(Math.min(pages, page + 1))}
            disabled={page === pages}
            className="btn-glass text-sm disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </motion.div>
      )}

      <ConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Product"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
        loading={deleting}
      />
    </div>
  );
}
