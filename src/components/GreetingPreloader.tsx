import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Words from Dennis Snellenberg / Skiper 8 preloader (video extraction)
const WORDS = [
  'Hello',
  'Bonjour',
  'Ciao',
  'Olà',
  'Hallo',
  'ਸਤਿ ਸ਼੍ਰੀ ਅਕਾਲ ਜੀ',
];

interface GreetingPreloaderProps {
  onComplete: () => void;
}

export const GreetingPreloader: React.FC<GreetingPreloaderProps> = ({ onComplete }) => {
  const [index, setIndex] = useState(0);
  const [dimension, setDimension] = useState({ width: 0, height: 0 });
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    setDimension({
      width: window.innerWidth,
      height: window.innerHeight,
    });

    const handleResize = () => {
      setDimension({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Cycle through the words
  useEffect(() => {
    if (index === WORDS.length - 1) {
      // Pause slightly on the last word before starting the reverse slide-up exit
      const exitTimer = setTimeout(() => {
        setIsExiting(true);
      }, 500);
      return () => clearTimeout(exitTimer);
    }

    const timer = setTimeout(
      () => {
        setIndex((prev) => prev + 1);
      },
      index === 0 ? 900 : 260
    );

    return () => clearTimeout(timer);
  }, [index]);

  // Initial and exit SVG curved path morphs
  // User explicitly instructed: "reverse animation and make the white screen a bit translucent"
  // It starts completely covering the viewport and exits by curving UPWARDS smoothly
  const initialPath = `M0 0 L${dimension.width} 0 L${dimension.width} ${dimension.height} Q${dimension.width / 2} ${dimension.height + 300} 0 ${dimension.height}  L0 0`;
  const targetPath = `M0 0 L${dimension.width} 0 L${dimension.width} ${dimension.height} Q${dimension.width / 2} ${dimension.height} 0 ${dimension.height}  L0 0`;
  const exitCurvePath = `M0 0 L${dimension.width} 0 L${dimension.width} ${dimension.height} Q${dimension.width / 2} 0 0 ${dimension.height} L0 0`;

  return (
    <AnimatePresence onExitComplete={onComplete}>
      {!isExiting ? (
        <motion.div
          key="greeting-preloader"
          initial={{ y: 0 }}
          exit={{
            y: '-100vh',
            transition: { duration: 0.9, ease: [0.76, 0, 0.24, 1], delay: 0.2 },
          }}
          className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-auto select-none overflow-hidden"
          style={{
            // Translucent Biscotti cream / WhatsApp off-white screen with subtle backdrop blur
            backgroundColor: 'rgba(239, 234, 226, 0.88)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
          }}
        >
          {/* Greeting Word with Dennis Snellenberg indicator dot */}
          <div className="relative z-10 flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-[#00a884] animate-pulse" />
            <motion.p
              key={index}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
              className="text-4xl sm:text-5xl md:text-6xl font-semibold text-[#0b141a] tracking-tight"
              style={{
                fontFamily:
                  'system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
              }}
            >
              {WORDS[index]}
            </motion.p>
          </div>

          {/* SVG Reverse Curve Morph Bottom Lip */}
          {dimension.width > 0 && (
            <svg className="absolute top-0 left-0 w-full h-[calc(100%+300px)] pointer-events-none -z-10 fill-[#efeae2]/90">
              <motion.path
                initial={{ d: initialPath }}
                animate={{ d: targetPath }}
                exit={{
                  d: exitCurvePath,
                  transition: { duration: 0.9, ease: [0.76, 0, 0.24, 1] },
                }}
              />
            </svg>
          )}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
};
