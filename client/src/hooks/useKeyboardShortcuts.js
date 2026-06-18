import { useEffect } from 'react';

export default function useKeyboardShortcuts(handlers) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        handlers.onEscape?.();
      }

      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        handlers.onSearch?.();
      }

      if (e.key === 'g' && !e.ctrlKey && !e.metaKey && !e.altKey) {
        handlers.onGPress?.();
      }

      if (e.shiftKey && e.key === 'T') {
        e.preventDefault();
        handlers.onTheme?.();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlers]);
}
