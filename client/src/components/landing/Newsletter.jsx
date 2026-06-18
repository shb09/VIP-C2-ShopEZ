import { useState, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Mail, ArrowRight } from 'lucide-react';
import { useToast } from '../ui/Toast';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const addToast = useToast();
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] });
  const sectionY = useTransform(scrollYProgress, [0, 1], [30, -30]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setTimeout(() => {
      addToast('Subscribed successfully!', 'success');
      setEmail('');
      setLoading(false);
    }, 800);
  };

  return (
    <section ref={sectionRef} className="py-24 relative">
      <motion.div style={{ y: sectionY }} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          className="max-w-lg mx-auto text-center"
        >
          <div className="w-14 h-14 rounded-2xl bg-[var(--glass-bg)] border border-[var(--glass-border)] flex items-center justify-center mx-auto mb-6">
            <Mail className="w-7 h-7 text-[var(--color-accent)]" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-3">Stay in the loop</h2>
          <p className="text-[var(--color-text-secondary)] text-sm mb-8">
            Be the first to know about new products and exclusive offers.
          </p>
          <form onSubmit={handleSubmit} className="flex items-center gap-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="input-field flex-1"
              required
            />
            <button type="submit" className="btn-liquid h-12" disabled={loading}>
              {loading ? <span className="spinner" /> : <ArrowRight className="w-4 h-4" />}
            </button>
          </form>
        </motion.div>
      </motion.div>
    </section>
  );
}
