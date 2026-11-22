import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ThreeSquaresLoader } from './ThreeSquaresLoader';

export type WordPreloaderPhase = 'idle' | 'expanding' | 'loading' | 'exiting';

interface WordsPreloaderProps {
  phase: WordPreloaderPhase;
  onExpanded?: () => void;
  onLoadingComplete?: () => void;
  onExited?: () => void;
}

// Security / Cryptography words cycling seamlessly like Skiper 8
const CRYPTO_WORDS = [
  'Initializing',
  'Connecting',
  'Diffie-Hellman',
  'Handshake',
  'Exchanging Keys',
  'Double Ratchet',
  'Curve25519',
  'Encrypted',
];

// 5x7 Dot-matrix glyph definitions for compiling counter
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

const DotMatrixDigit: React.FC<{ char: string; dotSize?: number; color?: string }> = ({
  char,
  dotSize = 5,
  color = '#000000',
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
            className="rounded-[1.5px] transition-all duration-150"
            style={{
              width: dotSize,
              height: dotSize,
              backgroundColor: on ? color : 'rgba(0, 0, 0, 0.06)',
              opacity: on ? 1 : 0.2,
            }}
          />
        ))
      )}
    </div>
  );
};

export const WordsPreloader: React.FC<WordsPreloaderProps> = ({
  phase,
  onExpanded,
  onLoadingComplete,
  onExited,
}) => {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [wordIndex, setWordIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  // Measure viewport dimensions
  useEffect(() => {
    const updateDims = () => {
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
    };
    updateDims();
    window.addEventListener('resize', updateDims);
    return () => window.removeEventListener('resize', updateDims);
  }, []);

  // Cycle cryptography words smoothly
  useEffect(() => {
    if (phase === 'loading') {
      const interval = setInterval(() => {
        setWordIndex((prev) => (prev + 1) % CRYPTO_WORDS.length);
      }, 340);
      return () => clearInterval(interval);
    }
  }, [phase]);

  // Numerical counter for the Compiling window
  useEffect(() => {
    if (phase === 'loading') {
      setProgress(1);
      let current = 1;
      const interval = setInterval(() => {
        current += 1;
        if (current >= 100) {
          current = 100;
          setProgress(100);
          clearInterval(interval);
          setTimeout(() => {
            if (onLoadingComplete) onLoadingComplete();
          }, 400);
        } else {
          setProgress(current);
        }
      }, 32);
      return () => clearInterval(interval);
    } else if (phase === 'idle') {
      setProgress(0);
      setWordIndex(0);
    }
  }, [phase, onLoadingComplete]);

  const { width, height } = dimensions;

  // Skiper 8 SVG Curve Math (Dennis Snellenberg organic curve)
  // When sliding up to exit, the bottom edge pulls into an elastic quadratic bezier curve
  const initialPath = `M0 0 L${width} 0 L${width} ${height} Q${width / 2} ${height + 350} 0 ${height} L0 0`;
  const targetPath = `M0 0 L${width} 0 L${width} ${height} Q${width / 2} ${height} 0 ${height} L0 0`;

  const customEase = [0.76, 0, 0.24, 1] as const;

  const progressStr = String(Math.min(100, progress)).padStart(3, '0') + '%';
  const digits = progressStr.split('');

  const isVisible = phase !== 'idle';

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed inset-0 z-[120] pointer-events-auto overflow-hidden select-none">
          {/*
            Phase 1: Pure black curtain rising up from the bottom of the website to cover the entire page.
            Phase 2: Compiling studio card + Skiper 8 Cycling Words.
            Phase 3: Smooth Dennis Snellenberg elastic curve sliding up to reveal simulator.
          */}
          <motion.div
            className="fixed inset-0 z-30 flex items-center justify-center bg-[#070b0e]"
            initial={{ y: '100%' }}
            animate={
              phase === 'expanding'
                ? {
                    y: '0%',
                    transition: { duration: 0.9, ease: customEase },
                  }
                : phase === 'loading'
                ? {
                    y: '0%',
                  }
                : phase === 'exiting'
                ? {
                    y: '-100vh',
                    transition: { duration: 0.85, ease: customEase, delay: 0.15 },
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
            {/*
              Animated Soap-Bubble Gradient at the BOTTOM of the black curtain only:
              Luminous Cyan (#22d3ee), Vibrant WhatsApp Green (#25D366), and Deep Forest Green (#064e3b)
              slowly breathing and swirling along the bottom border.
            */}
            <div className="absolute bottom-0 left-0 right-0 h-64 sm:h-80 pointer-events-none overflow-hidden z-10">
              {/* Primary Cyan & Emerald iridescent glow wave */}
              <div
                className="absolute -bottom-16 -left-[20%] -right-[20%] h-72 opacity-85 blur-3xl"
                style={{
                  background:
                    'radial-gradient(ellipse 90% 65% at 50% 100%, rgba(34, 211, 238, 0.75) 0%, rgba(37, 211, 102, 0.55) 45%, rgba(6, 78, 59, 0.35) 75%, transparent 100%)',
                  animation: 'bubbleWave 6s ease-in-out infinite alternate',
                }}
              />

              {/* Secondary oscillating shimmer ray */}
              <div
                className="absolute -bottom-10 left-[10%] right-[10%] h-44 opacity-75 blur-2xl"
                style={{
                  background:
                    'radial-gradient(ellipse 70% 50% at 50% 100%, rgba(45, 212, 191, 0.85) 0%, rgba(16, 185, 129, 0.6) 50%, transparent 85%)',
                  animation: 'bubbleShimmer 4.5s ease-in-out infinite alternate',
                }}
              />

              {/* Subtle top edge fade so the gradient seamlessly vanishes into the pitch black screen */}
              <div className="absolute inset-0 bg-gradient-to-t from-transparent via-[#070b0e]/30 to-[#070b0e]" />
            </div>

            {/* SVG Elastic Curve underneath the curtain (morphs from sag to flat as it lifts off) */}
            {width > 0 && phase === 'exiting' && (
              <svg className="absolute top-0 left-0 w-full h-[calc(100%+350px)] pointer-events-none -z-10">
                <motion.path
                  fill="#070b0e"
                  initial={{ d: initialPath }}
                  animate={{ d: targetPath }}
                  transition={{ duration: 0.75, ease: customEase }}
                />
              </svg>
            )}

            {/* Compiling Studio Card & Skiper 8 Word Preloader */}
            <AnimatePresence>
              {phase === 'loading' && (
                <motion.div
                  key="compiling-card-container"
                  initial={{ opacity: 0, scale: 0.94 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.35, ease: 'easeOut' }}
                  className="relative z-20 w-full max-w-4xl h-[78vh] max-h-[580px] bg-[#fcfcfc] rounded-3xl shadow-[0_35px_100px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col justify-between p-6 sm:p-8 md:p-10 text-slate-900 border border-slate-200/80 mx-4 sm:mx-8"
                >
                  {/* Top Bar Navigation: Mac window controls */}
                  <div className="flex items-center justify-between w-full border-b border-slate-200/80 pb-3.5">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-[#ff5f56] border border-[#e0443e]/50 shadow-xs cursor-pointer" />
                      <span className="w-3 h-3 rounded-full bg-[#ffbd2e] border border-[#dea123]/50 shadow-xs cursor-pointer" />
                      <span className="w-3 h-3 rounded-full bg-[#27c93f] border border-[#1aab29]/50 shadow-xs cursor-pointer" />
                    </div>

                    {/* Skiper 8 Cycling Words Pill */}
                    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs font-mono font-semibold text-emerald-600">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                      <span className="transition-all duration-200">{CRYPTO_WORDS[wordIndex]}</span>
                    </div>
                  </div>

                  {/* Center Dot-Matrix Loading Telemetry */}
                  <div className="flex flex-col md:flex-row items-center justify-between my-auto w-full gap-8">
                    {/* Left: Compiling with cycling three squares loader */}
                    <div className="flex items-center gap-4">
                      <span className="text-2xl sm:text-3xl md:text-4xl font-bold font-mono text-slate-900 tracking-tight">
                        Compiling
                      </span>
                      <ThreeSquaresLoader size={26} />
                    </div>

                    {/* Right: Big Dot-Matrix Counter with bold black digits */}
                    <div className="flex items-center gap-2 sm:gap-3 bg-slate-100/90 px-6 py-5 rounded-2xl border border-slate-200/90 shadow-inner">
                      {digits.map((ch, idx) => (
                        <DotMatrixDigit key={idx} char={ch} dotSize={6} color="#000000" />
                      ))}
                    </div>
                  </div>

                  {/* Bottom Footer Telemetry */}
                  <div className="flex items-center justify-between w-full text-xs font-mono text-slate-400 border-t border-slate-200/80 pt-3.5">
                    <span className="text-slate-500 font-medium">THE SYNTAX UNVEILERS</span>
                    <span className="text-slate-400 hidden sm:inline">END-TO-END ENCRYPTION SIMULATOR</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Keyframe styles for the bottom fluid bubble gradient animation */}
          <style>{`
            @keyframes bubbleWave {
              0% {
                transform: translateY(12px) scale(0.96) rotate(-1deg);
              }
              50% {
                transform: translateY(-8px) scale(1.04) rotate(1deg);
              }
              100% {
                transform: translateY(6px) scale(1.01) rotate(-0.5deg);
              }
            }
            @keyframes bubbleShimmer {
              0% {
                transform: translateX(-4%) scaleY(0.9);
                opacity: 0.65;
              }
              50% {
                transform: translateX(4%) scaleY(1.15);
                opacity: 0.9;
              }
              100% {
                transform: translateX(-2%) scaleY(1);
                opacity: 0.7;
              }
            }
          `}</style>
        </div>
      )}
    </AnimatePresence>
  );
};

export default WordsPreloader;
