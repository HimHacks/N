import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ThreeSquaresLoader } from './ThreeSquaresLoader';
import { LumenInteractiveShader } from './features/LumenInteractiveShader';

export type WordPreloaderPhase = 'idle' | 'expanding' | 'loading' | 'exiting';

interface WordsPreloaderProps {
  phase: WordPreloaderPhase;
  buttonOrigin?: { x: number; y: number } | null;
  triggerType?: 'button' | 'scroll';
  scrollFraction?: number; // 0 (hidden at bottom 100%) to 1 (fully loaded 0%)
  isInteractiveScroll?: boolean;
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

// Target word: "SCROLL"
const TARGET_WORD = 'SCROLL';

// Curated high-contrast glyph pool for vertical slot reel spinning
const SLOT_GLYPH_POOL = ['S', 'C', 'R', 'O', 'L', 'A', 'E', 'B', 'M', 'K', 'P', 'T', 'X', 'Z', '8', '3', '0', '9'];

// Strict sequential settling thresholds:
// All 6 letters start rolling simultaneously.
// S rolls and locks in at 26% (leaving 5 letters rolling)
// C rolls and locks in at 44% (leaving 4 letters rolling)
// R rolls and locks in at 62% (leaving 3 letters rolling)
// O rolls and locks in at 78% (leaving 2 letters rolling)
// First L rolls and locks in at 90% (leaving the final L rolling)
// Final L decelerates heavily, pauses through 99%, and settles strictly at 100% on the shared timeline!
const LOCK_THRESHOLDS = [26, 44, 62, 78, 90, 100];

/**
 * Vertical Rolling Physical Slot-Machine Reel Component
 * - All 6 letters roll simultaneously on independent vertical reels from the start.
 * - S rolls and locks into place, while the remaining letters keep rolling.
 * - Next, C rolls and locks into place, while the remaining keep rolling.
 * - Next, R rolls and locks, then O rolls and locks, then the first L rolls and locks.
 * - Finally, the last L decelerates and locks home simultaneously as the progress counter hits 100%.
 * - Each letter rolls smoothly without repeating the final letter twice.
 * - Fixed cell height/width ensures rock-solid stability with zero layout shift.
 */
const VerticalSlotReel: React.FC<{
  targetChar: string;
  slotIndex: number;
  progress: number;
  isLoaded: boolean;
}> = ({ targetChar, slotIndex, progress, isLoaded }) => {
  const threshold = LOCK_THRESHOLDS[slotIndex];
  const isFinal = slotIndex === TARGET_WORD.length - 1;
  const isLocked = isLoaded || progress >= threshold;

  // Single sequential reel strip:
  // Starts with random distinct glyphs and terminates with the targetChar at the end.
  // For the final slot (index 5, target 'L'), penultimate character is 'E' so it rolls visibly through 'E' before settling on 'L'!
  const [tape] = useState<string[]>(() => {
    const list: string[] = [];
    const poolWithoutTarget = SLOT_GLYPH_POOL.filter((g) => g !== targetChar);
    const count = 18 + slotIndex * 4; // Generous length for continuous fluid stepping
    for (let i = 0; i < count; i++) {
      list.push(poolWithoutTarget[(i * 7 + slotIndex * 3) % poolWithoutTarget.length]);
    }
    if (isFinal) {
      // Ensure the penultimate glyph is 'E' so it distinctly rolls through E into L!
      list[list.length - 1] = 'E';
    }
    list.push(targetChar); // Exactly 1 final destination glyph
    return list;
  });

  // Calculate target index on the tape based on progress approaching its lock threshold
  const maxUnlockedIndex = tape.length - 2;
  const progressRatio = Math.min(1, Math.max(0, progress / threshold));
  const computedTargetIndex = isLocked
    ? tape.length - 1
    : Math.min(maxUnlockedIndex, Math.floor(progressRatio * (tape.length - 1)));

  const [tapeIndex, setTapeIndex] = useState(0);

  useEffect(() => {
    if (isLocked) {
      setTapeIndex(tape.length - 1);
      return;
    }

    setTapeIndex((prev) => Math.max(prev, computedTargetIndex));

    let stepSpeed = 46 + (slotIndex % 3) * 6;
    if (isFinal) {
      if (progress >= 99) {
        stepSpeed = 480; // Dramatic slow crawl through 'E' during 99% pause
      } else if (progress >= 92) {
        stepSpeed = 200; // Progressive deceleration
      } else if (progress >= 80) {
        stepSpeed = 100;
      }
    }

    const timer = setInterval(() => {
      setTapeIndex((prev) => {
        if (prev < maxUnlockedIndex) {
          return prev + 1;
        }
        return prev;
      });
    }, stepSpeed);

    return () => clearInterval(timer);
  }, [isLocked, computedTargetIndex, isFinal, slotIndex, maxUnlockedIndex, tape.length, progress]);

  const cellHeight = 22; // Enlarged cell height in px for clear readability
  const cellWidth = 15;  // Enlarged cell width in px

  return (
    <div
      className="relative inline-block overflow-hidden select-none align-middle"
      style={{
        height: `${cellHeight}px`,
        width: `${cellWidth}px`,
      }}
    >
      <motion.div
        animate={{
          y: -tapeIndex * cellHeight,
        }}
        transition={
          isLocked
            ? {
                type: 'spring',
                stiffness: isFinal ? 140 : 320,
                damping: isFinal ? 18 : 22,
                mass: isFinal ? 1.1 : 0.8,
              }
            : {
                duration: isFinal && progress >= 92 ? 0.22 : 0.05,
                ease: 'linear',
              }
        }
        className="flex flex-col items-center"
      >
        {tape.map((ch, idx) => {
          const isAtTarget = idx === tape.length - 1 && isLocked;
          return (
            <div
              key={idx}
              className="flex items-center justify-center font-terminal-dots select-none uppercase tracking-[0.12em] font-extrabold"
              style={{
                height: `${cellHeight}px`,
                width: `${cellWidth}px`,
                fontSize: '15px',
                lineHeight: '22px',
                color: isAtTarget ? '#111b21' : '#444444',
                textShadow: isAtTarget ? '0 0.5px 1.5px rgba(0,0,0,0.35)' : 'none',
                opacity: isAtTarget ? 1 : 0.75,
              }}
            >
              {ch}
            </div>
          );
        })}
      </motion.div>
    </div>
  );
};

export const WordsPreloader: React.FC<WordsPreloaderProps> = ({
  phase,
  buttonOrigin,
  triggerType = 'scroll',
  scrollFraction = 0,
  isInteractiveScroll = false,
  onExpanded,
  onLoadingComplete,
  onExited,
}) => {
  const [progress, setProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const hasFinishedRef = useRef(false);

  const onLoadingCompleteRef = useRef(onLoadingComplete);
  useEffect(() => {
    onLoadingCompleteRef.current = onLoadingComplete;
  }, [onLoadingComplete]);

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
          if (onLoadingCompleteRef.current) onLoadingCompleteRef.current();
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
  }, [phase]);

