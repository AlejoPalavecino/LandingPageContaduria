import React from 'react';
import { motion, AnimatePresence, HTMLMotionProps } from 'framer-motion';

// Tokens
export const TRANSITION_SPRING = { type: "spring", stiffness: 300, damping: 30 };
export const TRANSITION_EASE = { duration: 0.5, ease: [0.25, 0.1, 0.25, 1.0] };

// Wrapper for Page Transitions
export const PageTransition: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    transition={{ duration: 0.4, ease: "easeOut" }}
    className={className}
  >
    {children}
  </motion.div>
);

// Fade In Up (Scroll Reveal)
export const FadeInUp: React.FC<HTMLMotionProps<"div"> & { delay?: number }> = ({ children, delay = 0, className, ...props }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration: 0.6, delay, ease: "easeOut" }}
    className={className}
    {...props}
  >
    {children}
  </motion.div>
);

// Stagger Container
export const StaggerContainer: React.FC<HTMLMotionProps<"div"> & { staggerDelay?: number }> = ({ children, staggerDelay = 0.1, className, ...props }) => (
  <motion.div
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, margin: "-50px" }}
    variants={{
      hidden: {},
      visible: {
        transition: {
          staggerChildren: staggerDelay
        }
      }
    }}
    className={className}
    {...props}
  >
    {children}
  </motion.div>
);

// Stagger Item
export const StaggerItem: React.FC<HTMLMotionProps<"div">> = ({ children, className, ...props }) => (
  <motion.div
    variants={{
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
    }}
    className={className}
    {...props}
  >
    {children}
  </motion.div>
);

// Scale In (for Modals/Badges)
export const ScaleIn: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.95 }}
    transition={{ duration: 0.2 }}
    className={className}
  >
    {children}
  </motion.div>
);

export { motion, AnimatePresence };