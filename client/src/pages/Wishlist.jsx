import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../components/ui/Toast';
import { formatPrice } from '../utils/helpers';
import ImageWithFallback from '../components/ui/ImageWithFallback';
import EmptyState from '../components/ui/EmptyState';

export default function Wishlist() {
  const { user } = useAuth();
  const { wishlist, removeFromWishlist, toggleWishlist } = useWishlist();
  const { addItem } = useCart();
  const addToast = useToast();

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <EmptyState
          icon={<Heart className="w-12 h-12" />}
          title="Sign in required"
          description="Please sign in to view your wishlist"
          actionLabel="Sign In"
          actionLink="/login"
        />
      </div>
    );
  }

  const handleAddToCart = (e, product) => {
    e.preventDefault();
    addItem(product);
    addToast(`${product.name} added to cart`, 'success');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
    >
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-center justify-between mb-10"
      >
        <div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Wishlist</h1>
          <p className="text-sm text-[var(--color-text-secondary)] mt-1">
            {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'} saved
          </p>
        </div>
        {wishlist.length > 0 && (
          <Link to="/products" className="btn-glass text-sm px-5 py-2.5 rounded-xl">
            <ShoppingBag className="w-4 h-4" /> Browse Products
          </Link>
        )}
      </motion.div>

      {wishlist.length === 0 ? (
        <EmptyState
          icon={<Heart className="w-12 h-12" />}
          title="Your wishlist is empty"
          description="Save items you love to your wishlist"
          actionLabel="Discover Products"
          actionLink="/products"
        />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {wishlist.map((item, i) => (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04, duration: 0.4 }}
            >
              <div className="group relative">
                <Link to={`/products/${item._id}`} className="block">
                  <div className="glass-premium rounded-2xl overflow-hidden" style={{ borderRadius: '20px' }}>
                    <div className="aspect-square relative overflow-hidden bg-[var(--color-surface)]">
                      <ImageWithFallback src={item.image} alt={item.name} category={item.category} className="w-full h-full group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    <div className="p-4">
                      <p className="text-[9px] font-semibold text-[var(--color-accent)] uppercase tracking-[0.15em] mb-1">{item.category}</p>
                      <h3 className="text-sm font-medium truncate">{item.name}</h3>
                      <p className="text-sm font-bold mt-1.5">{formatPrice(item.price)}</p>
                    </div>
                  </div>
                </Link>

                <div className="absolute top-3 right-3 z-10 flex flex-col gap-2">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.85 }}
                    onClick={() => removeFromWishlist(item._id)}
                    className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center hover:bg-[rgba(239,68,68,0.3)] transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-white" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.85 }}
                    onClick={(e) => handleAddToCart(e, item)}
                    className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center hover:bg-[var(--color-accent)]/30 transition-all"
                  >
                    <ShoppingBag className="w-3.5 h-3.5 text-white" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