  // Normalized coordinates in 1000x1000 viewBox:
  // Button origin (bx, by) defaults to bottom-right hotline zone (~860, 920)
  const winW = typeof window !== 'undefined' ? window.innerWidth : 1440;
  const winH = typeof window !== 'undefined' ? window.innerHeight : 900;
  const bx = buttonOrigin ? Math.round((buttonOrigin.x / winW) * 1000) : 860;
  const by = buttonOrigin ? Math.round((buttonOrigin.y / winH) * 1000) : 920;

  // Smooth expanding circular/radial bubble expansion from button origin:
  // Starts directly at (bx, by) with radius 0%, smoothly expands into an encompassing circle (150vmax)
  // covering all four corners simultaneously without any clipping inversion or flipping!
  const originXPercent = buttonOrigin ? Math.round((buttonOrigin.x / winW) * 100) : 50;
  const originYPercent = buttonOrigin ? Math.round((buttonOrigin.y / winH) * 100) : 50;

  const clip0 = `circle(0% at ${originXPercent}% ${originYPercent}%)`;
  const clip1 = `circle(25% at ${originXPercent}% ${originYPercent}%)`;
  const clip2 = `circle(65% at ${originXPercent}% ${originYPercent}%)`;
  const clip3 = `circle(115% at ${originXPercent}% ${originYPercent}%)`;
  const clip4 = `circle(160% at ${originXPercent}% ${originYPercent}%)`;

