import { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import { ShoppingBag, User, Search, LogOut, Package, LayoutDashboard, Menu, X, ChevronDown, Heart, Grid3X3 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import NotificationPanel from '../ui/NotificationPanel';
import SearchOverlay from '../ui/SearchOverlay';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { items } = useCart();
  const location = useLocation();
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef(null);
  const { scrollY } = useScroll();

  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

  useMotionValueEvent(scrollY, 'change', (latest) => {
    const prev = scrollY.getPrevious();
    setHidden(latest > prev && latest > 250);
    setScrolled(latest > 60);
  });

  useEffect(() => {
    setMobileMenu(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setDropdownOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <motion.header
      initial={false}
      animate={{ y: hidden ? -120 : 0 }}
      transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
      className="fixed top-0 left-0 right-0 z-[100] pt-3 pb-2 pointer-events-none"
    >
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 pointer-events-auto">
        <motion.div
          animate={{
            height: scrolled ? '46px' : '56px',
            paddingLeft: scrolled ? '8px' : '16px',
            paddingRight: scrolled ? '8px' : '16px',
          }}
          transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
          className="glass-nav flex items-center justify-between gap-2"
        >
          <Link to="/" className="flex items-center gap-2 flex-shrink-0 group relative z-10">
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 400, damping: 10 }}
              className="flex items-center gap-2"
            >
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-accent-subtle)] flex items-center justify-center shadow-sm">
                <ShoppingBag className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="text-sm font-semibold tracking-tight text-[var(--color-text)]/90">
                Shop<span className="text-[var(--color-accent)]">EZ</span>
              </span>
            </motion.div>
          </Link>

          <div className="hidden md:flex items-center gap-0.5 relative z-10">
            <Link to="/products" className="btn-ghost text-[11px] py-1.5 px-3 rounded-xl">
              <Grid3X3 className="w-3 h-3 mr-1" /> Products
            </Link>
            {user && (
              <Link to="/orders" className="btn-ghost text-[11px] py-1.5 px-3 rounded-xl">
                Orders
              </Link>
            )}
          </div>

          <div className="flex items-center gap-0.5 relative z-10">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setSearchOpen(true)}
              className="btn-ghost p-2 rounded-xl"
              aria-label="Search"
            >
              <Search className="w-3.5 h-3.5" />
            </motion.button>

            {user && <NotificationPanel />}

            <Link to="/cart">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.9 }}
                className="btn-ghost p-2 relative rounded-xl"
                aria-label="Cart"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                {itemCount > 0 && (
                  <motion.span
                    key={itemCount}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 15 }}
                    className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-[var(--color-accent)] text-white text-[7px] font-bold flex items-center justify-center"
                  >
                    {itemCount > 9 ? '9+' : itemCount}
                  </motion.span>
                )}
              </motion.button>
            </Link>

            {user ? (
              <div className="relative" ref={dropdownRef}>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-1 pl-1.5 pr-1 py-0.5 rounded-xl hover:bg-[rgba(255,255,255,0.04)] transition-all duration-200 ml-0.5"
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-accent-subtle)] flex items-center justify-center text-white text-[10px] font-semibold shadow-sm">
                    {user.name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <motion.div
                    animate={{ rotate: dropdownOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown className="w-2.5 h-2.5 text-[var(--color-text-secondary)]" />
                  </motion.div>
                </motion.button>
                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.92 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.92 }}
                      transition={{ duration: 0.15, ease: [0.25, 0.1, 0.25, 1] }}
                      className="absolute right-0 top-full mt-3 glass-medium rounded-2xl p-1.5 shadow-xl z-50 min-w-[180px]"
                    >
                      <div className="px-3 py-2.5 border-b border-[var(--color-border)] mb-1">
                        <p className="text-[11px] font-medium truncate">{user.name}</p>
                        <p className="text-[10px] text-[var(--color-text-secondary)] truncate">{user.email}</p>
                      </div>
                      <Link to="/profile" onClick={() => setDropdownOpen(false)} className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-[11px] hover:bg-[rgba(255,255,255,0.04)] transition-all duration-200">
                        <User className="w-3 h-3 text-[var(--color-text-secondary)]" /> Profile
                      </Link>
                      <Link to="/orders" onClick={() => setDropdownOpen(false)} className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-[11px] hover:bg-[rgba(255,255,255,0.04)] transition-all duration-200">
                        <Package className="w-3 h-3 text-[var(--color-text-secondary)]" /> Orders
                      </Link>
                      <Link to="/wishlist" onClick={() => setDropdownOpen(false)} className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-[11px] hover:bg-[rgba(255,255,255,0.04)] transition-all duration-200">
                        <Heart className="w-3 h-3 text-[var(--color-text-secondary)]" /> Wishlist
                      </Link>
                      {user.role === 'admin' && (
                        <Link to="/admin" onClick={() => setDropdownOpen(false)} className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-[11px] hover:bg-[rgba(255,255,255,0.04)] transition-all duration-200">
                          <LayoutDashboard className="w-3 h-3 text-[var(--color-text-secondary)]" /> Dashboard
                        </Link>
                      )}
                      <button onClick={() => { logout(); setDropdownOpen(false); }} className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-[11px] hover:bg-[rgba(239,68,68,0.06)] text-[var(--color-error)] w-full transition-all duration-200 mt-0.5">
                        <LogOut className="w-3 h-3" /> Sign Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
                <Link to="/login" className="btn-liquid text-[11px] py-1.5 px-4 rounded-xl">
                  Sign In
                </Link>
              </motion.div>
            )}

            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setMobileMenu(!mobileMenu)}
              className="md:hidden btn-ghost p-2 rounded-xl"
              aria-label="Menu"
            >
              {mobileMenu ? <X className="w-3.5 h-3.5" /> : <Menu className="w-3.5 h-3.5" />}
            </motion.button>
          </div>
        </motion.div>

        <AnimatePresence>
          {mobileMenu && (
            <motion.div
              initial={{ opacity: 0, y: -12, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.95 }}
              transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
              className="md:hidden mt-3 glass-medium rounded-2xl overflow-hidden shadow-xl"
            >
              <div className="py-2 px-2 space-y-0.5">
                <Link to="/products" className="block px-4 py-2.5 rounded-xl text-xs hover:bg-[rgba(255,255,255,0.04)] transition-colors">Products</Link>
                {user && <Link to="/orders" className="block px-4 py-2.5 rounded-xl text-xs hover:bg-[rgba(255,255,255,0.04)] transition-colors">Orders</Link>}
                {user && <Link to="/wishlist" className="block px-4 py-2.5 rounded-xl text-xs hover:bg-[rgba(255,255,255,0.04)] transition-colors">Wishlist</Link>}
                {user?.role === 'admin' && <Link to="/admin" className="block px-4 py-2.5 rounded-xl text-xs hover:bg-[rgba(255,255,255,0.04)] transition-colors">Dashboard</Link>}
                <hr className="border-[var(--color-border)] my-1.5 mx-2" />
                {user ? (
                  <>
                    <div className="px-4 py-2">
                      <p className="text-xs font-medium">{user.name}</p>
                      <p className="text-[10px] text-[var(--color-text-secondary)]">{user.email}</p>
                    </div>
                    <Link to="/profile" className="block px-4 py-2.5 rounded-xl text-xs hover:bg-[rgba(255,255,255,0.04)] transition-colors">Profile</Link>
                    <button onClick={() => { logout(); setMobileMenu(false); }} className="block w-full text-left px-4 py-2.5 rounded-xl text-xs text-[var(--color-error)] hover:bg-[rgba(239,68,68,0.06)] transition-colors">Sign Out</button>
                  </>
                ) : (
                  <Link to="/login" className="block px-4 py-2.5 rounded-xl text-xs font-medium text-[var(--color-accent)] hover:bg-[rgba(255,255,255,0.04)] transition-colors">Sign In</Link>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </motion.header>
  );
}
