import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, UserPlus, ShoppingBag, Check, ArrowRight, Shield, Zap, Heart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/ui/Toast';
import FloatingLabelInput from '../components/ui/FloatingLabelInput';

const benefits = [
  { icon: ShoppingBag, text: 'Track your orders in real time' },
  { icon: Shield, text: 'Exclusive member-only deals' },
  { icon: Zap, text: 'Faster checkout experience' },
  { icon: Heart, text: 'Personalized recommendations' },
];

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

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const addToast = useToast();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.email) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Invalid email address';
    if (!form.password) errs.password = 'Password is required';
    else if (form.password.length < 6) errs.password = 'Min 6 characters';
    if (form.password !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      addToast('Account created!', 'success');
      navigate('/');
    } catch (err) {
      addToast(err?.response?.data?.message || 'Registration failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex relative overflow-hidden bg-[var(--color-bg)]">
      <div className="hidden lg:flex w-[40%] relative overflow-hidden flex-col justify-center p-14"
        style={{ background: 'linear-gradient(200deg, color-mix(in srgb, var(--color-card) 92%, var(--color-accent)) 0%, var(--color-card) 100%)' }}
      >
        <div className="absolute inset-0 opacity-[0.05] pointer-events-none">
          <div className="absolute top-[10%] right-[5%] w-[400px] h-[400px] rounded-full"
            style={{ background: 'radial-gradient(circle, var(--color-accent), transparent 60%)' }} />
          <div className="absolute bottom-[20%] left-[0%] w-[300px] h-[300px] rounded-full"
            style={{ background: 'radial-gradient(circle, #a78bfa, transparent 60%)' }} />
        </div>
        <div className="relative z-10 space-y-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--color-accent)] to-[#a78bfa] flex items-center justify-center mb-7 shadow-xl shadow-[var(--glow-color)]">
              <UserPlus className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-4xl font-bold tracking-tight mb-4 leading-tight">
              Join the<br />
              <span className="gradient-text">community</span>
            </h2>
            <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed max-w-xs">
              Create an account and unlock a personalized shopping experience tailored to your preferences.
            </p>
          </motion.div>
          <div className="space-y-5">
            {benefits.map((benefit, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.25 + i * 0.08, duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
                className="flex items-center gap-3.5 group"
              >
                <div className="w-10 h-10 rounded-xl glass-light flex items-center justify-center flex-shrink-0 group-hover:border-[var(--color-accent)]/30 transition-all duration-300">
                  <benefit.icon className="w-4.5 h-4.5 text-[var(--color-accent)]" />
                </div>
                <span className="text-sm text-[var(--color-text-secondary)]">{benefit.text}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 relative">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -bottom-[15%] -left-[15%] w-[400px] h-[400px] rounded-full opacity-[0.03]"
            style={{ background: 'radial-gradient(circle, #a78bfa, transparent 60%)' }} />
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
              <h1 className="text-3xl font-bold tracking-tight mb-1">Create account</h1>
              <p className="text-sm text-[var(--color-text-secondary)] mb-9">Fill in your details to get started</p>
            </motion.div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <motion.div variants={itemVariants}>
                <FloatingLabelInput
                  label="Full Name"
                  id="name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  error={errors.name}
                />
              </motion.div>
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
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </motion.div>
              <motion.div variants={itemVariants} className="relative">
                <FloatingLabelInput
                  label="Confirm Password"
                  id="confirmPassword"
                  type={showConfirm ? 'text' : 'password'}
                  value={form.confirmPassword}
                  onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                  error={errors.confirmPassword}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-4 top-[18px] text-[var(--color-text-secondary)] hover:text-[var(--color-text)] transition-all duration-200 z-10 p-0.5"
                  tabIndex={-1}
                >
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </motion.div>

              <motion.div variants={itemVariants} className="pt-2">
                <button type="submit" className="btn-liquid w-full h-12 text-base rounded-2xl relative overflow-hidden group" disabled={loading}>
                  {loading ? (
                    <span className="spinner" />
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <UserPlus className="w-4 h-4" />
                      Create Account
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform duration-200" />
                    </span>
                  )}
                </button>
              </motion.div>

              <motion.p variants={itemVariants} className="text-xs text-[var(--color-text-secondary)] text-center pt-1 leading-relaxed">
                By creating an account, you agree to our{' '}
                <span className="text-[var(--color-accent)] cursor-default">Terms of Service</span> and{' '}
                <span className="text-[var(--color-accent)] cursor-default">Privacy Policy</span>.
              </motion.p>
            </form>

            <motion.p variants={itemVariants} className="mt-8 text-center text-sm text-[var(--color-text-secondary)]">
              Already have an account?{' '}
              <Link to="/login" className="text-[var(--color-accent)] hover:underline font-medium transition-all hover:opacity-80">
                Sign in
              </Link>
            </motion.p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
