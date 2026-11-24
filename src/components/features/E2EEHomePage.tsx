import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SoapBubbleButton, SoapBubbleMaterial } from '../soap-bubble';
import { LumenInteractiveShader } from './LumenInteractiveShader';

interface E2EEHomePageProps {
  onNavigateToSimulator: (origin?: { x: number; y: number }) => void;
  isInitialReady?: boolean;
}

export const E2EEHomePage: React.FC<E2EEHomePageProps> = ({ onNavigateToSimulator, isInitialReady = true }) => {
  const pageRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isReadingOver, setIsReadingOver] = useState(false);
  const autoHideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const readingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
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

  // The hero text and reading timer only begin after initial preloader has cleared
  useEffect(() => {
    if (!isInitialReady) return;

    readingTimerRef.current = setTimeout(() => {
      setIsReadingOver(true);
      triggerAutoShow();
    }, 6000); // Exactly 6 seconds estimated reading time

    return () => {
      if (readingTimerRef.current) clearTimeout(readingTimerRef.current);
      if (autoHideTimerRef.current) clearTimeout(autoHideTimerRef.current);
    };
  }, [isInitialReady]);

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
      <main className="relative z-20 flex flex-col justify-between min-h-screen px-6 sm:px-12 md:px-20 py-8 sm:py-12 w-full max-w-7xl mx-auto">
        {/* Top/Hero Left-Aligned Section: elevated cleanly away from the bottom of the screen */}
        <div className="mt-6 sm:mt-10 md:mt-14 max-w-4xl text-left">
          {/* Presenter line: THE SYNTAX UNVEILERS PRESENTS */}
          {isInitialReady && (
            <motion.p
              initial={{ opacity: 0, y: 24, filter: 'blur(4px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="text-xs sm:text-sm md:text-base font-bold tracking-[0.25em] text-white/90 uppercase text-left mb-3 drop-shadow-[0_2px_12px_rgba(0,0,0,0.6)]"
            >
              THE SYNTAX UNVEILERS PRESENTS
            </motion.p>
          )}

          {/* Headline: "End-to-End Encryption" comes up using smooth curvy upward fade */}
          {isInitialReady && (
            <motion.h1
              initial={{ opacity: 0, y: 36, filter: 'blur(8px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 0.95, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="text-left text-white font-black tracking-tight leading-[1.04] text-4xl sm:text-6xl md:text-7xl lg:text-8xl select-none max-w-full py-1 drop-shadow-[0_4px_30px_rgba(0,0,0,0.45)]"
            >
              End-to-End Encryption
            </motion.h1>
          )}

          {/* Elevated Description: placed up closely under the headline rather than pushed to the bottom */}
          {isInitialReady && (
            <motion.p
              initial={{ opacity: 0, y: 28, filter: 'blur(6px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 0.85, delay: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="text-base sm:text-lg md:text-xl text-[#efeae2]/95 font-normal max-w-xl text-left select-none drop-shadow-[0_2px_12px_rgba(0,0,0,0.5)] leading-relaxed mt-6 sm:mt-8"
            >
              <span className="block">Messages are encrypted directly on your device.</span>
              <span className="block mt-1">Only you and the recipient hold the keys.</span>
            </motion.p>
          )}
        </div>

        {/* Bottom Section: Soap Bubble Pop-up on bottom-right */}
        <div className="flex flex-col md:flex-row items-end justify-end gap-8 pb-4 w-full">

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
            {/* 
              Pre-warmed Soap Bubble Button:
              Mounted from page start so WebGL shaders and context compile immediately behind the scenes.
              Only animates into view when isOpen is true. Eliminates any unrendered or plain transparent fallback flash!
            */}
            <motion.div
              initial={false}
              animate={{
                y: isOpen ? 0 : 50,
                opacity: isOpen ? 1 : 0,
                scale: isOpen ? 1 : 0.88,
              }}
              transition={{
                duration: 0.75,
                ease: [0.16, 1, 0.3, 1],
              }}
              style={{
                pointerEvents: isOpen ? 'auto' : 'none',
              }}
              className="shrink-0"
            >
              <SoapBubbleMaterial
                glass={0.95}
                iridescence={0.8}
                filmScale={4.85}
                oilOpacity={1}
                oilCoverage={0.85}
                oilEdge={18}
                oilEdgeFade={2.33}
                clearCenter={0.57}
                thickness={480}
                drainage={0.35}
                swirl={0.5}
                reflectivity={1.3}
                refraction={0.15}
                dispersion={1}
                bevel={14}
                wobble={0.08}
                environment="studio"
                windowLength={1.3}
                windowMargin={0.85}
                windowBend={0.75}
                windowSize={0.75}
                windowWidth={0.8}
                windowGradient={0.96}
                windowHead={0.7}
                windowTail={0.6}
                glintSize={1.65}
                glintIntensity={0.4}
                glintDistance={-0.45}
                glintHeight={0.65}
                windowIntensity={0.85}
                windowTwin={false}
                tint="transparent"
              >
                <SoapBubbleButton
                  interactive={0.35}
                  onClick={(e) => {
                    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
                    const origin = {
                      x: rect.left + rect.width / 2,
                      y: rect.top + rect.height / 2,
                    };
                    onNavigateToSimulator(origin);
                  }}
                  className="flex items-center gap-2.5 px-8 py-3.5 text-sm font-medium text-white transition-transform duration-300 cursor-pointer"
                  style={{
                    background: 'transparent',
                    border: 'none',
                    boxShadow: 'none',
                  }}
                >
                  <span className="text-white font-medium drop-shadow-[0_1px_4px_rgba(0,0,0,0.6)]">Let's take a deep dive</span>
                  <span className="text-white font-bold text-base drop-shadow-[0_1px_4px_rgba(0,0,0,0.6)]">&rarr;</span>
                </SoapBubbleButton>
              </SoapBubbleMaterial>
            </motion.div>
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
