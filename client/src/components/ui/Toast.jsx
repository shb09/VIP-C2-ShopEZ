import { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Info, AlertTriangle, X } from 'lucide-react';

const ToastContext = createContext(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const idRef = useRef(0);

  const addToast = useCallback((message, type = 'info', duration = 4000) => {
    const id = ++idRef.current;
    setToasts((prev) => [...prev, { id, message, type, duration }]);
    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={addToast}>
      {children}
      <div className="fixed bottom-6 right-6 z-[300] flex flex-col-reverse gap-3 pointer-events-none" style={{ maxWidth: 400 }}>
        <AnimatePresence>
          {toasts.map((toast) => (
            <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

function ToastItem({ toast, onRemove }) {
  useEffect(() => {
    if (toast.duration > 0) {
      const timer = setTimeout(() => onRemove(toast.id), toast.duration);
      return () => clearTimeout(timer);
    }
  }, [toast.id, toast.duration, onRemove]);

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-[#34d399]" />,
    error: <XCircle className="w-5 h-5 text-[#f87171]" />,
    info: <Info className="w-5 h-5 text-[#60a5fa]" />,
    warning: <AlertTriangle className="w-5 h-5 text-[#fbbf24]" />,
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 80, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 80, scale: 0.9 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      className="glass-medium pointer-events-auto rounded-2xl overflow-hidden shadow-xl"
      style={{ minWidth: 320, borderRadius: '16px' }}
    >
      <div className="flex items-start gap-3 px-4 py-3.5">
        <span className="mt-0.5 flex-shrink-0">{icons[toast.type] || icons.info}</span>
        <p className="text-sm text-[var(--color-text)] flex-1">{toast.message}</p>
        <button onClick={() => onRemove(toast.id)} className="text-[var(--color-text-secondary)] hover:text-[var(--color-text)] transition-colors flex-shrink-0">
          <X className="w-4 h-4" />
        </button>
      </div>
      {toast.duration > 0 && (
        <ProgressBar duration={toast.duration} onComplete={() => onRemove(toast.id)} />
      )}
    </motion.div>
  );
}

function ProgressBar({ duration, onComplete }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.transition = 'none';
    el.style.width = '100%';
    requestAnimationFrame(() => {
      el.style.transition = `width ${duration}ms linear`;
      el.style.width = '0%';
    });
    const timer = setTimeout(onComplete, duration);
    return () => clearTimeout(timer);
  }, [duration, onComplete]);

  return (
    <div className="h-0.5 bg-[var(--color-border)]">
      <div ref={ref} className="h-full bg-[var(--color-accent)] rounded-full" />
    </div>
  );
}
