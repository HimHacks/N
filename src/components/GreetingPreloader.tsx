import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Multilingual Greetings including Mandarin (Chinese), Singaporean languages (English, Mandarin, Malay, Tamil), plus global greetings
const GREETING_WORDS = [
  'Hello',
  'Bonjour',
  'Ciao',
  'Olà',
  'Hallo',
  '你好',              // Mandarin / Chinese
  'Apa Khabar',        // Malay (Singapore national language)
  'வணக்கம்',          // Tamil (Singapore official language)
  'ਸਤਿ ਸ਼੍ਰੀ ਅਕਾਲ ਜੀ',  // Punjabi
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
    if (index === GREETING_WORDS.length - 1) {
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
      index === 0 ? 800 : 250
    );

    return () => clearTimeout(timer);
  }, [index]);

  // SVG Curved Path Morph (Dennis Snellenberg curve as in the original implementation)
  const initialPath = `M0 0 L${dimension.width} 0 L${dimension.width} ${dimension.height} Q${dimension.width / 2} ${dimension.height + 300} 0 ${dimension.height} L0 0`;
  const targetPath = `M0 0 L${dimension.width} 0 L${dimension.width} ${dimension.height} Q${dimension.width / 2} ${dimension.height} 0 ${dimension.height} L0 0`;
  const curveExitPath = `M0 0 L${dimension.width} 0 L${dimension.width} ${dimension.height} Q${dimension.width / 2} ${dimension.height + 300} 0 ${dimension.height} L0 0`;

  const curveTransition = { duration: 0.8, ease: [0.76, 0, 0.24, 1] };

  return (
    <AnimatePresence onExitComplete={onComplete}>
      {!isExiting ? (
        <motion.div
          key="greeting-preloader"
          initial={{ y: 0 }}
          exit={{
            y: '-100vh',
            transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1], delay: 0.1 },
          }}
          className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-auto select-none overflow-hidden"
          style={{
            // Clean white background with teeny-tiny translucency (0.97) so background is just subtly visible through it
            backgroundColor: 'rgba(255, 255, 255, 0.97)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
          }}
        >
          {/* Greeting Word: Pure clean typography without green dot */}
          <div className="relative z-10 flex items-center justify-center text-center px-4">
            <motion.p
              key={index}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.18 }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold text-[#0b141a] tracking-tight"
              style={{
                fontFamily:
                  'system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
              }}
            >
              {GREETING_WORDS[index]}
            </motion.p>
          </div>

          {/* Authentic SVG Curved Morphing Bottom Arch */}
          {dimension.width > 0 && (
            <svg className="absolute top-0 left-0 w-full h-[calc(100%+300px)] pointer-events-none -z-10 fill-white/97">
              <motion.path
                initial={{ d: initialPath }}
                animate={{ d: targetPath }}
                exit={{
                  d: curveExitPath,
                  transition: curveTransition,
                }}
              />
            </svg>
          )}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
};
