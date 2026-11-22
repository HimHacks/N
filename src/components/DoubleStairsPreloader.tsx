import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface DoubleStairsPreloaderProps {
  isLoading: boolean;
  onAnimationComplete?: () => void;
}

export const DoubleStairsPreloader: React.FC<DoubleStairsPreloaderProps> = ({
  isLoading,
  onAnimationComplete,
}) => {
  const totalColumns = 6;
  const columns = Array.from({ length: totalColumns });

  // Custom cubic bezier easing for luxury staggered transitions
  const customEase = [0.76, 0, 0.24, 1] as const;

  return (
    <AnimatePresence onExitComplete={onAnimationComplete}>
      {isLoading && (
        <motion.div
          key="double-stairs-preloader"
          className="fixed inset-0 z-50 flex pointer-events-none overflow-hidden select-none"
          initial={{ opacity: 1 }}
          exit={{ opacity: 1 }}
        >
          {columns.map((_, index) => {
            // Stagger from left to right with a smooth cascading waterfall timing
            const staggerDelay = index * 0.08 + 0.2;

            return (
              <div key={index} className="relative flex-1 h-full flex flex-col">
                {/* Top Stair Block: Retracts upwards (y: 0% -> -100%) */}
                <motion.div
                  className="w-full h-1/2 bg-[#021812] border-r border-[#064e3b]/20"
                  initial={{ y: '0%' }}
                  exit={{ y: '-100%' }}
                  transition={{
                    duration: 0.85,
                    ease: customEase,
                    delay: staggerDelay,
                  }}
                />

                {/* Bottom Stair Block: Retracts downwards (y: 0% -> 100%) */}
                <motion.div
                  className="w-full h-1/2 bg-[#032018] border-r border-[#064e3b]/20"
                  initial={{ y: '0%' }}
                  exit={{ y: '100%' }}
                  transition={{
                    duration: 0.85,
                    ease: customEase,
                    delay: staggerDelay,
                  }}
                />
              </div>
            );
          })}

          {/* Centered subtle branding badge that gracefully fades out right before curtains split */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            initial={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
          >
            <div className="flex flex-col items-center gap-2">
              <span className="text-emerald-400 font-mono text-xs uppercase tracking-[0.3em] font-semibold opacity-80">
                The Syntax Unveilers
              </span>
              <span className="text-white text-xl sm:text-2xl font-black tracking-wider uppercase drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
                GVH Security
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DoubleStairsPreloader;
