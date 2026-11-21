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
  startX: number;
  startY: number;
  targetX: number;
  targetY: number;
  duration: number;
  delay: number;
  size: number;
  color: string;
}

export const FloatingAsciiEncryption: React.FC = () => {
  const [particles, setParticles] = useState<AsciiParticle[]>([]);

  // Generate 16 distinct border particles that drift inward into the word 'Encryption'
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
        // Distribute around top, bottom, and edges of 'Encryption'
        const side = i % 4; // 0: top, 1: bottom, 2: right, 3: dispersed top-right
        let startX = 0;
        let startY = 0;
        let targetX = 0;
        let targetY = 0;

        const xSpread = (i / count) * 100; // 0% to 100% across the word

        if (side === 0) {
          // Floating down from top border into the letters
          startX = (Math.random() - 0.5) * 160 + xSpread * 1.8 - 90;
          startY = -22 - Math.random() * 26; // -22px to -48px above
          targetX = startX * 0.45;
          targetY = -2 + Math.random() * 6;
        } else if (side === 1) {
          // Floating up from bottom border into the letters
          startX = (Math.random() - 0.5) * 160 + xSpread * 1.8 - 90;
          startY = 24 + Math.random() * 24; // +24px to +48px below
          targetX = startX * 0.45;
          targetY = -2 - Math.random() * 6;
        } else if (side === 2) {
          // Floating in from right edge
          startX = 70 + Math.random() * 35;
          startY = (Math.random() - 0.5) * 40;
          targetX = 35 + Math.random() * 15;
          targetY = (Math.random() - 0.5) * 12;
        } else {
          // Dispersed top-right / ambient perimeter
          startX = (Math.random() - 0.2) * 180 - 40;
          startY = -18 - Math.random() * 20;
          targetX = startX * 0.6;
          targetY = 0;
        }

        list.push({
          id: i,
          char: ASCII_RUNES[Math.floor(Math.random() * ASCII_RUNES.length)],
          startX,
          startY,
          targetX,
          targetY,
          duration: 1.8 + Math.random() * 1.8, // 1.8s to 3.6s
          delay: (i / count) * 2.2, // Staggered entry
          size: Math.random() > 0.4 ? 12 : 10,
          color: colors[Math.floor(Math.random() * colors.length)],
        });
      }
      return list;
    };

    setParticles(generateParticles());

    // Continuously cycle and randomize ASCII glyphs to simulate live cryptographic data streaming
    const interval = setInterval(() => {
      setParticles(prev =>
        prev.map(p =>
          Math.random() > 0.4
            ? { ...p, char: ASCII_RUNES[Math.floor(Math.random() * ASCII_RUNES.length)] }
            : p
        )
      );
    }, 1400);

    return () => clearInterval(interval);
  }, []);

  return (
    <span className="relative inline-block select-none">
      {/* Background Holographic Glow & Aura */}
      <span
        aria-hidden="true"
        className="absolute -inset-x-4 -inset-y-2 pointer-events-none rounded-xl blur-xl bg-cyan-400/15"
      />

      {/* Floating Inward-Drifting ASCII Particle Cloud */}
      {particles.map(p => (
        <motion.span
          key={p.id}
          initial={{ x: p.startX, y: p.startY, opacity: 0, scale: 0.75 }}
          animate={{
            x: [p.startX, p.startX * 0.7, p.targetX],
            y: [p.startY, p.startY * 0.6, p.targetY],
            opacity: [0, 0.95, 0.85, 0],
            scale: [0.75, 1.05, 0.9, 0.6],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute z-20 pointer-events-none font-mono font-bold leading-none select-none"
          style={{
            fontSize: `${p.size}px`,
            color: p.color,
            textShadow: `0 0 8px ${p.color}, 0 0 16px rgba(34, 211, 238, 0.85)`,
          }}
        >
          {p.char}
        </motion.span>
      ))}

      {/* Digital Scanline Glitch Slices (Matching Screenshot) */}
      <span
        aria-hidden="true"
        className="absolute inset-0 z-20 pointer-events-none text-cyan-200 opacity-60 font-black tracking-tight"
        style={{
          clipPath: 'polygon(0 15%, 100% 15%, 100% 22%, 0 22%, 0 54%, 100% 54%, 100% 60%, 0 60%)',
          transform: 'translateX(2px)',
          filter: 'drop-shadow(0 0 6px #22d3ee)',
        }}
      >
        Encryption
      </span>
      <span
        aria-hidden="true"
        className="absolute inset-0 z-20 pointer-events-none text-teal-300 opacity-50 font-black tracking-tight"
        style={{
          clipPath: 'polygon(0 38%, 100% 38%, 100% 44%, 0 44%, 0 78%, 100% 78%, 100% 84%, 0 84%)',
          transform: 'translateX(-2px)',
          filter: 'drop-shadow(0 0 6px #2dd4bf)',
        }}
      >
        Encryption
      </span>

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
            className="text-xs sm:text-sm font-bold tracking-[0.24em] text-white uppercase text-center mb-4"
          >
            THE SYNTAX UNVEILERS PRESENTS
          </motion.p>

          {/* 
            Headline: In ONE SINGLE LINE:
            "End-to-End" in plain crisp solid white + "Encryption" with floating ASCII particle animation
          */}
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="flex items-center justify-center flex-wrap sm:flex-nowrap gap-x-3 text-4xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-black tracking-tight text-center leading-none"
          >
            {/* Plain crisp solid white 'End-to-End' */}
            <span className="text-white font-black drop-shadow-[0_2px_15px_rgba(0,0,0,0.5)]">
              End-to-End
            </span>

            {/* Glowing Cyan/Mint 'Encryption' with Live Inflowing Border ASCII particles */}
            <FloatingAsciiEncryption />
          </motion.h1>

          {/* Overview text formatted on 2 lines matching Src */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-sm sm:text-base md:text-lg text-slate-200/95 leading-relaxed font-normal max-w-xl mx-auto text-center mt-6"
          >
            Messages are encrypted directly on your device. Only you and the recipient
            <br className="hidden sm:inline" /> hold the keys.
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

        {/* Subtle 4-Point Sparkle Star in Bottom-Right Corner (Matches Src) */}
        <div className="fixed bottom-6 right-8 pointer-events-none z-20 opacity-60">
          <svg
            className="w-6 h-6 text-cyan-200 fill-current drop-shadow-[0_0_10px_rgba(34,211,238,0.6)]"
            viewBox="0 0 24 24"
          >
            <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
          </svg>
        </div>
      </main>
    </E2EEPageBackground>
  );
};
