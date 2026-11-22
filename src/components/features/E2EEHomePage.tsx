import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { E2EEPageBackground } from './E2EEPageBackground';
import { SoapBubbleButton, SoapBubbleMaterial } from '../soap-bubble';
import { RefractedText } from '../refracted-text';

interface E2EEHomePageProps {
  onNavigateToSimulator: () => void;
}

/**
 * Art-Directed Typography for "Encryption" (Gradient baseline)
 * Preserved for instant recoverability and direct visual comparison.
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
 * Implements a calibrated ~25% optical ray dispersion:
 * - Clear, rich optical refraction that is distinct and lively across the letter surfaces
 * - Visible spectral dispersion band: mint-emerald, prism teal, luminous center ray, and vibrant cyan
 * - Crisp, perfectly readable Plus Jakarta Sans typography aligned with "End-to-End"
 * - Gentle internal optical refraction oscillation (8s ease-in-out)
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

      {/* Optical Ray Dispersion Layer (Calibrated to 25% optical presence across the letters) */}
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

      {/* Internal Glass Prismatic Facet Highlight: Refracts light through the upper contour */}
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

  // When leaving the hotline range, immediately close the pop-up button
  const handleHotlineLeave = () => {
    if (autoHideTimerRef.current) {
      clearTimeout(autoHideTimerRef.current);
    }
    setIsOpen(false);
  };

  // Lifecycle:
  // 1. After ~4.5s (estimated reading time), pop-up appears, stays for 5s, and smoothly slides down.
  // 2. Hovering over the bottom hotline area triggers it to pop up, stays for 5s, and slides back down.
  useEffect(() => {
    readingTimerRef.current = setTimeout(() => {
      triggerShowFor5Seconds();
    }, 4500);

    return () => {
      if (readingTimerRef.current) clearTimeout(readingTimerRef.current);
      if (autoHideTimerRef.current) clearTimeout(autoHideTimerRef.current);
    };
  }, []);

  return (
    <E2EEPageBackground preset="whatsapp-iridescent">
      {/* Centered Main Viewport Container */}
      <main
        ref={pageRef}
        data-theme="dark"
        className="relative flex min-h-screen flex-col items-center justify-center px-4 sm:px-8 py-12 select-none overflow-hidden"
      >
        {/* Centered Hero Content Section */}
        <div className="relative z-10 w-full max-w-5xl mx-auto flex flex-col items-center justify-center text-center -mt-8">
          {/* Presenter Line: Exactly as in Src (THE SYNTAX UNVEILERS PRESENTS) */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-sm sm:text-base md:text-lg font-bold tracking-[0.25em] text-white uppercase text-center mb-5 drop-shadow-[0_2px_12px_rgba(0,0,0,0.4)]"
          >
            THE SYNTAX UNVEILERS PRESENTS
          </motion.p>

          {/* 
            Headline: Strictly in ONE SINGLE LINE across all viewports:
            "End-to-End" in plain crisp solid white + Art-directed "Encryption"
          */}
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="flex items-center justify-center whitespace-nowrap flex-nowrap gap-x-2 sm:gap-x-3 md:gap-x-4 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-center leading-[1.12] select-none max-w-full overflow-visible py-1"
          >
            {/* Plain crisp solid white 'End-to-End' */}
            <span className="text-white font-black drop-shadow-[0_2px_15px_rgba(0,0,0,0.5)] whitespace-nowrap shrink-0">
              End-to-End
            </span>

            {/* Subtle Optical Refracted Light Typography for "Encryption" */}
            <OpticalRefractedEncryption />
          </motion.h1>

          {/* Overview text strictly formatted on 2 lines matching the original template */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-sm sm:text-base md:text-lg text-slate-200/95 leading-relaxed font-normal max-w-2xl mx-auto text-center mt-6 select-none"
          >
            <span className="block">Messages are encrypted directly on your device. Only you and the recipient</span>
            <span className="block mt-0.5">hold the keys.</span>
          </motion.p>
        </div>

        {/* 
          Interactive SoapBubble Button & Hotline Area:
          - Automatically triggers after ~4.5s reading time, staying for 5s then smoothly hiding.
          - Hovering the hotline area shows the button.
          - Leaving the hotline area immediately closes the pop-up button.
        */}
        <div
          onMouseEnter={triggerShowFor5Seconds}
          onMouseLeave={handleHotlineLeave}
          className="fixed bottom-10 sm:bottom-14 left-0 right-0 h-24 z-40 flex items-center justify-center pointer-events-auto"
        >
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ y: 80, opacity: 0, scale: 0.8 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                exit={{ y: 72, opacity: 0, scale: 0.72 }}
                transition={{ duration: 1.25, ease: [0.16, 1, 0.3, 1] }}
                className="pointer-events-auto"
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
                  soapPaletteGold="#2dd4bf"   // Cyan-Mint
                  soapPaletteGreen="#059669"  // Deep Emerald
                  soapPaletteCyan="#22d3ee"   // Electric Cyan
                  soapPaletteBlue="#06b6d4"   // Vibrant Cyan
                  soapPaletteViolet="#0891b2" // Deep Oceanic Cyan
                  soapColor="#06b6d4"         // Prominent Cyan film base
                  soapHighlightColor="rgba(255, 255, 255, 0.95)"
                >
                  <SoapBubbleButton
                    interactive={0.2}
                    onClick={onNavigateToSimulator}
                    className="flex items-center gap-2.5 px-7 py-3 text-sm font-medium text-white shadow-[0_12px_45px_rgba(0,0,0,0.7),0_0_28px_rgba(6,182,212,0.3)] border border-white/20 hover:border-cyan-400/60 hover:shadow-[0_12px_50px_rgba(0,0,0,0.8),0_0_36px_rgba(6,182,212,0.45)] backdrop-blur-2xl transition-all duration-200 cursor-pointer"
                    style={{
                      background: 'rgba(14, 22, 24, 0.82)',
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
      </main>
    </E2EEPageBackground>
  );
};
