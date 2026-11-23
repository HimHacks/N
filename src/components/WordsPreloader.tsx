import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ThreeSquaresLoader } from './ThreeSquaresLoader';
import { SoffitGradient, type SoffitGradientConfig } from './SoffitGradient';

export type WordPreloaderPhase = 'idle' | 'expanding' | 'loading' | 'exiting';

interface WordsPreloaderProps {
  phase: WordPreloaderPhase;
  buttonOrigin?: { x: number; y: number } | null;
  onExpanded?: () => void;
  onLoadingComplete?: () => void;
  onExited?: () => void;
  onScrollDown?: () => void;
}

// 5x7 Dot-matrix glyph definitions for loading counter
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
    [0, 0, 0, 0, 1],
    [0, 1, 1, 1, 0],
  ],
  '%': [
    [1, 1, 0, 0, 1],
    [1, 1, 0, 1, 0],
    [0, 0, 1, 0, 0],
    [0, 1, 0, 0, 0],
    [0, 1, 0, 1, 1],
    [1, 0, 0, 1, 1],
    [0, 0, 0, 0, 0],
  ],
};

// Dot-Matrix Digit
const InstantDotMatrixDigit: React.FC<{ char: string; dotSize?: number; color?: string }> = ({
  char,
  dotSize = 5,
  color = '#111b21',
}) => {
  const pattern = DIGIT_PATTERNS[char] || DIGIT_PATTERNS['0'];
  return (
    <div
      className="inline-grid gap-[2.5px] p-0.5 select-none"
      style={{
        gridTemplateColumns: `repeat(5, ${dotSize}px)`,
        gridTemplateRows: `repeat(7, ${dotSize}px)`,
      }}
    >
      {pattern.flatMap((row, r) =>
        row.map((on, c) => (
          <div
            key={`${r}-${c}`}
            className="rounded-[1.5px]"
            style={{
              width: dotSize,
              height: dotSize,
              backgroundColor: on ? color : 'rgba(0, 0, 0, 0.06)',
              opacity: on ? 1 : 0.2,
              transition: 'none',
            }}
          />
        ))
      )}
    </div>
  );
};

// Target phrase in bottom right:
// "Scroll to see the simulator"
const TARGET_TEXT = "Scroll to see the simulator";
const TARGET_LETTERS = TARGET_TEXT.split('').map((char, index) => ({
  char,
  index,
  // Deterministic scatter position across the card
  initX: ((index * 47) % 360) - 180,
  initY: ((index * 31) % 220) - 110,
  initRot: ((index * 29) % 90) - 45,
}));

