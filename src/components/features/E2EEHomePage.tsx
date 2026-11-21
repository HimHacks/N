import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { E2EEPageBackground } from './E2EEPageBackground';

interface E2EEHomePageProps {
  onNavigateToSimulator: () => void;
}

export const E2EEHomePage: React.FC<E2EEHomePageProps> = ({ onNavigateToSimulator }) => {
  // Pop-up delay: button and arrow appear after 6 seconds
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowPopup(true);
    }, 6000); // 6 seconds

    return () => clearTimeout(timer);
  }, []);

  return (
    <E2EEPageBackground preset="whatsapp-iridescent">
      {/* Viewport Layout */}
      <main className="relative flex min-h-screen flex-col items-center justify-center px-6 py-12">
        {/* Floating Typography (No black rectangle container) */}
        <div className="text-center space-y-4 max-w-2xl mx-auto -mt-16">
          {/* Presenter Line: Solid White, bold and prominent */}
          <p className="text-sm sm:text-base font-bold tracking-widest text-white uppercase">
            The Syntax Unveilers presents
          </p>

          {/* Title: End-to-End Encryption with signature green gradient */}
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
            End-to-End{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
              Encryption
            </span>
          </h1>

          {/* Extremely Shortened Text */}
          <p className="text-base sm:text-lg text-slate-200 leading-relaxed font-normal pt-1">
            Messages are encrypted directly on your device. Only you and the recipient hold the keys.
          </p>
        </div>

        {/* Timed Pop-up: Appears after 5-7 seconds at the bottom center */}
        <AnimatePresence>
          {showPopup && (
            <motion.div
              initial={{ y: 80, opacity: 0, scale: 0.9 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 80, opacity: 0, scale: 0.9 }}
              transition={{ type: 'spring', damping: 25, stiffness: 280 }}
              className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2"
            >
              {/* Fully White Chromatic Bubble Button */}
              <button
                onClick={onNavigateToSimulator}
                className="group relative z-20 flex items-center justify-center rounded-full bg-white px-9 py-3.5 text-sm font-extrabold text-black shadow-[0_12px_40px_rgba(255,255,255,0.35)] ring-2 ring-white/90 transition-transform duration-200 hover:scale-105 active:scale-95 cursor-pointer"
              >
                <span>Let's take a deep dive</span>
              </button>

              {/* Stationary, Longer Blue Arrow pointing upwards from the bottom towards the bubble button */}
              <div className="flex flex-col items-center select-none pointer-events-none">
                <svg
                  className="w-8 h-12 text-[#34B7F1]"
                  viewBox="0 0 24 44"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="12" y1="42" x2="12" y2="4" />
                  <polyline points="5 13 12 4 19 13" />
                </svg>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </E2EEPageBackground>
  );
};
