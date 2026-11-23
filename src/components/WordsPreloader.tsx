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

// Target word: "SCROLL"
const TARGET_WORD = 'SCROLL';
// Upstream spasoje.dev character pool (uppercase alphanumeric)
const CHAR_POOL = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z','0','1','2','3','4','5','6','7','8','9'];

// Individual character slot that scrambles through random characters in place and settles into its target letter
const ScrambleCharInPlace: React.FC<{
  targetChar: string;
  charIndex: number;
  totalChars: number;
  progress: number;
  isComplete: boolean;
}> = ({ targetChar, charIndex, totalChars, progress, isComplete }) => {
  const [currentChar, setCurrentChar] = useState<string>(() =>
    CHAR_POOL[Math.floor(Math.random() * CHAR_POOL.length)]
  );

  useEffect(() => {
    if (isComplete) {
      setCurrentChar(targetChar);
      return;
    }

    // Characters settle sequentially based on progress:
    // e.g. char 0 settles at ~20%, char 1 at ~35%, ..., char 5 at 100%
    const settleThreshold = ((charIndex + 1) / totalChars) * 100;

    if (progress >= settleThreshold) {
      setCurrentChar(targetChar);
      return;
    }

    // Scramble rapidly in its fixed place with subtle jitter
    const interval = setInterval(() => {
      setCurrentChar(CHAR_POOL[Math.floor(Math.random() * CHAR_POOL.length)]);
    }, 55 + (charIndex * 12));

    return () => clearInterval(interval);
  }, [progress, isComplete, targetChar, charIndex, totalChars]);

  const isLocked = isComplete || (progress >= ((charIndex + 1) / totalChars) * 100);

  return (
    <span
      className={`inline-flex items-center justify-center font-mono w-[1ch] transition-colors duration-150 ${
        isLocked
          ? 'text-[#1a1a1a] font-bold'
          : 'text-[#1a1a1a]/70 font-semibold'
      }`}
    >
      {currentChar}
    </span>
  );
};

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

  // WhatsApp signature warm off-white cream (#efeae2 / #f0f2f5) with emerald accents
  const soffitConfig: SoffitGradientConfig = {
    bgColor: '#f0f2f5',
    colorA: '#00a884',
    colorB: '#25d366',
    colorC: '#efeae2',
    colorD: '#06b6d4',
    scale: 0.75,
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

            {/* Studio Card (Loading Screen) - WhatsApp off-white cream aesthetic */}
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
                  {/* Top Bar: Clean minimal header */}
                  <div className="flex items-center justify-between w-full border-b border-[#e9edef] pb-3.5">
                    <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#00a884]">
                      E2EE • PROTOCOL
                    </span>
                    <span className="text-xs font-mono text-[#8696a0]">
                      {progress < 100 ? 'CONNECTING...' : 'CHANNEL ACTIVE'}
                    </span>
                  </div>

                  {/* Center Loading Telemetry: Bootzy TM display font for "Loading" */}
                  <div className="flex flex-col md:flex-row items-center justify-between my-auto w-full gap-8">
                    {/* Left: "Loading" styled with Bootzy TM font and ThreeSquaresLoader */}
                    <div className="flex items-center gap-4">
                      <span className="font-bootzy text-4xl sm:text-5xl md:text-6xl text-[#111b21] tracking-wide leading-none">
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
                    - Bottom Right: spasoje.dev aesthetic button (tactile pill with LED dot)
                      Letters start as random in-place characters and animate in their fixed positions
                      to spell the word "SCROLL".
                  */}
                  <div className="relative flex items-center justify-between w-full border-t border-[#e9edef] pt-4 min-h-[56px]">
                    <span className="text-xs font-mono text-[#667781] hidden sm:inline">
                      END-TO-END ENCRYPTION SIMULATOR
                    </span>

                    {/* Bottom Right: Tactile pill button matching spasoje.dev template */}
                    <div className="relative flex items-center justify-end w-full sm:w-auto">
                      <button
                        onClick={() => {
                          if (isLoaded && onScrollDown) onScrollDown();
                        }}
                        disabled={!isLoaded}
                        className={`group flex items-center rounded-[36px] transition-all duration-300 select-none ${
                          isLoaded ? 'cursor-pointer hover:scale-105 active:scale-95' : 'cursor-default opacity-85'
                        }`}
                        style={{
                          padding: '10px 16px 8px 14px',
                          backgroundColor: '#f2f2f2',
                          boxShadow: '0 2px 2px 0 rgba(0,0,0,0.08), 0 4px 7px 0 rgba(0,0,0,0.2), 0 0.5px 2px 0 rgba(0,0,0,0.15), inset 0 -1px 0.2px 0 rgba(0,0,0,0.12), inset 0 1px 0.2px 0 #ffffff',
                        }}
                      >
                        {/* Spasoje LED Indicator dot: orange/emerald pulsating glow */}
                        <span
                          className={`relative inline-block w-1.5 h-1.5 rounded-full mr-2 mb-0.5 transition-colors duration-300 ${
                            isLoaded ? 'bg-[#ff611b]' : 'bg-[#e0e0e0]'
                          }`}
                        >
                          {isLoaded && (
                            <span className="absolute inset-0 rounded-full bg-[#ff611b] animate-ping opacity-75" />
                          )}
                        </span>

                        {/* In-place scrambling letters spelling out "SCROLL" */}
                        <span className="flex items-center text-[12px] font-mono tracking-wider uppercase text-[#1a1a1a]">
                          {TARGET_WORD.split('').map((char, idx) => (
                            <ScrambleCharInPlace
                              key={idx}
                              targetChar={char}
                              charIndex={idx}
                              totalChars={TARGET_WORD.length}
                              progress={progress}
                              isComplete={isLoaded}
                            />
                          ))}
                        </span>

                        {/* Subtle down arrow glyph */}
                        <span className={`ml-2 text-xs font-bold text-[#1a1a1a] transition-transform duration-300 ${isLoaded ? 'translate-y-0.5 opacity-100' : 'opacity-40'}`}>
                          &darr;
                        </span>
                      </button>
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