  const customEase = [0.22, 1, 0.36, 1] as const;

  const progressStr = String(Math.min(100, progress)).padStart(3, '0') + '%';
  const digits = progressStr.split('');

  const isVisible = phase !== 'idle' || isInteractiveScroll;

  // SVG multi-point organic boundary for the advancing biscotti cream surface:
  // Instead of a straight horizontal line or instant edge fill, the crest forms an organically undulating wave
  // with asymmetric peaks and troughs that deform and morph fluidly as the cream advances upward across the viewport.
  // Coordinate system: 0..1000 width, 0..1000 height.
  // baselineY is the leading edge (1000 = bottom, 0 = top).
  const baselineY = isInteractiveScroll && phase === 'idle'
    ? Math.max(0, Math.min(1000, Math.round((1 - scrollFraction) * 1000)))
    : phase === 'expanding'
    ? 0
    : phase === 'loading'
    ? 0
    : 1000;

  // Keyframes for the continuously deforming organic boundary during expansion
  // (Left and right edges do NOT jump; they are pinned to the organic wave contours)
  const wave0 = `M 0 1000 C 180 1000, 320 1000, 500 1000 C 680 1000, 840 1000, 1000 1000 L 1000 1000 L 0 1000 Z`;
  const wave1 = `M 0 780 C 160 720, 290 840, 480 750 C 670 660, 830 790, 1000 730 L 1000 1000 L 0 1000 Z`;
  const wave2 = `M 0 520 C 190 590, 340 440, 520 480 C 700 520, 850 410, 1000 460 L 1000 1000 L 0 1000 Z`;
  const wave3 = `M 0 240 C 170 170, 310 290, 510 210 C 710 130, 860 260, 1000 180 L 1000 1000 L 0 1000 Z`;
  const wave4 = `M 0 0 C 250 0, 500 0, 750 0 C 850 0, 950 0, 1000 0 L 1000 1000 L 0 1000 Z`;

  // Interactive dynamic wave path calculated from current baselineY
  const amp1 = Math.sin(scrollFraction * Math.PI) * 55;
  const amp2 = Math.cos(scrollFraction * Math.PI) * 45;
  const currentInteractiveWave = `M 0 ${Math.min(1000, baselineY + amp1 * 0.4)} C 180 ${Math.max(0, baselineY - amp1)}, 340 ${Math.min(1000, baselineY + amp2)}, 520 ${Math.max(0, baselineY - amp2 * 0.8)} C 700 ${Math.min(1000, baselineY + amp1 * 0.7)}, 860 ${Math.max(0, baselineY - amp2)}, 1000 ${Math.min(1000, baselineY + amp2 * 0.5)} L 1000 1000 L 0 1000 Z`;

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed inset-0 z-[120] pointer-events-auto overflow-hidden select-none">
          {/* 
            ORGANIC BISCOTTI CREAM ADVANCING SURFACE:
            - When scrubbing: continuously morphs along an asymmetric fluid wave contour.
            - When committed: smoothly rolls up with continuous multi-keyframe contour morphing (wave0 -> wave4).
            - No instantaneous filling of left or right edges; cohesive fluid propagation across the entire viewport.
          */}
          <svg
            className="fixed inset-0 z-20 w-full h-full pointer-events-none"
            viewBox="0 0 1000 1000"
            preserveAspectRatio="none"
          >
            {isInteractiveScroll && phase === 'idle' ? (
              <path
                d={currentInteractiveWave}
                fill="#efeae2"
                style={{ transition: 'd 0.08s ease-out' }}
              />
            ) : phase === 'expanding' ? (
              <motion.path
                fill="#efeae2"
                initial={{ d: currentInteractiveWave }}
                animate={{
                  d: [currentInteractiveWave, wave2, wave3, wave4],
                }}
                transition={{
                  duration: 1.25,
                  ease: [0.16, 1, 0.3, 1],
                  times: [0, 0.35, 0.7, 1],
                }}
                onAnimationComplete={() => {
                  if (onExpanded) onExpanded();
                }}
              />
            ) : (
              <path d="M 0 0 L 1000 0 L 1000 1000 L 0 1000 Z" fill="#efeae2" />
            )}
          </svg>

