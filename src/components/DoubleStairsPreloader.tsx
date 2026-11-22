import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export type PreloaderPhase = 'idle' | 'closing' | 'loading' | 'opening';

interface DoubleStairsPreloaderProps {
  phase: PreloaderPhase;
  onClosed?: () => void;
  onLoadingComplete?: () => void;
  onOpened?: () => void;
}

// 5x7 Dot-matrix glyph definitions
const DIGIT_PATTERNS: Record<string, number[][]> = {
  '0': [
    [0, 1, 1, 1, 0],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 1, 1],
    [1, 0, 1, 0, 1],
    [1, 1, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [0, 1, 1, 1, 0],
  ],
  '1': [
    [0, 0, 1, 0, 0],
    [0, 1, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 1, 1, 1, 0],
  ],
  '2': [
    [0, 1, 1, 1, 0],
    [1, 0, 0, 0, 1],
    [0, 0, 0, 0, 1],
    [0, 0, 0, 1, 0],
    [0, 0, 1, 0, 0],
    [0, 1, 0, 0, 0],
    [1, 1, 1, 1, 1],
  ],
  '3': [
    [0, 1, 1, 1, 0],
    [1, 0, 0, 0, 1],
    [0, 0, 0, 0, 1],
    [0, 0, 1, 1, 0],
    [0, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [0, 1, 1, 1, 0],
  ],
  '4': [
    [0, 0, 0, 1, 0],
    [0, 0, 1, 1, 0],
    [0, 1, 0, 1, 0],
    [1, 0, 0, 1, 0],
    [1, 1, 1, 1, 1],
    [0, 0, 0, 1, 0],
    [0, 0, 0, 1, 0],
  ],
  '5': [
    [1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0],
    [1, 1, 1, 1, 0],
    [0, 0, 0, 0, 1],
    [0, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [0, 1, 1, 1, 0],
  ],
  '6': [
    [0, 1, 1, 1, 0],
    [1, 0, 0, 0, 0],
    [1, 1, 1, 1, 0],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [0, 1, 1, 1, 0],
  ],
  '7': [
    [1, 1, 1, 1, 1],
    [0, 0, 0, 0, 1],
    [0, 0, 0, 1, 0],
    [0, 0, 1, 0, 0],
    [0, 1, 0, 0, 0],
    [0, 1, 0, 0, 0],
    [0, 1, 0, 0, 0],
  ],
  '8': [
    [0, 1, 1, 1, 0],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [0, 1, 1, 1, 0],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [0, 1, 1, 1, 0],
  ],
  '9': [
    [0, 1, 1, 1, 0],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [0, 1, 1, 1, 1],
    [0, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [0, 1, 1, 1, 0],
  ],
  '%': [
    [1, 1, 0, 0, 1],
    [1, 1, 0, 1, 0],
    [0, 0, 1, 0, 0],
    [0, 1, 0, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 1, 0, 1, 1],
    [1, 0, 0, 1, 1],
  ],
};

// Animated Dot Matrix Digit Component: Animates smoothly per digit change
const SmoothDotMatrixDigit: React.FC<{
  char: string;
  dotSize?: number;
  color?: string;
}> = ({ char, dotSize = 6, color = '#0f172a' }) => {
  const pattern = DIGIT_PATTERNS[char] || DIGIT_PATTERNS['0'];

  return (
    <div className="relative overflow-hidden py-1 px-0.5">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.div
          key={char}
          initial={{ y: 16, opacity: 0, filter: 'blur(2px)' }}
          animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
          exit={{ y: -16, opacity: 0, filter: 'blur(2px)' }}
          transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
          className="grid grid-cols-5 gap-[3.5px] select-none"
        >
          {pattern.flatMap((row, rIdx) =>
            row.map((active, cIdx) => (
              <div
                key={`${rIdx}-${cIdx}`}
                className="rounded-full transition-all duration-150"
                style={{
                  width: dotSize,
                  height: dotSize,
                  backgroundColor: active ? color : 'transparent',
                  opacity: active ? 1 : 0,
                  transform: active ? 'scale(1)' : 'scale(0.3)',
                }}
              />
            ))
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export const DoubleStairsPreloader: React.FC<DoubleStairsPreloaderProps> = ({
  phase,
  onClosed,
  onLoadingComplete,
  onOpened,
}) => {
  const totalColumns = 6;
  const columns = Array.from({ length: totalColumns });

  // Custom luxury cubic bezier easing (Skiper 10 standard)
  const customEase = [0.76, 0, 0.24, 1] as const;

  // Real-time counter for the Spasoje Perovic loading phase
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (phase === 'loading') {
      setProgress(1);
      let currentVal = 1;
      // Increment 1 by 1 from 1 to 100 with ~36ms interval (~3.6s total)
      // Every single digit (1, 2, 3, 4, ... 100%) is clearly visible to the human eye
      const interval = setInterval(() => {
        currentVal += 1;
        if (currentVal >= 100) {
          currentVal = 100;
          setProgress(100);
          clearInterval(interval);
          setTimeout(() => {
            if (onLoadingComplete) onLoadingComplete();
          }, 450);
        } else {
          setProgress(currentVal);
        }
      }, 36);
      return () => clearInterval(interval);
    } else if (phase === 'idle') {
      setProgress(0);
    }
  }, [phase, onLoadingComplete]);

  const progressStr = String(Math.min(100, progress)).padStart(3, '0') + '%';
  const digits = progressStr.split('');

  const isVisible = phase !== 'idle';
  const isStairsClosed = phase === 'closing' || phase === 'loading';

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="double-stairs-preloader"
          className="fixed inset-0 z-[120] flex pointer-events-auto overflow-hidden select-none"
          initial={{ opacity: 1 }}
          exit={{ opacity: 1 }}
        >
          {/* 
            STAIRS LAYER (The chunks that come together from top and bottom,
            and retract back in reverse double stair motion)
          */}
          {columns.map((_, index) => {
            // Forward cascade when closing (left to right)
            const forwardDelay = index * 0.07;
            // Majestic, clearly visible reverse mirrored cascade when opening (right to left)
            const reverseDelay = (totalColumns - 1 - index) * 0.12;

            const currentDelay = isStairsClosed ? forwardDelay : reverseDelay;
            const currentDuration = isStairsClosed ? 0.65 : 0.95;

            return (
              <div key={index} className="relative flex-1 h-full flex flex-col z-10 pointer-events-none">
                {/* Top Stair Block: WhatsApp Obsidian Emerald with crisp seam */}
                <motion.div
                  className="w-full h-1/2 bg-[#022119] border-r border-[#10b981]/20 shadow-2xl relative overflow-hidden"
                  initial={{ y: '-100%' }}
                  animate={{ y: isStairsClosed ? '0%' : '-100%' }}
                  transition={{
                    duration: currentDuration,
                    ease: customEase,
                    delay: currentDelay,
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-[#10b981]/10 to-transparent pointer-events-none" />
                </motion.div>

                {/* Bottom Stair Block */}
                <motion.div
                  className="w-full h-1/2 bg-[#011812] border-r border-[#10b981]/20 shadow-2xl relative overflow-hidden"
                  initial={{ y: '100%' }}
                  animate={{ y: isStairsClosed ? '0%' : '100%' }}
                  transition={{
                    duration: currentDuration,
                    ease: customEase,
                    delay: currentDelay,
                  }}
                  onAnimationComplete={() => {
                    // Triggered when chunks finish closing together
                    if (isStairsClosed && index === totalColumns - 1 && onClosed) {
                      onClosed();
                    }
                    // Triggered when chunks finish opening away in reverse double stair
                    else if (!isStairsClosed && index === 0 && onOpened) {
                      onOpened();
                    }
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-[#2dd4bf]/10 to-transparent pointer-events-none" />
                </motion.div>
              </div>
            );
          })}

          {/* 
            SPASOJE PEROVIC LOADING CANVAS (Visible inside when chunks come together)
            Wide prominent green border, smaller centered studio-white box
          */}
          <AnimatePresence>
            {phase === 'loading' && (
              <motion.div
                key="loading-canvas-center"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.28, ease: 'easeOut' }}
                className="absolute inset-0 z-20 flex items-center justify-center p-8 sm:p-14 md:p-20 lg:p-24"
              >
                {/* 
                  Studio White Card:
                  Sized smaller (~82% max-width, ~78% max-height) with wide visible emerald perimeter border 
                */}
                <div className="relative w-full max-w-4xl h-[78vh] max-h-[580px] bg-[#fcfcfc] rounded-3xl shadow-[0_30px_90px_rgba(0,0,0,0.65)] overflow-hidden flex flex-col justify-between p-6 sm:p-8 md:p-10 text-slate-900 border border-slate-200/60">
                  {/* Top Bar Navigation */}
                  <div className="flex items-center justify-between w-full text-xs font-mono tracking-wider text-slate-500 uppercase border-b border-slate-200/80 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="font-bold text-slate-900">GVH // SECURITY LAB</span>
                    </div>
                    <div className="hidden sm:flex items-center gap-5 text-[11px] font-medium text-slate-400">
                      <span>PROTOCOL E2EE</span>
                      <span>DIFFIE-HELLMAN</span>
                      <span>3D SIMULATOR</span>
                    </div>
                  </div>

                  {/* Center Dot-Matrix Loading Telemetry */}
                  <div className="flex flex-col md:flex-row items-center justify-between my-auto w-full gap-8">
                    {/* Left: Status & Micro-Copy */}
                    <div className="flex flex-col gap-4">
                      <div className="inline-flex items-center gap-2">
                        <span className="text-[11px] font-mono text-emerald-700 font-bold uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full border border-emerald-300/60">
                          INITIALIZING SIMULATOR...
                        </span>
                      </div>

                      <p className="max-w-sm text-xs font-mono text-slate-500 leading-relaxed uppercase">
                        Compiling 3D phone physics model, capacitive touch matrix, and session keys.
                      </p>

                      {/* Directional Dot-Matrix Arrow */}
                      <div className="flex items-center gap-3 mt-1">
                        <div className="grid grid-cols-5 gap-[3px]">
                          {[
                            [0, 0, 1, 0, 0],
                            [0, 0, 0, 1, 0],
                            [1, 1, 1, 1, 1],
                            [0, 0, 0, 1, 0],
                            [0, 0, 1, 0, 0],
                          ].flatMap((row, r) =>
                            row.map((val, c) => (
                              <div
                                key={`arr-${r}-${c}`}
                                className="w-[4px] h-[4px] rounded-full"
                                style={{
                                  backgroundColor: val ? '#059669' : 'transparent',
                                }}
                              />
                            ))
                          )}
                        </div>
                        <span className="text-[11px] font-mono text-slate-400 uppercase tracking-widest font-semibold">
                          PROCESSING MATRIX
                        </span>
                      </div>
                    </div>

                    {/* Right: Big Dot-Matrix Counter with per-digit animation */}
                    <div className="flex items-center gap-2 sm:gap-3 bg-slate-100/90 px-6 py-5 rounded-2xl border border-slate-200/90 shadow-inner">
                      {digits.map((ch, idx) => (
                        <SmoothDotMatrixDigit
                          key={idx}
                          char={ch}
                          dotSize={6}
                          color="#0f172a"
                        />
                      ))}
                    </div>
                  </div>

                  {/* Bottom Footer Telemetry */}
                  <div className="flex items-center justify-between w-full text-xs font-mono text-slate-400 border-t border-slate-200/80 pt-3.5">
                    <span className="text-slate-500 font-medium">THE SYNTAX UNVEILERS</span>
                    <span className="text-emerald-600 font-bold tracking-wider">
                      {progress < 100 ? 'PREPARING ASSETS...' : 'DEEP DIVE READY →'}
                    </span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DoubleStairsPreloader;
