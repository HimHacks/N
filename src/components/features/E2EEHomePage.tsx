import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { E2EEPageBackground } from './E2EEPageBackground';
import { SoapBubbleButton, SoapBubbleMaterial } from '../soap-bubble';

interface E2EEHomePageProps {
  onNavigateToSimulator: (origin?: { x: number; y: number }) => void;
}

/**
 * Art-Directed Typography for "Encryption" (Gradient baseline)
 */
export const ArtDirectedEncryption: React.FC = () => {
  return (
    <span className="relative inline-block select-none whitespace-nowrap shrink-0 overflow-visible">
      <span
        className="relative z-10 inline-block font-black tracking-normal text-transparent bg-clip-text select-none drop-shadow-[0_2px_12px_rgba(0,0,0,0.55)] overflow-visible"
        style={{
          backgroundImage:
            'linear-gradient(155deg, #a7f3d0 0%, #34d399 28%, #10b981 56%, #059669 82%, #047857 100%)',
          WebkitBackgroundClip: 'text',
          WebkitBoxDecorationBreak: 'clone',
          boxDecorationBreak: 'clone',
          paddingBottom: '0.18em',
          marginBottom: '-0.18em',
          paddingRight: '0.04em',
        }}
      >
        Encryption
      </span>
    </span>
  );
};

/**
 * Refracted Glass Optical Typography for "Encryption"
 * Implements a calibrated optical ray dispersion
 */
export const OpticalRefractedEncryption: React.FC = () => {
  return (
    <span className="relative inline-block select-none whitespace-nowrap shrink-0 overflow-visible align-baseline">
      {/* Base Glass Material Layer: Rich emerald-mint gradient */}
      <span
        className="relative z-10 inline-block font-black tracking-tight text-transparent bg-clip-text select-none drop-shadow-[0_2px_12px_rgba(0,0,0,0.55)] overflow-visible"
        style={{
          fontFamily: "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif",
          backgroundImage:
            'linear-gradient(155deg, #a7f3d0 0%, #34d399 32%, #10b981 58%, #059669 82%, #047857 100%)',
          WebkitBackgroundClip: 'text',
          WebkitBoxDecorationBreak: 'clone',
          boxDecorationBreak: 'clone',
          paddingBottom: '0.18em',
          marginBottom: '-0.18em',
          paddingRight: '0.04em',
        }}
      >
        Encryption
      </span>

      {/* Optical Ray Dispersion Layer */}
      <span
        aria-hidden="true"
        className="absolute inset-0 z-20 pointer-events-none inline-block font-black tracking-tight text-transparent bg-clip-text select-none overflow-visible mix-blend-screen opacity-80"
        style={{
          fontFamily: "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif",
          backgroundImage:
            'linear-gradient(125deg, transparent 10%, rgba(110,231,183,0.5) 28%, rgba(45,212,191,0.85) 42%, rgba(255,255,255,0.92) 50%, rgba(34,211,238,0.85) 58%, rgba(5,150,105,0.4) 72%, transparent 90%)',
          backgroundSize: '170% 100%',
          WebkitBackgroundClip: 'text',
          WebkitBoxDecorationBreak: 'clone',
          boxDecorationBreak: 'clone',
          animation: 'calibratedDispersion25 8s ease-in-out infinite alternate',
          paddingBottom: '0.18em',
          marginBottom: '-0.18em',
          paddingRight: '0.04em',
        }}
      >
        Encryption
      </span>

      {/* Internal Glass Prismatic Facet Highlight */}
      <span
        aria-hidden="true"
        className="absolute inset-0 z-30 pointer-events-none inline-block font-black tracking-tight text-transparent bg-clip-text select-none overflow-visible opacity-45 mix-blend-overlay"
        style={{
          fontFamily: "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif",
          backgroundImage:
            'linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(167,243,208,0.5) 30%, transparent 70%)',
          WebkitBackgroundClip: 'text',
          WebkitBoxDecorationBreak: 'clone',
          boxDecorationBreak: 'clone',
          paddingBottom: '0.18em',
          marginBottom: '-0.18em',
          paddingRight: '0.04em',
        }}
      >
        Encryption
      </span>

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
    </span>
  );
};

