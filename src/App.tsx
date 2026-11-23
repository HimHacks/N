import React, { useState, useEffect, useRef } from 'react';
import { E2EEHomePage } from './components/features/E2EEHomePage';
import { CaesarCipherInteraction } from './components/features/CaesarCipherInteraction';
import { GreetingPreloader } from './components/GreetingPreloader';
import { WordsPreloader, type WordPreloaderPhase } from './components/WordsPreloader';

export const App: React.FC = () => {
  const [hasVisited, setHasVisited] = useState(false);
  const [currentView, setCurrentView] = useState<'home' | 'simulator'>('home');
  const [preloaderPhase, setPreloaderPhase] = useState<WordPreloaderPhase>('idle');
  const [buttonOrigin, setButtonOrigin] = useState<{ x: number; y: number } | null>(null);
  const simulatorRef = useRef<HTMLDivElement>(null);

  // 1. User clicks the "Let's take a deep dive" soap bubble button on HomePage
  const handleStartDeepDive = (origin?: { x: number; y: number }) => {
    if (origin) {
      setButtonOrigin(origin);
    }
    // Expand curtain directly outward from the bubble button
    setPreloaderPhase('expanding');
  };

  // 2. Spreading bubble curtain covers the entire screen -> opens compiling studio card
  const handleBubbleExpanded = () => {
    setPreloaderPhase('loading');
  };

  // 3. Compiling reaches 100% -> mount the simulator behind/underneath the compiling card
  const handleLoadingComplete = () => {
    setCurrentView('simulator');
  };

  // 4. From the compiling page, after it loads, user has the option to scroll down to see the simulator!
  const handleScrollDownFromCompiling = () => {
    // Reverse preloader smoothly contracts back into the bubble origin
    setPreloaderPhase('exiting');
  };

  // 5. Native wheel / touch scroll listener while in the loaded compiling page
  useEffect(() => {
    if (preloaderPhase !== 'loading' || currentView !== 'simulator') return;

    let accumulatedDelta = 0;
    const handleWheel = (e: WheelEvent) => {
      if (e.deltaY > 20) {
        accumulatedDelta += e.deltaY;
        if (accumulatedDelta > 60) {
          handleScrollDownFromCompiling();
        }
      }
    };

    let touchStartY = 0;
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };
    const handleTouchMove = (e: TouchEvent) => {
      const touchY = e.touches[0].clientY;
      if (touchStartY - touchY > 50) {
        handleScrollDownFromCompiling();
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: true });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [preloaderPhase, currentView]);

  // When reverse contraction finishes, preloader is idle
  const handlePreloaderExited = () => {
    setPreloaderPhase('idle');
  };

  return (
    <div className="relative w-full min-h-screen bg-[#0b141a] text-white selection:bg-[#00a884] selection:text-white">
      {/* 
        Initial Visitor Arrival: Word Preloader
        Cycles multilingual greetings (Mandarin, Malay, Tamil, Punjabi, Bonjour, Ciao...)
        Clean typography, slightly translucent cream backdrop
      */}
      {!hasVisited && (
        <GreetingPreloader onComplete={() => setHasVisited(true)} />
      )}

      {/* 
        Original Compiling Studio Preloader with Rising Flat Soffit Gradient:
        Opens on bubble button click. After 100% load, user has the option to scroll down
        to reveal the simulator!
      */}
      <WordsPreloader
        phase={preloaderPhase}
        buttonOrigin={buttonOrigin}
        onExpanded={handleBubbleExpanded}
        onLoadingComplete={handleLoadingComplete}
        onExited={handlePreloaderExited}
        onScrollDown={handleScrollDownFromCompiling}
      />

      {/* 
        View Routing:
        - 'home': Main Hero Page with Lumen Interactive Shader and Soap Bubble button
        - 'simulator': Interactive Human Walk & Caesar Cipher E2EE Simulator
      */}
      {currentView === 'simulator' ? (
        <div ref={simulatorRef} className="relative w-full min-h-screen">
          <CaesarCipherInteraction onScrollToTop={() => setCurrentView('home')} />
        </div>
      ) : (
        <E2EEHomePage onNavigateToSimulator={handleStartDeepDive} />
      )}
    </div>
  );
};

export default App;
