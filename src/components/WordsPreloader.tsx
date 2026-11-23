import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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

// 5x7 dot matrix font maps for large typography (SP•DEV style)
const DOT_FONT: Record<string, number[][]> = {
  'S': [
    [0, 1, 1, 1, 1],
    [1, 0, 0, 0, 0],
    [1, 0, 0, 0, 0],
    [0, 1, 1, 1, 0],
    [0, 0, 0, 0, 1],
    [0, 0, 0, 0, 1],
    [1, 1, 1, 1, 0],
  ],
  'C': [
    [0, 1, 1, 1, 0],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 0],
    [1, 0, 0, 0, 0],
    [1, 0, 0, 0, 0],
    [1, 0, 0, 0, 1],
    [0, 1, 1, 1, 0],
  ],
  'R': [
    [1, 1, 1, 1, 0],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 1, 1, 1, 0],
    [1, 0, 1, 0, 0],
    [1, 0, 0, 1, 0],
    [1, 0, 0, 0, 1],
  ],
  'O': [
    [0, 1, 1, 1, 0],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [0, 1, 1, 1, 0],
  ],
  'L': [
    [1, 0, 0, 0, 0],
    [1, 0, 0, 0, 0],
    [1, 0, 0, 0, 0],
    [1, 0, 0, 0, 0],
    [1, 0, 0, 0, 0],
    [1, 0, 0, 0, 0],
    [1, 1, 1, 1, 1],
  ],
  'D': [
    [1, 1, 1, 1, 0],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 1, 1, 1, 0],
  ],
  'W': [
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1],
    [1, 1, 0, 1, 1],
    [1, 0, 0, 0, 1],
  ],
  'N': [
    [1, 0, 0, 0, 1],
    [1, 1, 0, 0, 1],
    [1, 0, 1, 0, 1],
    [1, 0, 0, 1, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
  ],
  ' ': [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ],
};

// Target text for dot matrix hero reassembly
const WORD_ROW_1 = ['S', 'C', 'R', 'O', 'L', 'L'];
const WORD_ROW_2 = ['D', 'O', 'W', 'N'];

