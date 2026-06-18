import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Eye } from 'lucide-react';
import Hero from '../components/landing/Hero';
import FeaturedProducts from '../components/landing/FeaturedProducts';
import Categories from '../components/landing/Categories';
import CTA from '../components/landing/CTA';
import Newsletter from '../components/landing/Newsletter';
import ImageWithFallback from '../components/ui/ImageWithFallback';
import { useRecentlyViewed } from '../context/RecentlyViewedContext';
import { formatPrice } from '../utils/helpers';
import Reveal from '../components/ui/Reveal';

function RecentlyViewed() {
  const { recent } = useRecentlyViewed();
  if (recent.length === 0) return null;

  return (
    <section className="py-24 pt-0">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <Reveal>
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="section-label">Recently Viewed</p>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Continue Exploring</h2>
            </div>
            <Link to="/products" className="btn-ghost text-xs hidden sm:inline-flex gap-1">
              View All <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
            {recent.slice(0, 6).map((item) => (
              <Link
                key={item._id}
                to={`/products/${item._id}`}
                className="flex-shrink-0 w-40 group"
              >
                <div className="glass-premium rounded-2xl overflow-hidden" style={{ borderRadius: '16px' }}>
                  <div className="aspect-square overflow-hidden bg-[var(--color-surface)]">
                    <ImageWithFallback src={item.image} alt="" category={item.category} className="w-full h-full group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="p-3">
                    <p className="text-[9px] font-semibold text-[var(--color-accent)] uppercase tracking-widest mb-0.5">{item.category}</p>
                    <p className="text-xs font-medium truncate">{item.name}</p>
                    <p className="text-xs font-bold mt-1">{formatPrice(item.price)}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Hero />
      <FeaturedProducts />
      <RecentlyViewed />
      <Categories />
      <CTA />
      <Newsletter />
    </motion.div>
  );
}
