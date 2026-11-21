import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { E2EEPageBackground } from './E2EEPageBackground';
import { SoapBubbleButton, SoapBubbleMaterial } from '../soap-bubble';

interface E2EEHomePageProps {
  onNavigateToSimulator: () => void;
}

export const E2EEHomePage: React.FC<E2EEHomePageProps> = ({ onNavigateToSimulator }) => {
  const pageRef = useRef<HTMLDivElement>(null);
  const [isTimedActive, setIsTimedActive] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const dismissTimerRef = useRef<NodeJS.Timeout | null>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Timed pop-up logic:
  // After ~5.5s (estimated reading time), the pop-up appears, stays for 4s, and auto-dismisses smoothly.
  useEffect(() => {
    const entranceTimer = setTimeout(() => {
      setIsTimedActive(true);

      // Auto-dismiss after 4 seconds
      dismissTimerRef.current = setTimeout(() => {
        setIsTimedActive(false);
      }, 4000);
    }, 5500);

    return () => {
      clearTimeout(entranceTimer);
      if (dismissTimerRef.current) clearTimeout(dismissTimerRef.current);
      if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    };
  }, []);

  // Calm hover handlers with gentle debounce so it doesn't trigger jittery re-animations
  const handleMouseEnter = () => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setIsHovered(false);
    }, 350);
  };

  // Show if either the initial timed window is active OR mouse is hovering in the bottom hot zone
  const showButton = isTimedActive || isHovered;

  return (
    <E2EEPageBackground preset="whatsapp-iridescent">
      {/* Main Viewport Container */}
      <main
        ref={pageRef}
        className="relative flex min-h-screen flex-col items-center justify-center px-6 py-12 select-none"
      >
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

        {/* 
          Invisible Hot Zone (Bottom Strip) — Matches Image 2 Architecture
          Spans across the bottom 80px of the screen.
          Hovering anywhere in this zone or directly over the button smoothly slides it into view.
        */}
        <div
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className="fixed bottom-0 left-0 right-0 h-24 z-30 flex items-center justify-center pointer-events-auto"
        >
          <AnimatePresence>
            {showButton && (
              <motion.div
                initial={{ y: 14, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 12, opacity: 0 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="mb-6 pointer-events-auto"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                {/* 
                  ReactDrops SoapBubbleButton:
                  - Dark obsidian glass (slightly less tinted black, not grey)
                  - Clearly noticeable bubble membrane with smooth thin-film swirl on the border
                  - Zero dispersion to prevent color disorientation / chromatic fringe
                  - Calm wobble (0.08) so it doesn't over-respond to mouse
                */}
                <SoapBubbleMaterial
                  backdrop={pageRef}
                  glass={0.95}
                  iridescence={0.85}
                  dispersion={0}
                  oilOpacity={0.85}
                  oilCoverage={0.92}
                  oilEdge={16}
                  oilEdgeFade={1.2}
                  clearCenter={0.65}
                  thickness={480}
                  drainage={0.2}
                  swirl={0.35}
                  speed={0.65}
                  wobble={0.08}
                  reflectivity={1.25}
                  refraction={0.12}
                  bevel={14}
                  windowIntensity={1.05}
                  tint="rgba(14, 18, 24, 0.72)"
                  soapHighlightColor="rgba(255, 255, 255, 0.95)"
                  environment="studio"
                >
                  <SoapBubbleButton
                    interactive={0.2}
                    onClick={onNavigateToSimulator}
                    className="flex items-center gap-2.5 px-8 py-3 text-sm font-semibold text-white shadow-[0_12px_40px_rgba(0,0,0,0.65),inset_0_1px_1px_rgba(255,255,255,0.35)] border border-white/25 hover:border-white/50 backdrop-blur-2xl transition-all duration-300 cursor-pointer"
                    style={{
                      background: 'rgba(14, 18, 24, 0.72)',
                      color: '#ffffff',
                    }}
                  >
                    <span className="tracking-wide drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                      Let's take a deep dive
                    </span>
                    {/* Stationary arrow */}
                    <span className="text-white/90 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                      &rarr;
                    </span>
                  </SoapBubbleButton>
                </SoapBubbleMaterial>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </E2EEPageBackground>
  );
};
