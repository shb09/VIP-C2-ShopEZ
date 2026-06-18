import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Sparkles, Headphones } from 'lucide-react';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.25, 0.1, 0.25, 1] },
  },
};

export default function Hero() {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const cardY = useTransform(scrollYProgress, [0, 1], [0, -60]);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center overflow-hidden pt-28 pb-20"
    >
      <motion.div style={{ y, opacity }} className="absolute inset-0 pointer-events-none">
        <div className="spotlight" style={{ top: '10%', left: '20%' }} />
        <div className="spotlight" style={{ bottom: '20%', right: '10%', animationDelay: '-4s', background: 'radial-gradient(circle, var(--color-accent-subtle), transparent 70%)' }} />
        <div className="glass-blob" style={{ top: '8%', left: '5%', width: '700px', height: '700px' }} />
        <div className="glass-blob" style={{ bottom: '10%', right: '0%', width: '500px', height: '500px', background: 'radial-gradient(circle, var(--color-accent-subtle), transparent 70%)' }} />
      </motion.div>

      <div className="absolute inset-0 pointer-events-none mask-fade-bottom">
        <div className="absolute top-[25%] left-[50%] -translate-x-1/2 w-[900px] h-[1px] bg-gradient-to-r from-transparent via-[var(--color-accent)]/6 to-transparent" />
        <div className="absolute top-[45%] left-[50%] -translate-x-1/2 w-[600px] h-[1px] bg-gradient-to-r from-transparent via-[var(--color-accent-subtle)]/5 to-transparent" />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="max-w-xl"
          >
            <motion.div
              variants={fadeUp}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-sweep text-xs font-medium text-[var(--color-accent)] mb-8"
            >
              <Sparkles className="w-3 h-3" />
              New Collection 2026
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-[-0.05em] leading-[0.85]"
            >
              Built for
              <br />
              <span className="gradient-text">focus.</span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="mt-8 text-base md:text-lg text-[var(--color-text-secondary)] max-w-md leading-relaxed"
            >
              Curated audio, laptops, and accessories engineered for those who demand more from their gear. Every detail matters.
            </motion.p>

            <motion.div
              variants={fadeUp}
              className="mt-10 flex items-center gap-4"
            >
              <Link
                to="/products"
                className="btn-liquid text-sm px-8 py-3.5 rounded-2xl cta-pulse"
              >
                Explore Collection
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/register"
                className="btn-glass text-sm px-8 py-3.5 rounded-2xl"
              >
                Get Started
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            style={{ y: cardY }}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, delay: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
            className="hidden lg:block relative"
          >
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              className="glass-premium rounded-3xl p-8 perspective-1000 tilt-card card-glow"
            >
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[var(--color-accent)]/5 to-transparent pointer-events-none" />

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[var(--color-text-secondary)]">Featured</span>
                  <span className="badge" style={{ background: 'var(--color-accent)/15', color: 'var(--color-accent)' }}>Premium</span>
                </div>

                <div className="relative rounded-2xl overflow-hidden mb-6 bg-gradient-to-br from-[var(--color-accent)]/10 to-transparent aspect-[4/3] flex items-center justify-center">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  <Headphones className="w-24 h-24 text-[var(--color-accent)]/40" />
                  <motion.div
                    animate={{ opacity: [0, 0.3, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute inset-0 bg-gradient-to-tr from-transparent via-[var(--color-accent)]/5 to-transparent"
                  />
                </div>

                <div>
                  <p className="text-[9px] font-semibold uppercase tracking-[0.15em] text-[var(--color-text-secondary)] mb-1.5">Audio</p>
                  <h3 className="text-xl font-bold tracking-tight mb-1">Studio Pro Wireless</h3>
                  <p className="text-sm text-[var(--color-text-secondary)] mb-4">Immersive sound. All-day comfort.</p>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-[var(--color-accent)]">₹29,999</span>
                    <span className="text-[10px] text-[var(--color-text-secondary)]">Free shipping</span>
                  </div>
                </div>
              </div>

              <div className="absolute inset-0 rounded-3xl bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
              <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-[var(--color-accent)]/3 to-transparent rounded-3xl pointer-events-none" />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
