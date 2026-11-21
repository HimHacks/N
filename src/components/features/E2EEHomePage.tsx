import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { E2EEPageBackground } from './E2EEPageBackground';

interface E2EEHomePageProps {
  onNavigateToSimulator: () => void;
}

export const E2EEHomePage: React.FC<E2EEHomePageProps> = ({ onNavigateToSimulator }) => {
  const [isTimedActive, setIsTimedActive] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const dismissTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Timed pop-up logic:
  // After ~5.5s (estimated reading time), the pop-up appears, stays for 4s, and auto-hides.
  useEffect(() => {
    const entranceTimer = setTimeout(() => {
      setIsTimedActive(true);

      // Dismiss after 4 seconds
      dismissTimerRef.current = setTimeout(() => {
        setIsTimedActive(false);
      }, 4000);
    }, 5500);

    return () => {
      clearTimeout(entranceTimer);
      if (dismissTimerRef.current) clearTimeout(dismissTimerRef.current);
    };
  }, []);

  // Show if either the initial 4-second timed window is active OR mouse is hovering in the bottom hot zone
  const showButton = isTimedActive || isHovered;

  return (
    <E2EEPageBackground preset="whatsapp-iridescent">
      {/* Main Viewport Container */}
      <main className="relative flex min-h-screen flex-col items-center justify-center px-6 py-12 select-none">
        {/* Floating Hero Typography — Matches Image 1 */}
        <div className="text-center space-y-4 max-w-2xl mx-auto -mt-12">
          {/* Presenter Line: Solid crisp white */}
          <p className="text-xs sm:text-sm font-bold tracking-widest text-white uppercase">
            The Syntax Unveilers presents
          </p>

          {/* Title: End-to-End Encryption with signature emerald/cyan gradient */}
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
            End-to-End{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
              Encryption
            </span>
          </h1>

          {/* Clean shortened overview */}
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal max-w-xl mx-auto">
            Messages are encrypted directly on your device. Only you and the recipient hold the keys.
          </p>
        </div>

        {/* Subtle 4-Point Star Accent from Image 1 */}
        <div className="fixed bottom-8 right-8 pointer-events-none select-none opacity-25">
          <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z" />
          </svg>
        </div>

        {/* 
          Invisible Hot Zone (Bottom Strip) — Matches Image 2 Architecture
          Spans across the bottom 64px of the screen.
          Hovering anywhere in this zone or directly over the button slides it up into view!
        */}
        <div
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="fixed bottom-0 left-0 right-0 h-24 z-30 flex items-center justify-center"
        >
          <AnimatePresence>
            {showButton && (
              <motion.div
                initial={{ y: 50, opacity: 0, scale: 0.95 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                exit={{ y: 50, opacity: 0, scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 350, damping: 28 }}
                className="mb-6"
              >
                {/* Dark Translucent Frosted Glass Pill Button — Matches Image 1 */}
                <button
                  onClick={onNavigateToSimulator}
                  className="group flex items-center gap-2.5 rounded-full border border-white/20 bg-[#12161a]/85 hover:bg-[#1a2026] px-8 py-3 text-sm font-medium text-white shadow-[0_12px_40px_rgba(0,0,0,0.6)] backdrop-blur-2xl transition-all duration-200 hover:border-white/40 active:scale-95 cursor-pointer"
                >
                  <span>Let's take a deep dive</span>
                  <span className="text-white/80 transition-transform duration-200 group-hover:translate-x-1">
                    &rarr;
                  </span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </E2EEPageBackground>
  );
};
