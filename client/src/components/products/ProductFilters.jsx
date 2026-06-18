import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { SlidersHorizontal, X, Check, Search, ChevronDown } from 'lucide-react';
import api from '../../utils/axios';

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
];

const PRICE_RANGES = [
  { label: 'Under ₹10,000', min: 0, max: 10000 },
  { label: '₹10,000 - ₹25,000', min: 10000, max: 25000 },
  { label: '₹25,000 - ₹50,000', min: 25000, max: 50000 },
  { label: 'Over ₹50,000', min: 50000, max: Infinity },
];

const panelVariants = {
  hidden: { x: '100%' },
  visible: { x: 0, transition: { type: 'spring', stiffness: 350, damping: 35 } },
  exit: { x: '100%', transition: { duration: 0.2, ease: [0.25, 0.1, 0.25, 1] } },
};

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.15 } },
};

export default function ProductFilters() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [categories, setCategories] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [catSearch, setCatSearch] = useState('');

  const currentCategory = searchParams.get('category') || '';
  const currentSort = searchParams.get('sort') || 'newest';
  const currentSearch = searchParams.get('search') || '';
  const priceMin = searchParams.get('priceMin') || '';
  const priceMax = searchParams.get('priceMax') || '';

  useEffect(() => {
    api.get('/products/categories')
      .then(({ data }) => setCategories(data))
      .catch(() => {});
  }, []);

  const updateParams = (key, value) => {
    const params = new URLSearchParams(searchParams);
    if (value) params.set(key, value);
    else params.delete(key);
    params.delete('page');
    setSearchParams(params);
  };

  const toggleCategory = (cat) => {
    if (currentCategory === cat) updateParams('category', '');
    else updateParams('category', cat);
  };

  const setPriceRange = (min, max) => {
    const params = new URLSearchParams(searchParams);
    if (min && max !== '') params.set('priceMin', min); else params.delete('priceMin');
    if (max && max !== Infinity) params.set('priceMax', max); else params.delete('priceMax');
    params.delete('page');
    setSearchParams(params);
    setSidebarOpen(false);
  };

  const clearAll = () => {
    const params = new URLSearchParams();
    if (currentSearch) params.set('search', currentSearch);
    setSearchParams(params);
  };

  const hasFilters = currentCategory || priceMin || priceMax;

  const filteredCategories = categories.filter((c) =>
    c.toLowerCase().includes(catSearch.toLowerCase())
  );

  const isPriceActive = (min, max) =>
    String(priceMin) === String(min) && String(priceMax) === String(max);

  const sidebarContent = (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">Filters</h3>
        {hasFilters && (
          <button
            onClick={clearAll}
            className="text-[11px] text-[var(--color-accent)] hover:underline font-medium"
          >
            Clear all
          </button>
        )}
      </div>

      <div>
        <h4 className="text-xs font-semibold mb-3 uppercase tracking-wider text-[var(--color-text-secondary)]">
          Category
        </h4>
        <div className="relative mb-3">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--color-text-secondary)]" />
          <input
            type="text"
            value={catSearch}
            onChange={(e) => setCatSearch(e.target.value)}
            placeholder="Search categories..."
            className="w-full h-10 pl-10 pr-3 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] text-xs text-[var(--color-text)] outline-none focus:border-[var(--color-accent)] transition-colors"
          />
        </div>
        <div className="space-y-1 max-h-[260px] overflow-y-auto pr-1">
          {filteredCategories.map((cat) => (
            <motion.button
              key={cat}
              whileTap={{ scale: 0.98 }}
              onClick={() => toggleCategory(cat)}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl hover:bg-[var(--glass-bg)] transition-colors text-left group"
            >
              <motion.div
                animate={currentCategory === cat ? { scale: [1, 1.2, 1] } : {}}
                transition={{ duration: 0.2 }}
                className={`w-4.5 h-4.5 rounded-md border-2 flex items-center justify-center transition-all duration-200 ${
                  currentCategory === cat
                    ? 'bg-[var(--color-accent)] border-[var(--color-accent)]'
                    : 'border-[var(--color-border)] group-hover:border-[var(--color-text-secondary)]'
                }`}
              >
                {currentCategory === cat && (
                  <Check className="w-3 h-3 text-white" />
                )}
              </motion.div>
              <span className="text-xs font-medium">{cat}</span>
            </motion.button>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-xs font-semibold mb-3 uppercase tracking-wider text-[var(--color-text-secondary)]">
          Price Range
        </h4>
        <div className="space-y-1">
          {PRICE_RANGES.map((range) => {
            const active = isPriceActive(range.min, range.max);
            return (
              <motion.button
                key={range.label}
                whileTap={{ scale: 0.98 }}
                onClick={() => setPriceRange(range.min, range.max)}
                className={`w-full text-left px-3.5 py-2.5 rounded-2xl text-xs transition-all duration-200 ${
                  active
                    ? 'bg-[var(--color-accent)]/10 text-[var(--color-accent)] font-semibold'
                    : 'hover:bg-[var(--glass-bg)] text-[var(--color-text-secondary)]'
                }`}
              >
                {range.label}
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className="mb-10">
        <div className="flex items-center gap-3">
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => setSidebarOpen(true)}
            className={`inline-flex items-center gap-2 h-10 px-5 rounded-full text-xs font-medium transition-all border ${
              hasFilters
                ? 'bg-[var(--color-accent)]/10 text-[var(--color-accent)] border-[var(--color-accent)]/30'
                : 'bg-[var(--color-surface)] text-[var(--color-text-secondary)] border-[var(--color-border)] hover:border-[var(--color-text-secondary)]'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            Filters
            {hasFilters && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-4.5 h-4.5 rounded-full bg-[var(--color-accent)] text-white text-[9px] font-bold flex items-center justify-center"
              >
                {[currentCategory, priceMin, priceMax].filter(Boolean).length}
              </motion.span>
            )}
          </motion.button>

          <AnimatePresence>
            {hasFilters && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2 flex-wrap"
              >
                {currentCategory && (
                  <motion.span
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full glass-liquid text-xs font-medium"
                  >
                    {currentCategory}
                    <button onClick={() => updateParams('category', '')} className="hover:text-[var(--color-accent)] transition-colors">
                      <X className="w-3 h-3" />
                    </button>
                  </motion.span>
                )}
                {priceMin && (
                  <motion.span
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full glass-liquid text-xs font-medium"
                  >
                    ₹{Number(priceMin).toLocaleString('en-IN')}{priceMax !== 'Infinity' ? ` - ₹${Number(priceMax).toLocaleString('en-IN')}` : '+'}
                    <button onClick={() => { updateParams('priceMin', ''); updateParams('priceMax', ''); }} className="hover:text-[var(--color-accent)] transition-colors">
                      <X className="w-3 h-3" />
                    </button>
                  </motion.span>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="ml-auto relative">
            <select
              value={currentSort}
              onChange={(e) => updateParams('sort', e.target.value)}
              className="appearance-none h-10 px-5 pr-9 rounded-full text-xs font-medium outline-none cursor-pointer transition-all border bg-[var(--color-surface)] text-[var(--color-text-secondary)] border-[var(--color-border)] hover:border-[var(--color-text-secondary)]"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-3 h-3 text-[var(--color-text-secondary)] pointer-events-none" />
          </div>
        </div>

        {currentSearch && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 px-5 py-3 rounded-2xl glass-liquid text-xs text-[var(--color-text-secondary)] flex items-center gap-2"
          >
            <span>
              Search results for:{" "}
              <span className="font-semibold text-[var(--color-text)]">
                &ldquo;{currentSearch}&rdquo;
              </span>
            </span>
            <button
              onClick={() => updateParams('search', '')}
              className="ml-auto text-[var(--color-accent)] hover:underline flex items-center gap-1"
            >
              <X className="w-3 h-3" /> Clear
            </button>
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              variants={backdropVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[150]"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.div
              variants={panelVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed right-0 top-0 bottom-0 w-[340px] max-w-[85vw] z-[160] overflow-y-auto"
            >
              <div className="min-h-full glass-liquid rounded-l-3xl border-l border-[var(--glass-border)] p-8 shadow-2xl">
                <div className="flex items-center justify-between mb-8">
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setSidebarOpen(false)}
                    className="w-8 h-8 rounded-full flex items-center justify-center bg-[var(--glass-bg)] hover:bg-[var(--color-border)] transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </motion.button>
                </div>
                {sidebarContent}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
