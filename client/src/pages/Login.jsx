import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, LogIn, Sparkles, ShoppingBag, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/ui/Toast';
import FloatingLabelInput from '../components/ui/FloatingLabelInput';

const phrases = ['Premium Audio', 'Smart Laptops', 'Gaming Gear', 'Luxury Fashion'];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] } },
};

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const addToast = useToast();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [phraseIndex, setPhraseIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPhraseIndex((prev) => (prev + 1) % phrases.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const validate = () => {
    const errs = {};
    if (!form.email) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Invalid email address';
    if (!form.password) errs.password = 'Password is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await login(form.email, form.password);
      addToast('Welcome back!', 'success');
      navigate('/');
    } catch (err) {
      addToast(err?.response?.data?.message || 'Invalid credentials', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex relative overflow-hidden bg-[var(--color-bg)]" style={{ paddingTop: '80px' }}>
      <div className="hidden lg:flex w-[45%] relative overflow-hidden flex-col justify-between p-14"
        style={{ background: 'linear-gradient(160deg, var(--color-card) 0%, color-mix(in srgb, var(--color-card) 95%, var(--color-accent)) 100%)' }}
      >
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none">
          <div className="glass-blob" style={{ top: '5%', left: '-5%', width: '500px', height: '500px' }} />
          <div className="glass-blob" style={{ bottom: '15%', right: '-5%', width: '350px', height: '350px', background: 'radial-gradient(circle, #818cf8, transparent 70%)' }} />
        </div>
        <div className="relative z-10 flex flex-col h-full">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
            className="flex items-center gap-3 mb-20"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--color-accent)] to-[#818cf8] flex items-center justify-center shadow-lg shadow-[var(--glow-color)]">
              <ShoppingBag className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight">ShopEZ</span>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
            className="flex-1 flex flex-col justify-center -mt-16"
          >
            <div className="space-y-4">
              <div className="text-6xl font-bold tracking-tight leading-[1.05]">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={phraseIndex}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
                    className="gradient-text"
                  >
                    {phrases[phraseIndex]}
                  </motion.span>
                </AnimatePresence>
                <br />
                <span className="text-[var(--color-text)]">Starts Here</span>
              </div>
              <p className="text-sm text-[var(--color-text-secondary)] max-w-sm leading-relaxed pt-4">
                Sign in to your account to access orders, manage your wishlist, and enjoy a seamless shopping experience.
              </p>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="flex items-center gap-2 text-xs text-[var(--color-text-secondary)]"
          >
            <Sparkles className="w-3.5 h-3.5 text-[var(--color-accent)]" />
            <span>Premium e-commerce experience</span>
          </motion.div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 relative">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[20%] -right-[15%] w-[450px] h-[450px] rounded-full opacity-[0.03]"
            style={{ background: 'radial-gradient(circle, var(--color-accent), transparent 60%)' }} />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          className="w-full max-w-sm"
        >
          <div className="lg:hidden flex items-center gap-3 mb-10">
            <div className="w-10 h-10 rounded-xl glass-medium flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 text-[var(--color-accent)]" />
            </div>
            <span className="text-lg font-bold">Shop<span className="text-[var(--color-accent)]">EZ</span></span>
          </div>

          <motion.div variants={containerVariants} initial="hidden" animate="visible">
            <motion.div variants={itemVariants}>
              <h1 className="text-3xl font-bold tracking-tight mb-1">Welcome back</h1>
              <p className="text-sm text-[var(--color-text-secondary)] mb-9">Enter your credentials to continue</p>
            </motion.div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <motion.div variants={itemVariants}>
                <FloatingLabelInput
                  label="Email"
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  error={errors.email}
                />
              </motion.div>
              <motion.div variants={itemVariants} className="relative">
                <FloatingLabelInput
                  label="Password"
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  error={errors.password}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-[18px] text-[var(--color-text-secondary)] hover:text-[var(--color-text)] transition-all duration-200 z-10 p-0.5"
                  tabIndex={-1}
                >
                  <AnimatePresence mode="wait">
                    {showPassword ? (
                      <motion.span
                        key="off"
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        transition={{ duration: 0.15 }}
                      >
                        <EyeOff className="w-4 h-4" />
                      </motion.span>
                    ) : (
                      <motion.span
                        key="on"
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        transition={{ duration: 0.15 }}
                      >
                        <Eye className="w-4 h-4" />
                      </motion.span>
                    )}
                  </AnimatePresence>
                </button>
              </motion.div>
              <motion.div variants={itemVariants} className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2.5 cursor-pointer group">
                  <div className="relative">
                    <input type="checkbox" className="peer sr-only" />
                    <div className="w-4 h-4 rounded-[4px] border border-[var(--color-border)] bg-[var(--color-surface)] peer-checked:bg-[var(--color-accent)] peer-checked:border-[var(--color-accent)] transition-all duration-200 group-hover:border-[var(--color-text-secondary)]" />
                    <svg className="absolute inset-0 w-4 h-4 text-white opacity-0 peer-checked:opacity-100 transition-opacity duration-200 pointer-events-none" viewBox="0 0 16 16" fill="none">
                      <path d="M4 8l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <span className="text-[var(--color-text-secondary)] select-none">Remember me</span>
                </label>
                <span className="text-[var(--color-text-secondary)] cursor-default text-xs opacity-60">Forgot password?</span>
              </motion.div>
              <motion.div variants={itemVariants}>
                <button type="submit" className="btn-liquid w-full h-12 text-base rounded-2xl relative overflow-hidden group" disabled={loading}>
                  {loading ? (
                    <span className="spinner" />
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <LogIn className="w-4 h-4" />
                      Sign In
                      <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform duration-200" />
                    </span>
                  )}
                </button>
              </motion.div>
            </form>

            <motion.p variants={itemVariants} className="mt-9 text-center text-sm text-[var(--color-text-secondary)]">
              Don&apos;t have an account?{' '}
              <Link to="/register" className="text-[var(--color-accent)] hover:underline font-medium transition-all hover:opacity-80">
                Create one
              </Link>
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="mt-6 p-5 rounded-2xl glass-light text-xs text-[var(--color-text-secondary)] space-y-2"
            >
              <p className="font-semibold text-[var(--color-text)] text-[11px] uppercase tracking-wider">Demo accounts</p>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)]" />
                <span>Admin: admin@shopez.com / admin123</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#a78bfa]" />
                <span>User: user@shopez.com / user123</span>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
