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
                  SoapBubbleButton:
                  - Completely glass white aesthetic with a delicate emerald/green accent
                  - Zero rainbow iridescence: crisp monochrome specular reflections
                  - Frosted white glass body with mint/emerald undertone
                  - Clean dark slate text for high-contrast legibility + emerald arrow
                  - Calm liquid motion (wobble 0.05, interactive 0.15)
                */}
                <SoapBubbleMaterial
                  backdrop={pageRef}
                  glass={0.96}
                  iridescence={0}
                  oilOpacity={0}
                  oilCoverage={0}
                  dispersion={0}
                  clearCenter={0.7}
                  thickness={460}
                  drainage={0.05}
                  swirl={0.12}
                  speed={0.35}
                  wobble={0.05}
                  reflectivity={1.15}
                  refraction={0.08}
                  bevel={12}
                  windowIntensity={1.0}
                  tint="rgba(240, 253, 244, 0.92)"
                  soapHighlightColor="rgba(255, 255, 255, 1.0)"
                  soapShadeColor="rgba(16, 185, 129, 0.18)"
                  soapColor="transparent"
                  environment="window"
                >
                  <SoapBubbleButton
                    interactive={0.15}
                    onClick={onNavigateToSimulator}
                    className="flex items-center gap-2.5 px-8 py-3.5 text-sm font-bold shadow-[0_14px_40px_rgba(0,0,0,0.35),0_0_24px_rgba(16,185,129,0.22),inset_0_1px_2px_rgba(255,255,255,1)] border border-emerald-500/35 hover:border-emerald-500/60 hover:shadow-[0_16px_45px_rgba(0,0,0,0.4),0_0_35px_rgba(16,185,129,0.35),inset_0_1px_2px_rgba(255,255,255,1)] backdrop-blur-2xl transition-all duration-300 cursor-pointer"
                    style={{
                      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(236, 253, 245, 0.90) 100%)',
                      color: '#0f172a',
                    }}
                  >
                    <span className="tracking-wide text-slate-900 font-bold">
                      Let's take a deep dive
                    </span>
                    {/* Tinted hint of green accent on the arrow */}
                    <span className="text-emerald-600 font-extrabold text-base">
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
