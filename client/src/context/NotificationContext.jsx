import { createContext, useContext, useState, useCallback, useEffect } from 'react';

const STORAGE_KEY = 'shopez-notifications';
const DEFAULT_NOTIFICATIONS = [
  { id: 'welcome', message: 'Welcome to ShopEZ! Start exploring our premium collection.', type: 'info', read: false, createdAt: new Date().toISOString() },
  { id: 'shipping', message: 'Free shipping on all orders above ₹500.', type: 'info', read: false, createdAt: new Date().toISOString() },
];

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);
  const [panelOpen, setPanelOpen] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setNotifications(JSON.parse(stored));
      } else {
        setNotifications(DEFAULT_NOTIFICATIONS);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_NOTIFICATIONS));
      }
    } catch {
      setNotifications(DEFAULT_NOTIFICATIONS);
    }
  }, []);

  useEffect(() => {
    if (notifications.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
    }
  }, [notifications]);

  const addNotification = useCallback((message, type = 'info') => {
    const notif = {
      id: Date.now().toString(),
      message,
      type,
      read: false,
      createdAt: new Date().toISOString(),
    };
    setNotifications((prev) => [notif, ...prev]);
  }, []);

  const markAllRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const togglePanel = useCallback(() => setPanelOpen((p) => !p), []);
  const closePanel = useCallback(() => setPanelOpen(false), []);
  const openPanel = useCallback(() => setPanelOpen(true), []);

  return (
    <NotificationContext.Provider value={{ notifications, addNotification, markAllRead, unreadCount, panelOpen, togglePanel, closePanel, openPanel }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotifications must be used within NotificationProvider');
  return ctx;
}
