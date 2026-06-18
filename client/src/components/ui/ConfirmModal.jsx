import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';

export default function ConfirmModal({ isOpen, onClose, onConfirm, title, message, loading }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="relative glass rounded-3xl p-6 w-full max-w-sm shadow-2xl"
          >
            <button onClick={onClose} className="absolute top-4 right-4 text-[var(--color-text-secondary)] hover:text-[var(--color-text)] transition-colors">
              <X className="w-5 h-5" />
            </button>
            <div className="flex flex-col items-center text-center pt-2">
              <div className="w-12 h-12 rounded-full bg-[rgba(248,113,113,0.12)] flex items-center justify-center mb-4">
                <AlertTriangle className="w-6 h-6 text-[#f87171]" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{title || 'Confirm'}</h3>
              <p className="text-sm text-[var(--color-text-secondary)] mb-6">{message || 'Are you sure?'}</p>
              <div className="flex gap-3 w-full">
                <button onClick={onClose} className="btn-glass flex-1 text-sm" disabled={loading}>
                  Cancel
                </button>
                <button onClick={onConfirm} className="btn-danger flex-1 text-sm rounded-2xl" disabled={loading}>
                  {loading ? <span className="spinner" /> : 'Delete'}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
