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
    };
  }, []);

  // Show if either the initial 4-second window is active OR mouse is hovering in the bottom hot zone
  const showButton = isTimedActive || isHovered;

  return (
    <E2EEPageBackground preset="whatsapp-iridescent">
      {/* Main Viewport Container */}
      <main
        ref={pageRef}
        data-theme="dark"
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
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="fixed bottom-0 left-0 right-0 h-24 z-30 flex items-center justify-center pointer-events-auto"
        >
          <AnimatePresence>
            {showButton && (
              <motion.div
                initial={{ y: 22, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 20, opacity: 0 }}
                transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                className="mb-6 pointer-events-auto"
              >
                {/* 
                  ReactDrops SoapBubbleButton:
                  Custom reflection palette strictly composed of Emerald, Cyan, Mint, and Deep Teal.
                  Zero dispersion (no purple/orange fringe noise), calm wobble & silky fluid border dynamics.
                */}
                <SoapBubbleMaterial
                  backdrop={pageRef}
                  glass={0.95}
                  iridescence={1.25}
                  filmScale={4.5}
                  oilCoverage={0.9}
                  oilEdge={18}
                  oilEdgeFade={1.2}
                  clearCenter={0.65}
                  thickness={460}
                  drainage={0.25}
                  swirl={0.45}
                  reflectivity={1.3}
                  refraction={0.12}
                  dispersion={0}
                  bevel={14}
                  wobble={0.08}
                  windowIntensity={0.95}
                  environment="studio"
                  soapPalette="custom"
                  soapPaletteRed="#10b981"    // Emerald
                  soapPaletteGold="#34d399"   // Mint
                  soapPaletteGreen="#059669"  // Deep Emerald
                  soapPaletteCyan="#06b6d4"   // Cyan
                  soapPaletteBlue="#0f766e"   // Deep Teal
                  soapPaletteViolet="#34d399" // Mint
                  soapColor="#10b981"
                  soapHighlightColor="rgba(255, 255, 255, 0.95)"
                >
                  <SoapBubbleButton
                    interactive={0.2}
                    onClick={onNavigateToSimulator}
                    className="flex items-center gap-2.5 px-8 py-3 text-sm font-medium text-white shadow-[0_12px_40px_rgba(0,0,0,0.65)] border border-white/20 hover:border-emerald-500/40 backdrop-blur-2xl transition-colors duration-200 cursor-pointer"
                    style={{
                      background: 'rgba(18, 22, 28, 0.85)',
                    }}
                  >
                    <span>Let's take a deep dive</span>
                    {/* Stationary arrow */}
                    <span className="text-white/80">&rarr;</span>
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
