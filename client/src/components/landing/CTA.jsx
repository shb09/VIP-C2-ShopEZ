import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export default function CTA() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);

  return (
    <section className="py-24 relative" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          style={{
            y, opacity,
            background: 'linear-gradient(135deg, var(--color-card), var(--color-surface))',
            border: '1px solid var(--color-border)',
          }}
          className="relative rounded-3xl overflow-hidden p-10 md:p-16 text-center"
        >
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.1 }}
            className="absolute inset-0 pointer-events-none opacity-[0.04]"
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute top-[-20%] left-[-10%] w-[400px] h-[400px] rounded-full"
              style={{ background: 'radial-gradient(circle, var(--color-accent), transparent 60%)' }}
            />
            <motion.div
              animate={{ scale: [1.2, 1, 1.2] }}
              transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute bottom-[-20%] right-[-10%] w-[400px] h-[400px] rounded-full"
              style={{ background: 'radial-gradient(circle, #a78bfa, transparent 60%)' }}
            />
          </motion.div>
          <div className="relative z-10">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-3xl md:text-4xl font-bold tracking-tight mb-4"
            >
              Ready to start shopping?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-[var(--color-text-secondary)] text-lg max-w-md mx-auto mb-8"
            >
              Browse our curated collection and find something you love.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Link to="/products" className="btn-liquid text-base py-3.5 px-8">
                Browse Products <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