export const WordsPreloader: React.FC<WordsPreloaderProps> = ({
  phase,
  buttonOrigin,
  onExpanded,
  onLoadingComplete,
  onExited,
  onScrollDown,
}) => {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [progress, setProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  // Measure viewport dimensions
  useEffect(() => {
    const updateDims = () => {
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
    };
    updateDims();
    window.addEventListener('resize', updateDims);
    return () => window.removeEventListener('resize', updateDims);
  }, []);

  // Loading duration: ~5.0 seconds (1% -> 100%)
  useEffect(() => {
    if (phase === 'loading') {
      setIsLoaded(false);
      setProgress(1);
      let current = 1;
      const interval = setInterval(() => {
        current += 1;
        if (current >= 100) {
          current = 100;
          setProgress(100);
          setIsLoaded(true);
          clearInterval(interval);
          if (onLoadingComplete) onLoadingComplete();
        } else {
          setProgress(current);
        }
      }, 50);
      return () => clearInterval(interval);
    } else if (phase === 'idle') {
      setProgress(0);
      setIsLoaded(false);
    }
  }, [phase, onLoadingComplete]);

  const originX = buttonOrigin ? `${Math.round(buttonOrigin.x)}px` : '50%';
  const originY = buttonOrigin ? `${Math.round(buttonOrigin.y)}px` : 'calc(100% - 70px)';

  const initialClip = `circle(0px at ${originX} ${originY})`;
  const expandedClip = `circle(160vmax at ${originX} ${originY})`;
  const customEase = [0.76, 0, 0.24, 1] as const;

  const progressStr = String(Math.min(100, progress)).padStart(3, '0') + '%';
  const digits = progressStr.split('');

  const isVisible = phase !== 'idle';

  const soffitConfig: SoffitGradientConfig = {
    bgColor: '#f0f2f5',
    colorA: '#00a884',
    colorB: '#25d366',
    colorC: '#06b6d4',
    colorD: '#dcfce7',
    scale: 0.65,
    speed: 0.28,
    tilt: 0.0,
    rock: 0.06,
    horizon: -0.15,
    breathe: 0.25,
    spread: 0.6,
    curve: 2.8,
    direct: 0.85,
    bounce: 0.25,
    bounceCurve: 2.5,
    spillCentre: 0.0,
    spillWidth: 1.8,
    spillFloor: 0.2,
    amount: 0.24,
    warp: 2.2,
    warpScale: 0.65,
    flow: 0.38,
    roughness: 0.35,
    lacunarity: 2.0,
    motes: 0.05,
    moteScale: 7,
    ambient: 0.32,
    contrast: 1.8,
    midpoint: 0.55,
    sink: 0.22,
    glow: 0.35,
    grain: 0,
    grainAnim: 0,
    dither: 0.8,
    vignette: 0.08,
    steer: 0.0,
    lift: 0.08,
    sweep: 0.2,
    cursor: 1,
    parallax: 0.008,
    maxDpr: 1,
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed inset-0 z-[120] pointer-events-auto overflow-hidden select-none">
          <motion.div
            className="fixed inset-0 z-30 flex items-center justify-center"
            initial={{
              clipPath: initialClip,
              backgroundColor: '#0c1317',
            }}
            animate={
              phase === 'expanding'
                ? {
                    clipPath: expandedClip,
                    backgroundColor: '#efeae2',
                    transition: {
                      clipPath: { duration: 1.15, ease: customEase },
                      backgroundColor: { duration: 1.0, ease: 'easeInOut' },
                    },
                  }
                : phase === 'loading'
                ? {
                    clipPath: expandedClip,
                    backgroundColor: '#efeae2',
                  }
                : phase === 'exiting'
                ? {
                    clipPath: initialClip,
                    backgroundColor: '#0c1317',
                    transition: {
                      clipPath: { duration: 0.95, ease: customEase },
                      backgroundColor: { duration: 0.85, ease: 'easeInOut' },
                    },
                  }
                : {}
            }
            onAnimationComplete={() => {
              if (phase === 'expanding' && onExpanded) {
                onExpanded();
              } else if (phase === 'exiting' && onExited) {
                onExited();
              }
            }}
          >
            {/* Flat Soffit WebGL2 Gradient Rising from Bottom */}
            <motion.div
              initial={{ y: '100%', opacity: 0 }}
              animate={
                phase === 'loading'
                  ? {
                      y: '0%',
                      opacity: 0.92,
                      transition: { duration: 5.0, ease: [0.16, 1, 0.3, 1] },
                    }
                  : phase === 'exiting'
                  ? {
                      opacity: 0,
                      transition: { duration: 0.4 },
                    }
                  : {}
              }
              className="absolute bottom-0 left-0 right-0 h-[65vh] min-h-[480px] pointer-events-none overflow-hidden z-10"
            >
              <SoffitGradient
                config={soffitConfig}
                className="w-full h-full"
              />

              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    'linear-gradient(to top, transparent 0%, rgba(239, 234, 226, 0.25) 40%, rgba(239, 234, 226, 0.85) 80%, #efeae2 100%)',
                }}
              />
            </motion.div>

            {/* Studio Card (Loading Screen) */}
            <AnimatePresence>
              {phase === 'loading' && (
                <motion.div
                  key="loading-card-container"
                  initial={{ opacity: 0, scale: 0.94 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.35, ease: 'easeOut' }}
                  className="relative z-20 w-full max-w-4xl h-[78vh] max-h-[580px] bg-white/95 rounded-3xl shadow-[0_30px_90px_rgba(11,20,26,0.18)] overflow-hidden flex flex-col justify-between p-6 sm:p-8 md:p-10 text-slate-900 border border-[#d1d7db]/80 mx-4 sm:mx-8 backdrop-blur-xl"
                >
                  {/* Top Bar: Clean minimal header (no mac buttons, no initializing pill) */}
                  <div className="flex items-center justify-between w-full border-b border-[#e9edef] pb-3.5">
                    <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#00a884]">
                      E2EE • PROTOCOL
                    </span>
                    <span className="text-xs font-mono text-[#8696a0]">
                      {progress < 100 ? 'CONNECTING...' : 'CHANNEL ACTIVE'}
                    </span>
                  </div>

                  {/* Center Loading Telemetry: Overwritten "Loading" with ThreeSquaresLoader & Dot Matrix Counter */}
                  <div className="flex flex-col md:flex-row items-center justify-between my-auto w-full gap-8">
                    {/* Left: "Loading" with cycling three squares loader */}
                    <div className="flex items-center gap-4">
                      <span className="text-3xl sm:text-4xl md:text-5xl font-bold font-mono text-[#111b21] tracking-tight">
                        Loading
                      </span>
                      <ThreeSquaresLoader size={28} color="#00a884" />
                    </div>

                    {/* Right: Big Dot-Matrix Counter with instant digit changes */}
                    <div className="flex items-center gap-2 sm:gap-3 bg-[#f0f2f5] px-6 py-5 rounded-2xl border border-[#d1d7db] shadow-inner">
                      {digits.map((ch, idx) => (
                        <InstantDotMatrixDigit key={idx} char={ch} dotSize={6} color="#111b21" />
                      ))}
                    </div>
                  </div>

                  {/* 
                    Bottom Section:
                    - Left: Clean status label
                    - Bottom Right: Jumbled letters animating across the page and reassembling into:
                      "Scroll to see the simulator ↓"
                  */}
                  <div className="relative flex items-center justify-between w-full border-t border-[#e9edef] pt-4 min-h-[56px]">
                    <span className="text-xs font-mono text-[#8696a0]">
                      END-TO-END ENCRYPTION SIMULATOR
                    </span>

                    {/* Bottom Right Jumbled & Reassembling Area */}
                    <div className="relative flex items-center justify-end">
                      {/* During loading (1% -> 99%): Letters are jumbled and scattered */}
                      {!isLoaded && (
                        <div className="relative flex items-center font-mono text-sm font-bold text-[#00a884]">
                          {TARGET_LETTERS.map((item, idx) => (
                            <motion.span
                              key={idx}
                              animate={{
                                x: [item.initX, item.initX * 0.4, item.initX * 0.15],
                                y: [item.initY, item.initY * 0.4, item.initY * 0.15],
                                rotate: [item.initRot, item.initRot * 0.5, 0],
                                opacity: [0.3, 0.85, 0.6],
                              }}
                              transition={{
                                duration: 3.5,
                                ease: [0.16, 1, 0.3, 1],
                                repeat: Infinity,
                                repeatType: 'reverse',
                                delay: (idx * 0.03),
                              }}
                              className="inline-block pointer-events-none select-none text-[#00a884]"
                            >
                              {item.char === ' ' ? '\u00A0' : item.char}
                            </motion.span>
                          ))}
                        </div>
                      )}

                      {/* When Loaded (100%): Letters smoothly snap together into the exact final button */}
                      {isLoaded && (
                        <motion.button
                          initial={{ opacity: 0, scale: 0.9, y: 10 }}
                          animate={{
                            opacity: 1,
                            scale: 1,
                            y: 0,
                            transition: {
                              type: 'spring',
                              stiffness: 300,
                              damping: 22,
                            },
                          }}
                          onClick={() => {
                            if (onScrollDown) onScrollDown();
                          }}
                          className="flex items-center gap-2.5 px-6 py-2.5 rounded-full text-white font-sans font-semibold text-sm shadow-[0_8px_24px_rgba(0,168,132,0.35)] hover:shadow-[0_10px_30px_rgba(0,168,132,0.5)] transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer animate-bounce"
                          style={{
                            backgroundColor: '#00a884', // Green button matching screenshot
                          }}
                        >
                          <span className="tracking-wide">Scroll to see the simulator</span>
                          <span className="text-base font-bold">&darr;</span>
                        </motion.button>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default WordsPreloader;
