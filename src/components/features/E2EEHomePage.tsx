import React from 'react';
import { E2EEPageBackground } from './E2EEPageBackground';

interface E2EEHomePageProps {
  onNavigateToSimulator: () => void;
}

export const E2EEHomePage: React.FC<E2EEHomePageProps> = ({ onNavigateToSimulator }) => {
  return (
    <E2EEPageBackground preset="whatsapp-iridescent">
      {/* Main Viewport Container */}
      <main className="relative flex min-h-screen flex-col items-center justify-between px-6 py-12">
        {/* Top Spacer / Balance */}
        <div className="w-full h-8" />

        {/* Central Black Rectangle: Contains all text & reading time with zero icons */}
        <div className="w-full max-w-xl rounded-2xl bg-black border border-white/15 p-8 sm:p-10 shadow-2xl shadow-black/80 text-center space-y-4">
          {/* Presenter Line: Solid White, bold and prominent */}
          <p className="text-sm sm:text-base font-bold tracking-widest text-white uppercase">
            The Syntax Unveilers presents
          </p>

          {/* Title: Solid White, clean and crisp, no gradients */}
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
            End-to-End Encryption
          </h1>

          {/* Extremely Shortened Text */}
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal pt-1">
            Messages are encrypted on your device. Only you and the recipient hold the keys.
          </p>

          {/* Reading Time: Minimal clean text, no icons */}
          <div className="pt-3 border-t border-white/10">
            <span className="font-mono text-xs text-slate-400">
              Reading time: 5s
            </span>
          </div>
        </div>

        {/* Bottom Section: Blue Arrow pointing upward from the bottom towards the White Bubble Button */}
        <div className="relative flex flex-col items-center justify-center gap-3 pb-4">
          {/* Chromatic White Bubble Button */}
          <button
            onClick={onNavigateToSimulator}
            className="group relative z-20 flex items-center justify-center rounded-full bg-white px-9 py-3.5 text-sm font-extrabold text-black shadow-[0_10px_35px_rgba(255,255,255,0.3)] ring-2 ring-white/80 transition-all duration-200 hover:scale-105 hover:shadow-[0_15px_45px_rgba(255,255,255,0.45)] active:scale-95 cursor-pointer"
          >
            <span>Let's take a deep dive</span>
          </button>

          {/* Blue Arrow coming from the bottom edge pointing upward towards the bubble button */}
          <div className="flex flex-col items-center animate-bounce">
            <svg
              className="w-6 h-7 text-[#34B7F1]"
              viewBox="0 0 24 28"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="12" y1="26" x2="12" y2="4" />
              <polyline points="5 11 12 4 19 11" />
            </svg>
          </div>
        </div>
      </main>
    </E2EEPageBackground>
  );
};
