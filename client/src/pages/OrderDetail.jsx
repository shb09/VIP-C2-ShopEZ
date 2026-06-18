import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Package,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
  MapPin,
  CreditCard,
} from 'lucide-react';
import api from '../utils/axios';
import { formatPrice } from '../utils/helpers';
import ImageWithFallback from '../components/ui/ImageWithFallback';
import Loading from '../components/ui/Loading';

const timelineSteps = [
  { key: 'Processing', icon: Clock, label: 'Order Placed', desc: 'Your order has been placed successfully' },
  { key: 'Packed', icon: Package, label: 'Packed', desc: 'Your items have been packed and ready for shipping' },
  { key: 'Shipped', icon: Truck, label: 'Shipped', desc: 'Your order is on its way to you' },
  { key: 'Delivered', icon: CheckCircle, label: 'Delivered', desc: 'Your order has been delivered' },
];

export default function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/orders/${id}`)
      .then(({ data }) => setOrder(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Loading />;
  if (!order) return (
    <div className="text-center py-32">
      <p className="text-[var(--color-text-secondary)] text-lg">Order not found</p>
      <Link to="/orders" className="btn-liquid mt-6 inline-flex">Back to Orders</Link>
    </div>
  );

  const currentIndex = timelineSteps.findIndex((s) => s.key === order.status);
  const isCancelled = order.status === 'Cancelled';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
    >
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Link
          to="/orders"
          className="inline-flex items-center gap-1.5 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] transition-colors mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          Back to Orders
        </Link>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.05 }}
        className="flex flex-wrap items-center justify-between gap-4 mb-10"
      >
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            Order #{order._id.slice(-8).toUpperCase()}
          </h1>
          <p className="text-sm text-[var(--color-text-secondary)] mt-1.5">
            Placed on{' '}
            {new Date(order.createdAt).toLocaleDateString('en-IN', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
        </div>
        {isCancelled ? (
          <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[rgba(248,113,113,0.1)] text-[#f87171] text-sm font-medium">
            <XCircle className="w-4 h-4" /> Cancelled
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[rgba(52,211,153,0.1)] text-[#34d399] text-sm font-medium">
            <CheckCircle className="w-4 h-4" /> {order.status}
          </span>
        )}
      </motion.div>

      <div className="grid lg:grid-cols-5 gap-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="lg:col-span-3"
        >
          <div className="glass-liquid rounded-3xl p-6 md:p-8">
            <h2 className="font-semibold mb-8">Order Status</h2>
            <div className="relative space-y-0">
              {isCancelled ? (
                <div className="flex items-start gap-5 pb-8">
                  <div className="relative flex flex-col items-center">
                    <div className="w-11 h-11 rounded-full bg-[rgba(248,113,113,0.1)] border-2 border-[#f87171] flex items-center justify-center z-10">
                      <XCircle className="w-5 h-5 text-[#f87171]" />
                    </div>
                  </div>
                  <div className="pt-2">
                    <p className="text-sm font-semibold text-[#f87171]">Cancelled</p>
                    <p className="text-xs text-[var(--color-text-secondary)] mt-1">
                      Your order has been cancelled
                    </p>
                  </div>
                </div>
              ) : (
                timelineSteps.map((step, i) => {
                  const complete = i <= currentIndex;
                  const isLast = i === timelineSteps.length - 1;
                  return (
                    <div key={step.key} className="flex items-start gap-5 pb-10 relative">
                      {!isLast && (
                        <div
                          className={`absolute left-[21px] top-11 w-[2px] h-[calc(100%-2.5rem)] transition-all duration-700 ${
                            i < currentIndex
                              ? 'bg-[#34d399]'
                              : 'bg-[var(--color-border)]'
                          }`}
                        />
                      )}
                      <div
                        className={`relative flex flex-col items-center transition-all duration-500 ${
                          complete ? 'scale-100' : 'scale-90 opacity-50'
                        }`}
                      >
                        <div
                          className={`w-11 h-11 rounded-full border-2 flex items-center justify-center z-10 transition-all duration-500 ${
                            complete
                              ? 'bg-[rgba(52,211,153,0.1)] border-[#34d399] shadow-[0_0_12px_rgba(52,211,153,0.2)]'
                              : 'bg-[var(--color-surface)] border-[var(--color-border)]'
                          }`}
                        >
                          <step.icon
                            className={`w-5 h-5 ${
                              complete
                                ? 'text-[#34d399]'
                                : 'text-[var(--color-text-secondary)]'
                            }`}
                          />
                        </div>
                      </div>
                      <div className="pt-2.5">
                        <p
                          className={`text-sm font-semibold ${
                            complete
                              ? 'text-[var(--color-text)]'
                              : 'text-[var(--color-text-secondary)]'
                          }`}
                        >
                          {step.label}
                        </p>
                        <p className="text-xs text-[var(--color-text-secondary)] mt-1">
                          {complete ? step.desc : 'Pending'}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="lg:col-span-2 space-y-6"
        >
          <div className="glass-liquid rounded-3xl p-6 md:p-8">
            <h2 className="font-semibold mb-5">
              Items ({order.items.length})
            </h2>
            <div className="space-y-4">
              {order.items.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 py-3 border-b border-[var(--color-border)]/50 last:border-0"
                >
                  <div className="w-14 h-14 rounded-2xl overflow-hidden bg-[var(--color-surface)] flex-shrink-0 border border-[var(--color-border)]">
                    <ImageWithFallback src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">
                      {item.name}
                    </p>
                    <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">
                      {formatPrice(item.price)} x {item.quantity}
                    </p>
                  </div>
                  <p className="font-bold text-sm">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-liquid rounded-3xl p-6 md:p-8">
            <div className="flex items-center gap-2 mb-5">
              <MapPin className="w-4 h-4 text-[var(--color-accent)]" />
              <h2 className="font-semibold">Shipping Address</h2>
            </div>
            <div className="text-sm text-[var(--color-text-secondary)] space-y-1">
              <p className="text-[var(--color-text)] font-medium">
                {order.shippingAddress.address}
              </p>
              <p>
                {order.shippingAddress.city}, {order.shippingAddress.postalCode}
              </p>
              <p>{order.shippingAddress.country}</p>
            </div>
          </div>

          <div className="glass-liquid rounded-3xl p-6 md:p-8">
            <div className="flex items-center gap-2 mb-5">
              <CreditCard className="w-4 h-4 text-[var(--color-accent)]" />
              <h2 className="font-semibold">Payment</h2>
            </div>
            <p className="text-sm text-[var(--color-text-secondary)]">
              {order.paymentMethod}
            </p>
            <div className="mt-5 space-y-3 text-sm border-t border-[var(--color-border)]/50 pt-5">
              <div className="flex justify-between">
                <span className="text-[var(--color-text-secondary)]">
                  Subtotal
                </span>
                <span className="font-medium">
                  {formatPrice(order.itemsPrice)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--color-text-secondary)]">
                  Shipping
                </span>
                <span className="font-medium">
                  {order.shippingPrice === 0
                    ? 'Free'
                    : formatPrice(order.shippingPrice)}
                </span>
              </div>
              <div className="flex justify-between font-bold text-lg border-t border-[var(--color-border)]/50 pt-4 mt-2">
                <span>Total</span>
                <span>{formatPrice(order.totalPrice)}</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
