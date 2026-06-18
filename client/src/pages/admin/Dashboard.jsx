import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { Package, ShoppingBag, Users, DollarSign, ArrowRight, TrendingUp, TrendingDown, Activity } from 'lucide-react';
import api from '../../utils/axios';
import { formatPrice, getOrderStatusColor } from '../../utils/helpers';
import ImageWithFallback from '../../components/ui/ImageWithFallback';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.05 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] } },
};

function AnimatedCounter({ value, suffix = '', decimals = 0 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const num = typeof value === 'string' ? parseFloat(value.replace(/[^0-9.-]/g, '')) : value;
    if (isNaN(num)) { setDisplay(value); return; }
    const duration = 1200;
    const steps = 40;
    const increment = num / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= num) {
        setDisplay(num);
        clearInterval(timer);
      } else {
        setDisplay(Math.round(current * 100) / 100);
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [inView, value]);

  const formatted = typeof display === 'number'
    ? (suffix === '₹' ? `${suffix}${display.toLocaleString('en-IN')}` : display.toLocaleString('en-IN', { maximumFractionDigits: decimals }))
    : display;

  return <span ref={ref}>{formatted}</span>;
}

export default function Dashboard() {
  const [stats, setStats] = useState({ products: 0, orders: 0, users: 0, revenue: 0 });
  const [recentOrders, setRecentOrders] = useState([]);
  const [statusCounts, setStatusCounts] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/users/analytics')
      .then(({ data }) => {
        setStats({
          products: data.totalProducts || 0,
          orders: data.totalOrders || 0,
          users: data.totalUsers || 0,
          revenue: data.totalRevenue || 0,
        });

        const counts = {};
        (data.ordersByStatus || []).forEach((o) => { counts[o._id] = o.count; });
        setStatusCounts(counts);
        setRecentOrders(data.recentOrders || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const cards = [
    { label: 'Total Products', value: stats.products, icon: Package, color: '#3b82f6', link: '/admin/products', trend: '+12%' },
    { label: 'Total Orders', value: stats.orders, icon: ShoppingBag, color: '#a78bfa', link: '/admin/orders', trend: '+8%' },
    { label: 'Total Users', value: stats.users, icon: Users, color: '#34d399', link: '/admin/users', trend: '+5%' },
    { label: 'Revenue', value: stats.revenue, icon: DollarSign, color: '#fbbf24', link: '/admin/orders', prefix: '₹', trend: '+18%' },
  ];

  const orderStatuses = ['Processing', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled', 'Returned'];
  const statusColors = { Processing: '#fbbf24', Packed: '#60a5fa', Shipped: '#818cf8', 'Out for Delivery': '#a78bfa', Delivered: '#34d399', Cancelled: '#f87171', Returned: '#fb923c' };

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
        className="flex items-center justify-between mb-8"
      >
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-sm text-[var(--color-text-secondary)] mt-1">Overview of your store</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-[var(--color-text-secondary)] bg-[var(--glass-bg)] px-3 py-1.5 rounded-full border border-[var(--glass-border)]">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#34d399] opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#34d399]" />
          </span>
          <span>Live</span>
        </div>
      </motion.div>

      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="card p-5 space-y-4">
              <div className="h-12 w-12 skeleton rounded-2xl" />
              <div className="h-8 w-24 skeleton" />
              <div className="h-3 w-28 skeleton" />
            </div>
          ))}
        </div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          {cards.map((card) => (
            <motion.div key={card.label} variants={cardVariants}>
              <Link to={card.link} className="card p-5 block group relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 opacity-[0.03] rounded-full -translate-y-1/2 translate-x-1/2"
                  style={{ background: `radial-gradient(circle, ${card.color}, transparent 60%)` }} />
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-3xl flex items-center justify-center relative" style={{ background: `${card.color}12` }}>
                    <card.icon className="w-5.5 h-5.5" style={{ color: card.color }} />
                  </div>
                  <span className={`flex items-center gap-1 text-[11px] font-medium ${card.trend?.startsWith('+') ? 'text-[#34d399]' : 'text-[#f87171]'}`}>
                    <TrendingUp className="w-3 h-3" />
                    {card.trend}
                  </span>
                </div>
                <p className="text-2xl font-bold tracking-tight">
                  {card.prefix}{card.value > 0 ? <AnimatedCounter value={card.value} suffix={card.prefix} /> : card.value}
                </p>
                <p className="text-xs text-[var(--color-text-secondary)] mt-1.5">{card.label}</p>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      )}

      {loading ? (
        <div className="grid lg:grid-cols-5 gap-4 mb-8">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="card p-5 space-y-3">
              <div className="h-8 w-16 skeleton mx-auto" />
              <div className="h-3 w-20 skeleton mx-auto" />
            </div>
          ))}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
          className="grid lg:grid-cols-5 gap-4 mb-8"
        >
          {orderStatuses.map((status, i) => (
            <motion.div
              key={status}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 + i * 0.05, duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
              className="card p-5 text-center relative overflow-hidden group hover:border-[var(--color-accent)]/20 transition-all duration-300"
            >
              <div className="absolute inset-0 opacity-[0.02] group-hover:opacity-[0.04] transition-opacity"
                style={{ background: `linear-gradient(180deg, ${statusColors[status]} 0%, transparent 100%)` }} />
              <p className="text-3xl font-bold mb-1 transition-all duration-300 group-hover:scale-110 origin-center" style={{ color: statusColors[status] }}>
                {statusCounts[status] || 0}
              </p>
              <p className="text-xs text-[var(--color-text-secondary)] font-medium">{status}</p>
            </motion.div>
          ))}
        </motion.div>
      )}

      {loading ? (
        <div className="card p-6 space-y-5">
          <div className="h-5 w-40 skeleton rounded-lg" />
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="h-10 w-10 skeleton rounded-xl" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-48 skeleton rounded-lg" />
                <div className="h-3 w-32 skeleton rounded-lg" />
              </div>
              <div className="h-4 w-20 skeleton rounded-lg" />
            </div>
          ))}
        </div>
      ) : recentOrders.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
          className="card p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-semibold text-sm">Recent Orders</h2>
            <Link to="/admin/orders" className="btn-ghost text-xs gap-1.5 group">
              View All
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform duration-200" />
            </Link>
          </div>
          <div className="space-y-2">
            {recentOrders.map((order, i) => (
              <motion.div
                key={order._id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.55 + i * 0.04, duration: 0.3 }}
              >
                <Link
                  to="/admin/orders"
                  className="flex items-center justify-between p-4 rounded-2xl hover:bg-[var(--glass-bg)] transition-all duration-200 border border-[var(--color-border)] group"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex -space-x-2">
                      {order.items?.slice(0, 3).map((item, j) => (
                        <div key={j} className="w-9 h-9 rounded-lg overflow-hidden border border-[var(--color-border)] bg-[var(--color-surface)] ring-2 ring-[var(--color-card)]">
                          <ImageWithFallback src={item.image} alt="" className="w-full h-full object-cover" />
                        </div>
                      ))}
                      {order.items?.length > 3 && (
                        <div className="w-9 h-9 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] ring-2 ring-[var(--color-card)] flex items-center justify-center text-[10px] font-medium text-[var(--color-text-secondary)]">
                          +{order.items.length - 3}
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium">#{order._id?.slice(-8).toUpperCase()}</p>
                      <p className="text-xs text-[var(--color-text-secondary)]">{order.user?.name || 'Guest'} &middot; {new Date(order.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}</p>
                    </div>
                  </div>
                  <div className="text-right flex items-center gap-3">
                    <p className="text-sm font-bold">{formatPrice(order.totalPrice)}</p>
                    <span className={`badge text-[10px] ${getOrderStatusColor(order.status)}`}>{order.status}</span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
