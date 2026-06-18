import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Package, SearchX } from 'lucide-react';

export default function EmptyState({ icon: Icon, title, description, actionLabel, actionLink, onAction }) {
  const IconComponent = Icon || SearchX;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
      className="flex flex-col items-center justify-center py-28 text-center px-6"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.15, duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
        className="w-20 h-20 rounded-3xl glass flex items-center justify-center mb-8 relative"
      >
        <div className="absolute inset-0 rounded-3xl bg-[var(--color-accent)] opacity-[0.08]" />
        <IconComponent className="w-9 h-9 text-[var(--color-text-secondary)]" />
      </motion.div>
      <motion.h3
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 0.5 }}
        className="text-2xl font-bold tracking-tight mb-3"
      >
        {title || 'Nothing here'}
      </motion.h3>
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.5 }}
        className="text-sm text-[var(--color-text-secondary)] max-w-xs leading-relaxed mb-10"
      >
        {description || ''}
      </motion.p>
      {(actionLabel && actionLink) || (actionLabel && onAction) ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.5 }}
        >
          {actionLink ? (
            <Link to={actionLink} className="btn-liquid text-sm gap-2 group">
              {actionLabel}
            </Link>
          ) : (
            <button onClick={onAction} className="btn-liquid text-sm gap-2 group">
              {actionLabel}
            </button>
          )}
        </motion.div>
      ) : null}
    </motion.div>
  );
}
