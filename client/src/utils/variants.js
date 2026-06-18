export const spring = {
  type: 'spring',
  stiffness: 250,
  damping: 25,
};

export const springStiff = {
  type: 'spring',
  stiffness: 400,
  damping: 30,
};

export const springGentle = {
  type: 'spring',
  stiffness: 180,
  damping: 22,
};

export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

export const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { ...spring, delay } },
  exit: { opacity: 0, y: -8 },
});

export const fadeScale = (delay = 0) => ({
  initial: { opacity: 0, scale: 0.96 },
  animate: { opacity: 1, scale: 1, transition: { ...spring, delay } },
  exit: { opacity: 0, scale: 0.96 },
});

export const slideIn = {
  initial: { opacity: 0, x: -16 },
  animate: { opacity: 1, x: 0, transition: spring },
  exit: { opacity: 0, x: 16 },
};

export const staggerContainer = (staggerMs = 40) => ({
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: { staggerChildren: staggerMs / 1000, delayChildren: 0.05 },
  },
});

export const cardHover = {
  whileHover: { y: -4, transition: spring },
  whileTap: { scale: 0.98 },
};

export const buttonPress = {
  whileHover: { scale: 1.02, transition: spring },
  whileTap: { scale: 0.97 },
};
