import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../utils/axios';
import ProductCard from '../components/products/ProductCard';
import ProductFilters from '../components/products/ProductFilters';
import Pagination from '../components/products/Pagination';
import ProductSkeleton from '../components/ui/ProductSkeleton';
import EmptyState from '../components/ui/EmptyState';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.04 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 200, damping: 25 } },
};

export default function Products() {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const category = searchParams.get('category') || '';
  const sort = searchParams.get('sort') || 'newest';
  const search = searchParams.get('search') || '';
  const pageParam = searchParams.get('page') || '1';
  const priceMin = searchParams.get('priceMin') || '';
  const priceMax = searchParams.get('priceMax') || '';

  useEffect(() => {
    setLoading(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const params = new URLSearchParams({ page: pageParam, limit: '12' });
    if (category) params.set('category', category);
    if (sort) params.set('sort', sort);
    if (search) params.set('search', search);
    if (priceMin) params.set('priceMin', priceMin);
    if (priceMax) params.set('priceMax', priceMax);

    api.get(`/products?${params}`)
      .then(({ data }) => {
        setProducts(data.products);
        setPage(data.page);
        setPages(data.pages);
        setTotal(data.total);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [category, sort, search, pageParam, priceMin, priceMax]);

  const getGridSpan = (index) => {
    if (index === 0) return 'md:col-span-2';
    if (index % 5 === 0) return 'md:col-span-2';
    return '';
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
    >
      <div className="mb-10">
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
          className="text-4xl md:text-6xl font-bold tracking-[-0.03em]"
        >
          {search ? (
            <>
              Results for{" "}
              <span className="text-[var(--color-accent)]">&ldquo;{search}&rdquo;</span>
            </>
          ) : category || 'All Products'}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="text-sm text-[var(--color-text-secondary)] mt-3"
        >
          {!loading && `${(page - 1) * 12 + 1}–${Math.min(page * 12, total)} of ${total} pieces`}
        </motion.p>
      </div>

      <ProductFilters />

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <ProductSkeleton key={i} featured={i === 0 || i % 5 === 0} />
          ))}
        </div>
      ) : products.length === 0 ? (
        <EmptyState
          icon="🔍"
          title="No products found"
          description="Try adjusting your search or filter criteria"
          actionLabel="View All Products"
          actionLink="/products"
        />
      ) : (
        <>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
          >
            <AnimatePresence>
              {products.map((product, i) => (
                <motion.div
                  key={product._id}
                  variants={itemVariants}
                  layout
                  className={getGridSpan(i)}
                >
                  <ProductCard product={product} featured={i === 0 || i % 5 === 0} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Pagination page={page} pages={pages} />
          </motion.div>
        </>
      )}
    </motion.div>
  );
}
