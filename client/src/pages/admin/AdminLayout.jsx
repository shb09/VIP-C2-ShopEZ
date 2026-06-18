import { useState } from 'react';
import { Link, Outlet, useLocation, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, Package, ShoppingBag, Users, Menu, X, ChevronLeft, Store } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const navItems = [
  { to: '/admin', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/admin/products', icon: Package, label: 'Products' },
  { to: '/admin/orders', icon: ShoppingBag, label: 'Orders' },
  { to: '/admin/users', icon: Users, label: 'Users' },
];

export default function AdminLayout() {
  const { user } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!user || user.role !== 'admin') return <Navigate to="/login" />;

  const isActive = (item) => {
    return item.end ? location.pathname === item.to : location.pathname.startsWith(item.to);
  };

  return (
    <div className="min-h-screen flex pt-16 bg-[var(--color-bg)]">
      <div className="hidden lg:flex flex-col w-64 border-r border-[var(--color-border)] glass-light fixed left-0 top-16 bottom-0 z-40">
        <div className="flex items-center gap-3 px-5 py-5 border-b border-[var(--color-border)]/50">
          <div className="w-8 h-8 rounded-lg bg-[var(--color-accent)]/10 flex items-center justify-center">
            <LayoutDashboard className="w-4 h-4 text-[var(--color-accent)]" />
          </div>
          <span className="font-semibold text-sm tracking-tight">Admin Panel</span>
        </div>
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {navItems.map((item, i) => {
            const active = isActive(item);
            return (
              <motion.div
                key={item.to}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06, duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
              >
                <Link
                  to={item.to}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group relative ${
                    active
                      ? 'text-[var(--color-accent)]'
                      : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text)]'
                  }`}
                >
                  {active && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 rounded-xl bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/15"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                  <item.icon className="w-4.5 h-4.5 relative z-10" />
                  <span className="relative z-10">{item.label}</span>
                  {active && (
                    <motion.div
                      layoutId="activeDot"
                      className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)] ml-auto relative z-10"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                </Link>
              </motion.div>
            );
          })}
        </nav>
        <div className="p-3 border-t border-[var(--color-border)]/50">
          <Link
            to="/"
            className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm text-[var(--color-text-secondary)] hover:bg-[var(--glass-bg)] hover:text-[var(--color-text)] transition-all duration-200 group"
          >
            <div className="w-8 h-8 rounded-lg bg-[var(--glass-bg)] flex items-center justify-center group-hover:bg-[var(--color-accent)]/10 transition-colors duration-200">
              <Store className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <span className="text-sm font-medium">Back to Store</span>
              <p className="text-[10px] opacity-50">Return to shopping</p>
            </div>
            <ChevronLeft className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity" />
          </Link>
        </div>
      </div>

      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-[var(--color-border)] glass-light shadow-2xl">
        <div className="flex items-center justify-around px-2 py-1">
          {navItems.map((item) => {
            const active = isActive(item);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex flex-col items-center gap-0.5 py-2 px-3 rounded-xl text-[10px] font-medium transition-all duration-200 relative ${
                  active ? 'text-[var(--color-accent)]' : 'text-[var(--color-text-secondary)]'
                }`}
              >
                {active && (
                  <motion.div
                    layoutId="mobileActiveTab"
                    className="absolute inset-0 rounded-xl bg-[var(--color-accent)]/10"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <item.icon className="w-5 h-5 relative z-10" />
                <span className="relative z-10">{item.label}</span>
              </Link>
            );
          })}
          <Link
            to="/"
            className="flex flex-col items-center gap-0.5 py-2 px-3 rounded-xl text-[10px] font-medium text-[var(--color-text-secondary)]"
          >
            <Store className="w-5 h-5" />
            <span>Store</span>
          </Link>
        </div>
      </div>

      <div className="flex-1 lg:ml-64 p-4 sm:p-6 lg:p-8 pb-24 lg:pb-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
