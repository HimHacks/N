import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SoapBubbleButton, SoapBubbleMaterial } from '../soap-bubble';
import { LumenBloomBackground } from './LumenBloomBackground';

interface E2EEHomePageProps {
  onNavigateToSimulator: (origin?: { x: number; y: number }) => void;
}

export const E2EEHomePage: React.FC<E2EEHomePageProps> = ({ onNavigateToSimulator }) => {
  const pageRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [canHover, setCanHover] = useState(false);
  const autoHideTimerRef = useRef<NodeJS.Timeout | null>(null);
  const readingTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Helper to open the pop-up button for precisely 5 seconds, then smoothly hide it
  const triggerShowFor5Seconds = () => {
    if (autoHideTimerRef.current) {
      clearTimeout(autoHideTimerRef.current);
    }
    setIsOpen(true);
    autoHideTimerRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 5000);
  };

  // Hovering anywhere in the bottom-right hotline zone triggers the pop-up button (after 6s reading time)
  const handleHotlineEnter = () => {
    if (!canHover) return;
    triggerShowFor5Seconds();
  };

  // Leaving the hotline zone immediately closes the pop-up button
  const handleHotlineLeave = () => {
    if (autoHideTimerRef.current) {
      clearTimeout(autoHideTimerRef.current);
    }
    setIsOpen(false);
  };

  // Estimated reading time requirement:
  // The pop-up button will NOT appear until the 6-second reading time completes.
  // After 6 seconds, it pops up automatically, stays for 5 seconds, and drops down.
  // After that, the hotline zone is active so hovering brings it right back up.
  useEffect(() => {
    readingTimerRef.current = setTimeout(() => {
      setCanHover(true);
      triggerShowFor5Seconds();
    }, 6000); // Strict 6 seconds estimated reading time

    return () => {
      if (readingTimerRef.current) clearTimeout(readingTimerRef.current);
      if (autoHideTimerRef.current) clearTimeout(autoHideTimerRef.current);
    };
  }, []);

  return (
    <div
      ref={pageRef}
      className="relative w-full min-h-screen overflow-x-hidden font-sans select-none"
      style={{
        backgroundColor: '#03140e',
        color: '#ffffff',
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      }}
    >
      {/* 
        Full-Screen Lumen WebGL2 Background (Soft Bloom Mode from the reference template video):
        Calibrated to the exact green contrast translation:
        - Pink -> Deep Forest Green (#042b1f)
        - Blue -> Deep Emerald (#02402e)
        - Purple -> Deep Signal Green (#00a884)
        - Orange -> Slight Green / Mint (#25d366, #34d399)
        - Background -> Deep Dark Forest (#03140e)
      */}
      <div className="fixed inset-0 -z-10 w-full h-full pointer-events-none overflow-hidden">
        <LumenBloomBackground
          config={{
            c1: '#00a884', // Deep Signal Emerald
            c2: '#25d366', // Vibrant WhatsApp Green (Orange equivalent)
            c3: '#043b2c', // Deep Emerald (Blue equivalent)
            c4: '#34d399', // Mint / Slight Green
            bg: '#03140e', // Deep Dark Forest Canvas
            scale: 1.15,
            warp: 0.95,
            flow: 0.35,
            soft: 1.25,
            loop: 8.0,
          }}
        />

        {/* Soft edge & center vignette preserving typography readability */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: `
              radial-gradient(circle at 50% 35%, rgba(3, 20, 14, 0.1) 0%, rgba(3, 20, 14, 0.45) 100%),
              linear-gradient(to bottom, rgba(3, 20, 14, 0.25) 0%, transparent 40%, rgba(2, 16, 11, 0.55) 100%)
            `,
          }}
        />
      </div>

      {/* 
        Main Layout: Exactly matching the template from the video:
        - Main text left-aligned in the hero section ("THE SYNTAX UNVEILERS PRESENTS", "End-to-End Encryption")
        - Description copy on the bottom-left
        - Soap Bubble Button on the bottom-right (pops up after 6s, and hoverable in the hotline zone)
      */}
      <main className="relative z-20 flex flex-col justify-between min-h-screen px-6 sm:px-12 md:px-20 py-12 w-full max-w-7xl mx-auto">
        {/* Top/Hero Left-Aligned Section */}
        <div className="mt-12 sm:mt-16 md:mt-24 max-w-4xl text-left">
          {/* Presenter line: THE SYNTAX UNVEILERS PRESENTS */}
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-xs sm:text-sm md:text-base font-bold tracking-[0.25em] text-[#34d399] uppercase text-left mb-4 drop-shadow-[0_2px_12px_rgba(0,0,0,0.5)]"
          >
            THE SYNTAX UNVEILERS PRESENTS
          </motion.p>

          {/* 
            Headline: Single line across viewports with Art-directed / Optical Refracted Encryption
          */}
          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="flex items-center text-left whitespace-nowrap flex-nowrap gap-x-2 sm:gap-x-3 md:gap-x-4 text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[1.04] select-none max-w-full overflow-visible py-1 drop-shadow-[0_4px_30px_rgba(0,0,0,0.35)]"
          >
            <span className="text-white font-black whitespace-nowrap shrink-0">
              End-to-End
            </span>
            <span className="relative inline-block select-none whitespace-nowrap shrink-0 overflow-visible align-baseline">
              <span
                className="relative z-10 inline-block font-black tracking-tight text-transparent bg-clip-text select-none drop-shadow-[0_2px_12px_rgba(0,0,0,0.55)] overflow-visible"
                style={{
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
              <span
                aria-hidden="true"
                className="absolute inset-0 z-20 pointer-events-none inline-block font-black tracking-tight text-transparent bg-clip-text select-none overflow-visible mix-blend-screen opacity-85"
                style={{
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
            </span>
          </motion.h1>
        </div>

        {/* Bottom Section: Description on bottom-left, Soap Bubble Pop-up on bottom-right */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-8 mt-16 sm:mt-24 w-full">
          {/* Bottom-left description text */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-base sm:text-lg md:text-xl text-slate-100 font-normal max-w-xl text-left select-none drop-shadow-[0_2px_12px_rgba(0,0,0,0.4)]"
          >
            <span className="block">Messages are encrypted directly on your device. Only you and the recipient</span>
            <span className="block mt-0.5">hold the keys.</span>
          </motion.p>

          {/* 
            Right-hand Hotline Zone (Generous 260px wide × 120px tall hitbox):
            - Before 6s: hidden, non-interactive.
            - At 6s: triggers automatic pop-up for 5 seconds.
            - After 6s: permanently active, so hovering anywhere in this zone reveals the button!
          */}
          <div
            onMouseEnter={handleHotlineEnter}
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
                      duration: 1.15,
                      ease: [0.16, 1, 0.3, 1],
                    },
                  }}
                  exit={{
                    y: 40,
                    opacity: 0,
                    scale: 0.88,
                    transition: {
                      duration: 0.5,
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
                        background: 'rgba(14, 22, 24, 0.88)',
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
