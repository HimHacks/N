import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export type PreloaderPhase = 'idle' | 'closing' | 'initializing' | 'opening';

interface DoubleStairsPreloaderProps {
  phase: PreloaderPhase;
  onClosed?: () => void;
  onOpened?: () => void;
}

export const DoubleStairsPreloader: React.FC<DoubleStairsPreloaderProps> = ({
  phase,
  onClosed,
  onOpened,
}) => {
  const totalColumns = 6;
  const columns = Array.from({ length: totalColumns });

  // Custom luxury cubic bezier easing (Skiper 10 standard: [0.76, 0, 0.24, 1])
  const customEase = [0.76, 0, 0.24, 1] as const;

  // Real-time telemetry counter for the cyber-luxury HUD
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (phase === 'closing' || phase === 'initializing') {
      setProgress(12);
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 98) {
            clearInterval(interval);
            return 100;
          }
          return prev + Math.floor(Math.random() * 18 + 12);
        });
      }, 70);
      return () => clearInterval(interval);
    } else {
      setProgress(0);
    }
  }, [phase]);

  const isVisible = phase !== 'idle';

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="double-stairs-preloader"
          className="fixed inset-0 z-[120] flex pointer-events-auto overflow-hidden select-none"
          initial={{ opacity: 1 }}
          exit={{ opacity: 1 }}
        >
          {/* Dual-Direction Cascading Stair Columns */}
          {columns.map((_, index) => {
            // Forward cascade when closing (left to right)
            // Reverse mirrored cascade when opening (right to left)
            const forwardDelay = index * 0.06;
            const reverseDelay = (totalColumns - 1 - index) * 0.06;

            const isClosingPhase = phase === 'closing' || phase === 'initializing';
            const currentDelay = isClosingPhase ? forwardDelay : reverseDelay;

            return (
              <div key={index} className="relative flex-1 h-full flex flex-col">
                {/* Top Stair Block: Deep obsidian gunmetal with crisp micro-border */}
                <motion.div
                  className="w-full h-1/2 bg-[#090b10] border-r border-white/[0.06] shadow-2xl relative overflow-hidden"
                  initial={{ y: '-100%' }}
                  animate={{ y: isClosingPhase ? '0%' : '-100%' }}
                  transition={{
                    duration: 0.62,
                    ease: customEase,
                    delay: currentDelay,
                  }}
                >
                  {/* Subtle vertical luxury carbon-grain sheen */}
                  <div className="absolute inset-0 bg-gradient-to-b from-white/[0.03] to-transparent pointer-events-none" />
                </motion.div>

                {/* Bottom Stair Block */}
                <motion.div
                  className="w-full h-1/2 bg-[#07090d] border-r border-white/[0.06] shadow-2xl relative overflow-hidden"
                  initial={{ y: '100%' }}
                  animate={{ y: isClosingPhase ? '0%' : '100%' }}
                  transition={{
                    duration: 0.62,
                    ease: customEase,
                    delay: currentDelay,
                  }}
                  onAnimationComplete={() => {
                    if (isClosingPhase && index === totalColumns - 1 && onClosed) {
                      onClosed();
                    } else if (!isClosingPhase && index === 0 && onOpened) {
                      onOpened();
                    }
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/[0.02] to-transparent pointer-events-none" />
                </motion.div>
              </div>
            );
          })}

          {/* Modern Cyber-Luxury HUD Telemetry Overlay (Centered Monolith) */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{
              opacity: phase === 'closing' || phase === 'initializing' ? 1 : 0,
              scale: phase === 'closing' || phase === 'initializing' ? 1 : 1.05,
            }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
          >
            <div className="relative px-8 py-6 rounded-2xl bg-[#0d1117]/85 border border-white/10 backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.85)] flex flex-col items-center gap-4 min-w-[320px]">
              {/* Corner Sci-Fi Bracket Accents */}
              <div className="absolute top-2 left-2 w-2 h-2 border-t-2 border-l-2 border-cyan-400/60" />
              <div className="absolute top-2 right-2 w-2 h-2 border-t-2 border-r-2 border-cyan-400/60" />
              <div className="absolute bottom-2 left-2 w-2 h-2 border-b-2 border-l-2 border-cyan-400/60" />
              <div className="absolute bottom-2 right-2 w-2 h-2 border-b-2 border-r-2 border-cyan-400/60" />

              {/* Status Header */}
              <div className="flex items-center justify-between w-full border-b border-white/[0.08] pb-2.5">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500" />
                  </span>
                  <span className="text-[11px] font-mono tracking-[0.2em] uppercase text-cyan-300/90 font-semibold">
                    SYS.PROTOCOL // E2EE
                  </span>
                </div>
                <span className="text-[11px] font-mono text-slate-400 font-medium">
                  {Math.min(100, progress)}%
                </span>
              </div>

              {/* Center Title & Telemetry */}
              <div className="flex flex-col items-center text-center my-1">
                <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white uppercase drop-shadow-[0_2px_12px_rgba(0,0,0,0.5)]">
                  Cryptographic Lab
                </h3>
                <p className="text-xs font-mono text-slate-400 mt-1 tracking-wider">
                  Establishing Hardware Simulator Session
                </p>
              </div>

              {/* Minimalist Tech Progress Bar */}
              <div className="w-full h-1 bg-white/[0.08] rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-emerald-400 via-cyan-400 to-indigo-400 rounded-full shadow-[0_0_12px_rgba(34,211,238,0.7)]"
                  initial={{ width: '0%' }}
                  animate={{ width: `${Math.min(100, progress)}%` }}
                  transition={{ ease: 'easeOut', duration: 0.2 }}
                />
              </div>

              {/* Footer Cryptographic Micro-State */}
              <div className="flex items-center justify-between w-full text-[10px] font-mono text-slate-500 tracking-wider">
                <span>DIFFIE-HELLMAN KEYGEN</span>
                <span className="text-emerald-400/80">READY</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DoubleStairsPreloader;
