import React, { useState, useEffect, useRef } from 'react';
import { E2EEHomePage } from './components/features/E2EEHomePage';
import { CaesarCipherInteraction } from './components/features/CaesarCipherInteraction';
import { GreetingPreloader } from './components/GreetingPreloader';
import { ScrollTransitionPreloader } from './components/ScrollTransitionPreloader';

export const App: React.FC = () => {
  const [hasVisited, setHasVisited] = useState(false);
  const [showScrollPreloader, setShowScrollPreloader] = useState(false);
  const hasTriggeredScrollPreloaderRef = useRef(false);
  const playgroundRef = useRef<HTMLDivElement>(null);

  // Smooth scroll down to the human interaction section
  const handleScrollToPlayground = () => {
    // Show the transition preloader animation when navigating between sections
    setShowScrollPreloader(true);
    setTimeout(() => {
      playgroundRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 400);

    setTimeout(() => {
      setShowScrollPreloader(false);
    }, 1300);
  };

  // Scroll listener to detect when user scrolls towards the interaction section
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const vh = window.innerHeight;

      // When the user scrolls past 30% of the landing page for the first time
      if (scrollY > vh * 0.3 && !hasTriggeredScrollPreloaderRef.current) {
        hasTriggeredScrollPreloaderRef.current = true;
        setShowScrollPreloader(true);
        setTimeout(() => {
          setShowScrollPreloader(false);
        }, 1300);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="relative w-full min-h-screen bg-[#0b141a] text-white selection:bg-[#00a884] selection:text-white">
      {/* 
        1. Initial Visitor Arrival: Word Preloader
        Cycles multilingual greetings (Mandarin 你好, Malay Apa Khabar, Tamil வணக்கம், Punjabi, Bonjour, Ciao...)
        Clean typography without green dot, slightly translucent cream backdrop
      */}
      {!hasVisited && (
        <GreetingPreloader onComplete={() => setHasVisited(true)} />
      )}

      {/* 
        Scroll Transition Word Preloader between Home Page and the Human Interaction Section
      */}
      <ScrollTransitionPreloader isVisible={showScrollPreloader} />

      {/* 
        2. Main Homepage (Hero & Lumen Interactive Shader)
        "The Syntax Unveilers Presents - End-to-End Encryption"
        Soap Bubble Button linking down to the interactive playground
      */}
      <section className="relative w-full min-h-screen">
        <E2EEHomePage onScrollToPlayground={handleScrollToPlayground} />
      </section>

      {/* 
        3. Single-Scroll Seamless Transition:
        Interactive Two-Human Walk & Text Caesar Cipher Simulator
        Retaining the beautiful Soffit gradient background
      */}
      <div ref={playgroundRef} id="cipher-playground" className="relative w-full">
        <CaesarCipherInteraction onScrollToTop={() => window.scrollTo({ top: 0, behavior: 'smooth' })} />
      </div>
    </div>
  );
};

export default App;
