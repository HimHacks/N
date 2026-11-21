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
                  - Completely glass white (exact match to reference picture)
                  - Light theme preset with windowLight arc specular reflection
                  - Tinted milky white glass body (#f7f7f8 / rgba(250, 251, 253, 0.96))
                  - Dark slate bold typography (#1b1d22) with subtle green accent arrow
                  - Authentic liquid soap bubble rim physics
                */}
                <div data-theme="light" className="relative flex items-center justify-center">
                  <SoapBubbleMaterial
                    backdrop={pageRef}
                    iridescence={0.5}
                    oilCoverage={0.73}
                    oilEdgeFade={2.33}
                    clearCenter={0.57}
                    windowLight={true}
                    windowLength={1.3}
                    windowMargin={0.85}
                    windowBend={0.75}
                    windowSize={0.75}
                    windowWidth={0.8}
                    windowGradient={0.96}
                    windowHead={0.7}
                    windowTail={0.6}
                    glintSize={1.65}
                    glintIntensity={0}
                    glintDistance={-0.45}
                    glintHeight={0.65}
                    windowIntensity={0.85}
                    windowTwin={false}
                    bottomShade={true}
                    bottomShadeColor="#ffffff"
                    tint="rgba(250, 251, 253, 0.96)"
                    soapHighlightColor="#ffffff"
                    glass={0.96}
                    reflectivity={1.25}
                    refraction={0.08}
                    wobble={0.06}
                    environment="window"
                  >
                    <SoapBubbleButton
                      interactive={0.15}
                      onClick={onNavigateToSimulator}
                      className="flex items-center justify-center gap-2.5 px-10 py-3.5 text-base sm:text-lg font-bold text-[#1b1d22] cursor-pointer shadow-[0_16px_45px_rgba(0,0,0,0.35)]"
                      style={{
                        color: '#1b1d22',
                      }}
                    >
                      <span className="tracking-tight text-[#1b1d22] font-bold">
                        Let's take a deep dive
                      </span>
                      {/* Tinted hint of green accent arrow */}
                      <span className="text-emerald-600 font-extrabold text-xl ml-1">
                        &rarr;
                      </span>
                    </SoapBubbleButton>
                  </SoapBubbleMaterial>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </E2EEPageBackground>
  );
};
