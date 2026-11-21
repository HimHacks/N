import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { E2EEPageBackground } from './E2EEPageBackground';
import { SoapBubbleButton, SoapBubbleMaterial } from '../soap-bubble';

interface E2EEHomePageProps {
  onNavigateToSimulator: () => void;
}

const ASCII_CHARS = '01#@$%&*<>[]{}~=+/\\_|^!?XYZ0101';

export const AsciiGlitchText: React.FC<{ text: string }> = ({ text }) => {
  const [displayText, setDisplayText] = useState(text);
  const [isGlitching, setIsGlitching] = useState(false);
  const frameRef = useRef<number | null>(null);

  const triggerGlitch = useCallback(() => {
    if (isGlitching) return;
    setIsGlitching(true);
    let iteration = 0;
    const totalSteps = text.length * 3;

    const step = () => {
      setDisplayText(
        text
          .split('')
          .map((char, index) => {
            if (char === ' ') return ' ';
            if (index < iteration / 3) {
              return text[index];
            }
            return ASCII_CHARS[Math.floor(Math.random() * ASCII_CHARS.length)];
          })
          .join('')
      );

      iteration++;
      if (iteration <= totalSteps) {
        frameRef.current = requestAnimationFrame(step);
      } else {
        setDisplayText(text);
        setIsGlitching(false);
      }
    };

    frameRef.current = requestAnimationFrame(step);
  }, [text, isGlitching]);

  // Periodic cryptographic scramble every 4.2 seconds + trigger on hover
  useEffect(() => {
    const interval = setInterval(() => {
      triggerGlitch();
    }, 4200);
    return () => {
      clearInterval(interval);
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [triggerGlitch]);

  return (
    <span
      onMouseEnter={triggerGlitch}
      className={`inline-block cursor-pointer select-none transition-all duration-150 ${
        isGlitching
          ? 'text-emerald-400 font-mono tracking-wider'
          : 'text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-teal-200 to-cyan-300'
      }`}
      style={
        isGlitching
          ? {
              textShadow:
                '0 0 14px rgba(16, 185, 129, 0.95), 2px 2px 0px #021a14, -2px -2px 0px #021a14, 0 0 24px rgba(6, 182, 212, 0.65)',
            }
          : undefined
      }
    >
      {displayText}
    </span>
  );
};

export const E2EEHomePage: React.FC<E2EEHomePageProps> = ({ onNavigateToSimulator }) => {
  const pageRef = useRef<HTMLDivElement>(null);
  const [isTimedActive, setIsTimedActive] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const dismissTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Timed pop-up logic:
  // After ~4.5s (reading time), the interactive bubble button appears, stays for 6s, and auto-dismisses smoothly.
  // Hovering over the bottom hotzone brings it back at any time.
  useEffect(() => {
    const entranceTimer = setTimeout(() => {
      setIsTimedActive(true);

      dismissTimerRef.current = setTimeout(() => {
        setIsTimedActive(false);
      }, 6000);
    }, 4500);

    return () => {
      clearTimeout(entranceTimer);
      if (dismissTimerRef.current) clearTimeout(dismissTimerRef.current);
    };
  }, []);

  const showButton = isTimedActive || isHovered;

  return (
    <E2EEPageBackground preset="whatsapp-iridescent">
      {/* Centered Main Viewport Container */}
      <main
        ref={pageRef}
        data-theme="dark"
        className="relative flex min-h-screen flex-col items-center justify-center px-6 sm:px-12 py-12 select-none overflow-hidden"
      >
        {/* Centered Hero Content Section */}
        <div className="relative z-10 w-full max-w-5xl mx-auto flex flex-col items-center justify-center text-center -mt-8">
          {/* Presenter Line: Exactly as originally written */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-xs sm:text-sm font-bold tracking-[0.25em] text-white uppercase text-center mb-4"
          >
            THE SYNTAX UNVEILERS Presents
          </motion.p>

          {/* Headline: Huge, Bold, Centered with communicate-without-limits Gradient and ASCII Glitch on ENCRYPTION */}
          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-5xl sm:text-7xl lg:text-8xl xl:text-9xl font-black tracking-tight text-center leading-[1.08]"
          >
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-teal-200 to-cyan-300">
              END-TO-END{' '}
            </span>
            <br className="hidden sm:inline" />
            <AsciiGlitchText text="ENCRYPTION" />
          </motion.h1>

          {/* Clean shortened overview */}
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-sm sm:text-base md:text-lg text-slate-300/90 leading-relaxed font-normal max-w-xl mx-auto text-center mt-6"
          >
            Messages are encrypted directly on your device. Only you and the recipient hold the keys.
          </motion.p>
        </div>

        {/* 
          Bottom Hot Zone & Interactive SoapBubble Button (Src 5):
          Appears automatically after reading time or when hovering anywhere across the bottom strip.
        */}
        <div
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="fixed bottom-0 left-0 right-0 h-28 z-40 flex items-center justify-center pointer-events-auto"
        >
          <AnimatePresence>
            {showButton && (
              <motion.div
                initial={{ y: 26, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 24, opacity: 0 }}
                transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                className="mb-8 pointer-events-auto"
              >
                {/* 
                  ReactDrops SoapBubbleButton:
                  Palette focused on Emerald, Cyan, Mint, and Deep Teal.
                  Zero dispersion, calm wobble & silky fluid border dynamics.
                */}
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
                    className="flex items-center gap-3 px-8 py-3.5 text-sm font-semibold text-white shadow-[0_12px_45px_rgba(0,0,0,0.7),0_0_28px_rgba(6,182,212,0.3)] border border-white/20 hover:border-cyan-400/60 hover:shadow-[0_12px_50px_rgba(0,0,0,0.8),0_0_36px_rgba(6,182,212,0.45)] backdrop-blur-2xl transition-all duration-200 cursor-pointer"
                    style={{
                      background: 'rgba(12, 18, 22, 0.88)',
                    }}
                  >
                    <span>Take a deep dive into E2EE</span>
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
