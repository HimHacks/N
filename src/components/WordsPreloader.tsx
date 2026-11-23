import React, { useState, useEffect } from 'react';
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

// Target word: "Scroll"
const TARGET_WORD = 'Scroll';
const CHAR_POOL = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z','a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z','0','1','2','3','4','5','6','7','8','9'];

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

  const lockThreshold = Math.round(((slotIndex + 1) / totalSlots) * 100);
  const isLocked = isComplete || progress >= lockThreshold;

  useEffect(() => {
    if (isLocked) {
      setCurrentChar(targetChar);
      return;
    }

    const interval = setInterval(() => {
      const rand = CHAR_POOL[Math.floor(Math.random() * CHAR_POOL.length)];
      setCurrentChar(rand);
    }, 28 + (slotIndex * 4));

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

  // Loading animation: ~3.0s total, ticking 1% -> 100%
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
      }, 30);
      return () => clearInterval(interval);
    } else if (phase === 'idle') {
      setProgress(0);
      setIsLoaded(false);
    }
  }, [phase, onLoadingComplete]);

  const originX = buttonOrigin ? `${Math.round(buttonOrigin.x)}px` : '50%';
  const originY = buttonOrigin ? `${Math.round(buttonOrigin.y)}px` : 'calc(100% - 70px)';

  // Organic corner-filling warping animation:
  const initialClip = `ellipse(0px 0px at ${originX} ${originY})`;
  const expandingWarpClip = `ellipse(120vw 100vh at ${originX} ${originY})`;
  const fullCoverClip = `ellipse(220vw 220vh at ${originX} ${originY})`;

  const customEase = [0.16, 1, 0.3, 1] as const;

  const progressStr = String(Math.min(100, progress)).padStart(3, '0') + '%';
  const digits = progressStr.split('');

  const isVisible = phase !== 'idle';

  // Gradient configuration: vibrant cyan and emerald gradients mixed seamlessly with Biscotti Cream
  const soffitConfig: SoffitGradientConfig = {
    bgColor: '#00a884',   // Vibrant emerald base
    colorA: '#00a884',    // WhatsApp primary emerald
    colorB: '#06b6d4',    // Bright Cyan
    colorC: '#22d3ee',    // Electric Cyan
    colorD: '#043e2e',    // Deep dark emerald
    scale: 0.8,
    speed: 0.35,
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
    amount: 0.28,
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
    glow: 0.45,
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
            className="fixed inset-0 z-30 flex items-center justify-center overflow-hidden"
            initial={{
              clipPath: initialClip,
              backgroundColor: 'rgba(239, 234, 226, 0.0)',
            }}
            animate={
              phase === 'expanding'
                ? {
                    clipPath: [initialClip, expandingWarpClip, fullCoverClip],
                    backgroundColor: ['rgba(239, 234, 226, 0.1)', 'rgba(239, 234, 226, 0.6)', '#efeae2'],
                    transition: {
                      clipPath: { duration: 1.05, ease: customEase, times: [0, 0.55, 1] },
                      backgroundColor: { duration: 0.95, ease: 'easeInOut' },
                    },
                  }
                : phase === 'loading'
                ? {
                    clipPath: fullCoverClip,
                    backgroundColor: '#efeae2',
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
              1. Top ~50%: Authentic WhatsApp Biscotti Cream (#efeae2)
              2. Bottom ~50%: Vibrant Cyan, Green, and Dark Green fluid gradient
                 seamlessly feathering up with ZERO sharp cutoff!
            */}
            <div className="absolute inset-0 pointer-events-none bg-[#efeae2]" />

            {/* Bottom 50% Cyan & Green gradient container */}
            <div className="absolute bottom-0 left-0 right-0 h-[52vh] min-h-[380px] pointer-events-none overflow-hidden z-10">
              {/* Home page WebGL fluid shader running in background */}
              <div className="absolute inset-0 opacity-45">
                <LumenInteractiveShader />
              </div>

              {/* Soffit Cyan & Green generative fluid ripples */}
              <div className="absolute inset-0 opacity-90">
                <SoffitGradient
                  config={soffitConfig}
                  className="w-full h-full"
                />
              </div>

              {/* Smooth organic feathered fade into the top Biscotti Cream (zero sharp cutoff line) */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    'linear-gradient(to top, transparent 0%, rgba(239, 234, 226, 0.2) 35%, rgba(239, 234, 226, 0.8) 75%, #efeae2 100%)',
                }}
              />
            </div>

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
                  {/* Top Bar: Clean minimal dividing line (removed GVH 2026 and syntax unveilers) */}
                  <div className="w-full border-b border-[#e9edef] pb-3.5" />

                  {/* Center Loading Telemetry: Space Grotesk font for "Loading" */}
                  <div className="flex flex-col md:flex-row items-center justify-between my-auto w-full gap-8">
                    {/* Left: 'Loading' in Space Grotesk font with ThreeSquaresLoader */}
                    <div className="flex items-center gap-4">
                      <span
                        className="text-4xl sm:text-5xl md:text-6xl font-bold text-[#111b21] tracking-tight leading-none select-none"
                        style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                      >
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
