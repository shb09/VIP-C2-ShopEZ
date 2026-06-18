import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Package, CheckCircle, Truck, Clock, XCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import api from '../utils/axios';
import { useAuth } from '../context/AuthContext';
import { formatPrice } from '../utils/helpers';
import ImageWithFallback from '../components/ui/ImageWithFallback';
import EmptyState from '../components/ui/EmptyState';

const timelineSteps = ['Processing', 'Packed', 'Shipped', 'Delivered'];

const statusIcons = {
  Processing: Clock,
  Packed: Package,
  Shipped: Truck,
  Delivered: CheckCircle,
  Cancelled: XCircle,
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] },
  },
};

function OrderTimeline({ status }) {
  const currentIndex = timelineSteps.indexOf(status);
  const isCancelled = status === 'Cancelled';

  return (
    <div className="flex items-center gap-1.5">
      {timelineSteps.map((step, i) => {
        const complete = !isCancelled && i <= currentIndex;
        return (
          <div key={step} className="flex items-center gap-1.5">
            <div
              className={`w-2.5 h-2.5 rounded-full transition-all duration-500 ${
                complete
                  ? 'bg-[#34d399] shadow-[0_0_6px_rgba(52,211,153,0.5)]'
                  : isCancelled && i === 0
                  ? 'bg-[#f87171]'
                  : 'bg-[var(--color-border)]'
              }`}
            />
            {i < timelineSteps.length - 1 && (
              <div
                className={`w-5 h-0.5 rounded-full transition-all duration-500 ${
                  !isCancelled && i < currentIndex
                    ? 'bg-[#34d399]'
                    : 'bg-[var(--color-border)]'
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

function Skeleton() {
  return (
    <div className="glass rounded-3xl p-6 animate-pulse space-y-4">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl skeleton" />
        <div className="space-y-2 flex-1">
          <div className="h-4 w-40 skeleton" />
          <div className="h-3 w-24 skeleton" />
        </div>
        <div className="h-6 w-20 skeleton" />
      </div>
      <div className="flex gap-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="w-12 h-12 rounded-xl skeleton" />
        ))}
      </div>
    </div>
  );
}

export default function Orders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      setLoading(true);
      api.get(`/orders/mine?page=${page}&limit=10`)
        .then(({ data }) => {
          setOrders(data.orders || data || []);
          setPages(data.pages || 1);
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, [user, page]);

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <EmptyState
          icon={<Package className="w-12 h-12" />}
          title="Sign in required"
          description="Please sign in to view your orders"
          actionLabel="Sign In"
          actionLink="/login"
        />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
    >
      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-3xl md:text-4xl font-bold tracking-tight mb-10"
      >
        My Orders
      </motion.h1>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.05 }}
            >
              <Skeleton />
            </motion.div>
          ))}
        </div>
      ) : orders.length === 0 ? (
        <EmptyState
          icon={<Package className="w-12 h-12" />}
          title="No orders yet"
          description="Start shopping to see your orders here"
          actionLabel="Browse Products"
          actionLink="/products"
        />
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-4"
        >
          {orders.map((order) => {
            const StatusIcon = statusIcons[order.status] || Package;
            const isCancelled = order.status === 'Cancelled';

            return (
              <motion.div
                key={order._id}
                variants={itemVariants}
                whileHover={{ y: -2, scale: 1.005 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              >
                <Link
                  to={`/orders/${order._id}`}
                  className="block glass-liquid rounded-3xl p-6 transition-all hover:shadow-lg hover:shadow-black/5"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                          isCancelled
                            ? 'bg-[rgba(248,113,113,0.1)]'
                            : order.status === 'Delivered'
                            ? 'bg-[rgba(52,211,153,0.1)]'
                            : 'bg-[var(--glass-bg)]'
                        }`}
                      >
                        <StatusIcon
                          className={`w-5 h-5 ${
                            order.status === 'Delivered'
                              ? 'text-[#34d399]'
                              : isCancelled
                              ? 'text-[#f87171]'
                              : 'text-[var(--color-accent)]'
                          }`}
                        />
                      </div>
                      <div>
                        <p className="font-medium text-sm">
                          Order{' '}
                          <span className="font-semibold">
                            #{order._id.slice(-8).toUpperCase()}
                          </span>
                        </p>
                        <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">
                          {new Date(order.createdAt).toLocaleDateString('en-IN', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-5">
                      {!isCancelled && <OrderTimeline status={order.status} />}
                      <span className="font-bold text-base">
                        {formatPrice(order.totalPrice)}
                      </span>
                    </div>
                  </div>
                  <div className="mt-5 flex gap-2 overflow-x-auto pb-1">
                    {order.items.slice(0, 5).map((item, j) => (
                      <div
                        key={j}
                        className="w-12 h-12 rounded-xl overflow-hidden bg-[var(--color-bg)] flex-shrink-0 border border-[var(--color-border)]"
                      >
                        <ImageWithFallback src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                    ))}
                    {order.items.length > 5 && (
                      <div className="w-12 h-12 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] flex items-center justify-center text-xs font-semibold flex-shrink-0">
                        +{order.items.length - 5}
                      </div>
                    )}
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      )}

      {pages > 1 && (
        <div className="flex items-center justify-center gap-3 mt-10">
          <button
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
            className="btn-glass text-sm disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1"
          >
            <ChevronLeft className="w-4 h-4" /> Previous
          </button>
          <div className="flex items-center gap-1.5">
            {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`w-9 h-9 rounded-xl text-xs font-medium transition-all duration-200 ${
                  page === p
                    ? 'bg-[var(--color-accent)] text-white shadow-lg shadow-[var(--glow-color)]'
                    : 'text-[var(--color-text-secondary)] hover:bg-[var(--glass-bg)] border border-[var(--color-border)]'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
          <button
            onClick={() => setPage(Math.min(pages, page + 1))}
            disabled={page === pages}
            className="btn-glass text-sm disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1"
          >
            Next <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </motion.div>
  );
}
