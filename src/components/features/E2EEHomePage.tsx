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
  // After ~5.5s (estimated reading time), the pop-up appears, stays for 4s, and auto-hides smoothly.
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
      if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    };
  }, []);

  // Smooth hover handlers with gentle debounce
  const handleMouseEnter = () => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setIsHovered(false);
    }, 350);
  };

  // Show if either the initial 4-second timed window is active OR mouse is hovering in the bottom hot zone
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
          Hovering anywhere in this zone or directly over the button smoothly slides it up into view.
        */}
        <div
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className="fixed bottom-0 left-0 right-0 h-24 z-30 flex items-center justify-center pointer-events-auto"
        >
          <AnimatePresence>
            {showButton && (
              <motion.div
                initial={{ y: 18, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 16, opacity: 0 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="mb-6 pointer-events-auto"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                {/* 
                  ReactDrops SoapBubbleButton:
                  - Bubble UI with 3D liquid membrane, curved window specular arc & bevel reflections
                  - Translucent "Glass White" aesthetic (NOT solid/opaque white paint)
                  - Zero rainbow iridescence for clean, monochrome crystal clarity
                  - Calm motion (wobble 0.05, interactive 0.15)
                */}
                <SoapBubbleMaterial
                  backdrop={pageRef}
                  glass={1.0}
                  seeThrough={0.85}
                  mirage={0.8}
                  refraction={0.12}
                  reflectivity={1.3}
                  bevel={14}
                  iridescence={0}
                  oilOpacity={0}
                  oilCoverage={0}
                  dispersion={0}
                  clearCenter={0.7}
                  thickness={450}
                  drainage={0.05}
                  swirl={0.15}
                  speed={0.35}
                  wobble={0.05}
                  windowLight={true}
                  windowLength={1.2}
                  windowMargin={0.85}
                  windowBend={0.75}
                  windowIntensity={0.85}
                  tint="rgba(255, 255, 255, 0.12)"
                  soapHighlightColor="rgba(255, 255, 255, 1.0)"
                  soapShadeColor="transparent"
                  soapColor="transparent"
                  environment="window"
                >
                  <SoapBubbleButton
                    interactive={0.15}
                    onClick={onNavigateToSimulator}
                    className="flex items-center gap-2.5 px-8 py-3.5 text-sm font-semibold text-white cursor-pointer shadow-[0_12px_40px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.45),0_0_24px_rgba(255,255,255,0.12)] border border-white/35 hover:border-white/60 backdrop-blur-2xl transition-all duration-300"
                    style={{
                      background: 'rgba(255, 255, 255, 0.10)',
                      color: '#ffffff',
                    }}
                  >
                    <span className="tracking-wide drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">
                      Let's take a deep dive
                    </span>
                    <span className="text-white/90 drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">
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
