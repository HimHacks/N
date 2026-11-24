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

// 5x7 Dot-matrix glyph definitions for loading counter digits
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

// 5x7 Dot-matrix glyph definitions for authentic circular dot typography
// Specifically crafted to match the user's reference image (discrete circular dots in 5x7 grid)
const LETTER_DOT_PATTERNS: Record<string, number[][]> = {
  S: [
    [0, 1, 1, 1, 1],
    [1, 0, 0, 0, 0],
    [1, 0, 0, 0, 0],
    [0, 1, 1, 1, 0],
    [0, 0, 0, 0, 1],
    [0, 0, 0, 0, 1],
    [1, 1, 1, 1, 0],
  ],
  C: [
    [0, 1, 1, 1, 0],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 0],
    [1, 0, 0, 0, 0],
    [1, 0, 0, 0, 0],
    [1, 0, 0, 0, 1],
    [0, 1, 1, 1, 0],
  ],
  R: [
    [1, 1, 1, 1, 0],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 1, 1, 1, 0],
    [1, 0, 1, 0, 0],
    [1, 0, 0, 1, 0],
    [1, 0, 0, 0, 1],
  ],
  O: [
    [0, 1, 1, 1, 0],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [0, 1, 1, 1, 0],
  ],
  L: [
    [1, 0, 0, 0, 0],
    [1, 0, 0, 0, 0],
    [1, 0, 0, 0, 0],
    [1, 0, 0, 0, 0],
    [1, 0, 0, 0, 0],
    [1, 0, 0, 0, 0],
    [1, 1, 1, 1, 1],
  ],
  P: [
    [1, 1, 1, 1, 0],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 1, 1, 1, 0],
    [1, 0, 0, 0, 0],
    [1, 0, 0, 0, 0],
    [1, 0, 0, 0, 0],
  ],
  A: [
    [0, 1, 1, 1, 0],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 1, 1, 1, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
  ],
  B: [
    [1, 1, 1, 1, 0],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 1, 1, 1, 0],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 1, 1, 1, 0],
  ],
  E: [
    [1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0],
    [1, 0, 0, 0, 0],
    [1, 1, 1, 1, 0],
    [1, 0, 0, 0, 0],
    [1, 0, 0, 0, 0],
    [1, 1, 1, 1, 1],
  ],
  K: [
    [1, 0, 0, 0, 1],
    [1, 0, 0, 1, 0],
    [1, 0, 1, 0, 0],
    [1, 1, 0, 0, 0],
    [1, 0, 1, 0, 0],
    [1, 0, 0, 1, 0],
    [1, 0, 0, 0, 1],
  ],
  T: [
    [1, 1, 1, 1, 1],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
  ],
  U: [
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [0, 1, 1, 1, 0],
  ],
  X: [
    [1, 0, 0, 0, 1],
    [0, 1, 0, 1, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 1, 0, 1, 0],
    [1, 0, 0, 0, 1],
  ],
  Z: [
    [1, 1, 1, 1, 1],
    [0, 0, 0, 0, 1],
    [0, 0, 0, 1, 0],
    [0, 0, 1, 0, 0],
    [0, 1, 0, 0, 0],
    [1, 0, 0, 0, 0],
    [1, 1, 1, 1, 1],
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
            className="rounded-full"
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

// Dot-Matrix Letter component rendering genuine circular dots (as shown in user reference image)
const DotMatrixLetter: React.FC<{
  char: string;
  isLocked: boolean;
  dotSize?: number;
}> = ({ char, isLocked, dotSize = 1.5 }) => {
  const pattern =
    LETTER_DOT_PATTERNS[char] ||
    DIGIT_PATTERNS[char] ||
    LETTER_DOT_PATTERNS['S'];

  return (
    <div
      className="inline-grid gap-[1.5px] p-[1px] select-none"
      style={{
        gridTemplateColumns: `repeat(5, ${dotSize}px)`,
        gridTemplateRows: `repeat(7, ${dotSize}px)`,
      }}
    >
      {pattern.flatMap((row, r) =>
        row.map((on, c) => (
          <div
            key={`${r}-${c}`}
            className="rounded-full"
            style={{
              width: dotSize,
              height: dotSize,
              backgroundColor: on
                ? isLocked
                  ? '#111b21'
                  : '#4b5563'
                : 'transparent',
              opacity: on ? 1 : 0,
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

// Single-Roll Vegas 3-Slot Reel Sequences for "SCROLL":
// As requested: each letter on the word "SCROLL" rolls only once, step-by-step,
// and that once is where the animation stops for each and every letter!
// - Slot 0: rolls to 'S' and stops.
// - Slot 1: rolls to 'C' and stops.
// - Slot 2: rolls to 'R' and stops.
// - Slot 3: rolls to 'O' and stops.
// - Slot 4: rolls to 'L' and stops.
// - Slot 5 (the last 'L'): decelerates cleanly and rolls to 'L' exactly once at 100%!
const TARGET_WORD = 'SCROLL';
const SLOT_REELS: string[][] = [
  ['P', 'B', 'S'],           // Slot 0 -> resolves to 'S'
  ['A', 'K', 'C'],           // Slot 1 -> resolves to 'C'
  ['E', 'T', 'R'],           // Slot 2 -> resolves to 'R'
  ['U', 'X', 'O'],           // Slot 3 -> resolves to 'O'
  ['Z', 'E', 'L'],           // Slot 4 -> resolves to 'L'
  ['P', 'A', 'K', 'T', 'L'], // Slot 5 -> slows down, rolls once to 'L'
];

const LOCK_THRESHOLDS = [18, 36, 54, 72, 88, 100];

const ScrollLotteryMachine: React.FC<{ progress: number; isLoaded: boolean }> = ({
  progress,
  isLoaded,
}) => {
  const [chars, setChars] = useState<string[]>(() =>
    SLOT_REELS.map((reel) => reel[0])
  );

  const progressRef = useRef(progress);
  progressRef.current = progress;
  const isLoadedRef = useRef(isLoaded);
  isLoadedRef.current = isLoaded;

  useEffect(() => {
    let animId: number;
    let lastTick = performance.now();
    const reelIndices = [0, 0, 0, 0, 0, 0];
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
          const reel = SLOT_REELS[i];
          const targetChar = TARGET_WORD[i];
          const threshold = LOCK_THRESHOLDS[i];
          const isFinal = i === TARGET_WORD.length - 1;

          // If reached threshold or loaded, lock to final target character
          if (loaded || curProg >= threshold) {
            if (next[i] !== targetChar) {
              next[i] = targetChar;
              reelIndices[i] = reel.length - 1;
              changed = true;
            }
            continue;
          }

          // If the slot has already completed its single roll to the penultimate letter, wait for threshold
          if (reelIndices[i] >= reel.length - 1) {
            continue;
          }

          // Step cadence: each letter advances along its reel only once
          let stepDelay = 80;
          if (isFinal) {
            // Final reel slows down heavily on its single roll
            if (curProg >= 95) {
              stepDelay = 450;
            } else if (curProg >= 85) {
              stepDelay = 260;
            } else {
              stepDelay = 140;
            }
          }

          slotTimers[i] += dt;
          if (slotTimers[i] >= stepDelay) {
            slotTimers[i] = 0;
            // Advance by 1 step only (never loop backwards or duplicate)
            if (reelIndices[i] < reel.length - 2) {
              reelIndices[i] += 1;
              next[i] = reel[reelIndices[i]];
              changed = true;
            }
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
    <div className="flex items-center gap-1 sm:gap-1.5">
      {chars.map((ch, idx) => {
        const isLocked = isLoaded || progress >= LOCK_THRESHOLDS[idx];
        return (
          <DotMatrixLetter
            key={idx}
            char={ch}
            isLocked={isLocked}
            dotSize={2.0}
          />
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

  // Cinematic pacing loading animation (calm, unhurried):
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
  const bx = buttonOrigin ? Math.round((buttonOrigin.x / winW) * 1000) : 840;
  const by = buttonOrigin ? Math.round((buttonOrigin.y / winH) * 1000) : 900;

  // Exact warping flow requested by user:
  // 1. Expands from button to the nearest edges (right side and bottom side).
  // 2. Then fully expands across the rest of the website to other corners.
  // 3. Specifically, the right-bottom corner gets filled last!
  // 4. Smooth continuous morphing without any rectangle snapping.
  const pathInitial = `M ${bx} ${by - 4} C ${bx + 4} ${by - 4}, ${bx + 4} ${by + 4}, ${bx} ${by + 4} C ${bx - 4} ${by + 4}, ${bx - 4} ${by - 4}, ${bx} ${by - 4} C ${bx + 4} ${by - 4}, ${bx + 4} ${by + 4}, ${bx} ${by + 4} C ${bx - 4} ${by + 4}, ${bx - 4} ${by - 4}, ${bx} ${by - 4} Z`;

  // Stage 1: Hits the nearest edges (right side x=1000, and bottom side y=1000) while holding back corner (1000, 1000)
  const pathNearestEdges = `M ${bx - 120} ${by - 180} C 960 ${by - 120}, 1000 ${by - 80}, 1000 ${by} C 1000 ${by + 60}, 940 920, 920 920 C 920 920, ${bx + 40} 1000, ${bx} 1000 C ${bx - 80} 1000, ${bx - 180} 960, ${bx - 120} ${by - 180} Z`;

  // Stage 2: Sweeps across the entire website (top-right, top-left, bottom-left), keeping bottom-right corner concave
  const pathSweepWholeSite = `M 0 0 C 450 0, 850 0, 1000 0 C 1000 350, 1000 650, 930 780 C 850 860, 880 940, 780 1000 C 450 1000, 0 1000, 0 1000 C 0 650, 0 350, 0 0 Z`;

  // Stage 3: Finally fills and seals the right-bottom corner last!
  const pathCornerFilledLast = `M 0 0 C 450 0, 850 0, 1000 0 C 1000 350, 1000 650, 1000 1000 C 650 1000, 350 1000, 0 1000 C 0 650, 0 350, 0 0 Z`;

  const customEase = [0.25, 1, 0.35, 1] as const;

  const progressStr = String(Math.min(100, progress)).padStart(3, '0') + '%';
  const digits = progressStr.split('');

  const isVisible = phase !== 'idle';

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed inset-0 z-[120] pointer-events-auto overflow-hidden select-none">
          {/* 
            Expanding Warping Biscotti Cream Curtain:
            Begins at the button, warps first to nearest edges (right & bottom),
            sweeps across the site, and seals the bottom-right corner last!
          */}
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
                  d: [pathInitial, pathNearestEdges, pathSweepWholeSite, pathCornerFilledLast],
                  opacity: [0, 0.75, 0.95, 1],
                }}
                transition={{
                  d: {
                    duration: 2.1,
                    ease: customEase,
                    times: [0, 0.28, 0.68, 1],
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
              Loading page background:
              Base is authentic WhatsApp Biscotti Cream (#efeae2).
              The animated fluid gradient (cyan, deep emerald, and light green with WhatsApp bubble mint highlights)
              lives at the bottom covering strictly 3/8 of the screen (37.5%), with rich organic movement!
            */}
            <motion.div
              initial={{ y: '100%', opacity: 0 }}
              animate={
                phase === 'loading'
                  ? {
                      y: '0%',
                      opacity: 1,
                    }
                  : { y: '100%', opacity: 0 }
              }
              transition={{
                duration: 2.8,
                ease: [0.16, 1, 0.3, 1],
                delay: 0.1,
              }}
              className="absolute inset-x-0 bottom-0 h-[37.5%] pointer-events-none overflow-hidden z-10"
              style={{
                // Strictly 3/8 height ratio (37.5%) with soft feathered top mask blending into Biscotti Cream (#efeae2)
                maskImage:
                  'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.95) 55%, rgba(0,0,0,0.55) 82%, rgba(0,0,0,0.12) 94%, transparent 100%)',
                WebkitMaskImage:
                  'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.95) 55%, rgba(0,0,0,0.55) 82%, rgba(0,0,0,0.12) 94%, transparent 100%)',
              }}
            >
              {/* Organic lively breathing expansion to give depth and fluid life */}
              <motion.div
                animate={{
                  scale: [1, 1.05, 1],
                  x: [0, 15, -15, 0],
                  y: [0, -8, 4, 0],
                }}
                transition={{
                  duration: 12,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="absolute inset-0 w-full h-full"
              >
                <LumenInteractiveShader />
              </motion.div>
            </motion.div>

            {/* Studio Card (Loading Screen) - Floating WhatsApp off-white cream aesthetic */}
            <AnimatePresence>
              {phase === 'loading' && (
                <motion.div
                  key="loading-card-container"
                  initial={{ opacity: 0, scale: 0.95, y: 12 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="relative z-20 w-full max-w-4xl h-[78vh] max-h-[580px] bg-white/95 rounded-3xl shadow-[0_30px_90px_rgba(11,20,26,0.22)] overflow-hidden flex flex-col justify-between p-6 sm:p-8 md:p-10 text-slate-900 border border-[#d1d7db]/80 mx-4 sm:mx-8 backdrop-blur-xl"
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
                    - Bottom Right: Tactile pill indicator with genuine dot-matrix lottery machine for "SCROLL"
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
                        {/* Dot-matrix lottery machine resolving sequentially into circular-dot 'SCROLL' */}
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
