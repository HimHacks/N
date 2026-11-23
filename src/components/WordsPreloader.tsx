import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ThreeSquaresLoader } from './ThreeSquaresLoader';
import { SoffitGradient, type SoffitGradientConfig } from './SoffitGradient';
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

const TARGET_WORD = 'Scroll';
const CHAR_POOL = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z','a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z','0','1','2','3','4','5','6','7','8','9'];

// Stable loading label; proper descender padding for "g" and clean layout
const RollDownText: React.FC<{
  text: string;
  isComplete: boolean;
}> = ({ text, isComplete }) => {
  const letters = text.split('');

  return (
    <div className="inline-flex items-center overflow-visible pb-1.5 pt-0.5">
      <AnimatePresence mode="wait">
        {!isComplete ? (
          <motion.div
            key="loading-active"
            className="inline-flex items-center overflow-visible leading-normal"
          >
            {letters.map((char, i) => (
              <motion.span
                key={i}
                className="inline-block text-4xl sm:text-5xl md:text-6xl font-bold text-[#111b21] tracking-tight select-none"
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  display: 'inline-block',
                  lineHeight: '1.25',
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

// Lottery 3-slot sequential character resolver
const LotterySlotChar: React.FC<{
  targetChar: string;
  slotIndex: number;
  totalSlots: number;
  progress: number;
  isComplete: boolean;
}> = ({ targetChar, slotIndex, totalSlots, progress, isComplete }) => {
  const [currentChar, setCurrentChar] = useState<string>(() =>
    CHAR_POOL[(slotIndex * 7) % CHAR_POOL.length]
  );

  // Evenly spaced progressive resolution for all 6 letters (S, c, r, o, l, l):
  // slot 0 ('S'): resolves at 25%
  // slot 1 ('c'): resolves at 42%
  // slot 2 ('r'): resolves at 58%
  // slot 3 ('o'): resolves at 72%
  // slot 4 ('l'): resolves at 86%
  // slot 5 ('l'): resolves at 100%
  const thresholds = [25, 42, 58, 72, 86, 100];
  const lockThreshold = thresholds[slotIndex] ?? 100;

  const isLocked = isComplete || progress >= lockThreshold;

  useEffect(() => {
    if (isLocked) {
      setCurrentChar(targetChar);
      return;
    }

    const interval = setInterval(() => {
      const rand = CHAR_POOL[Math.floor(Math.random() * CHAR_POOL.length)];
      setCurrentChar(rand);
    }, 45 + (slotIndex * 6));

    return () => clearInterval(interval);
  }, [isLocked, targetChar, slotIndex]);

  return (
    <span
      className={`font-terminal-dots inline-block text-center transition-transform duration-75 select-none ${
        isLocked
          ? 'text-[#1a1a1a] scale-100 font-bold'
          : 'text-[#404040] scale-95 opacity-90'
      }`}
      style={{
        width: '1.2ch',
        letterSpacing: '0.04em',
      }}
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
}) => {
  const [progress, setProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const hasFinishedRef = useRef(false);

  // Cinematic pacing loading animation (calm, unhurried, giving gradients time to settle):
  // - 1% to 75%: smooth steady progress (~28ms per tick)
  // - 75% to 92%: noticeably begins slowing down (~68ms per tick)
  // - 92% to 99%: dramatic cinematic deceleration (~140ms per tick)
  // - 99%: deliberate tense pause (~500ms) before snapping into 100%
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
        let delay = 28;
        if (current >= 99) {
          delay = 500; // Dramatic cinematic pause at 99% before popping to 100%
        } else if (current >= 92) {
          delay = 130 + (current - 92) * 18; // Slow down intensely
        } else if (current >= 75) {
          delay = 45 + (current - 75) * 6; // Gradual deceleration
        } else {
          delay = 28; // Steady unhurried initial progress
        }

        timer = setTimeout(step, delay);
      };

      timer = setTimeout(step, 60);

      return () => {
        if (timer) clearTimeout(timer);
      };
    } else if (phase === 'idle') {
      hasFinishedRef.current = false;
      setProgress(0);
      setIsLoaded(false);
    }
  }, [phase, onLoadingComplete]);

  const originX = buttonOrigin ? `${Math.round(buttonOrigin.x)}px` : 'calc(100% - 140px)';
  const originY = buttonOrigin ? `${Math.round(buttonOrigin.y)}px` : 'calc(100% - 70px)';

  // Warping expansion strictly from the clicked button:
  // Starts directly at the button's location in the bottom-right zone,
  // warps and balloons across the website to cover the whole screen,
  // transitioning from completely transparent to Biscotti Cream.
  const clipInitial = `circle(0px at ${originX} ${originY})`;
  const clipMid = `circle(80vw at ${originX} ${originY})`;
  const clipFull = `circle(220vw at ${originX} ${originY})`;

  const customEase = [0.16, 1, 0.3, 1] as const;

  const progressStr = String(Math.min(100, progress)).padStart(3, '0') + '%';
  const digits = progressStr.split('');

  const isVisible = phase !== 'idle';

  // Gradient configuration: thoroughly mixed emerald, cyan, and deep forest green without segregated blocks
  const soffitConfig: SoffitGradientConfig = {
    bgColor: '#00a884',   // WhatsApp primary emerald green
    colorA: '#06b6d4',    // Cyan accent
    colorB: '#059669',    // Vibrant emerald green
    colorC: '#10b981',    // Lush medium green
    colorD: '#022c22',    // Deep forest dark green
    scale: 0.95,
    speed: 0.22,
    tilt: 0.05,
    rock: 0.12,
    horizon: -0.2,
    breathe: 0.35,
    spread: 0.85,
    curve: 3.2,
    direct: 0.75,
    bounce: 0.35,
    bounceCurve: 2.8,
    spillCentre: 0.0,
    spillWidth: 2.4,
    spillFloor: 0.3,
    amount: 0.45,
    warp: 2.8,
    warpScale: 0.8,
    flow: 0.45,
    roughness: 0.4,
    lacunarity: 2.2,
    motes: 0.08,
    moteScale: 8,
    ambient: 0.4,
    contrast: 1.6,
    midpoint: 0.5,
    sink: 0.25,
    glow: 0.55,
    grain: 0,
    grainAnim: 0,
    dither: 0.85,
    vignette: 0.06,
    steer: 0.0,
    lift: 0.1,
    sweep: 0.25,
    cursor: 1,
    parallax: 0.01,
    maxDpr: 1,
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed inset-0 z-[120] pointer-events-auto overflow-hidden select-none">
          <motion.div
            className="fixed inset-0 z-30 flex items-center justify-center overflow-hidden"
            initial={{
              clipPath: clipInitial,
              backgroundColor: 'rgba(239, 234, 226, 0.0)',
            }}
            animate={
              phase === 'expanding'
                ? {
                    clipPath: [clipInitial, clipMid, clipFull],
                    backgroundColor: [
                      'rgba(239, 234, 226, 0.0)',
                      'rgba(239, 234, 226, 0.65)',
                      'rgba(239, 234, 226, 0.96)',
                    ],
                    transition: {
                      clipPath: { duration: 1.25, ease: customEase, times: [0, 0.45, 1] },
                      backgroundColor: { duration: 1.15, ease: 'easeInOut' },
                    },
                  }
                : phase === 'loading'
                ? {
                    clipPath: clipFull,
                    backgroundColor: 'rgba(239, 234, 226, 0.96)',
                  }
                : phase === 'exiting'
                ? {
                    y: '-100vh',
                    transition: { duration: 0.85, ease: [0.76, 0, 0.24, 1] },
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
              Background of the loading page:
              1. Entire screen expands from transparent to authentic WhatsApp Biscotti Cream (#efeae2) with delicate translucency (0.96).
              2. Vibrant Green, Emerald & Cyan fluid ripples rise up smoothly and naturally from the bottom,
                 seamlessly blending into the Biscotti Cream with no harsh border line.
            */}
            <div className="absolute inset-0 pointer-events-none bg-[#efeae2]/96" />

            {/* Cyan, Rich Green & Dark Green fluid background rises up smoothly and blends naturally into the cream */}
            <motion.div
              initial={{ y: '100%', opacity: 0 }}
              animate={
                phase === 'loading'
                  ? { y: '0%', opacity: 1 }
                  : { y: '100%', opacity: 0 }
              }
              transition={{
                duration: 2.4, // Unhurried cinematic glide allowing the fluid ripples to settle
                ease: [0.16, 1, 0.3, 1],
                delay: 0.2,
              }}
              className="absolute inset-0 pointer-events-none overflow-hidden z-10"
              style={{
                // Natural organic fade without a hard line, gently transitioning from bottom up
                maskImage: 'linear-gradient(to top, black 0%, rgba(0,0,0,0.9) 25%, rgba(0,0,0,0.5) 45%, rgba(0,0,0,0.15) 60%, transparent 75%)',
                WebkitMaskImage: 'linear-gradient(to top, black 0%, rgba(0,0,0,0.9) 25%, rgba(0,0,0,0.5) 45%, rgba(0,0,0,0.15) 60%, transparent 75%)',
              }}
            >
              {/* Home page WebGL fluid shader running in background with strong green presence */}
              <div className="absolute inset-0 opacity-60">
                <LumenInteractiveShader />
              </div>

              {/* Soffit Cyan & Green generative fluid ripples */}
              <div className="absolute inset-0 opacity-90">
                <SoffitGradient
                  config={soffitConfig}
                  className="w-full h-full"
                />
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
                  transition={{ duration: 0.3, ease: 'easeOut' }}
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
                    - Bottom Right: Tactile pill indicator (NOT CLICKABLE, no arrow animation)
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
                          boxShadow: '0 2px 2px 0 rgba(0,0,0,0.08), 0 4px 7px 0 rgba(0,0,0,0.2), 0 0.5px 2px 0 rgba(0,0,0,0.15), inset 0 -1px 0.2px 0 rgba(0,0,0,0.12), inset 0 1px 0.2px 0 #ffffff',
                        }}
                      >
                        {/* Dot-matrix letters resolving into 'Scroll' */}
                        <span className="flex items-center text-sm sm:text-base font-normal tracking-wider text-[#1a1a1a]">
                          {TARGET_WORD.split('').map((char, idx) => (
                            <LotterySlotChar
                              key={idx}
                              targetChar={char}
                              slotIndex={idx}
                              totalSlots={TARGET_WORD.length}
                              progress={progress}
                              isComplete={isLoaded}
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
