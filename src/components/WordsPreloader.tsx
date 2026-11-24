import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ThreeSquaresLoader } from './ThreeSquaresLoader';
import { LumenInteractiveShader } from './features/LumenInteractiveShader';

export type WordPreloaderPhase = 'idle' | 'expanding' | 'loading' | 'exiting';

interface WordsPreloaderProps {
  phase: WordPreloaderPhase;
  buttonOrigin?: { x: number; y: number } | null;
  onExpanded?: () => void;
  onLoadingComplete?: () => void;
  onExited?: () => void;
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

// Stable loading label with generous descender space so 'g' is never cut off
const RollDownText: React.FC<{
  text: string;
  isComplete: boolean;
}> = ({ text, isComplete }) => {
  const letters = text.split('');

  return (
    <div className="inline-flex items-center overflow-visible pb-3 pt-1">
      <AnimatePresence mode="wait">
        {!isComplete ? (
          <motion.div
            key="loading-active"
            className="inline-flex items-center overflow-visible leading-relaxed"
          >
            {letters.map((char, i) => (
              <motion.span
                key={i}
                className="inline-block text-4xl sm:text-5xl md:text-6xl font-bold text-[#111b21] tracking-tight select-none"
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  display: 'inline-block',
                  lineHeight: '1.35',
                  paddingBottom: '4px',
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.28, delay: i * 0.025 }}
              >
                {char === ' ' ? '\u00A0' : char}
              </motion.span>
            ))}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
};

// Vegas 3-Slot Lottery Sequential Character Resolver for "SCROLL":
// All slots continuously scramble random letters.
// As loading progress advances, slot 0 ('S') locks, then slot 1 ('C'), etc.
// The final letter ('L') begins slowing down dramatically like the last reel of a lottery machine,
// pauses suspensefully at 99% ("cheating the letters slowly"), and snaps to 'L' simultaneously when 100% hits!
const TARGET_WORD = 'SCROLL';
const CHAR_POOL = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'.split('');
const LOCK_THRESHOLDS = [18, 36, 54, 72, 88, 100];

const ScrollLotteryMachine: React.FC<{ progress: number; isLoaded: boolean }> = ({
  progress,
  isLoaded,
}) => {
  const [chars, setChars] = useState<string[]>(() =>
    TARGET_WORD.split('').map((_, i) => CHAR_POOL[(i * 7) % CHAR_POOL.length])
  );

  const progressRef = useRef(progress);
  progressRef.current = progress;
  const isLoadedRef = useRef(isLoaded);
  isLoadedRef.current = isLoaded;

  useEffect(() => {
    let animId: number;
    let lastTick = performance.now();
    const slotTimers = [0, 0, 0, 0, 0, 0];

    const loop = (now: number) => {
      const dt = now - lastTick;
      lastTick = now;
      const curProg = progressRef.current;
      const loaded = isLoadedRef.current;

      setChars((prev) => {
        let changed = false;
        const next = [...prev];

        for (let i = 0; i < TARGET_WORD.length; i++) {
          const target = TARGET_WORD[i];
          const threshold = LOCK_THRESHOLDS[i];
          const isFinal = i === TARGET_WORD.length - 1;

          // If reached threshold or finished, lock permanently to target character
          if (loaded || curProg >= threshold) {
            if (next[i] !== target) {
              next[i] = target;
              changed = true;
            }
            continue;
          }

          // Compute slot cycle speed:
          let speed = 40; // Default fast slot spin
          if (isFinal) {
            // Final 'L' slot decelerates dramatically like the last reel of a lottery machine:
            if (curProg >= 99) {
              speed = 520; // Suspense pause at 99%, sluggishly crawling
            } else if (curProg >= 92) {
              speed = 300; // Noticeably slow
            } else if (curProg >= 85) {
              speed = 160; // Decelerating
            } else {
              speed = 45;
            }
          }

          slotTimers[i] += dt;
          if (slotTimers[i] >= speed) {
            slotTimers[i] = 0;
            const rand = CHAR_POOL[Math.floor(Math.random() * CHAR_POOL.length)];
            next[i] = rand;
            changed = true;
          }
        }

        return changed ? next : prev;
      });

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <div className="flex items-center text-sm sm:text-base font-mono tracking-wider">
      {chars.map((ch, idx) => {
        const isLocked = isLoaded || progress >= LOCK_THRESHOLDS[idx];
        return (
          <span
            key={idx}
            className={`inline-block text-center select-none transition-all duration-150 ${
              isLocked
                ? 'text-[#111b21] font-bold scale-100'
                : 'text-[#667781] font-normal scale-95 opacity-80'
            }`}
            style={{ width: '1.25ch' }}
          >
            {ch}
          </span>
        );
      })}
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
  const [progress, setProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const hasFinishedRef = useRef(false);

  // Cinematic pacing loading animation (calm, unhurried, giving fluid ripples time to rise):
  // - 1% to 75%: smooth steady progress (~30ms per tick)
  // - 75% to 92%: begins slowing down noticeably (~75ms per tick)
  // - 92% to 98%: decelerates heavily (~160ms per tick)
  // - 99%: deliberate suspense pause (~600ms) before snapping into 100%
  useEffect(() => {
    if (phase === 'loading') {
      if (hasFinishedRef.current) return;
      setIsLoaded(false);
      setProgress(1);
      let current = 1;
      let timer: ReturnType<typeof setTimeout> | null = null;

      const step = () => {
        current += 1;
        if (current >= 100) {
          current = 100;
          setProgress(100);
          setIsLoaded(true);
          hasFinishedRef.current = true;
          if (onLoadingComplete) onLoadingComplete();
          return;
        }

        setProgress(current);

        // Compute delay based on cinematic curve
        let delay = 30;
        if (current >= 99) {
          delay = 600; // Dramatic cinematic pause at 99% before popping to 100%
        } else if (current >= 92) {
          delay = 140 + (current - 92) * 20; // Slow down intensely
        } else if (current >= 75) {
          delay = 45 + (current - 75) * 6; // Gradual deceleration
        } else {
          delay = 30; // Steady unhurried initial progress
        }

        timer = setTimeout(step, delay);
      };

      timer = setTimeout(step, 80);

      return () => {
        if (timer) clearTimeout(timer);
      };
    } else if (phase === 'idle') {
      hasFinishedRef.current = false;
      setProgress(0);
      setIsLoaded(false);
    }
  }, [phase, onLoadingComplete]);

  // Compute normalized button origin coordinates for the warping animation
  const winW = typeof window !== 'undefined' ? window.innerWidth : 1440;
  const winH = typeof window !== 'undefined' ? window.innerHeight : 900;
  const bx = buttonOrigin ? Math.round((buttonOrigin.x / winW) * 1000) : 850;
  const by = buttonOrigin ? Math.round((buttonOrigin.y / winH) * 1000) : 900;

  // Mathematically smooth 4-phase SVG cubic Bezier curve warping:
  // Starts strictly at the clicked button (bx, by).
  // Phase 1: Surges down to bottom edge and spreads along bottom towards the left edge first!
  // Phase 2: Wraps up around the left edge to the top and sweeps across the page.
  // Phase 3: Finally fills in and seals the bottom-right corner!
  const pathInitial = `M ${bx} ${by - 2} C ${bx + 1} ${by - 2}, ${bx + 2} ${by - 1}, ${bx + 2} ${by} C ${bx + 2} ${by + 1}, ${bx + 1} ${by + 2}, ${bx} ${by + 2} C ${bx - 1} ${by + 2}, ${bx - 2} ${by + 1}, ${bx - 2} ${by} C ${bx - 2} ${by - 1}, ${bx - 1} ${by - 2}, ${bx} ${by - 2} Z`;
  const pathStage1Edges = `M ${bx - 50} 600 C 250 500, 0 650, 0 850 C 0 980, 200 1000, 600 1000 C 850 1000, ${bx} 980, ${bx} 900 C ${bx} 800, ${bx} 700, ${bx - 50} 600 Z`;
  const pathStage2WarpAround = `M 0 0 C 450 0, 850 0, 1000 0 C 1000 350, 1000 650, 920 720 C 780 780, 750 950, 500 1000 C 200 1000, 0 1000, 0 800 C 0 500, 0 250, 0 0 Z`;
  const pathFull = `M 0 0 C 350 0, 650 0, 1000 0 C 1000 350, 1000 650, 1000 1000 C 650 1000, 350 1000, 0 1000 C 0 650, 0 350, 0 0 Z`;

  const customEase = [0.22, 1, 0.36, 1] as const;

  const progressStr = String(Math.min(100, progress)).padStart(3, '0') + '%';
  const digits = progressStr.split('');

  const isVisible = phase !== 'idle';

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed inset-0 z-[120] pointer-events-auto overflow-hidden select-none">
          {/* Expanding Warping Biscotti Cream Curtain */}
          {phase === 'expanding' && (
            <svg
              className="fixed inset-0 z-20 w-full h-full pointer-events-none"
              viewBox="0 0 1000 1000"
              preserveAspectRatio="none"
            >
              <motion.path
                fill="#efeae2"
                initial={{ d: pathInitial, opacity: 0 }}
                animate={{
                  d: [pathInitial, pathStage1Edges, pathStage2WarpAround, pathFull],
                  opacity: [0, 0.65, 0.92, 0.98],
                }}
                transition={{
                  d: {
                    duration: 2.0,
                    ease: customEase,
                    times: [0, 0.35, 0.72, 1],
                  },
                  opacity: {
                    duration: 1.8,
                    ease: 'easeInOut',
                  },
                }}
                onAnimationComplete={() => {
                  if (onExpanded) onExpanded();
                }}
              />
            </svg>
          )}

          {/* Full Loading and Exiting Screen */}
          <motion.div
            className="fixed inset-0 z-30 flex items-center justify-center overflow-hidden bg-[#efeae2]"
            initial={{
              opacity: phase === 'expanding' ? 0 : 1,
            }}
            animate={
              phase === 'loading'
                ? {
                    opacity: 1,
                  }
                : phase === 'exiting'
                ? {
                    y: '-100vh',
                    transition: { duration: 0.85, ease: [0.76, 0, 0.24, 1] },
                  }
                : { opacity: 0 }
            }
            onAnimationComplete={() => {
              if (phase === 'exiting' && onExited) {
                onExited();
              }
            }}
          >
            {/* 
              Background of the loading page:
              1. Base is authentic WhatsApp Biscotti Cream (#efeae2).
              2. Animated Cyan, Vibrant Emerald & Deep Green fluid ripples from the home page (LumenInteractiveShader).
                 Rises slowly and smoothly from the bottom to strictly 3/8 height (37.5%).
                 NO static dark green non-animated layer!
            */}
            <motion.div
              initial={{ y: '100%', opacity: 0 }}
              animate={
                phase === 'loading'
                  ? { y: '0%', opacity: 1 }
                  : { y: '100%', opacity: 0 }
              }
              transition={{
                duration: 3.0, // Slow, calm, unhurried animation so the fluid ripples rise smoothly
                ease: [0.16, 1, 0.3, 1],
                delay: 0.1,
              }}
              className="absolute inset-x-0 bottom-0 h-[37.5%] pointer-events-none overflow-hidden z-10"
              style={{
                // Strictly 3/8 height ratio (37.5%) with soft organic top mask feathering into Biscotti Cream (#efeae2)
                maskImage:
                  'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.92) 50%, rgba(0,0,0,0.45) 80%, rgba(0,0,0,0.1) 94%, transparent 100%)',
                WebkitMaskImage:
                  'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.92) 50%, rgba(0,0,0,0.45) 80%, rgba(0,0,0,0.1) 94%, transparent 100%)',
              }}
            >
              <div className="absolute inset-0 w-full h-full">
                <LumenInteractiveShader />
              </div>
            </motion.div>

            {/* Studio Card (Loading Screen) - WhatsApp off-white cream aesthetic */}
            <AnimatePresence>
              {phase === 'loading' && (
                <motion.div
                  key="loading-card-container"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.35, ease: 'easeOut' }}
                  className="relative z-20 w-full max-w-4xl h-[78vh] max-h-[580px] bg-white/95 rounded-3xl shadow-[0_30px_90px_rgba(11,20,26,0.18)] overflow-hidden flex flex-col justify-between p-6 sm:p-8 md:p-10 text-slate-900 border border-[#d1d7db]/80 mx-4 sm:mx-8 backdrop-blur-xl"
                >
                  {/* Center Loading Telemetry: Space Grotesk font for "Loading" with calm roll down exit */}
                  <div className="flex flex-col md:flex-row items-center justify-between my-auto w-full gap-8">
                    {/* Left: 'Loading' animated with calm roll down exit when 100% reached */}
                    <div className="flex items-center gap-4 min-h-[64px]">
                      <RollDownText text="Loading" isComplete={isLoaded} />
                      <AnimatePresence>
                        {!isLoaded && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.6, y: 16 }}
                            transition={{ duration: 0.4 }}
                          >
                            <ThreeSquaresLoader size={28} />
                          </motion.div>
                        )}
                      </AnimatePresence>
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
                    - Left: Retained "END-TO-END ENCRYPTION SIMULATOR"
                    - Bottom Right: Tactile pill indicator with sequential lottery machine for "SCROLL"
                  */}
                  <div className="relative flex items-center justify-between w-full border-t border-[#e9edef] pt-4 min-h-[56px]">
                    <span className="text-xs font-mono text-[#667781] tracking-wide select-none">
                      END-TO-END ENCRYPTION SIMULATOR
                    </span>

                    {/* Bottom Right: Clean tactile informational pill (not clickable, no arrow) */}
                    <div className="relative flex items-center justify-end">
                      <div
                        className="flex items-center rounded-[36px] transition-all duration-200 select-none cursor-default"
                        style={{
                          padding: '10px 22px 8px 22px',
                          backgroundColor: '#f2f2f2',
                          boxShadow:
                            '0 2px 2px 0 rgba(0,0,0,0.08), 0 4px 7px 0 rgba(0,0,0,0.2), 0 0.5px 2px 0 rgba(0,0,0,0.15), inset 0 -1px 0.2px 0 rgba(0,0,0,0.12), inset 0 1px 0.2px 0 #ffffff',
                        }}
                      >
                        {/* Dot-matrix lottery machine resolving sequentially into 'SCROLL' */}
                        <ScrollLotteryMachine progress={progress} isLoaded={isLoaded} />
                      </div>
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
