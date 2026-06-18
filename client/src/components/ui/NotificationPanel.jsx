import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, CheckCheck, Info, CheckCircle, ShoppingBag, Truck, AlertCircle } from 'lucide-react';
import { useNotifications } from '../../context/NotificationContext';

const typeIcons = {
  success: CheckCircle,
  info: Info,
  warning: AlertCircle,
  order: ShoppingBag,
  shipping: Truck,
};

export default function NotificationPanel() {
  const { notifications, markAllRead, unreadCount, panelOpen, togglePanel, closePanel } = useNotifications();
  const panelRef = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) closePanel();
    };
    const handleEsc = (e) => {
      if (e.key === 'Escape') closePanel();
    };
    if (panelOpen) {
      document.addEventListener('mousedown', handleClick);
      document.addEventListener('keydown', handleEsc);
    }
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleEsc);
    };
  }, [panelOpen, closePanel]);

  return (
    <div className="relative" ref={panelRef}>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.9 }}
        onClick={togglePanel}
        className="btn-ghost p-2 rounded-xl relative"
        aria-label="Notifications"
      >
        <Bell className="w-3.5 h-3.5" />
        <AnimatePresence>
          {unreadCount > 0 && (
            <motion.span
              key={unreadCount}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              transition={{ type: 'spring', stiffness: 500, damping: 15 }}
              className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-[var(--color-accent)] text-white text-[7px] font-bold flex items-center justify-center"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      <AnimatePresence>
        {panelOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 350, damping: 28 }}
            style={{ transformOrigin: 'top right', width: '380px', position: 'absolute', right: '-8px', top: 'calc(100% + 10px)', zIndex: 50 }}
          >
            <div className="relative">
              <div
                className="absolute top-0 right-[14px] w-3 h-3 rotate-45"
                style={{
                  background: 'var(--glass-heavy-bg)',
                  borderLeft: '1px solid var(--glass-border)',
                  borderTop: '1px solid var(--glass-border)',
                  marginTop: '-5.5px',
                  backdropFilter: 'blur(50px)',
                }}
              />
              <div
                className="glass-premium rounded-2xl overflow-hidden shadow-2xl"
                style={{ maxHeight: '480px', boxShadow: '0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px var(--glass-border)' }}
              >
                <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--color-border)]">
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-[var(--color-accent)]" />
                    <span className="text-sm font-semibold">Notifications</span>
                    {unreadCount > 0 && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--color-accent)]/10 text-[var(--color-accent)] font-medium">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    {unreadCount > 0 && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={markAllRead}
                        className="btn-ghost text-[10px] p-1.5 rounded-lg"
                        title="Mark all as read"
                      >
                        <CheckCheck className="w-3.5 h-3.5" />
                      </motion.button>
                    )}
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={closePanel}
                      className="btn-ghost text-[10px] p-1.5 rounded-lg"
                    >
                      <X className="w-3.5 h-3.5" />
                    </motion.button>
                  </div>
                </div>

                <div className="overflow-y-auto" style={{ maxHeight: '380px' }}>
                  {notifications.length === 0 ? (
                    <div className="flex flex-col items-center py-12 text-center px-6">
                      <div className="w-12 h-12 rounded-2xl bg-[var(--glass-bg)] border border-[var(--glass-border)] flex items-center justify-center mb-3">
                        <Bell className="w-5 h-5 text-[var(--color-text-secondary)]" />
                      </div>
                      <p className="text-sm font-medium text-[var(--color-text)]">No notifications</p>
                      <p className="text-xs text-[var(--color-text-secondary)] mt-1">You're all caught up!</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-[var(--color-border)]">
                      {notifications.map((notif, i) => {
                        const Icon = typeIcons[notif.type] || Info;
                        return (
                          <motion.div
                            key={notif.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.02 }}
                            className={`flex items-start gap-3 px-5 py-4 transition-colors ${
                              !notif.read ? 'bg-[var(--color-accent)]/3' : ''
                            }`}
                          >
                            <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${
                              !notif.read ? 'bg-[var(--color-accent)]/10' : 'bg-[var(--glass-bg)]'
                            }`}>
                              <Icon className={`w-4 h-4 ${!notif.read ? 'text-[var(--color-accent)]' : 'text-[var(--color-text-secondary)]'}`} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs text-[var(--color-text)] leading-relaxed">{notif.message}</p>
                              <p className="text-[10px] text-[var(--color-text-secondary)] mt-1 opacity-60">
                                {new Date(notif.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                              </p>
                            </div>
                            {!notif.read && (
                              <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)] flex-shrink-0 mt-1.5" />
                            )}
                          </motion.div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