          {/* Full Loading and Exiting Screen */}
          <motion.div
            className="fixed inset-0 z-30 flex items-center justify-center overflow-hidden"
            initial={{ opacity: 0 }}
            animate={
              phase === 'loading'
                ? {
                    opacity: 1,
                    transition: { duration: 0.35, ease: 'easeOut' },
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
              Only appears once cream expansion has completed and phase enters 'loading'!
              Anchored at the bottom at 3/8 height (37.5%) with lively undulating crest.
            */}
            {phase === 'loading' && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-x-0 bottom-0 h-[37.5%] pointer-events-none overflow-hidden z-10"
                style={{
                  maskImage:
                    'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.95) 55%, rgba(0,0,0,0.55) 82%, rgba(0,0,0,0.12) 94%, transparent 100%)',
                  WebkitMaskImage:
                    'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.95) 55%, rgba(0,0,0,0.55) 82%, rgba(0,0,0,0.12) 94%, transparent 100%)',
                }}
              >
                {/* Lively flame-like undulating motion extending the green/emerald fluid shader */}
                <motion.div
                  animate={{
                    y: [0, -20, -6, -28, -12, 0],
                    scaleY: [1, 1.15, 1.05, 1.20, 1.08, 1],
                  }}
                  transition={{
                    duration: 8.0,
                    repeat: Infinity,
                    ease: [0.45, 0.05, 0.55, 0.95],
                  }}
                  className="absolute inset-0 w-full h-[130%] -top-[30%]"
                >
                  <LumenInteractiveShader
                    baseColor={[0.005, 0.150, 0.095]}
                    warmColor={[0.000, 0.680, 0.500]}
                    midColor={[0.050, 0.850, 0.550]}
                    coolColor={[0.020, 0.560, 0.520]}
                    brightness={1.35}
                  />
                </motion.div>
              </motion.div>
            )}

            {/* Studio Card (Loading Screen) - ONLY rendered once transition completes into 'loading' */}
            <AnimatePresence>
              {phase === 'loading' && (
                <motion.div
                  key="loading-card-container"
                  initial={{ opacity: 0, scale: 0.95, y: 16 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
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

                    {/* Bottom Right: Tactile pill indicator with genuine dot-matrix lottery machine for "SCROLL" */}
                    <div className="relative flex items-center justify-end">
                      <div
                        className="group flex items-center rounded-[36px] transition-all duration-300 select-none cursor-default"
                        style={{
                          padding: '10px 18px 8px 18px',
                          backgroundColor: '#f2f2f2',
                          boxShadow:
                            '0 2px 2px 0 rgba(0,0,0,0.08), 0 4px 7px 0 rgba(0,0,0,0.2), 0 0.5px 2px 0 rgba(0,0,0,0.15), inset 0 -1px 0.2px 0 rgba(0,0,0,0.12), inset 0 1px 0.2px 0 #ffffff',
                        }}
                      >
                        {/* Authentic dot-matrix letters rolling on independent vertical slot reels */}
                        <span className="flex items-center tracking-normal text-[#1a1a1a]">
                          {TARGET_WORD.split('').map((char, idx) => (
                            <VerticalSlotReel
                              key={idx}
                              targetChar={char}
                              slotIndex={idx}
                              progress={progress}
                              isLoaded={isLoaded}
                            />
                          ))}
                        </span>
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
