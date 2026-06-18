import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Package, ChevronDown, ChevronUp, User, Mail, MapPin, CreditCard } from 'lucide-react';
import api from '../../utils/axios';
import { formatPrice, getOrderStatusColor } from '../../utils/helpers';
import { useToast } from '../../components/ui/Toast';
import { useNotifications } from '../../context/NotificationContext';
import ImageWithFallback from '../../components/ui/ImageWithFallback';

const STATUSES = ['Processing', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled', 'Returned'];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.04, delayChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] } },
};

const statusFilters = [
  { label: 'All', value: '', color: '' },
  { label: 'Processing', value: 'Processing', color: '#fbbf24' },
  { label: 'Packed', value: 'Packed', color: '#60a5fa' },
  { label: 'Shipped', value: 'Shipped', color: '#818cf8' },
  { label: 'Out for Delivery', value: 'Out for Delivery', color: '#a78bfa' },
  { label: 'Delivered', value: 'Delivered', color: '#34d399' },
  { label: 'Cancelled', value: 'Cancelled', color: '#f87171' },
  { label: 'Returned', value: 'Returned', color: '#fb923c' },
];

export default function ManageOrders() {
  const [orders, setOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [updating, setUpdating] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const addToast = useToast();
  const { addNotification } = useNotifications();

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter) params.set('status', statusFilter);
      const { data } = await api.get(`/orders?${params}`);
      setOrders(data.orders || []);
    } catch {
      addToast('Failed to load orders', 'error');
    } finally {
      setLoading(false);
    }
  }, [statusFilter, addToast]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdating(orderId);
    try {
      const prev = orders.find((o) => o._id === orderId)?.status;
      await api.put(`/orders/${orderId}/status`, { status: newStatus });
      setOrders((prevOrders) =>
        prevOrders.map((o) => (o._id === orderId ? { ...o, status: newStatus } : o))
      );
      addToast(`Order status changed to "${newStatus}"`, 'success');
      addNotification(`Order #${orderId.slice(-8).toUpperCase()} status updated to "${newStatus}"`, 'info');
    } catch (err) {
      addToast(err?.response?.data?.message || 'Update failed', 'error');
    } finally {
      setUpdating(null);
    }
  };

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-8"
      >
        <h1 className="text-2xl font-bold tracking-tight">Orders</h1>
        <p className="text-sm text-[var(--color-text-secondary)] mt-1">Manage customer orders</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}
        className="flex flex-wrap gap-2 mb-6"
      >
        {statusFilters.map((s) => (
          <button
            key={s.value}
            onClick={() => setStatusFilter(s.value)}
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
              statusFilter === s.value
                ? 'text-white shadow-lg'
                : 'bg-[var(--color-card)] border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-accent)]/30'
            }`}
            style={statusFilter === s.value ? { background: s.color || 'var(--color-accent)' } : {}}
          >
            {s.label}
          </button>
        ))}
      </motion.div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="card p-5 space-y-4">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="h-4 w-48 skeleton rounded-lg" />
                  <div className="h-3 w-32 skeleton rounded-lg" />
                </div>
                <div className="h-6 w-20 skeleton rounded-full" />
              </div>
              <div className="flex gap-2">
                {[1, 2, 3].map((j) => (
                  <div key={j} className="w-8 h-8 skeleton rounded-lg" />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : orders.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-24"
        >
          <div className="w-16 h-16 rounded-2xl glass flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="w-8 h-8 text-[var(--color-text-secondary)]" />
          </div>
          <p className="text-base font-medium text-[var(--color-text-secondary)]">No orders found</p>
          <p className="text-sm text-[var(--color-text-secondary)] mt-1 opacity-60">
            {statusFilter ? `No orders with status "${statusFilter}"` : 'Orders will appear here'}
          </p>
        </motion.div>
      ) : (
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-3">
          {orders.map((order, i) => {
            const isExpanded = expandedId === order._id;
            return (
              <motion.div
                key={order._id}
                variants={itemVariants}
                className="card p-5 md:p-6 relative overflow-hidden group hover:border-[var(--color-accent)]/15 transition-all duration-300"
              >
                <div className="flex flex-wrap items-start justify-between gap-4 mb-4 relative z-10">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <p className="text-sm font-medium">
                        Order #<span className="text-[var(--color-accent)] font-mono">{order._id?.slice(-8).toUpperCase()}</span>
                      </p>
                      <div className="relative">
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusChange(order._id, e.target.value)}
                          disabled={updating === order._id}
                          className="px-3 py-1.5 rounded-full bg-[var(--color-card)] border border-[var(--color-border)] text-xs outline-none cursor-pointer appearance-none pr-8 hover:border-[var(--color-accent)]/30 transition-all disabled:opacity-40"
                        >
                          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                        </select>
                        <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-[var(--color-text-secondary)] pointer-events-none" />
                      </div>
                      {updating === order._id && <span className="spinner" />}
                    </div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2">
                      <span className="text-xs text-[var(--color-text-secondary)] flex items-center gap-1">
                        <User className="w-3 h-3" /> {order.user?.name || 'Guest'}
                      </span>
                      {order.user?.email && (
                        <span className="text-xs text-[var(--color-text-secondary)] flex items-center gap-1">
                          <Mail className="w-3 h-3" /> {order.user.email}
                        </span>
                      )}
                      <span className="text-xs text-[var(--color-text-secondary)] opacity-60">
                        {new Date(order.createdAt).toLocaleDateString('en-IN', {
                          year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
                        })}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold">{formatPrice(order.totalPrice)}</span>
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : order._id)}
                      className="btn-ghost p-1.5 rounded-lg"
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 relative z-10">
                  <div className="flex -space-x-2">
                    {order.items?.slice(0, 5).map((item, j) => (
                      <div key={j} className="w-9 h-9 rounded-lg overflow-hidden border border-[var(--color-border)] bg-[var(--color-surface)] ring-2 ring-[var(--color-card)]">
                        <ImageWithFallback src={item.image} alt="" className="w-full h-full object-cover" />
                      </div>
                    ))}
                    {order.items?.length > 5 && (
                      <div className="w-9 h-9 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] ring-2 ring-[var(--color-card)] flex items-center justify-center text-[10px] font-medium text-[var(--color-text-secondary)]">
                        +{order.items.length - 5}
                      </div>
                    )}
                  </div>
                  <span className="text-[10px] text-[var(--color-text-secondary)]">
                    {order.items?.length || 0} item{(order.items?.length || 0) !== 1 ? 's' : ''}
                  </span>
                </div>

                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                    className="mt-5 pt-5 border-t border-[var(--color-border)] relative z-10"
                  >
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider mb-3">Order Items</h4>
                        <div className="space-y-3">
                          {order.items?.map((item, j) => (
                            <div key={j} className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg overflow-hidden bg-[var(--color-surface)] border border-[var(--color-border)] flex-shrink-0">
                                <ImageWithFallback src={item.image} alt="" className="w-full h-full object-cover" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-medium truncate">{item.name}</p>
                                <p className="text-[10px] text-[var(--color-text-secondary)]">
                                  {formatPrice(item.price)} × {item.quantity}
                                </p>
                              </div>
                              <p className="text-xs font-bold">{formatPrice(item.price * item.quantity)}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="space-y-4">
                        {order.shippingAddress && (
                          <div>
                            <h4 className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                              <MapPin className="w-3 h-3" /> Shipping Address
                            </h4>
                            <div className="text-xs text-[var(--color-text)] space-y-0.5">
                              <p>{order.shippingAddress.address}</p>
                              <p>{order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>
                              <p>{order.shippingAddress.country}</p>
                            </div>
                          </div>
                        )}
                        {order.paymentMethod && (
                          <div>
                            <h4 className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                              <CreditCard className="w-3 h-3" /> Payment
                            </h4>
                            <p className="text-xs text-[var(--color-text)]">{order.paymentMethod}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </div>
  );
}
