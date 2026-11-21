import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, Lock, Sparkles, ArrowRight, KeyRound } from 'lucide-react';
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
  // After ~5.5s (reading time), the interactive bubble button appears, stays for 6s, and auto-dismisses smoothly.
  // Hovering over the bottom strip brings it back at any time.
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
      {/* Viewport Frame */}
      <main
        ref={pageRef}
        data-theme="dark"
        className="relative flex min-h-screen flex-col justify-between px-6 sm:px-12 py-8 select-none overflow-hidden"
      >
        {/* Top Navigation Bar — Matches React Bits Pro Lumen Architecture (Image 1) */}
        <header className="relative z-20 flex items-center justify-between w-full max-w-7xl mx-auto">
          {/* Brand Logo & Identifier */}
          <div className="flex items-center gap-3 cursor-default">
            <div className="relative flex items-center justify-center w-8 h-8 rounded-full border border-emerald-400/60 bg-emerald-500/10 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <span className="text-sm font-semibold tracking-wide text-white/95">
              The Syntax Unveilers
            </span>
          </div>

          {/* Frosted Glass Navigation Pill */}
          <nav className="flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 rounded-full bg-white/[0.08] backdrop-blur-xl border border-white/15 shadow-[0_4px_24px_rgba(0,0,0,0.3)]">
            <span className="hidden md:inline-block px-3 py-1 text-xs font-semibold tracking-wider text-white/70 hover:text-white transition-colors cursor-pointer">
              OVERVIEW
            </span>
            <span className="hidden md:inline-block px-3 py-1 text-xs font-semibold tracking-wider text-white/70 hover:text-white transition-colors cursor-pointer">
              ARCHITECTURE
            </span>
            <span className="hidden sm:inline-block px-3 py-1 text-xs font-semibold tracking-wider text-white/70 hover:text-white transition-colors cursor-pointer">
              SECURITY
            </span>
            <button
              type="button"
              onClick={onNavigateToSimulator}
              className="px-4 py-1.5 rounded-full bg-black/90 hover:bg-black text-white text-xs font-bold tracking-wider shadow-md hover:shadow-cyan-500/20 transition-all cursor-pointer flex items-center gap-1.5 border border-white/10 hover:border-cyan-400/40"
            >
              <span>EXPLORE</span>
              <ArrowRight className="w-3 h-3 text-cyan-400" />
            </button>
          </nav>
        </header>

        {/* Hero Content Section — Direct Lumen Layout & Scale (Image 1) */}
        <div className="relative z-10 w-full max-w-7xl mx-auto my-auto py-12 flex flex-col items-start justify-center text-left">
          {/* Eyebrow Presenter Line */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-2 mb-4"
          >
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-[11px] font-bold tracking-widest text-emerald-300 uppercase">
              <Lock className="w-3 h-3 text-emerald-400" />
              E2EE Architecture
            </span>
            <span className="text-xs font-bold tracking-widest text-white/60 uppercase">
              Canadian International School Singapore
            </span>
          </motion.div>

          {/* Headline: Huge, Bold, Heroic Typography */}
          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-4xl sm:text-6xl lg:text-7xl xl:text-8xl font-black tracking-tight text-white leading-[1.04] max-w-5xl"
          >
            Protect what matters, <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-teal-200 to-cyan-300">
              communicate without limits.
            </span>
          </motion.h1>

          {/* Subtitle Overview */}
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-base sm:text-lg lg:text-xl text-slate-200/90 leading-relaxed font-normal max-w-2xl mt-6"
          >
            The all-in-one cryptographic showcase for modern secure communication.
            Messages are encrypted on-device using the Signal Protocol and AES-256-GCM — zero trust, zero leakage, impenetrable by design.
          </motion.p>
        </div>

        {/* Bottom Bar: Status Badges & Interactive Explorer Button */}
        <footer className="relative z-20 flex flex-col sm:flex-row items-center justify-between w-full max-w-7xl mx-auto pt-6 gap-4">
          {/* Left: Cryptographic Verification Badges */}
          <div className="flex items-center gap-3 text-xs text-white/70">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.06] backdrop-blur-md border border-white/10">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              AES-256-GCM &bull; Signal Protocol
            </span>
            <span className="hidden md:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.06] backdrop-blur-md border border-white/10">
              <KeyRound className="w-3.5 h-3.5 text-cyan-400" />
              Client-Side Key Sovereignty
            </span>
          </div>

          {/* Right: Quick Action Explorer Button (Always Visible in Lumen Style) */}
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={onNavigateToSimulator}
              className="group flex items-center gap-3 px-6 py-3 rounded-xl bg-white hover:bg-slate-100 text-black text-xs sm:text-sm font-bold tracking-wider shadow-2xl hover:shadow-[0_0_35px_rgba(6,182,212,0.4)] transition-all duration-200 cursor-pointer"
            >
              <span>EXPLORE THE SIMULATOR</span>
              <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-black text-white group-hover:translate-x-1 transition-transform">
                <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />
              </span>
            </button>
          </div>
        </footer>

        {/* 
          Right-Edge Floating Icons — Matches Image 1 Controls
        */}
        <aside className="hidden lg:flex fixed right-6 top-1/2 -translate-y-1/2 z-30 flex-col gap-3">
          <button
            type="button"
            title="Cryptographic Integrity Verified"
            className="flex items-center justify-center w-10 h-10 rounded-full bg-black/40 backdrop-blur-xl border border-white/15 text-emerald-400 shadow-lg hover:border-emerald-400/60 hover:text-emerald-300 transition-all cursor-pointer"
          >
            <ShieldCheck className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={onNavigateToSimulator}
            title="Launch Phone Simulator"
            className="flex items-center justify-center w-10 h-10 rounded-full bg-black/40 backdrop-blur-xl border border-white/15 text-cyan-400 shadow-lg hover:border-cyan-400/60 hover:text-cyan-300 transition-all cursor-pointer"
          >
            <Sparkles className="w-5 h-5" />
          </button>
        </aside>

        {/* 
          Bottom Hot Zone & Interactive SoapBubble Button:
          Appears automatically or when hovering across bottom strip.
        */}
        <div
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="fixed bottom-0 left-0 right-0 h-28 z-40 flex items-center justify-center pointer-events-auto"
        >
          <AnimatePresence>
            {showButton && (
              <motion.div
                initial={{ y: 28, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 24, opacity: 0 }}
                transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                className="mb-8 pointer-events-auto"
              >
                {/* 
                  ReactDrops SoapBubbleButton:
                  Palette focused on Emerald, Cyan, Mint, and Deep Teal — with amplified Cyan accents.
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
