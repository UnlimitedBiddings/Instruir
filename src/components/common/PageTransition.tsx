import { motion, AnimatePresence } from 'framer-motion';
import { ReactNode } from 'react';

interface PageTransitionProps {
  children: ReactNode;
  className?: string;
}

const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
    scale: 0.98,
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
  },
  exit: {
    opacity: 0,
    y: -10,
    scale: 0.98,
  },
};

const pageTransition = {
  type: 'spring' as const,
  stiffness: 380,
  damping: 30,
};

export function PageTransition({ children, className }: PageTransitionProps) {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      transition={pageTransition}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Stagger children animation
export const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

export const staggerItem = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  show: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 25,
    },
  },
};

// Fade in animation
export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.2 },
};

// Scale up animation
export const scaleUp = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.9 },
  transition: { type: 'spring', stiffness: 400, damping: 25 },
};

// Slide in from bottom
export const slideUp = {
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 20 },
  transition: { type: 'spring', stiffness: 400, damping: 30 },
};

// Slide in from right
export const slideInRight = {
  initial: { opacity: 0, x: 40 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
  transition: { type: 'spring', stiffness: 400, damping: 30 },
};

// Tap animation for buttons
export const tapAnimation = {
  whileTap: { scale: 0.97 },
  whileHover: { scale: 1.02 },
  transition: { type: 'spring', stiffness: 400, damping: 17 },
};

// Card hover animation
export const cardHover = {
  whileHover: { 
    y: -4, 
    boxShadow: '0 20px 40px -12px hsl(215 35% 15% / 0.15)',
  },
  whileTap: { scale: 0.98 },
  transition: { type: 'spring', stiffness: 400, damping: 20 },
};
