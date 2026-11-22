import React, { useRef } from 'react';
import { motion } from 'motion/react';
import { SoapBubbleButton, SoapBubbleMaterial } from '../soap-bubble';
import { LumenBloomBackground } from './LumenBloomBackground';

interface E2EEHomePageProps {
  onNavigateToSimulator: (origin?: { x: number; y: number }) => void;
}

export const E2EEHomePage: React.FC<E2EEHomePageProps> = ({ onNavigateToSimulator }) => {
  const pageRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={pageRef}
      className="relative w-full min-h-screen overflow-x-hidden font-sans select-none"
      style={{
        backgroundColor: '#efeae2',
        color: '#111b21',
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      }}
    >
      {/* 
        Full-screen generative WebGL2 background from Lumen (Soft Bloom mode)
        Calibrated with WhatsApp emerald, signal teal, vibrant green, and warm cream base:
        - Pink -> Deep Emerald (#059669)
        - Blue -> Signal Emerald & WhatsApp Teal (#00a884)
        - Purple/Orange -> Radiant Mint & WhatsApp Green (#25d366, #10b981)
        - Background -> Signature WhatsApp warm cream (#efeae2)
      */}
      <div className="fixed inset-0 -z-10 w-full h-full pointer-events-none overflow-hidden">
        <LumenBloomBackground />
      </div>

      {/* Top Navigation Bar: Matching the video layout */}
      <header className="relative z-30 flex items-center justify-between px-6 sm:px-12 md:px-16 pt-8 pb-4 w-full max-w-7xl mx-auto">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-[#00a884] flex items-center justify-center bg-white/40 backdrop-blur-md shadow-xs">
            <div className="w-3.5 h-3.5 rounded-full bg-[#00a884]" />
          </div>
          <span className="text-xl font-bold tracking-tight text-[#111b21]">
            Syntax Unveilers
          </span>
        </div>

        {/* Top Right Navigation Pill */}
        <div className="flex items-center bg-white/70 backdrop-blur-md px-2 py-1.5 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-white/80">
          <nav className="flex items-center gap-1 sm:gap-2 px-3 text-xs sm:text-sm font-medium text-[#54656f]">
            <a href="#simulator" onClick={(e) => { e.preventDefault(); onNavigateToSimulator(); }} className="px-3 py-1.5 rounded-xl hover:text-[#00a884] hover:bg-black/5 transition-colors cursor-pointer">
              PROTOCOL
            </a>
            <a href="#cryptography" onClick={(e) => { e.preventDefault(); onNavigateToSimulator(); }} className="px-3 py-1.5 rounded-xl hover:text-[#00a884] hover:bg-black/5 transition-colors cursor-pointer">
              DOUBLE RATCHET
            </a>
            <a href="#keys" onClick={(e) => { e.preventDefault(); onNavigateToSimulator(); }} className="px-3 py-1.5 rounded-xl hover:text-[#00a884] hover:bg-black/5 transition-colors cursor-pointer">
              ENCRYPTION
            </a>
          </nav>
          <button
            onClick={(e) => {
              const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
              onNavigateToSimulator({
                x: rect.left + rect.width / 2,
                y: rect.top + rect.height / 2,
              });
            }}
            className="px-5 py-2 rounded-xl text-xs sm:text-sm font-semibold text-white bg-[#111b21] hover:bg-[#00a884] transition-colors shadow-xs cursor-pointer ml-1"
          >
            LAUNCH PORTAL
          </button>
        </div>
      </header>

      {/* Main Content Area: Matching the video hero typography and bottom card layout */}
      <main className="relative z-20 flex flex-col justify-between min-h-[calc(100vh-120px)] px-6 sm:px-12 md:px-16 pb-12 w-full max-w-7xl mx-auto">
        {/* Giant Left-Aligned Display Headline */}
        <div className="mt-12 sm:mt-20 md:mt-24 max-w-4xl">
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tight text-white leading-[1.04] drop-shadow-[0_4px_30px_rgba(0,0,0,0.18)]"
            style={{
              fontFamily:
                '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
            }}
          >
            Build what matters,
            <br />
            <span className="text-white">ship without limits.</span>
          </motion.h1>
        </div>

        {/* Bottom Split Layout: Subtitle on Left, Soap Bubble Button on Right */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-8 mt-16 sm:mt-24">
          {/* Subtitle description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="text-base sm:text-lg md:text-xl font-normal text-white max-w-xl leading-relaxed drop-shadow-[0_2px_12px_rgba(0,0,0,0.22)]"
          >
            The all-in-one cryptographic platform for modern teams to design,
            verify, and simulate end-to-end encryption protocols faster than ever.
          </motion.p>

          {/* Interactive Soap Bubble Button replacing the Explore Platform button */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="shrink-0"
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
                onClick={(e) => {
                  const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
                  const origin = {
                    x: rect.left + rect.width / 2,
                    y: rect.top + rect.height / 2,
                  };
                  onNavigateToSimulator(origin);
                }}
                className="flex items-center gap-3 px-8 py-4 text-base font-semibold text-white shadow-[0_12px_45px_rgba(0,0,0,0.5),0_0_28px_rgba(0,168,132,0.3)] border border-white/30 hover:border-[#25d366] hover:shadow-[0_12px_50px_rgba(0,0,0,0.6),0_0_36px_rgba(37,211,102,0.45)] backdrop-blur-2xl transition-all duration-200 cursor-pointer"
                style={{
                  background: 'rgba(17, 27, 33, 0.88)',
                }}
              >
                <span>EXPLORE THE PLATFORM</span>
                <span className="text-[#25d366] font-bold text-lg">&rarr;</span>
              </SoapBubbleButton>
            </SoapBubbleMaterial>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default E2EEHomePage;
