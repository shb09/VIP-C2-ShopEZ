import { createContext, useContext, useReducer, useEffect, useState, useCallback } from 'react';
import api from '../utils/axios';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

const getStorageKey = (user) => {
  if (user) return `shopez_cart_${user._id}`;
  return 'shopez_cart_guest';
};

const loadCartItems = (key) => {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existing = state.find((item) => item.productId === action.payload.productId);
      if (existing) {
        return state.map((item) =>
          item.productId === action.payload.productId
            ? { ...item, quantity: Math.min(item.quantity + action.payload.quantity, 10) }
            : item
        );
      }
      return [...state, { productId: action.payload.productId, quantity: Math.min(action.payload.quantity, 10) }];
    }
    case 'REMOVE_ITEM':
      return state.filter((item) => item.productId !== action.payload);
    case 'UPDATE_QUANTITY':
      return state.map((item) =>
        item.productId === action.payload.productId
          ? { ...item, quantity: Math.max(1, Math.min(action.payload.quantity, 10)) }
          : item
      );
    case 'CLEAR':
      return [];
    case 'SET_ITEMS':
      return action.payload;
    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [storageKey, setStorageKey] = useState(() => getStorageKey(user));
  const [cartItems, dispatch] = useReducer(cartReducer, [], () => loadCartItems(storageKey));
  const [productCache, setProductCache] = useState({});
  const [loading, setLoading] = useState(true);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const newKey = getStorageKey(user);
    if (newKey !== storageKey) {
      const guestItems = loadCartItems(storageKey);
      const userItems = loadCartItems(newKey);
      if (guestItems.length > 0 && user) {
        const merged = [...userItems];
        for (const guest of guestItems) {
          const existing = merged.find((m) => m.productId === guest.productId);
          if (existing) {
            existing.quantity = Math.min(existing.quantity + guest.quantity, 10);
          } else {
            merged.push({ ...guest });
          }
        }
        localStorage.setItem(newKey, JSON.stringify(merged));
        dispatch({ type: 'SET_ITEMS', payload: merged });
        localStorage.removeItem(storageKey);
      } else {
        dispatch({ type: 'SET_ITEMS', payload: userItems });
      }
      setStorageKey(newKey);
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(cartItems));
  }, [cartItems, storageKey]);

  const fetchProducts = useCallback(async () => {
    try {
      const { data } = await api.get('/products?limit=100');
      const list = data.products || data || [];
      const map = {};
      list.forEach((p) => { map[p._id] = p; });
      setProductCache(map);
      setLoaded(true);
    } catch {
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const addItem = (product) => {
    const id = product._id || product.productId || product;
    dispatch({ type: 'ADD_ITEM', payload: { productId: id, quantity: 1 } });
    if (product._id) {
      setProductCache((prev) => ({ ...prev, [product._id]: product }));
    }
  };

  const addItemWithQuantity = (product, quantity) => {
    const id = product._id || product.productId || product;
    dispatch({ type: 'ADD_ITEM', payload: { productId: id, quantity } });
    if (product._id) {
      setProductCache((prev) => ({ ...prev, [product._id]: product }));
    }
  };

  const removeItem = (productId) => dispatch({ type: 'REMOVE_ITEM', payload: productId });
  const updateQuantity = (productId, quantity) =>
    dispatch({ type: 'UPDATE_QUANTITY', payload: { productId, quantity } });
  const clearCart = () => dispatch({ type: 'CLEAR' });

  const items = loaded
    ? cartItems
        .map((item) => {
          const p = productCache[item.productId];
          return {
            _id: item.productId,
            productId: item.productId,
            product: item.productId,
            quantity: item.quantity,
            name: p?.name || 'Loading...',
            price: p?.price || 0,
            image: p?.image || '',
            stock: p?.stock || 0,
            category: p?.category || '',
          };
        })
        .filter((item) => item.price > 0 || !productCache[item.productId])
    : [];

  const itemsCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 500 ? 0 : 49;
  const total = subtotal + shipping;

  return (
    <CartContext.Provider value={{ items, addItem, addItemWithQuantity, removeItem, updateQuantity, clearCart, itemsCount, subtotal, shipping, total, loading }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};
