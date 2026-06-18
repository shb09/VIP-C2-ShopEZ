import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import api from '../utils/axios';

const STORAGE_KEY = 'shopez-wishlist';
const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setWishlist(JSON.parse(stored));
    } catch {}
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(wishlist));
  }, [wishlist]);

  const isWishlisted = useCallback((productId) => {
    return wishlist.some((item) => item._id === productId);
  }, [wishlist]);

  const toggleWishlist = useCallback(async (product) => {
    const id = product._id || product.productId;
    setWishlist((prev) => {
      const exists = prev.some((item) => item._id === id);
      if (exists) return prev.filter((item) => item._id !== id);
      const entry = {
        _id: id,
        name: product.name || 'Product',
        price: product.price || 0,
        image: product.image || '',
        category: product.category || '',
        addedAt: new Date().toISOString(),
      };
      return [entry, ...prev];
    });
  }, []);

  const removeFromWishlist = useCallback((productId) => {
    setWishlist((prev) => prev.filter((item) => item._id !== productId));
  }, []);

  const wishlistCount = wishlist.length;

  return (
    <WishlistContext.Provider value={{ wishlist, isWishlisted, toggleWishlist, removeFromWishlist, wishlistCount }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider');
  return ctx;
}
