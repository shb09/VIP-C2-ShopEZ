import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Smartphone, Monitor, Headphones, Watch, Shirt, Home, Gamepad2, ShoppingBag, ArrowRight } from 'lucide-react';
import api from '../../utils/axios';
import Reveal from '../ui/Reveal';

const categoryIcons = {
  Mobiles: Smartphone,
  Laptops: Monitor,
  Electronics: Headphones,
  Accessories: Watch,
  Fashion: Shirt,
  'Home & Living': Home,
  Gaming: Gamepad2,
};

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const scrollRef = useRef(null);

  useEffect(() => {
    api.get('/products/categories')
      .then(({ data }) => setCategories(data))
      .catch(() => {});
  }, []);

  if (categories.length === 0) return null;

  return (
    <section className="py-24">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="section-label">Categories</p>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Browse by Category</h2>
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <button onClick={() => scrollRef.current?.scrollBy({ left: -300, behavior: 'smooth' })} className="btn-ghost p-1.5 text-xs">←</button>
            <button onClick={() => scrollRef.current?.scrollBy({ left: 300, behavior: 'smooth' })} className="btn-ghost p-1.5 text-xs">→</button>
          </div>
        </div>

        <Reveal variant="fadeUp">
          <div
            ref={scrollRef}
            className="flex gap-3 overflow-x-auto pb-4 scrollbar-none"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {categories.map((cat) => {
              const Icon = categoryIcons[cat] || ShoppingBag;
              return (
                <div key={cat} className="flex-shrink-0">
                  <Link
                    to={`/products?category=${encodeURIComponent(cat)}`}
                    className="flex items-center gap-3 px-4 py-2.5 rounded-xl glass hover:bg-[var(--color-accent)]/10 transition-all duration-300 hover:scale-[1.02] group"
                  >
                    <Icon className="w-4 h-4 text-[var(--color-accent)]" />
                    <span className="text-xs font-medium whitespace-nowrap">{cat}</span>
                    <ArrowRight className="w-3 h-3 text-[var(--color-text-secondary)] group-hover:text-[var(--color-accent)] transition-colors" />
                  </Link>
                </div>
              );
            })}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
