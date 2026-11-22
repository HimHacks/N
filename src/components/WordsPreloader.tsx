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

// Strict Instant Dot-Matrix Digit (Zero animation/transition, immediate digit changes)
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

export const WordsPreloader: React.FC<WordsPreloaderProps> = ({
  phase,
  buttonOrigin,
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
      }, 450);
      return () => clearInterval(interval);
    }
  }, [phase]);

  // Compiling duration: Approximately 6 seconds total (1% -> 100% at ~58ms per tick)
  // This gives the large WebGL2 Soffit gradient plenty of time to expand and bloom from the bottom
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
          }, 500);
        } else {
          setProgress(current);
        }
      }, 58); // 100 ticks * 58ms = ~5.8s + 0.5s settle = ~6.3 seconds total
      return () => clearInterval(interval);
    } else if (phase === 'idle') {
      setProgress(0);
      setWordIndex(0);
    }
  }, [phase, onLoadingComplete]);

  // Button origin coordinates: Strictly at horizontal center (50vw) and bottom of screen (button position)
  // Ensures perfectly symmetric bottom expansion with no sideways/rightward bias
  const originX = buttonOrigin ? `${Math.round(buttonOrigin.x)}px` : '50%';
  const originY = buttonOrigin ? `${Math.round(buttonOrigin.y)}px` : 'calc(100% - 70px)';

  const initialClip = `circle(0px at ${originX} ${originY})`;
  const expandedClip = `circle(160vmax at ${originX} ${originY})`;

  const customEase = [0.76, 0, 0.24, 1] as const;

  const progressStr = String(Math.min(100, progress)).padStart(3, '0') + '%';
  const digits = progressStr.split('');

  const isVisible = phase !== 'idle';

  // WhatsApp-inspired authentic palette:
  // Smooth transition from dark oil-film black -> WhatsApp warm cream/off-white background
  // Soffit gradient with WhatsApp green, teal, and luminous emerald ripples
  const soffitConfig: SoffitGradientConfig = {
    bgColor: '#f0f2f5',   // WhatsApp warm off-white cream base
    colorA: '#00a884',    // WhatsApp primary teal-green
    colorB: '#25d366',    // WhatsApp vibrant green
    colorC: '#06b6d4',    // Electric Cyan highlight
    colorD: '#dcfce7',    // Light mint-cream glint
    scale: 0.65,          // Broad organic ripples
    speed: 0.28,
    tilt: 0.0,            // FLAT horizontal orientation
    rock: 0.06,           // Gentle horizontal undulation
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
          {/*
            Phase 1 (Expanding):
            Starts at the bubble button location at the bottom of the website,
            morphing from the button's black tint (#0c1317) into WhatsApp's warm off-white cream (#f0f2f5),
            expanding outward to cover the entire website.
            Phase 2 (Loading):
            Compiling studio card + 6-second rising flat Soffit gradient in WhatsApp teal/emerald/cyan.
            Phase 3 (Exiting):
            Reverse preloader contracts smoothly back into the bottom button origin, revealing the simulator!
          */}
          <motion.div
            className="fixed inset-0 z-30 flex items-center justify-center"
            initial={{
              clipPath: initialClip,
              backgroundColor: '#0c1317', // Bubble black start
            }}
            animate={
              phase === 'expanding'
                ? {
                    clipPath: expandedClip,
                    backgroundColor: '#efeae2', // WhatsApp signature warm cream (#efeae2)
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
                    backgroundColor: '#0c1317', // Contracts back into black bubble
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
            {/*
              LARGE FLAT SOFFIT WEBGL2 GRADIENT RISING FROM THE BOTTOM:
              Covers 65% of the screen height (h-[65vh]), rising up over 5.2s so it
              slowly and gracefully blooms to full scale in vibrant WhatsApp green, teal, and cyan.
            */}
            <motion.div
              initial={{ y: '100%', opacity: 0 }}
              animate={
                phase === 'loading'
                  ? {
                      y: '0%',
                      opacity: 0.92,
                      transition: { duration: 5.2, ease: [0.16, 1, 0.3, 1] },
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

              {/* Seamless flat top blend into the warm cream background */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    'linear-gradient(to top, transparent 0%, rgba(239, 234, 226, 0.25) 40%, rgba(239, 234, 226, 0.85) 80%, #efeae2 100%)',
                }}
              />
            </motion.div>

            {/* Compiling Studio Card & Skiper 8 Word Preloader in refined WhatsApp theme */}
            <AnimatePresence>
              {phase === 'loading' && (
                <motion.div
                  key="compiling-card-container"
                  initial={{ opacity: 0, scale: 0.94 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.35, ease: 'easeOut' }}
                  className="relative z-20 w-full max-w-4xl h-[78vh] max-h-[580px] bg-white/95 rounded-3xl shadow-[0_30px_90px_rgba(11,20,26,0.18)] overflow-hidden flex flex-col justify-between p-6 sm:p-8 md:p-10 text-slate-900 border border-[#d1d7db]/80 mx-4 sm:mx-8 backdrop-blur-xl"
                >
                  {/* Top Bar Navigation: Mac window controls */}
                  <div className="flex items-center justify-between w-full border-b border-[#e9edef] pb-3.5">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-[#ff5f56] border border-[#e0443e]/50 shadow-xs cursor-pointer" />
                      <span className="w-3 h-3 rounded-full bg-[#ffbd2e] border border-[#dea123]/50 shadow-xs cursor-pointer" />
                      <span className="w-3 h-3 rounded-full bg-[#25d366] border border-[#128c7e]/50 shadow-xs cursor-pointer" />
                    </div>

                    {/* Skiper 8 Cycling Words Pill */}
                    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#f0f2f5] border border-[#d1d7db] text-xs font-mono font-semibold text-[#00a884]">
                      <span className="w-2 h-2 rounded-full bg-[#00a884] animate-ping" />
                      <span className="transition-all duration-200">{CRYPTO_WORDS[wordIndex]}</span>
                    </div>
                  </div>

                  {/* Center Dot-Matrix Loading Telemetry */}
                  <div className="flex flex-col md:flex-row items-center justify-between my-auto w-full gap-8">
                    {/* Left: Compiling with cycling three squares loader */}
                    <div className="flex items-center gap-4">
                      <span className="text-2xl sm:text-3xl md:text-4xl font-bold font-mono text-[#111b21] tracking-tight">
                        Compiling
                      </span>
                      <ThreeSquaresLoader size={26} color="#00a884" />
                    </div>

                    {/* Right: Big Dot-Matrix Counter with instant digit changes */}
                    <div className="flex items-center gap-2 sm:gap-3 bg-[#f0f2f5] px-6 py-5 rounded-2xl border border-[#d1d7db] shadow-inner">
                      {digits.map((ch, idx) => (
                        <InstantDotMatrixDigit key={idx} char={ch} dotSize={6} color="#111b21" />
                      ))}
                    </div>
                  </div>

                  {/* Bottom Footer Telemetry */}
                  <div className="flex items-center justify-between w-full text-xs font-mono text-[#667781] border-t border-[#e9edef] pt-3.5">
                    <span className="text-[#00a884] font-semibold tracking-wide">THE SYNTAX UNVEILERS</span>
                    <span className="text-[#667781] hidden sm:inline">END-TO-END ENCRYPTION SIMULATOR</span>
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
