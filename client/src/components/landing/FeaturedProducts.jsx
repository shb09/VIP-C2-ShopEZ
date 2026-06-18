import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import api from '../../utils/axios';
import { formatPrice } from '../../utils/helpers';
import ImageWithFallback from '../ui/ImageWithFallback';
import ProductSkeleton from '../ui/ProductSkeleton';
import Reveal from '../ui/Reveal';

export default function FeaturedProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] });
  const sectionY = useTransform(scrollYProgress, [0, 1], [40, -40]);

  useEffect(() => {
    api.get('/products?page=1&limit=4&sort=newest')
      .then(({ data }) => setProducts(data.products || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {Array.from({ length: 4 }).map((_, i) => <ProductSkeleton key={i} />)}
          </div>
        </div>
      </section>
    );
  }

  if (products.length === 0) return null;

  const hero = products[0];
  const rest = products.slice(1);

  return (
    <section ref={sectionRef} className="py-24">
      <motion.div style={{ y: sectionY }} className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="section-label">Featured</p>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">New Arrivals</h2>
          </div>
          <Link to="/products" className="btn-ghost text-xs hidden sm:inline-flex gap-1">
            View All <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <Reveal>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          variants={{ visible: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } } }}
          className="grid lg:grid-cols-3 gap-6"
        >
          <motion.div
            variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] } } }}
            className="lg:col-span-2"
          >
            <Link to={`/products/${hero._id}`} className="card overflow-hidden group block card-lift h-full">
              <div className="aspect-[4/3] relative overflow-hidden bg-[var(--color-surface)]">
                <ImageWithFallback src={hero.image} alt={hero.name} category={hero.category} className="w-full h-full group-hover:scale-[1.03] transition-transform duration-700 ease-out" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <p className="text-[10px] font-semibold text-white/80 uppercase tracking-widest mb-2">{hero.category}</p>
                  <h3 className="text-xl font-bold text-white mb-1">{hero.name}</h3>
                  <p className="text-lg font-semibold text-white/90">{formatPrice(hero.price)}</p>
                </div>
              </div>
            </Link>
          </motion.div>

          <div className="flex flex-col gap-6">
            {rest.map((product, i) => (
              <motion.div
                key={product._id}
                variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] } } }}
                className="flex-1"
              >
                <Link to={`/products/${product._id}`} className="card overflow-hidden group block card-lift h-full">
                  <div className="flex items-center gap-4 p-4">
                    <div className="w-20 h-20 rounded-xl overflow-hidden bg-[var(--color-surface)] flex-shrink-0">
                      <ImageWithFallback src={product.image} alt={product.name} category={product.category} className="w-full h-full group-hover:scale-[1.03] transition-transform duration-700 ease-out" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-semibold text-[var(--color-accent)] uppercase tracking-widest mb-1">{product.category}</p>
                      <h3 className="text-sm font-medium leading-snug line-clamp-1">{product.name}</h3>
                      <p className="text-sm font-semibold mt-1">{formatPrice(product.price)}</p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
        </Reveal>

        <Link to="/products" className="mt-6 btn-glass text-xs sm:hidden inline-flex">
          View All Products <ArrowRight className="w-3 h-3" />
        </Link>
      </motion.div>
    </section>
  );
}
