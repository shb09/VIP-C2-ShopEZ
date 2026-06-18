import { createContext, useContext, useState, useCallback, useEffect } from 'react';

const STORAGE_KEY = 'shopez-recently-viewed';
const MAX_ITEMS = 8;

const RecentlyViewedContext = createContext(null);

export function RecentlyViewedProvider({ children }) {
  const [recent, setRecent] = useState([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setRecent(JSON.parse(stored));
    } catch {}
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(recent));
  }, [recent]);

  const addToRecent = useCallback((product) => {
    const id = product._id || product.productId;
    if (!id) return;
    setRecent((prev) => {
      const filtered = prev.filter((item) => (item._id || item.productId) !== id);
      const entry = {
        _id: id,
        name: product.name,
        price: product.price,
        image: product.image,
        category: product.category,
        viewedAt: Date.now(),
      };
      return [entry, ...filtered].slice(0, MAX_ITEMS);
    });
  }, []);

  return (
    <RecentlyViewedContext.Provider value={{ recent, addToRecent }}>
      {children}
    </RecentlyViewedContext.Provider>
  );
}

export function useRecentlyViewed() {
  const ctx = useContext(RecentlyViewedContext);
  if (!ctx) throw new Error('useRecentlyViewed must be used within RecentlyViewedProvider');
  return ctx;
}
