import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingBag } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-[var(--color-border)] mt-auto relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          <div className="col-span-2 md:col-span-1">
            <motion.div whileHover={{ scale: 1.02 }} transition={{ type: 'spring', stiffness: 400, damping: 10 }}>
              <Link to="/" className="text-xl font-bold tracking-tight flex items-center gap-2 mb-4">
                <ShoppingBag className="w-5 h-5 text-[var(--color-accent)]" />
                <span>Shop<span className="text-[var(--color-accent)]">EZ</span></span>
              </Link>
            </motion.div>
            <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed max-w-xs">
              Premium e-commerce platform. Quality products, seamless experience.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-4 uppercase tracking-wider text-[var(--color-text-secondary)]">Shop</h4>
            <ul className="space-y-3 text-sm">
              <motion.li whileHover={{ x: 3 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }}>
                <Link to="/products" className="text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] transition-colors">All Products</Link>
              </motion.li>
              <motion.li whileHover={{ x: 3 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }}>
                <Link to="/products?category=Mobiles" className="text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] transition-colors">Mobiles</Link>
              </motion.li>
              <motion.li whileHover={{ x: 3 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }}>
                <Link to="/products?category=Laptops" className="text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] transition-colors">Laptops</Link>
              </motion.li>
              <motion.li whileHover={{ x: 3 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }}>
                <Link to="/products?category=Electronics" className="text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] transition-colors">Electronics</Link>
              </motion.li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-4 uppercase tracking-wider text-[var(--color-text-secondary)]">Support</h4>
            <ul className="space-y-3 text-sm text-[var(--color-text-secondary)]">
              <motion.li whileHover={{ x: 3 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }}>
                <span className="cursor-default hover:text-[var(--color-accent)] transition-colors">Contact Us</span>
              </motion.li>
              <motion.li whileHover={{ x: 3 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }}>
                <span className="cursor-default hover:text-[var(--color-accent)] transition-colors">FAQ</span>
              </motion.li>
              <motion.li whileHover={{ x: 3 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }}>
                <span className="cursor-default hover:text-[var(--color-accent)] transition-colors">Shipping</span>
              </motion.li>
              <motion.li whileHover={{ x: 3 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }}>
                <span className="cursor-default hover:text-[var(--color-accent)] transition-colors">Returns</span>
              </motion.li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-4 uppercase tracking-wider text-[var(--color-text-secondary)]">Company</h4>
            <ul className="space-y-3 text-sm text-[var(--color-text-secondary)]">
              <motion.li whileHover={{ x: 3 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }}>
                <span className="cursor-default hover:text-[var(--color-accent)] transition-colors">About</span>
              </motion.li>
              <motion.li whileHover={{ x: 3 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }}>
                <span className="cursor-default hover:text-[var(--color-accent)] transition-colors">Privacy</span>
              </motion.li>
              <motion.li whileHover={{ x: 3 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }}>
                <span className="cursor-default hover:text-[var(--color-accent)] transition-colors">Terms</span>
              </motion.li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-[var(--color-border)] flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-[var(--color-text-secondary)]">
          <p>&copy; {new Date().getFullYear()} ShopEZ. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
