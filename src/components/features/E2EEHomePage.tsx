import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SoapBubbleButton, SoapBubbleMaterial } from '../soap-bubble';
import { LumenInteractiveShader } from './LumenInteractiveShader';

interface E2EEHomePageProps {
  onNavigateToSimulator: (origin?: { x: number; y: number }) => void;
}

export const E2EEHomePage: React.FC<E2EEHomePageProps> = ({ onNavigateToSimulator }) => {
  const pageRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isReadingOver, setIsReadingOver] = useState(false);
  const autoHideTimerRef = useRef<NodeJS.Timeout | null>(null);
  const readingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isHoveredRef = useRef(false);

  // Helper to open the pop-up button for precisely 5 seconds, then smoothly hide it unless hovered
  const triggerAutoShow = () => {
    if (autoHideTimerRef.current) {
      clearTimeout(autoHideTimerRef.current);
    }
    setIsOpen(true);
    autoHideTimerRef.current = setTimeout(() => {
      // Only auto-hide if user isn't hovering directly over the hotline zone
      if (!isHoveredRef.current) {
        setIsOpen(false);
      }
    }, 5000);
  };

  // Hovering anywhere in the bottom-right hotline zone triggers and keeps the pop-up button
  const handleHotlineEnter = () => {
    if (!isReadingOver) return;
    isHoveredRef.current = true;
    if (autoHideTimerRef.current) {
      clearTimeout(autoHideTimerRef.current);
    }
    setIsOpen(true);
  };

  // Leaving the hotline zone gives a brief grace period then smoothly closes
  const handleHotlineLeave = () => {
    isHoveredRef.current = false;
    if (autoHideTimerRef.current) {
      clearTimeout(autoHideTimerRef.current);
    }
    autoHideTimerRef.current = setTimeout(() => {
      if (!isHoveredRef.current) {
        setIsOpen(false);
      }
    }, 400);
  };

  // Estimated reading time requirement:
  // The pop-up button will NOT appear until the 6-second reading time completes.
  // After 6 seconds, it pops up automatically, stays for 5 seconds, and drops down.
  // After that, hovering anywhere in the bottom-right hotline zone reliably brings it up.
  useEffect(() => {
    readingTimerRef.current = setTimeout(() => {
      setIsReadingOver(true);
      triggerAutoShow();
    }, 6000); // Exactly 6 seconds estimated reading time

    return () => {
      if (readingTimerRef.current) clearTimeout(readingTimerRef.current);
      if (autoHideTimerRef.current) clearTimeout(autoHideTimerRef.current);
    };
  }, []);

  return (
    <div
      ref={pageRef}
      className="relative w-full min-h-screen overflow-x-hidden select-none bg-[#0b141a] text-white"
      style={{
        fontFamily:
          'system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      }}
    >
      {/* 
        Full-Screen Interactive WebGL Fluid Background (Lumen Interactive Shader):
        Positioned fixed behind all page content with pointer-events enabled for fluid tracking
      */}
      <div className="fixed inset-0 z-0 w-full h-full overflow-hidden">
        <LumenInteractiveShader />

        {/* Soft subtle edge vignette preserving crisp typography readability without burying colors */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: `
              radial-gradient(circle at 50% 40%, transparent 0%, rgba(3, 20, 14, 0.2) 100%),
              linear-gradient(to bottom, rgba(3, 20, 14, 0.1) 0%, transparent 40%, rgba(3, 20, 14, 0.3) 100%)
            `,
          }}
        />
      </div>

      {/* 
        Main Layout: Exactly matching the template reference layout:
        - Left-aligned hero: "THE SYNTAX UNVEILERS PRESENTS" and "End-to-End Encryption"
        - Bottom-left: Description copy
        - Bottom-right: Soap Bubble Button (pops up after 6s, and re-accessible anytime via hotline)
      */}
      <main className="relative z-20 flex flex-col justify-between min-h-screen px-6 sm:px-12 md:px-20 py-12 w-full max-w-7xl mx-auto">
        {/* Top/Hero Left-Aligned Section */}
        <div className="mt-12 sm:mt-16 md:mt-24 max-w-4xl text-left">
          {/* Presenter line: THE SYNTAX UNVEILERS PRESENTS in clean white matching template */}
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-xs sm:text-sm md:text-base font-bold tracking-[0.25em] text-white/90 uppercase text-left mb-4 drop-shadow-[0_2px_12px_rgba(0,0,0,0.6)]"
          >
            THE SYNTAX UNVEILERS PRESENTS
          </motion.p>

          {/* Headline: Clean solid white matching Lumen template layout without text gradients */}
          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-left text-white font-black tracking-tight leading-[1.04] text-4xl sm:text-6xl md:text-7xl lg:text-8xl select-none max-w-full py-1 drop-shadow-[0_4px_30px_rgba(0,0,0,0.45)]"
          >
            End-to-End Encryption
          </motion.h1>
        </div>

        {/* Bottom Section: Description on bottom-left, Soap Bubble Pop-up on bottom-right */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-8 mt-16 sm:mt-24 w-full">
          {/* Bottom-left description text: strictly 2 lines */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-base sm:text-lg md:text-xl text-[#efeae2]/90 font-normal max-w-xl text-left select-none drop-shadow-[0_2px_12px_rgba(0,0,0,0.5)] leading-relaxed"
          >
            <span className="block">Messages are encrypted directly on your device.</span>
            <span className="block mt-0.5">Only you and the recipient hold the keys.</span>
          </motion.p>

          {/* 
            Right-hand Hotline Zone:
            - Before 6s: hidden, non-interactive.
            - At 6s: triggers automatic pop-up for 5 seconds.
            - After 6s: permanently active, so hovering anywhere in this zone reveals the button!
          */}
          <div
            onMouseEnter={handleHotlineEnter}
            onMouseMove={handleHotlineEnter}
            onMouseLeave={handleHotlineLeave}
            className="relative h-28 w-full md:w-80 flex items-center justify-start md:justify-end pointer-events-auto cursor-pointer"
          >
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ y: 70, opacity: 0, scale: 0.85 }}
                  animate={{
                    y: 0,
                    opacity: 1,
                    scale: 1,
                    transition: {
                      duration: 0.75,
                      ease: [0.16, 1, 0.3, 1],
                    },
                  }}
                  exit={{
                    y: 40,
                    opacity: 0,
                    scale: 0.88,
                    transition: {
                      duration: 0.45,
                      ease: [0.32, 0, 0.67, 0],
                    },
                  }}
                  className="pointer-events-auto shrink-0"
                >
                  <SoapBubbleMaterial
                    backdrop={pageRef}
                    glass={1.0}
                    iridescence={1.5}
                    filmScale={3.0}
                    oilCoverage={0.5}
                    oilEdge={20}
                    oilEdgeFade={0.8}
                    clearCenter={0.92}
                    thickness={520}
                    drainage={0.25}
                    swirl={0.3}
                    reflectivity={1.8}
                    refraction={0.25}
                    dispersion={0.08}
                    bevel={18}
                    wobble={0.05}
                    windowIntensity={1.4}
                    environment="studio"
                    soapPalette="custom"
                    soapPaletteRed="#ffffff"
                    soapPaletteGold="#22d3ee"   // Electric Cyan
                    soapPaletteGreen="#10b981"  // Vibrant Emerald
                    soapPaletteCyan="#38bdf8"   // Light Cyan
                    soapPaletteBlue="#06b6d4"   // Bright Cyan
                    soapPaletteViolet="#e0f2fe" // Frost White
                    soapColor="#ffffff"
                    soapHighlightColor="rgba(255, 255, 255, 1.0)"
                  >
                    <SoapBubbleButton
                      interactive={0.25}
                      onClick={(e) => {
                        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
                        const origin = {
                          x: rect.left + rect.width / 2,
                          y: rect.top + rect.height / 2,
                        };
                        onNavigateToSimulator(origin);
                      }}
                      className="flex items-center gap-2.5 px-8 py-3.5 text-sm font-medium text-white shadow-[0_12px_45px_rgba(0,0,0,0.25),0_0_36px_rgba(255,255,255,0.45),inset_0_1px_1px_rgba(255,255,255,0.9)] border border-white/70 hover:border-white hover:shadow-[0_12px_50px_rgba(0,0,0,0.35),0_0_48px_rgba(255,255,255,0.65)] backdrop-blur-2xl transition-all duration-300 cursor-pointer"
                      style={{
                        background: 'rgba(255, 255, 255, 0.15)',
                      }}
                    >
                      <span className="text-white font-medium drop-shadow-[0_1px_4px_rgba(0,0,0,0.5)]">Let's take a deep dive</span>
                      <span className="text-white font-bold text-base drop-shadow-[0_1px_4px_rgba(0,0,0,0.5)]">&rarr;</span>
                    </SoapBubbleButton>
                  </SoapBubbleMaterial>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>

      {/* Persistent global hotline overlay after 6s in bottom-right corner to catch any hover approach */}
      {isReadingOver && !isOpen && (
        <div
          onMouseEnter={handleHotlineEnter}
          onMouseMove={handleHotlineEnter}
          className="fixed bottom-0 right-0 w-80 h-32 z-30 pointer-events-auto cursor-pointer"
          title="Hover to reveal button"
        />
      )}

      <style>{`
        @keyframes calibratedDispersion25 {
          0% {
            background-position: 20% 0%;
            filter: hue-rotate(-10deg) brightness(1.05);
          }
          100% {
            background-position: 80% 0%;
            filter: hue-rotate(10deg) brightness(1.15);
          }
        }
      `}</style>
    </div>
  );
};

export default E2EEHomePage;
