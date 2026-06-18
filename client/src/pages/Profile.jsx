import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Save, Package, Calendar, Palette, Heart, Shield, LogOut, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useToast } from '../components/ui/Toast';
import { formatPrice, getOrderStatusColor } from '../utils/helpers';
import api from '../utils/axios';
import ImageWithFallback from '../components/ui/ImageWithFallback';

const themeOptions = [
  { id: 'midnight', label: 'Midnight', icon: Palette, desc: 'Cool blue accents' },
  { id: 'pine', label: 'Pine', icon: Palette, desc: 'Natural green tones' },
  { id: 'mauve', label: 'Mauve', icon: Palette, desc: 'Soft purple hues' },
  { id: 'terracotta', label: 'Terracotta', icon: Palette, desc: 'Warm earthy glow' },
];

const tabs = [
  { id: 'settings', label: 'Account', icon: User },
  { id: 'preferences', label: 'Preferences', icon: Palette },
  { id: 'orders', label: 'Orders', icon: Package },
  { id: 'wishlist', label: 'Wishlist', icon: Heart },
  { id: 'security', label: 'Security', icon: Shield },
];

const springTransition = { type: 'spring', stiffness: 250, damping: 25 };

function SectionLabel({ icon: Icon, label }) {
  return (
    <h2 className="text-sm font-semibold mb-4 flex items-center gap-2">
      <Icon className="w-4 h-4 text-[var(--color-accent)]" />
      {label}
    </h2>
  );
}

