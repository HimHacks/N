import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface DoubleStairsPreloaderProps {
  isActive: boolean;
  onTransitionComplete?: () => void;
}

export const DoubleStairsPreloader: React.FC<DoubleStairsPreloaderProps> = ({
  isActive,
  onTransitionComplete,
}) => {
  const totalColumns = 6;
  const columns = Array.from({ length: totalColumns });

  // Custom cubic bezier easing for luxury staggered transitions (Skiper 10 standard)
  const customEase = [0.76, 0, 0.24, 1] as const;

  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          key="double-stairs-preloader"
          className="fixed inset-0 z-[100] flex pointer-events-auto overflow-hidden select-none"
          initial={{ opacity: 1 }}
          exit={{ opacity: 1 }}
        >
          {columns.map((_, index) => {
            // Stagger from left to right with cascading timing
            const staggerDelay = index * 0.07;

            return (
              <div key={index} className="relative flex-1 h-full flex flex-col">
                {/* Top Stair Block: Closes downwards from top (y: -100% -> 0%) */}
                <motion.div
                  className="w-full h-1/2 bg-[#021812] border-r border-[#064e3b]/25 shadow-2xl"
                  initial={{ y: '-100%' }}
                  animate={{ y: '0%' }}
                  transition={{
                    duration: 0.65,
                    ease: customEase,
                    delay: staggerDelay,
                  }}
                />

                {/* Bottom Stair Block: Closes upwards from bottom (y: 100% -> 0%) */}
                <motion.div
                  className="w-full h-1/2 bg-[#032018] border-r border-[#064e3b]/25 shadow-2xl"
                  initial={{ y: '100%' }}
                  animate={{ y: '0%' }}
                  transition={{
                    duration: 0.65,
                    ease: customEase,
                    delay: staggerDelay,
                  }}
                  onAnimationComplete={() => {
                    // When the last column finishes closing, trigger transition redirect callback
                    if (index === totalColumns - 1 && onTransitionComplete) {
                      onTransitionComplete();
                    }
                  }}
                />
              </div>
            );
          })}

          {/* Centered subtle branding badge while curtains close */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.25 }}
          >
            <div className="flex flex-col items-center gap-2">
              <span className="text-emerald-400 font-mono text-xs uppercase tracking-[0.3em] font-semibold opacity-90">
                Initializing Deep Dive
              </span>
              <span className="text-white text-xl sm:text-2xl font-black tracking-wider uppercase drop-shadow-[0_2px_12px_rgba(0,0,0,0.6)]">
                GVH Security Simulator
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DoubleStairsPreloader;
