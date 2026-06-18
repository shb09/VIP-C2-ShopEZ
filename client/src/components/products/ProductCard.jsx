import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingBag, Check, Heart } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useToast } from '../ui/Toast';
import { formatPrice } from '../../utils/helpers';
import ImageWithFallback from '../ui/ImageWithFallback';

export default function ProductCard({ product, featured = false }) {
  const { addItem } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const addToast = useToast();
  const [adding, setAdding] = useState(false);
  const [checked, setChecked] = useState(false);
  const [hovered, setHovered] = useState(false);
  const cardRef = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const wishlisted = isWishlisted(product._id);

  const handleAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.stock <= 0) return;
    setAdding(true);
    addItem(product);
    addToast(`${product.name} added to cart`, 'success');
    setTimeout(() => {
      setAdding(false);
      setChecked(true);
      setTimeout(() => setChecked(false), 1200);
    }, 400);
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
    addToast(wishlisted ? 'Removed from wishlist' : 'Added to wishlist', 'success');
  };

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: y * -12, y: x * 12 });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
    setHovered(false);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleMouseLeave}
      className="perspective-1000"
    >
      <Link
        to={`/products/${product._id}`}
        className="group block relative rounded-3xl overflow-hidden"
        style={{ borderRadius: '28px' }}
      >
        <motion.div
          animate={{ rotateX: tilt.x, rotateY: tilt.y }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="relative overflow-hidden glass-premium card-glow"
          style={{ borderRadius: '28px' }}
        >
          <div className={`relative overflow-hidden ${featured ? 'aspect-[4/3]' : 'aspect-square'}`}>
            <motion.div
              animate={{ scale: hovered ? 1.08 : 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              className="w-full h-full"
            >
              <ImageWithFallback
                src={product.image}
                alt={product.name}
                category={product.category}
                className="w-full h-full"
                style={{ borderRadius: '28px' }}
              />
            </motion.div>

            <motion.div
              animate={{ opacity: hovered ? 1 : 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 pointer-events-none z-[1]"
              style={{
                background: 'linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.5) 100%)',
                backdropFilter: 'blur(3px)',
                WebkitBackdropFilter: 'blur(3px)',
                borderRadius: '28px',
              }}
            />

            <motion.div
              animate={{ x: hovered ? '100%' : '-100%' }}
              transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
              className="absolute inset-0 z-[2] pointer-events-none"
              style={{
                background: 'linear-gradient(105deg, transparent 20%, rgba(255,255,255,0.08) 45%, rgba(255,255,255,0.12) 50%, rgba(255,255,255,0.08) 55%, transparent 80%)',
                transform: 'skewX(-12deg)',
                borderRadius: '28px',
              }}
            />

            <motion.button
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.85 }}
              onClick={handleWishlist}
              className={`absolute top-4 left-4 z-[3] w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${
                wishlisted
                  ? 'bg-[rgba(239,68,68,0.2)] text-[#f87171]'
                  : 'bg-black/30 backdrop-blur-md text-white/70 hover:text-white hover:bg-black/40'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${wishlisted ? 'fill-current' : ''}`} />
            </motion.button>

            <div className="absolute top-4 right-4 z-[3]">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full glass-light text-[10px] font-semibold text-[var(--color-accent)] tracking-wide shadow-lg border border-[var(--glass-border)]">
                {product.category}
              </span>
            </div>

            {product.stock <= 5 && product.stock > 0 && (
              <span className="absolute top-14 right-4 z-[3] px-3 py-1.5 rounded-full glass-light text-[9px] font-semibold shadow-lg text-[var(--color-text)]/70">
                Only {product.stock} left
              </span>
            )}
            {product.stock === 0 && (
              <span className="absolute top-14 right-4 z-[3] px-3 py-1.5 rounded-full glass-light text-[9px] font-semibold shadow-lg text-[var(--color-error)]">
                Out of stock
              </span>
            )}

            {!featured && (
              <motion.div
                animate={{ y: hovered ? 0 : 12, opacity: hovered ? 1 : 0 }}
                transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                className="absolute bottom-0 left-0 right-0 p-5 z-[3]"
              >
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={handleAdd}
                  disabled={adding || product.stock <= 0}
                  className="magnetic-btn w-full h-11 rounded-2xl bg-white/10 backdrop-blur-2xl text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-xl border border-white/10 hover:bg-white/20 transition-all disabled:opacity-40"
                >
                  {checked ? (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="flex items-center gap-1.5"
                    >
                      <Check className="w-3.5 h-3.5" /> Added
                    </motion.span>
                  ) : adding ? (
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : product.stock <= 0 ? (
                    'View Product'
                  ) : (
                    <span className="flex items-center gap-2">
                      <ShoppingBag className="w-3.5 h-3.5" /> Add to Cart
                    </span>
                  )}
                </motion.button>
              </motion.div>
            )}

            {featured && (
              <div className="absolute bottom-0 left-0 right-0 p-7 z-[3]">
                <p className="text-[10px] font-semibold text-white/60 uppercase tracking-[0.15em] mb-2">
                  {product.category}
                </p>
                <h3 className="text-2xl font-bold text-white mb-1 tracking-tight">
                  {product.name}
                </h3>
                <p className="text-lg font-semibold text-white/80">
                  {formatPrice(product.price)}
                </p>
              </div>
            )}
          </div>

          {!featured && (
            <div className="pt-5 px-1 pb-1">
              <p className="text-[9px] font-semibold text-[var(--color-accent)] uppercase tracking-[0.15em] mb-1.5">
                {product.category}
              </p>
              <h3 className="font-medium text-sm leading-snug mb-1 line-clamp-2 text-[var(--color-text)]">
                {product.name}
              </h3>
              <div className="flex items-center justify-between mt-3">
                <span className="font-bold text-lg tracking-tight">
                  {formatPrice(product.price)}
                </span>
                <span className="text-[10px] text-[var(--color-text-secondary)]">{product.stock > 0 ? 'In Stock' : 'Sold Out'}</span>
              </div>
            </div>
          )}
        </motion.div>
      </Link>
    </motion.div>
  );
}