export default function Profile() {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const addToast = useToast();
  const [activeTab, setActiveTab] = useState('settings');
  const [form, setForm] = useState({ name: '', email: '' });
  const [saving, setSaving] = useState(false);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      setForm({ name: user.name || '', email: user.email || '' });
      api.get('/orders/mine?limit=5')
        .then(({ data }) => setOrders(data.orders || []))
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) {
      addToast('Name and email are required', 'error');
      return;
    }
    setSaving(true);
    try {
      await api.put('/auth/profile', { name: form.name, email: form.email });
      addToast('Profile updated', 'success');
    } catch {
      addToast('Update failed', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleBlurUpdate = async () => {
    if (form.name.trim() && form.email.trim()) {
      try {
        await api.put('/auth/profile', { name: form.name, email: form.email });
      } catch {
        /* silent */
      }
    }
  };

  if (!user) {
    return (
      <div className="text-center py-32">
        <p className="text-[var(--color-text-secondary)]">Sign in to view your profile</p>
        <Link to="/login" className="btn-liquid mt-6 inline-flex">Sign In</Link>
      </div>
    );
  }

  const initials = user.name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || 'U';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
    >
      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-3xl md:text-4xl font-bold tracking-[-0.03em] mb-10"
      >
        Profile
      </motion.h1>

      <div className="grid lg:grid-cols-4 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
        >
          <div className="glass-premium rounded-3xl overflow-hidden sticky top-28">
            <div className="p-6 text-center border-b border-[var(--color-border)]">
              <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-accent-subtle)] flex items-center justify-center text-white text-xl font-bold mx-auto shadow-lg mb-4">
                {initials}
              </div>
              <h2 className="font-bold">{user.name}</h2>
              <p className="text-xs text-[var(--color-text-secondary)] mt-1">{user.email}</p>
              <span className={`inline-block mt-3 px-3 py-1 rounded-full text-[9px] font-semibold uppercase tracking-wider ${
                user.role === 'admin'
                  ? 'bg-[rgba(251,191,36,0.1)] text-[#fbbf24]'
                  : 'bg-[var(--glass-bg)] text-[var(--color-text-secondary)]'
              }`}>
                {user.role}
              </span>
            </div>
            <nav className="p-2 space-y-0.5">
              {tabs.map((tab) => {
                const active = activeTab === tab.id;
                return (
                  <motion.button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    whileHover={{ x: 2 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-2xl text-xs font-medium transition-all duration-200 relative ${
                      active
                        ? 'text-[var(--color-accent)]'
                        : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text)]'
                    }`}
                  >
                    {active && (
                      <motion.div
                        layoutId="profileTab"
                        className="absolute inset-0 rounded-2xl bg-[var(--color-accent)]/8 border border-[var(--color-accent)]/12"
                        transition={springTransition}
                      />
                    )}
                    <tab.icon className="w-4 h-4 relative z-10" />
                    <span className="relative z-10">{tab.label}</span>
                  </motion.button>
                );
              })}
              <hr className="border-[var(--color-border)] my-2" />
              <button
                onClick={() => { logout(); }}
                className="w-full flex items-center gap-3 px-4 py-2.5 rounded-2xl text-xs font-medium text-[var(--color-text-secondary)] hover:text-[#f87171] transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </nav>
          </div>
        </motion.div>

        <motion.div className="lg:col-span-3 space-y-6">
          <AnimatePresence mode="wait">
            {activeTab === 'settings' && (
              <motion.div
                key="settings"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="glass-premium rounded-3xl p-6 md:p-8"
              >
                <SectionLabel icon={User} label="Account Settings" />
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-xs font-medium mb-2 text-[var(--color-text-secondary)] uppercase tracking-wider">Name</label>
                    <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} onBlur={handleBlurUpdate}
                      className="w-full h-12 px-5 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] text-sm text-[var(--color-text)] outline-none focus:border-[var(--color-accent)] transition-all" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-2 text-[var(--color-text-secondary)] uppercase tracking-wider">Email</label>
                    <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} onBlur={handleBlurUpdate}
                      className="w-full h-12 px-5 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] text-sm text-[var(--color-text)] outline-none focus:border-[var(--color-accent)] transition-all" />
                  </div>
                  <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }} type="submit"
                    className="btn-liquid rounded-2xl" disabled={saving}>
                    {saving ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      : <span className="flex items-center gap-2"><Save className="w-4 h-4" /> Save Changes</span>}
                  </motion.button>
                </form>
              </motion.div>
            )}

            {activeTab === 'preferences' && (
              <motion.div
                key="preferences"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="glass-premium rounded-3xl p-6 md:p-8"
              >
                <SectionLabel icon={Palette} label="Theme Preferences" />
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {themeOptions.map((opt) => {
                    const Icon = opt.icon;
                    const active = theme === opt.id;
                    return (
                      <motion.button key={opt.id} whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.97 }}
                        onClick={() => setTheme(opt.id)}
                        className={`relative p-4 rounded-2xl text-left transition-all duration-200 ${
                          active ? 'bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/30 shadow-sm'
                            : 'bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-[var(--color-border)]'
                        }`}>
                        {active && (
                          <motion.div layoutId="themeActive"
                            className="absolute inset-0 rounded-2xl border-2 border-[var(--color-accent)]/40"
                            transition={{ type: 'spring', stiffness: 400, damping: 30 }} />
                        )}
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${
                          active ? 'bg-[var(--color-accent)]/15 text-[var(--color-accent)]' : 'bg-[var(--glass-bg)] text-[var(--color-text-secondary)]'
                        }`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <p className="text-sm font-medium">{opt.label}</p>
                        <p className="text-[10px] text-[var(--color-text-secondary)] mt-0.5">{opt.desc}</p>
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {activeTab === 'orders' && (
              <motion.div
                key="orders"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="glass-premium rounded-3xl p-6 md:p-8"
              >
                <SectionLabel icon={Package} label="Recent Orders" />
                {loading ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-center gap-4 p-4 rounded-2xl animate-pulse border border-[var(--color-border)]">
                        <div className="h-10 w-10 skeleton rounded-xl" />
                        <div className="flex-1 space-y-2">
                          <div className="h-4 w-40 skeleton" />
                          <div className="h-3 w-24 skeleton" />
                        </div>
                        <div className="h-4 w-16 skeleton" />
                      </div>
                    ))}
                  </div>
                ) : orders.length === 0 ? (
                  <p className="text-sm text-[var(--color-text-secondary)]">No orders yet. Start shopping!</p>
                ) : (
                  <div className="space-y-2">
                    {orders.slice(0, 5).map((order) => (
                      <Link key={order._id} to={`/orders/${order._id}`}
                        className="flex items-center justify-between p-4 rounded-2xl hover:bg-[var(--glass-bg)] transition-colors border border-[var(--color-border)] group">
                        <div className="flex items-center gap-4">
                          <div className="flex -space-x-2">
                            {order.items.slice(0, 3).map((item, i) => (
                              <div key={i} className="w-9 h-9 rounded-xl overflow-hidden border border-[var(--color-border)] bg-[var(--color-surface)]">
                                <ImageWithFallback src={item.image} alt="" className="w-full h-full" />
                              </div>
                            ))}
                          </div>
                          <div>
                            <p className="text-sm font-medium">#{order._id.slice(-8).toUpperCase()}</p>
                            <p className="text-xs text-[var(--color-text-secondary)] flex items-center gap-1 mt-0.5">
                              <Calendar className="w-3 h-3" />
                              {new Date(order.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}
                            </p>
                          </div>
                        </div>
                        <div className="text-right flex items-center gap-3">
                          <p className="font-bold text-sm">{formatPrice(order.totalPrice)}</p>
                          <span className={`inline-block px-2.5 py-0.5 rounded-full text-[9px] font-semibold uppercase tracking-wider ${
                            getOrderStatusColor(order.status) === 'badge-cancelled'
                              ? 'bg-[rgba(248,113,113,0.1)] text-[#f87171]'
                              : 'bg-[var(--glass-bg)] text-[var(--color-text-secondary)]'
                          }`}>{order.status}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
                {orders.length > 5 && (
                  <Link to="/orders" className="inline-flex items-center gap-1 mt-5 text-xs font-medium text-[var(--color-accent)] hover:underline">
                    View all orders <ChevronRight className="w-3 h-3" />
                  </Link>
                )}
              </motion.div>
            )}

            {activeTab === 'wishlist' && (
              <motion.div
                key="wishlist"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="glass-premium rounded-3xl p-6 md:p-8"
              >
                <SectionLabel icon={Heart} label="Wishlist" />
                <Link to="/wishlist" className="btn-liquid rounded-2xl inline-flex items-center gap-2">
                  <Heart className="w-4 h-4" /> View Wishlist
                </Link>
              </motion.div>
            )}

            {activeTab === 'security' && (
              <motion.div
                key="security"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="glass-premium rounded-3xl p-6 md:p-8"
              >
                <SectionLabel icon={Shield} label="Security" />
                <p className="text-sm text-[var(--color-text-secondary)]">Password management and account security settings will be available soon.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </motion.div>
  );
}
