import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Trash2, Minus, Plus, ArrowLeft, CreditCard, Truck, ShieldCheck, MapPin, Zap, Gift } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/ui/Toast';
import { formatPrice } from '../utils/helpers';
import api from '../utils/axios';
import ImageWithFallback from '../components/ui/ImageWithFallback';
import EmptyState from '../components/ui/EmptyState';
import FloatingLabelInput from '../components/ui/FloatingLabelInput';

function AnimatedPrice({ value, className = '' }) {
  const ref = useRef(null);
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    const from = display;
    const to = value;
    const duration = 400;
    const start = performance.now();

    const animate = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(from + (to - from) * eased);
      if (progress < 1) requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }, [value]);

  const formatted = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(display);

  return <span className={className}>{formatted}</span>;
}

export default function Cart() {
  const { items, removeItem, updateQuantity, subtotal, shipping, total, loading, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const addToast = useToast();
  const [checkingOut, setCheckingOut] = useState(false);
  const [shippingForm, setShippingForm] = useState({ address: '', city: '', postalCode: '', country: '' });

  const freeShippingThreshold = 500;
  const progress = Math.min((subtotal / freeShippingThreshold) * 100, 100);
  const remaining = freeShippingThreshold - subtotal;

  const handleCheckout = async () => {
    if (!user) { navigate('/login'); return; }
    if (!shippingForm.address || !shippingForm.city || !shippingForm.postalCode || !shippingForm.country) {
      addToast('Please fill in shipping details', 'error');
      return;
    }
    if (items.length === 0) { addToast('Cart is empty', 'error'); return; }
    setCheckingOut(true);
    try {
      await api.post('/orders', {
        items: items.map((i) => ({ product: i._id, name: i.name, image: i.image, price: i.price, quantity: i.quantity })),
        shippingAddress: shippingForm,
        paymentMethod: 'Cash on Delivery',
        itemsPrice: subtotal,
        shippingPrice: shipping,
        totalPrice: total,
      });
      addToast('Order placed successfully!', 'success');
      clearCart();
      navigate('/orders');
    } catch (err) {
      addToast(err?.response?.data?.message || 'Checkout failed', 'error');
    } finally {
      setCheckingOut(false);
    }
  };

  const updateField = (field, value) => setShippingForm((prev) => ({ ...prev, [field]: value }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
    >
      <Link to="/products" className="inline-flex items-center gap-1.5 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] transition-colors mb-8 group">
        <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
        Continue Shopping
      </Link>

      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05, type: 'spring', stiffness: 200, damping: 25 }}
        className="text-4xl font-bold tracking-[-0.03em] mb-8"
      >
        Cart
      </motion.h1>

      {loading ? (
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="card p-5 flex items-center gap-4 animate-pulse">
                <div className="w-20 h-20 rounded-2xl skeleton" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-40 skeleton" />
                  <div className="h-3 w-20 skeleton" />
                  <div className="h-8 w-28 skeleton" />
                </div>
                <div className="h-5 w-16 skeleton" />
              </div>
            ))}
          </div>
          <div>
            <div className="card p-6 space-y-4">
              <div className="h-5 w-32 skeleton" />
              <div className="h-4 w-full skeleton" />
              <div className="h-4 w-full skeleton" />
              <div className="h-6 w-full skeleton" />
              <div className="h-12 w-full skeleton" />
            </div>
          </div>
        </div>
      ) : items.length === 0 ? (
        <EmptyState
          icon={<ShoppingBag className="w-12 h-12" />}
          title="Your cart is empty"
          description="Looks like you haven't added anything yet"
          actionLabel="Browse Products"
          actionLink="/products"
        />
      ) : (
        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-[var(--color-text-secondary)]">{items.length} {items.length === 1 ? 'item' : 'items'}</p>
            </div>
            <AnimatePresence>
              {items.map((item) => (
                <motion.div
                  key={item._id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20, height: 0, marginBottom: 0 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  className="glass-premium p-4 md:p-5 flex items-center gap-4 overflow-hidden"
                  style={{ borderRadius: '24px' }}
                >
                  <div className="w-20 h-20 rounded-2xl overflow-hidden bg-[var(--color-surface)] flex-shrink-0 border border-[var(--color-border)]">
                    <ImageWithFallback src={item.image} alt={item.name} category={item.category} className="w-full h-full" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link to={`/products/${item._id}`} className="font-semibold text-sm hover:text-[var(--color-accent)] transition-colors line-clamp-1">{item.name}</Link>
                    <p className="text-sm text-[var(--color-text-secondary)] mt-0.5">{formatPrice(item.price)}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <div className="flex items-center rounded-full border border-[var(--color-border)] overflow-hidden">
                        <motion.button
                          whileTap={{ scale: 0.9 }}
                          onClick={() => updateQuantity(item._id, item.quantity - 1)}
                          className="p-1.5 hover:bg-[var(--glass-bg)] transition-colors text-[var(--color-text-secondary)]"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </motion.button>
                        <motion.span
                          key={item.quantity}
                          initial={{ y: -5, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          className="w-8 text-center text-xs font-semibold"
                        >
                          {item.quantity}
                        </motion.span>
                        <motion.button
                          whileTap={{ scale: 0.9 }}
                          onClick={() => updateQuantity(item._id, item.quantity + 1)}
                          className="p-1.5 hover:bg-[var(--glass-bg)] transition-colors text-[var(--color-text-secondary)]"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </motion.button>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.85 }}
                        onClick={() => removeItem(item._id)}
                        className="text-[var(--color-text-secondary)] hover:text-[#f87171] transition-colors p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-bold">{formatPrice(item.price * item.quantity)}</p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <div>
            <div className="sticky top-28 space-y-4">
              <div className="glass-premium p-6 md:p-8" style={{ borderRadius: '24px' }}>
                <h2 className="font-semibold mb-6 text-sm">Order Summary</h2>

                <div className="mb-6">
                  <div className="flex items-center justify-between text-xs text-[var(--color-text-secondary)] mb-2">
                    <span>Free Shipping</span>
                    <span>{subtotal >= freeShippingThreshold ? 'Unlocked!' : `${formatPrice(remaining)} away`}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-[var(--color-surface)] overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ type: 'spring', stiffness: 100, damping: 20 }}
                      className="h-full rounded-full"
                      style={{ background: progress >= 100 ? 'var(--color-success)' : 'var(--color-accent)' }}
                    />
                  </div>
                  {progress >= 100 && (
                    <motion.p
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-[10px] text-[var(--color-success)] mt-1.5 flex items-center gap-1"
                    >
                      <Zap className="w-3 h-3" /> You've unlocked free shipping!
                    </motion.p>
                  )}
                </div>

                <div className="space-y-3 text-sm mb-6">
                  <div className="flex justify-between">
                    <span className="text-[var(--color-text-secondary)]">Subtotal</span>
                    <AnimatedPrice value={subtotal} className="font-medium" />
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--color-text-secondary)]">Shipping</span>
                    <span className="font-medium">{shipping === 0 ? 'Free' : formatPrice(shipping)}</span>
                  </div>
                  {shipping > 0 && (
                    <div className="flex justify-between text-[10px] text-[var(--color-text-secondary)]">
                      <span>Standard delivery</span>
                      <span>3–5 business days</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-lg border-t border-[var(--color-border)] pt-3">
                    <span>Total</span>
                    <AnimatedPrice value={total} className="text-[var(--color-accent)]" />
                  </div>
                </div>

                <div className="flex items-center gap-3 text-xs text-[var(--color-text-secondary)] mb-6 bg-[var(--glass-bg)] p-3 rounded-2xl">
                  <Truck className="w-4 h-4 text-[var(--color-accent)]" />
                  <span>Free shipping on orders over {formatPrice(freeShippingThreshold)}</span>
                </div>

                <div className="space-y-4 mb-6">
                  <h3 className="text-sm font-medium flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[var(--color-accent)]" />
                    Shipping Details
                  </h3>
                  <FloatingLabelInput label="Address" id="address" value={shippingForm.address} onChange={(e) => updateField('address', e.target.value)} />
                  <div className="grid grid-cols-2 gap-3">
                    <FloatingLabelInput label="City" id="city" value={shippingForm.city} onChange={(e) => updateField('city', e.target.value)} />
                    <FloatingLabelInput label="Postal Code" id="postalCode" value={shippingForm.postalCode} onChange={(e) => updateField('postalCode', e.target.value)} />
                  </div>
                  <FloatingLabelInput label="Country" id="country" value={shippingForm.country} onChange={(e) => updateField('country', e.target.value)} />
                </div>

                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCheckout}
                  className="btn-liquid w-full h-12 text-[13px] rounded-2xl font-medium"
                  disabled={checkingOut || items.length === 0}
                >
                  {checkingOut ? (
                    <span className="spinner" />
                  ) : (
                    <span className="flex items-center gap-2 justify-center">
                      <CreditCard className="w-4 h-4" />
                      {user ? 'Place Order' : 'Sign In to Checkout'}
                    </span>
                  )}
                </motion.button>

                <div className="mt-5 space-y-2">
                  <div className="flex items-center gap-2 text-[10px] text-[var(--color-text-secondary)]">
                    <ShieldCheck className="w-3 h-3 text-[#34d399]" />
                    <span>Secure checkout with SSL encryption</span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-[var(--color-text-secondary)]">
                    <Gift className="w-3 h-3 text-[var(--color-accent)]" />
                    <span>Easy returns within 7 days</span>
                  </div>
                </div>
              </div>

              <div className="glass-light p-4 flex items-center gap-3" style={{ borderRadius: '20px' }}>
                <div className="w-10 h-10 rounded-xl bg-[var(--glass-bg)] flex items-center justify-center flex-shrink-0">
                  <ShoppingBag className="w-4 h-4 text-[var(--color-accent)]" />
                </div>
                <div className="text-xs text-[var(--color-text-secondary)]">
                  <p className="font-medium text-[var(--color-text)]">{items.length} {items.length === 1 ? 'item' : 'items'} in cart</p>
                  <p>Continue shopping to add more</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
