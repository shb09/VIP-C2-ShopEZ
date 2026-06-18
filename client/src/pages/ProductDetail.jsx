import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingBag, Minus, Plus, ArrowLeft, CheckCircle, Package, Heart, ZoomIn } from 'lucide-react';
import api from '../utils/axios';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useRecentlyViewed } from '../context/RecentlyViewedContext';
import { useToast } from '../components/ui/Toast';
import { formatPrice } from '../utils/helpers';
import { springGentle, fadeUp } from '../utils/variants';
import ImageWithFallback from '../components/ui/ImageWithFallback';
import Loading from '../components/ui/Loading';

export default function ProductDetail() {
  const { id } = useParams();
  const { addItemWithQuantity } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const { addToRecent } = useRecentlyViewed();
  const addToast = useToast();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const [zoom, setZoom] = useState(false);

  const wishlisted = product ? isWishlisted(product._id) : false;

  useEffect(() => {
    setLoading(true);
    setQuantity(1);
    api.get(`/products/${id}`)
      .then(({ data }) => {
        setProduct(data);
        addToRecent(data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id, addToRecent]);

  const handleAdd = () => {
    if (!product || product.stock <= 0) return;
    setAdding(true);
    addItemWithQuantity(product, quantity);
    addToast(`Added ${quantity} × ${product.name} to cart`, 'success');
    setTimeout(() => {
      setAdding(false);
      setAdded(true);
      setTimeout(() => { setAdded(false); setQuantity(1); }, 1500);
    }, 400);
  };

  const handleWishlist = () => {
    if (!product) return;
    toggleWishlist(product);
    addToast(wishlisted ? 'Removed from wishlist' : 'Added to wishlist', 'success');
  };

  if (loading) return <Loading />;
  if (!product) return (
    <div className="text-center py-32">
      <p className="text-[var(--color-text-secondary)] text-lg">Product not found</p>
      <Link to="/products" className="btn-liquid mt-6 inline-flex">Back to Products</Link>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
    >
      <motion.div {...fadeUp(0.05)}>
        <Link to="/products" className="inline-flex items-center gap-1.5 text-xs text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] transition-colors mb-8 group">
          <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
          Back to Products
        </Link>
      </motion.div>

      <div className="grid lg:grid-cols-12 gap-8 lg:gap-16 items-start">
        <motion.div
          {...fadeUp(0.1)}
          className="lg:col-span-7 relative group cursor-zoom-in"
          onClick={() => setZoom(!zoom)}
        >
          <div className={`${zoom ? 'fixed inset-0 z-[200] flex items-center justify-center bg-[var(--color-bg)]/95 backdrop-blur-2xl p-8' : 'relative'}`}>
            <div className={`relative overflow-hidden bg-[var(--color-surface)] shadow-xl ${zoom ? 'max-w-5xl max-h-[90vh] w-full' : 'aspect-square rounded-3xl'}`}>
              <ImageWithFallback
                src={product.image}
                alt={product.name}
                category={product.category}
                className={`w-full h-full ${zoom ? 'object-contain' : 'object-cover'}`}
              />
              {!zoom && (
                <>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-4 right-4 w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <ZoomIn className="w-4 h-4 text-white" />
                  </div>
                </>
              )}
              {zoom && (
                <button
                  onClick={(e) => { e.stopPropagation(); setZoom(false); }}
                  className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </motion.div>

        <motion.div
          {...fadeUp(0.15)}
          className="lg:col-span-5 lg:sticky lg:top-28"
        >
          <div className="glass-premium rounded-3xl p-8 md:p-10 space-y-6">
            <div>
              <p className="text-[10px] font-semibold text-[var(--color-accent)] uppercase tracking-[0.2em] mb-3">
                {product.category}
              </p>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight leading-tight">
                {product.name}
              </h1>
            </div>

            {product.description && (
              <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                {product.description}
              </p>
            )}

            <div className="flex items-end gap-4">
              <motion.span
                key={product.price}
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={springGentle}
                className="text-5xl font-bold tracking-tight"
              >
                {formatPrice(product.price)}
              </motion.span>
              {product.stock > 0 ? (
                <span className="flex items-center gap-1.5 text-xs text-[#34d399] font-medium pb-1">
                  <CheckCircle className="w-3.5 h-3.5" />
                  In Stock ({product.stock})
                </span>
              ) : (
                <span className="flex items-center gap-1.5 text-xs text-[#f87171] font-medium pb-1">
                  <Package className="w-3.5 h-3.5" />
                  Out of Stock
                </span>
              )}
            </div>

            <div className="flex items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.85 }}
                onClick={handleWishlist}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition-all ${
                  wishlisted
                    ? 'bg-[rgba(239,68,68,0.1)] text-[#f87171] border border-[rgba(239,68,68,0.2)]'
                    : 'bg-[var(--glass-bg)] text-[var(--color-text-secondary)] border border-[var(--glass-border)] hover:text-[var(--color-text)]'
                }`}
              >
                <Heart className={`w-3.5 h-3.5 ${wishlisted ? 'fill-current' : ''}`} />
                {wishlisted ? 'Saved' : 'Save to Wishlist'}
              </motion.button>
            </div>

            <div className="h-px bg-[var(--color-border)] opacity-50" />

            {product.stock > 0 && (
              <div className="space-y-4">
                <p className="text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wider">
                  Quantity
                </p>
                <div className="flex items-center gap-4">
                  <div className="flex items-center rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] overflow-hidden">
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-3 hover:bg-[var(--glass-bg)] transition-colors text-[var(--color-text-secondary)] hover:text-[var(--color-text)] disabled:opacity-30"
                      disabled={quantity <= 1}
                    >
                      <Minus className="w-4 h-4" />
                    </motion.button>
                    <motion.span
                      key={quantity}
                      initial={{ y: -5, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      className="w-12 text-center text-sm font-semibold"
                    >
                      {quantity}
                    </motion.span>
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      className="p-3 hover:bg-[var(--glass-bg)] transition-colors text-[var(--color-text-secondary)] hover:text-[var(--color-text)] disabled:opacity-30"
                      disabled={quantity >= product.stock}
                    >
                      <Plus className="w-4 h-4" />
                    </motion.button>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={handleAdd}
                    className="btn-liquid flex-1 h-12 text-sm rounded-2xl"
                    disabled={adding || product.stock <= 0}
                  >
                    {added ? (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="flex items-center gap-2"
                      >
                        <CheckCircle className="w-4 h-4" /> Added to Cart
                      </motion.span>
                    ) : adding ? (
                      <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <span className="flex items-center gap-2">
                        <ShoppingBag className="w-4 h-4" /> Add to Cart
                      </span>
                    )}
                  </motion.button>
                </div>
              </div>
            )}

            {product.stock > 0 && (
              <p className="text-[11px] text-[var(--color-text-secondary)] text-center">
                Free shipping on orders over {formatPrice(500)}
              </p>
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
