import React from 'react';
import { motion } from 'framer-motion';

interface PageTransitionProps {
  children: React.ReactNode;
}

const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
  return (
    <>
      <motion.div
        className="fixed top-0 left-0 w-full h-screen bg-sogip-resonance z-[9998]"
        initial={{ scaleY: 1 }}
        animate={{ scaleY: 0 }}
        exit={{ scaleY: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        style={{ transformOrigin: 'top' }}
      />
      <motion.div
        className="fixed top-0 left-0 w-full h-screen bg-sogip-resonance z-[9998]"
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 0 }}
        exit={{ scaleY: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        style={{ transformOrigin: 'bottom' }}
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
      >
        {children}
      </motion.div>
    </>
  );
};

export default PageTransition;
