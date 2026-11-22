import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export type PreloaderPhase = 'idle' | 'closing' | 'initializing' | 'opening';

interface DoubleStairsPreloaderProps {
  phase: PreloaderPhase;
  onClosed?: () => void;
  onOpened?: () => void;
}

// 5x7 dot-matrix font patterns for digits 0-9 and %
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
    [1, 0, 0, 0, 1],
    [0, 1, 1, 1, 0],
  ],
  '%': [
    [1, 1, 0, 0, 1],
    [1, 1, 0, 1, 0],
    [0, 0, 1, 0, 0],
    [0, 1, 0, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 1, 0, 1, 1],
    [1, 0, 0, 1, 1],
  ],
};

const DotMatrixGlyph: React.FC<{ char: string; dotSize?: number; color?: string }> = ({
  char,
  dotSize = 5,
  color = '#111827',
}) => {
  const pattern = DIGIT_PATTERNS[char] || DIGIT_PATTERNS['0'];

  return (
    <div className="grid grid-cols-5 gap-[3px] select-none">
      {pattern.flatMap((row, rIdx) =>
        row.map((active, cIdx) => (
          <div
            key={`${rIdx}-${cIdx}`}
            className="rounded-full transition-opacity duration-150"
            style={{
              width: dotSize,
              height: dotSize,
              backgroundColor: active ? color : 'transparent',
              opacity: active ? 1 : 0,
            }}
          />
        ))
      )}
    </div>
  );
};

export const DoubleStairsPreloader: React.FC<DoubleStairsPreloaderProps> = ({
  phase,
  onClosed,
  onOpened,
}) => {
  const isVisible = phase !== 'idle';
  const isClosingPhase = phase === 'closing' || phase === 'initializing';

  // Progress telemetry (0 to 100%)
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (phase === 'closing' || phase === 'initializing') {
      setProgress(12);
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 98) {
            clearInterval(interval);
            return 100;
          }
          return prev + Math.floor(Math.random() * 16 + 14);
        });
      }, 70);
      return () => clearInterval(interval);
    } else {
      setProgress(0);
    }
  }, [phase]);

  const progressStr = String(Math.min(100, progress)).padStart(3, '0') + '%';
  const digits = progressStr.split('');

  // Framer Motion spring/bezier curve
  const easeCurve = [0.76, 0, 0.24, 1] as const;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="awwwards-preloader-canvas"
          className="fixed inset-0 z-[120] pointer-events-auto overflow-hidden select-none"
          initial={{ opacity: 1 }}
          exit={{ opacity: 1 }}
        >
          {/* 
            Outer Palette Border Canvas:
            Rich WhatsApp Deep Emerald & Mint Mesh (#047857 / #064e3b / #022c22)
            Matches user's website palette exactly (replaces the orange border from Spasoje's demo)
          */}
          <motion.div
            className="absolute inset-0 bg-[#021f18] p-3 sm:p-5 md:p-6 lg:p-8 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Ambient luxury emerald corner glow on the border */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#10b981]/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#2dd4bf]/10 rounded-full blur-3xl pointer-events-none" />

            {/* 
              Main Center Card:
              Clean, bright studio White canvas (#fbfbfb) with rounded corners and drop-shadow,
              animating down/up with the Double Stairs / Curtain Reveal
            */}
            <motion.div
              className="relative w-full h-full bg-[#fbfbfb] rounded-2xl sm:rounded-3xl shadow-[0_25px_70px_rgba(0,0,0,0.45)] overflow-hidden flex flex-col justify-between p-6 sm:p-8 md:p-10 lg:p-12 text-slate-900"
              initial={{ scaleY: 0 }}
              animate={{ scaleY: isClosingPhase ? 1 : 0 }}
              transition={{
                duration: 0.65,
                ease: easeCurve,
              }}
              style={{ originY: isClosingPhase ? 0.5 : 0.5 }}
              onAnimationComplete={() => {
                if (isClosingPhase && onClosed) {
                  onClosed();
                } else if (!isClosingPhase && onOpened) {
                  onOpened();
                }
              }}
            >
              {/* Top Navigation & Credits Header Bar */}
              <div className="flex items-center justify-between w-full text-xs font-mono tracking-wider text-slate-500 uppercase">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="font-semibold text-slate-800">GVH // SECURITY LAB</span>
                </div>
                <div className="hidden sm:flex items-center gap-6 text-[11px] font-medium text-slate-400">
                  <span>E2EE PROTOCOL</span>
                  <span>DIFFIE-HELLMAN</span>
                  <span>QUANTUM-RESISTANT</span>
                </div>
              </div>

              {/* Center Dot-Matrix Loading Telemetry (Spasoje Perovic Awwwards Style) */}
              <div className="flex flex-col md:flex-row items-center justify-between my-auto w-full gap-8">
                {/* Left Side: System Readout & Arrow */}
                <div className="flex flex-col gap-6">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-emerald-600 font-bold uppercase tracking-widest bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200/60">
                      INITIALIZING SIMULATOR...
                    </span>
                  </div>

                  <p className="max-w-xs text-xs font-mono text-slate-500 leading-relaxed uppercase">
                    Loading interactive 3D physics model, capacitive touch matrix, and private session keys.
                  </p>

                  {/* Dot Matrix Directional Arrow */}
                  <div className="flex items-center gap-4 mt-2">
                    <div className="grid grid-cols-5 gap-[3px]">
                      {[
                        [0, 0, 1, 0, 0],
                        [0, 0, 0, 1, 0],
                        [1, 1, 1, 1, 1],
                        [0, 0, 0, 1, 0],
                        [0, 0, 1, 0, 0],
                      ].flatMap((row, r) =>
                        row.map((val, c) => (
                          <div
                            key={`arr-${r}-${c}`}
                            className="w-[4px] h-[4px] rounded-full"
                            style={{
                              backgroundColor: val ? '#059669' : 'transparent',
                            }}
                          />
                        ))
                      )}
                    </div>
                    <span className="text-[11px] font-mono text-slate-400 uppercase tracking-widest">
                      SYSTEM READY
                    </span>
                  </div>
                </div>

                {/* Right Side: Big 5x7 Dot-Matrix Percentage Counter */}
                <div className="flex items-center gap-2 sm:gap-3 bg-slate-100/70 p-4 sm:p-6 rounded-2xl border border-slate-200/80 shadow-inner">
                  {digits.map((ch, idx) => (
                    <DotMatrixGlyph
                      key={idx}
                      char={ch}
                      dotSize={6}
                      color="#0f172a"
                    />
                  ))}
                </div>
              </div>

              {/* Bottom Footer Telemetry */}
              <div className="flex items-center justify-between w-full text-xs font-mono text-slate-400 border-t border-slate-200/80 pt-4">
                <span className="text-slate-500 tracking-wider">THE SYNTAX UNVEILERS</span>
                <span className="text-emerald-600 font-semibold tracking-widest">
                  PROCEEDING TO SIMULATOR &rarr;
                </span>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DoubleStairsPreloader;
