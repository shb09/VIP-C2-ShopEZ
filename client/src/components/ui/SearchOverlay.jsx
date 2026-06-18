import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, TrendingUp, Package, Loader2 } from 'lucide-react';
import api from '../../utils/axios';
import ImageWithFallback from './ImageWithFallback';

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const panelVariants = {
  hidden: { opacity: 0, scale: 0.96, y: -12 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 350, damping: 30 },
  },
  exit: {
    opacity: 0,
    scale: 0.96,
    y: -12,
    transition: { duration: 0.15, ease: [0.25, 0.1, 0.25, 1] },
  },
};

export default function SearchOverlay({ open, onClose }) {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [trending, setTrending] = useState([]);
  const inputRef = useRef(null);
  const debounceRef = useRef(null);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
      api.get('/products/categories')
        .then(({ data }) => setTrending(Array.isArray(data) ? data.slice(0, 5) : []))
        .catch(() => {});
    } else {
      setQuery('');
      setResults([]);
    }
  }, [open]);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!query.trim()) { setResults([]); return; }
    setLoading(true);
    debounceRef.current = setTimeout(async () => {
      try {
        const { data } = await api.get(`/products?search=${encodeURIComponent(query.trim())}&limit=5`);
        setResults(data.products || []);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 250);
  }, [query]);

  const handleSelect = useCallback((url) => {
    onClose();
    navigate(url);
  }, [onClose, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      handleSelect(`/products?search=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[200] flex items-start justify-center pt-[12vh]"
          onClick={onClose}
        >
          <div className="absolute inset-0 bg-black/50 backdrop-blur-xl" />
          <motion.div
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative w-full max-w-2xl mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="glass rounded-3xl overflow-hidden shadow-2xl shadow-black/20 border border-[var(--glass-border)]">
              <form onSubmit={handleSubmit} className="flex items-center gap-3 px-6 py-5 border-b border-[var(--color-border)]/50">
                <Search className="w-5 h-5 text-[var(--color-text-secondary)] flex-shrink-0" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search products..."
                  className="flex-1 bg-transparent text-base text-[var(--color-text)] outline-none placeholder:text-[var(--color-text-secondary)]"
                />
                {query && (
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    type="button"
                    onClick={() => setQuery('')}
                    className="text-[var(--color-text-secondary)] hover:text-[var(--color-text)] transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </motion.button>
                )}
                <kbd className="hidden sm:inline-flex items-center px-2 py-1 rounded-lg bg-[var(--color-surface)] text-[10px] font-medium text-[var(--color-text-secondary)] border border-[var(--color-border)]">
                  ESC
                </kbd>
              </form>

              <div className="max-h-[55vh] overflow-y-auto p-3">
                {loading ? (
                  <div className="flex items-center justify-center py-16">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    >
                      <Loader2 className="w-6 h-6 text-[var(--color-accent)]" />
                    </motion.div>
                  </div>
                ) : query.trim() && results.length > 0 ? (
                  <div className="space-y-1">
                    <p className="px-3 py-2 text-[9px] text-[var(--color-text-secondary)] font-semibold uppercase tracking-[0.15em]">
                      Products
                    </p>
                    {results.map((product, i) => (
                      <motion.button
                        key={product._id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.03 }}
                        onClick={() => handleSelect(`/products/${product._id}`)}
                        className="w-full flex items-center gap-4 px-4 py-3 rounded-2xl hover:bg-[var(--glass-bg)] transition-all text-left group"
                      >
                        <div className="w-12 h-12 rounded-xl overflow-hidden bg-[var(--color-surface)] border border-[var(--color-border)] flex-shrink-0">
                          <ImageWithFallback src={product.image} alt="" category={product.category} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate text-[var(--color-text)]">{product.name}</p>
                          <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">
                            {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(product.price)}
                          </p>
                        </div>
                        <span className="text-[10px] text-[var(--color-text-secondary)] opacity-0 group-hover:opacity-100 transition-opacity">
                          View →
                        </span>
                      </motion.button>
                    ))}
                  </div>
                ) : query.trim() && results.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center py-16 text-center"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-[var(--glass-bg)] border border-[var(--glass-border)] flex items-center justify-center mb-4">
                      <Package className="w-6 h-6 text-[var(--color-text-secondary)]" />
                    </div>
                    <p className="text-sm font-medium text-[var(--color-text)] mb-1">
                      No results for &ldquo;{query}&rdquo;
                    </p>
                    <p className="text-xs text-[var(--color-text-secondary)]">
                      Try a different search term
                    </p>
                  </motion.div>
                ) : (
                  <div className="p-3">
                    <p className="flex items-center gap-2 text-xs text-[var(--color-text-secondary)] font-medium mb-4">
                      <TrendingUp className="w-3.5 h-3.5" />
                      Trending Categories
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {trending.map((cat) => (
                        <motion.button
                          key={cat}
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => handleSelect(`/products?category=${encodeURIComponent(cat)}`)}
                          className="px-4 py-2 rounded-full glass border border-[var(--glass-border)] text-xs font-medium hover:bg-[var(--color-accent)]/10 hover:text-[var(--color-accent)] hover:border-[var(--color-accent)]/30 transition-all"
                        >
                          {cat}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
