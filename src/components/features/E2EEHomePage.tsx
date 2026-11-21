import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { E2EEPageBackground } from './E2EEPageBackground';
import { SoapBubbleButton, SoapBubbleMaterial } from '../soap-bubble';

interface E2EEHomePageProps {
  onNavigateToSimulator: () => void;
}

// Authentic cryptographic ASCII runes extracted directly from the user's reference image
const ASCII_RUNES = ['Ø', '1', '&', '0', '!', '+', 'θ', '_', '%', 'cd', 'A', 'X', 'H', 'λ', '§', '#', '?', '7', 'µ', '0', '1'];

interface AsciiParticle {
  id: number;
  char: string;
  leftPercent: number; // Position strictly across 'Encryption' (12% to 94% or right edge >100%)
  startY: number;
  targetY: number;
  startX: number;
  targetX: number;
  duration: number;
  delay: number;
  size: number;
  color: string;
}

export const FloatingAsciiEncryption: React.FC = () => {
  const [particles, setParticles] = useState<AsciiParticle[]>([]);

  // Generate border particles strictly around 'Encryption' (top, bottom, and right edges only).
  // NO particles exist in the gap between 'End-to-End' and 'Encryption' (< 10%).
  useEffect(() => {
    const colors = [
      '#22d3ee', // Cyan
      '#2dd4bf', // Mint
      '#38bdf8', // Light Cyan
      '#6ee7b7', // Mint-Emerald
      '#a7f3d0', // Pale Mint
      '#06b6d4', // Deep Cyan
    ];

    const generateParticles = () => {
      const list: AsciiParticle[] = [];
      const count = 18;

      for (let i = 0; i < count; i++) {
        const side = i % 3; // 0: top border, 1: bottom border, 2: right edge
        let leftPercent = 14;
        let startX = 0;
        let targetX = 0;
        let startY = 0;
        let targetY = 0;

        // Distribute evenly along the word 'Encryption' (from 14% to 94%)
        const spread = 14 + (i / count) * 78;

        if (side === 0) {
          // Top border: starts 26px to 46px above the letters, absorbed downward into the letter body
          leftPercent = spread;
          startX = (Math.random() - 0.5) * 8;
          targetX = 0;
          startY = -26 - Math.random() * 22; // -26px to -48px
          targetY = 2 + Math.random() * 6; // into the glyph
        } else if (side === 1) {
          // Bottom border: starts 26px to 46px below the letters, absorbed upward into the letter body
          leftPercent = spread;
          startX = (Math.random() - 0.5) * 8;
          targetX = 0;
          startY = 26 + Math.random() * 22; // +26px to +48px
          targetY = -2 - Math.random() * 6; // into the glyph
        } else {
          // Right edge: starts just past the 'n' (102% to 118%), absorbed leftward into 'o' and 'n'
          leftPercent = 101 + Math.random() * 16;
          startX = 0;
          targetX = -24 - Math.random() * 18; // drifts into rightmost characters
          startY = (Math.random() - 0.5) * 26;
          targetY = 0;
        }

        list.push({
          id: i,
          char: ASCII_RUNES[Math.floor(Math.random() * ASCII_RUNES.length)],
          leftPercent,
          startX,
          targetX,
          startY,
          targetY,
          duration: 1.8 + Math.random() * 1.6, // 1.8s to 3.4s
          delay: (i / count) * 2.0,
          size: Math.random() > 0.4 ? 12 : 10,
          color: colors[Math.floor(Math.random() * colors.length)],
        });
      }
      return list;
    };

    setParticles(generateParticles());

    // Continuously cycle cryptographic runes
    const interval = setInterval(() => {
      setParticles(prev =>
        prev.map(p =>
          Math.random() > 0.45
            ? { ...p, char: ASCII_RUNES[Math.floor(Math.random() * ASCII_RUNES.length)] }
            : p
        )
      );
    }, 1200);

    return () => clearInterval(interval);
  }, []);

  return (
    <span className="relative inline-block select-none whitespace-nowrap shrink-0">
      {/* Background Holographic Glow & Aura */}
      <span
        aria-hidden="true"
        className="absolute -inset-x-3 -inset-y-2 pointer-events-none rounded-xl blur-xl bg-cyan-400/15"
      />

      {/* Floating & Inward Absorbing ASCII Particles (Strictly on 'Encryption', not in between) */}
      {particles.map(p => (
        <motion.span
          key={p.id}
          initial={{
            x: p.startX,
            y: p.startY,
            opacity: 0,
            scale: 0.8,
          }}
          animate={{
            x: [p.startX, p.startX * 0.5, p.targetX],
            y: [p.startY, p.startY * 0.5, p.targetY],
            opacity: [0, 0.95, 0.9, 0], // Fades out as it touches the glyph center (absorption)
            scale: [0.8, 1.1, 0.85, 0.15], // Shrinks down into the letter
            filter: [
              'blur(0px) brightness(1)',
              'blur(0px) brightness(1.2)',
              'blur(0px) brightness(1.5)',
              'blur(1px) brightness(2)',
            ],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute z-20 pointer-events-none font-mono font-bold leading-none select-none"
          style={{
            left: `${p.leftPercent}%`,
            top: '50%',
            fontSize: `${p.size}px`,
            color: p.color,
            textShadow: `0 0 8px ${p.color}, 0 0 16px rgba(34, 211, 238, 0.85)`,
          }}
        >
          {p.char}
        </motion.span>
      ))}

      {/* 
        Subtle greyed-out glitch lines on 'Encryption'
        Smoothly sweeps from left to right across the typography with organic digital staggering
      */}
      <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden select-none mix-blend-screen">
        {/* Hairline 1 - Upper slice */}
        <motion.div
          animate={{ x: ['-60%', '140%'], opacity: [0, 0.55, 0.7, 0] }}
          transition={{ duration: 5.2, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-[22%] h-[1px] w-20 bg-gradient-to-r from-transparent via-slate-300/60 to-transparent"
        />
        {/* Hairline 2 - Mid-upper slice */}
        <motion.div
          animate={{ x: ['-80%', '150%'], opacity: [0, 0.5, 0.65, 0] }}
          transition={{ duration: 6.4, repeat: Infinity, ease: 'easeInOut', delay: 1.2 }}
          className="absolute top-[38%] h-[1.5px] w-28 bg-gradient-to-r from-transparent via-slate-200/50 to-transparent"
        />
        {/* Hairline 3 - Core center scanner */}
        <motion.div
          animate={{ x: ['-50%', '130%'], opacity: [0, 0.6, 0.75, 0] }}
          transition={{ duration: 4.8, repeat: Infinity, ease: 'easeInOut', delay: 2.1 }}
          className="absolute top-[54%] h-[1px] w-24 bg-gradient-to-r from-transparent via-slate-300/70 to-transparent"
        />
        {/* Hairline 4 - Lower slice */}
        <motion.div
          animate={{ x: ['-70%', '140%'], opacity: [0, 0.45, 0.6, 0] }}
          transition={{ duration: 5.8, repeat: Infinity, ease: 'easeInOut', delay: 3.0 }}
          className="absolute top-[70%] h-[1.5px] w-28 bg-gradient-to-r from-transparent via-slate-200/50 to-transparent"
        />
        {/* Hairline 5 - Baseline slice */}
        <motion.div
          animate={{ x: ['-60%', '130%'], opacity: [0, 0.4, 0.55, 0] }}
          transition={{ duration: 6.8, repeat: Infinity, ease: 'easeInOut', delay: 0.6 }}
          className="absolute top-[84%] h-[1px] w-32 bg-gradient-to-r from-transparent via-slate-300/45 to-transparent"
        />
        {/* Micro sweep beam */}
        <motion.div
          animate={{ x: ['-40%', '130%'], opacity: [0, 0.35, 0.35, 0] }}
          transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut', delay: 1.8 }}
          className="absolute inset-y-0 w-12 bg-gradient-to-r from-transparent via-slate-300/25 to-transparent blur-[1px]"
        />
      </div>

      {/* Digital Scanline Glitch Slices (Matching Screenshot) */}
      <motion.span
        aria-hidden="true"
        animate={{ x: [0, 2, -1, 2, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute inset-0 z-20 pointer-events-none text-cyan-200 opacity-60 font-black tracking-tight"
        style={{
          clipPath: 'polygon(0 15%, 100% 15%, 100% 22%, 0 22%, 0 54%, 100% 54%, 100% 60%, 0 60%)',
          filter: 'drop-shadow(0 0 6px #22d3ee)',
        }}
      >
        Encryption
      </motion.span>
      <motion.span
        aria-hidden="true"
        animate={{ x: [0, -2, 1, -2, 0] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
        className="absolute inset-0 z-20 pointer-events-none text-teal-300 opacity-50 font-black tracking-tight"
        style={{
          clipPath: 'polygon(0 38%, 100% 38%, 100% 44%, 0 44%, 0 78%, 100% 78%, 100% 84%, 0 84%)',
          filter: 'drop-shadow(0 0 6px #2dd4bf)',
        }}
      >
        Encryption
      </motion.span>

      {/* Primary Radiant 'Encryption' Text — Matches cyan/mint/teal in Src */}
      <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-teal-300 via-cyan-300 to-emerald-300 font-black tracking-tight drop-shadow-[0_0_24px_rgba(34,211,238,0.55)]">
        Encryption
      </span>
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
            "End-to-End" in plain crisp solid white + "Encryption" with absorption ASCII particle animation
          */}
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="flex items-center justify-center whitespace-nowrap flex-nowrap gap-x-2 sm:gap-x-4 md:gap-x-5 text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black tracking-tight text-center leading-none select-none max-w-full"
          >
            {/* Plain crisp solid white 'End-to-End' */}
            <span className="text-white font-black drop-shadow-[0_2px_15px_rgba(0,0,0,0.5)] whitespace-nowrap shrink-0">
              End-to-End
            </span>

            {/* Glowing Cyan/Mint 'Encryption' with Absorption ASCII particles & Moving Grey Glitch Lines */}
            <FloatingAsciiEncryption />
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
          Bottom Hot Zone & Interactive SoapBubble Button:
          Reverted to original text: "Let's take a deep dive →"
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