// Floating scatter words that converge and reassemble into the final button
const SCATTER_WORDS = [
  { id: 1, text: 'CIPHER', initX: -260, initY: -140 },
  { id: 2, text: 'KEYS', initX: 280, initY: -160 },
  { id: 3, text: 'RATCHET', initX: -320, initY: 40 },
  { id: 4, text: 'ENTROPY', initX: 300, initY: 60 },
  { id: 5, text: 'ENCRYPT', initX: -220, initY: 180 },
  { id: 6, text: 'DIFFIE', initX: 240, initY: 190 },
  { id: 7, text: 'CURVE25519', initX: 0, initY: -220 },
  { id: 8, text: 'SIGNAL', initX: -140, initY: -80 },
  { id: 9, text: 'DECRYPT', initX: 160, initY: -90 },
  { id: 10, text: 'PEER', initX: 0, initY: 220 },
];

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
  const [isAssembled, setIsAssembled] = useState(false);

  useEffect(() => {
    const updateDims = () => {
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
    };
    updateDims();
    window.addEventListener('resize', updateDims);
    return () => window.removeEventListener('resize', updateDims);
  }, []);

  // Smooth loading progression over ~4.8 seconds
  useEffect(() => {
    if (phase === 'loading') {
      setIsAssembled(false);
      setProgress(1);
      let current = 1;
      const interval = setInterval(() => {
        current += 1;
        if (current >= 100) {
          current = 100;
          setProgress(100);
          setIsAssembled(true);
          clearInterval(interval);
          if (onLoadingComplete) onLoadingComplete();
        } else {
          setProgress(current);
        }
      }, 48);
      return () => clearInterval(interval);
    } else if (phase === 'idle') {
      setProgress(0);
      setIsAssembled(false);
    }
  }, [phase, onLoadingComplete]);

  const originX = buttonOrigin ? `${Math.round(buttonOrigin.x)}px` : '50%';
  const originY = buttonOrigin ? `${Math.round(buttonOrigin.y)}px` : 'calc(100% - 70px)';

  const initialClip = `circle(0px at ${originX} ${originY})`;
  const expandedClip = `circle(160vmax at ${originX} ${originY})`;
  const customEase = [0.76, 0, 0.24, 1] as const;

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
            className="fixed inset-0 z-30 flex flex-col justify-between"
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
            {/* Retained Soffit Gradient rising from the bottom */}
            <motion.div
              initial={{ y: '100%', opacity: 0 }}
              animate={
                phase === 'loading'
                  ? {
                      y: '0%',
                      opacity: 0.85,
                      transition: { duration: 4.8, ease: [0.16, 1, 0.3, 1] },
                    }
                  : phase === 'exiting'
                  ? {
                      opacity: 0,
                      transition: { duration: 0.4 },
                    }
                  : {}
              }
              className="absolute bottom-0 left-0 right-0 h-[60vh] min-h-[420px] pointer-events-none overflow-hidden z-0"
            >
              <SoffitGradient config={soffitConfig} className="w-full h-full" />
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    'linear-gradient(to top, transparent 0%, rgba(239, 234, 226, 0.3) 40%, rgba(239, 234, 226, 0.9) 85%, #efeae2 100%)',
                }}
              />
            </motion.div>

            {/* 
              SP•DEV Minimal Clean Top Navigation Header 
              (Replaces MacBook window controls)
            */}
            <header className="relative z-20 w-full px-6 sm:px-12 py-6 flex items-center justify-between text-[#111b21] font-mono text-xs font-semibold tracking-wider uppercase border-b border-[#111b21]/10">
              <div className="flex items-center gap-2">
                <span className="text-sm font-black tracking-widest text-[#00a884]">E2EE•DEV</span>
                <span className="hidden sm:inline text-[#8696a0] text-[10px] lowercase">/ protocol</span>
              </div>

              {/* Progress counter pill */}
              <div className="flex items-center gap-3">
                <span className="text-[#8696a0] hidden md:inline">SYSTEM STATUS:</span>
                <span className="px-3 py-1 rounded-full bg-[#111b21]/5 border border-[#111b21]/15 text-[#00a884] font-bold">
                  {progress < 100 ? `ASSEMBLING ${progress}%` : 'READY 100%'}
                </span>
              </div>
            </header>

            {/* 
              Center Stage: SP•DEV Dot-Matrix Letters & Converging Words Reassembly
            */}
            <main className="relative z-20 flex-1 flex flex-col items-center justify-center px-4 sm:px-8 w-full max-w-6xl mx-auto overflow-hidden">
              {/* SP•DEV Big Dot-Matrix Typography Hero */}
              <div className="flex flex-col items-center gap-4 sm:gap-6 my-auto">
                {/* Row 1: SCROLL */}
                <div className="flex items-center justify-center gap-2 sm:gap-4 md:gap-6">
                  {WORD_ROW_1.map((char, charIdx) => {
                    const matrix = DOT_FONT[char] || DOT_FONT[' '];
                    return (
                      <div key={charIdx} className="flex flex-col gap-1.5 sm:gap-2">
                        {matrix.map((row, rIdx) => (
                          <div key={rIdx} className="flex gap-1.5 sm:gap-2">
                            {row.map((on, cIdx) => (
                              <motion.span
                                key={cIdx}
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{
                                  scale: on ? 1 : 0,
                                  opacity: on ? 1 : 0,
                                }}
                                transition={{
                                  delay: (charIdx * 0.08) + (rIdx * 0.02) + (cIdx * 0.01),
                                  duration: 0.3,
                                  ease: 'backOut',
                                }}
                                className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 rounded-full bg-[#111b21]"
                                style={{
                                  visibility: on ? 'visible' : 'hidden',
                                }}
                              />
                            ))}
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </div>

                {/* Row 2: DOWN */}
                <div className="flex items-center justify-center gap-2 sm:gap-4 md:gap-6">
                  {WORD_ROW_2.map((char, charIdx) => {
                    const matrix = DOT_FONT[char] || DOT_FONT[' '];
                    return (
                      <div key={charIdx} className="flex flex-col gap-1.5 sm:gap-2">
                        {matrix.map((row, rIdx) => (
                          <div key={rIdx} className="flex gap-1.5 sm:gap-2">
                            {row.map((on, cIdx) => (
                              <motion.span
                                key={cIdx}
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{
                                  scale: on ? 1 : 0,
                                  opacity: on ? 1 : 0,
                                }}
                                transition={{
                                  delay: 0.4 + (charIdx * 0.08) + (rIdx * 0.02) + (cIdx * 0.01),
                                  duration: 0.3,
                                  ease: 'backOut',
                                }}
                                className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 rounded-full bg-[#111b21]"
                                style={{
                                  visibility: on ? 'visible' : 'hidden',
                                }}
                              />
                            ))}
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 
                Random Words Converging & Reassembling into the "Scroll Down to Simulator ↓" Button 
              */}
              <div className="relative w-full h-32 flex items-center justify-center my-6">
                {/* Floating Scatter Words */}
                <AnimatePresence>
                  {!isAssembled && (
                    <>
                      {SCATTER_WORDS.map((item) => (
                        <motion.div
                          key={item.id}
                          initial={{
                            x: item.initX,
                            y: item.initY,
                            opacity: 0,
                            scale: 0.8,
                          }}
                          animate={{
                            x: [item.initX, item.initX * 0.5, 0],
                            y: [item.initY, item.initY * 0.5, 0],
                            opacity: [0, 0.85, 0],
                            scale: [0.8, 1.05, 0.4],
                          }}
                          transition={{
                            duration: 3.8,
                            ease: [0.16, 1, 0.3, 1],
                            delay: (item.id * 0.12),
                          }}
                          className="absolute pointer-events-none text-xs sm:text-sm font-mono font-bold tracking-widest text-[#00a884] bg-white/70 px-3 py-1 rounded-full border border-[#00a884]/30 backdrop-blur-sm shadow-sm"
                        >
                          {item.text}
                        </motion.div>
                      ))}
                    </>
                  )}
                </AnimatePresence>

                {/* 
                  Target Assembled Button: Exactly matching Screenshot 2
                  Green pill: "Scroll Down to Simulator ↓"
                */}
                <AnimatePresence>
                  {isAssembled && (
                    <motion.div
                      key="assembled-pill"
                      initial={{ opacity: 0, scale: 0.6, y: 15 }}
                      animate={{
                        opacity: 1,
                        scale: 1,
                        y: 0,
                        transition: {
                          type: 'spring',
                          stiffness: 240,
                          damping: 18,
                        },
                      }}
                      className="relative z-30"
                    >
                      <button
                        onClick={() => {
                          if (onScrollDown) onScrollDown();
                        }}
                        className="group flex items-center justify-center gap-2 px-8 py-3.5 rounded-full text-white font-sans font-semibold text-base sm:text-lg shadow-[0_10px_30px_rgba(0,168,132,0.4)] hover:shadow-[0_14px_40px_rgba(0,168,132,0.55)] transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
                        style={{
                          backgroundColor: '#00a884', // WhatsApp teal emerald matching screenshot
                        }}
                      >
                        <span className="tracking-wide">Scroll Down to Simulator</span>
                        <motion.span
                          animate={{ y: [0, 3, 0] }}
                          transition={{ repeat: Infinity, duration: 1.4, ease: 'easeInOut' }}
                          className="text-xl font-bold"
                        >
                          &darr;
                        </motion.span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </main>

            {/* Clean, minimalist footer (no syntax unveilers label) */}
            <footer className="relative z-20 w-full px-6 sm:px-12 py-4 flex items-center justify-between text-[#8696a0] font-mono text-[11px] border-t border-[#111b21]/10">
              <span>END-TO-END ENCRYPTION</span>
              <span>GVH 2026</span>
            </footer>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default WordsPreloader;
