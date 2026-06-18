import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from './Navbar';
import Footer from './Footer';
import AnimatedBackground from '../ui/AnimatedBackground';
import { MouseProvider } from '../ui/MouseEffects';

const pageVariants = {
  initial: { opacity: 0, y: 12, filter: 'blur(3px)' },
  animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
  exit: { opacity: 0, y: -12, filter: 'blur(3px)' },
};

export default function Layout() {
  const location = useLocation();
  const isAuthPage = ['/login', '/register'].includes(location.pathname);

  return (
    <MouseProvider>
      <div className="min-h-screen flex flex-col">
        {!isAuthPage && <AnimatedBackground />}
        <Navbar />
        <main className={`flex-1 ${isAuthPage ? 'pt-0' : 'pt-16'}`}>
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial="initial"
              animate="animate"
              exit="exit"
              variants={pageVariants}
              transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
        {!isAuthPage && <Footer />}
      </div>
    </MouseProvider>
  );
}