export const E2EEHomePage: React.FC<E2EEHomePageProps> = ({ onNavigateToSimulator }) => {
  const pageRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [canHover, setCanHover] = useState(false);
  const autoHideTimerRef = useRef<NodeJS.Timeout | null>(null);
  const readingTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Helper to open the pop-up button for precisely ~5 seconds, then smoothly hide it
  const triggerShowFor5Seconds = () => {
    if (autoHideTimerRef.current) {
      clearTimeout(autoHideTimerRef.current);
    }
    setIsOpen(true);
    autoHideTimerRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 5000);
  };

  // Hovering the bottom-right hotline zone triggers it only if 7-second reading time has finished
  const handleHotlineEnter = () => {
    if (!canHover) return;
    triggerShowFor5Seconds();
  };

  // Leaving the hotline area immediately hides the pop-up button
  const handleHotlineLeave = () => {
    if (autoHideTimerRef.current) {
      clearTimeout(autoHideTimerRef.current);
    }
    setIsOpen(false);
  };

  // Estimated reading time requirement:
  // The pop-up button will NOT appear until the 7-second reading time completes.
  // After 7 seconds, it pops up automatically, stays for 5 seconds, and drops down.
  // Then the hotline zone is activated so the user can hover to reveal it anytime.
  useEffect(() => {
    readingTimerRef.current = setTimeout(() => {
      setCanHover(true);
      triggerShowFor5Seconds();
    }, 7000); // Strict 7 seconds estimated reading time

    return () => {
      if (readingTimerRef.current) clearTimeout(readingTimerRef.current);
      if (autoHideTimerRef.current) clearTimeout(autoHideTimerRef.current);
    };
  }, []);

  return (
    <E2EEPageBackground
      preset="whatsapp-iridescent"
      color="#10b981"         // Signal Emerald (#10b981)
      accentColor="#059669"   // Deep Emerald (#059669)
      cyanColor="#34d399"     // Mint / Slight Green (#34d399)
      darkColor="#021a12"     // Deep Forest Green / Night Emerald (#021a12)
      whiteColor="#dcfce7"    // Luminous Glint (#dcfce7)
      opacity={0.94}
      speed={0.6}
    >
      {/* 
        Full Layout: Matching the video/image structure:
        - Main text left-aligned in the hero section ("THE SYNTAX UNVEILERS PRESENTS", "End-to-End Encryption")
        - Description copy on the bottom-left
        - Soap Bubble Button on the right, appearing after the 7-second estimated reading time
      */}
      <main
        ref={pageRef}
        data-theme="dark"
        className="relative flex min-h-screen flex-col justify-between px-6 sm:px-12 md:px-20 py-12 select-none overflow-hidden"
      >
        {/* Top/Hero Left-Aligned Section */}
        <div className="relative z-10 w-full max-w-5xl mt-12 sm:mt-16 md:mt-20 text-left">
          {/* Presenter line: THE SYNTAX UNVEILERS PRESENTS */}
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-xs sm:text-sm md:text-base font-bold tracking-[0.25em] text-[#34d399] uppercase text-left mb-4 drop-shadow-[0_2px_12px_rgba(0,0,0,0.5)]"
          >
            THE SYNTAX UNVEILERS PRESENTS
          </motion.p>

          {/* Headline: Single line across viewports with Art-directed / Optical Refracted Encryption */}
          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="flex items-center text-left whitespace-nowrap flex-nowrap gap-x-2 sm:gap-x-3 md:gap-x-4 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[1.08] select-none max-w-full overflow-visible py-1"
          >
            <span className="text-white font-black drop-shadow-[0_2px_15px_rgba(0,0,0,0.6)] whitespace-nowrap shrink-0">
              End-to-End
            </span>
            <OpticalRefractedEncryption />
          </motion.h1>
        </div>

        {/* Bottom Section: Description on bottom-left, Soap Bubble Pop-up on bottom-right */}
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-end justify-between gap-8 mt-16 sm:mt-24 w-full">
          {/* Bottom-left description text */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-sm sm:text-base md:text-lg text-slate-200/90 leading-relaxed font-normal max-w-xl text-left select-none drop-shadow-[0_2px_10px_rgba(0,0,0,0.6)]"
          >
            <span className="block">Messages are encrypted directly on your device. Only you and the recipient</span>
            <span className="block mt-0.5">hold the keys.</span>
          </motion.p>

          {/* 
            Right-hand Hotline Zone & Pop-Up Soap Bubble Button:
            - Locked until 7-second reading timer ends.
            - Once timer ends, pops up for 5 seconds and drops down.
            - Then hoverable in this right-hand hotline zone.
          */}
          <div
            onMouseEnter={handleHotlineEnter}
            onMouseLeave={handleHotlineLeave}
            className="relative h-24 w-full md:w-auto flex items-center justify-start md:justify-end pointer-events-auto"
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
                      duration: 1.25,
                      ease: [0.16, 1, 0.3, 1],
                    },
                  }}
                  exit={{
                    y: 40,
                    opacity: 0,
                    scale: 0.88,
                    transition: {
                      duration: 0.55,
                      ease: [0.32, 0, 0.67, 0],
                    },
                  }}
                  className="pointer-events-auto shrink-0"
                >
                  <SoapBubbleMaterial
                    backdrop={pageRef}
                    glass={0.95}
                    iridescence={1.35}
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
                    soapPaletteGold="#2dd4bf"   // Mint
                    soapPaletteGreen="#059669"  // Deep Emerald
                    soapPaletteCyan="#22d3ee"   // Electric Cyan
                    soapPaletteBlue="#06b6d4"   // Vibrant Cyan
                    soapPaletteViolet="#0891b2" // Oceanic Cyan
                    soapColor="#06b6d4"
                    soapHighlightColor="rgba(255, 255, 255, 0.95)"
                  >
                    <SoapBubbleButton
                      interactive={0.2}
                      onClick={(e) => {
                        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
                        const origin = {
                          x: rect.left + rect.width / 2,
                          y: rect.top + rect.height / 2,
                        };
                        onNavigateToSimulator(origin);
                      }}
                      className="flex items-center gap-2.5 px-8 py-3.5 text-sm font-medium text-white shadow-[0_12px_45px_rgba(0,0,0,0.7),0_0_28px_rgba(6,182,212,0.3)] border border-white/20 hover:border-cyan-400/60 hover:shadow-[0_12px_50px_rgba(0,0,0,0.8),0_0_36px_rgba(6,182,212,0.45)] backdrop-blur-2xl transition-all duration-200 cursor-pointer"
                      style={{
                        background: 'rgba(14, 22, 24, 0.85)',
                      }}
                    >
                      <span>Let's take a deep dive</span>
                      <span className="text-cyan-400 font-bold text-base">&rarr;</span>
                    </SoapBubbleButton>
                  </SoapBubbleMaterial>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>
    </E2EEPageBackground>
  );
};

export default E2EEHomePage;
