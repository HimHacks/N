import React, { useState, useEffect, useRef } from 'react';
import { E2EEHomePage } from './components/features/E2EEHomePage';
import { CaesarCipherInteraction } from './components/features/CaesarCipherInteraction';
import { GreetingPreloader } from './components/GreetingPreloader';
import { WordsPreloader, type WordPreloaderPhase } from './components/WordsPreloader';

export const App: React.FC = () => {
  // Use sessionStorage to ensure the initial GreetingPreloader runs strictly ONCE per session
  const [hasVisited, setHasVisited] = useState(() => {
    try {
      return sessionStorage.getItem('gvh_greeting_seen') === 'true';
    } catch {
      return false;
    }
  });
  const [currentView, setCurrentView] = useState<'home' | 'simulator'>('home');
  const [preloaderPhase, setPreloaderPhase] = useState<WordPreloaderPhase>('idle');
  const [buttonOrigin, setButtonOrigin] = useState<{ x: number; y: number } | null>(null);
  const [isCompilingFinished, setIsCompilingFinished] = useState(false);
  const simulatorRef = useRef<HTMLDivElement>(null);

  // 1. User clicks the "Let's take a deep dive" soap bubble button on HomePage
  const handleStartDeepDive = (origin?: { x: number; y: number }) => {
    // Prevent re-triggering if already expanding or loading
    if (preloaderPhase !== 'idle') return;
    if (origin) {
      setButtonOrigin(origin);
    }
    setIsCompilingFinished(false);
    // Expand curtain directly outward from the bubble button
    setPreloaderPhase('expanding');
  };

  // 2. Spreading bubble curtain covers the entire screen -> opens compiling studio card
  const handleBubbleExpanded = () => {
    setPreloaderPhase('loading');
  };

  // 3. Compiling reaches 100% -> mark compiling finished (Do NOT switch currentView to simulator yet!
  // Switching currentView would cause re-render and unmount/remount of page components.
  // We only mount/switch to simulator when the user actually scrolls down and exits the preloader!)
  const handleLoadingComplete = () => {
    setIsCompilingFinished(true);
  };

  // 4. Scrolling down triggers navigation ONLY AFTER compiling finishes
  useEffect(() => {
    if (preloaderPhase !== 'loading' || !isCompilingFinished) return;

    let accumulatedDelta = 0;
    const handleWheel = (e: WheelEvent) => {
      // User must scroll down
      if (e.deltaY > 15) {
        accumulatedDelta += e.deltaY;
        if (accumulatedDelta > 45) {
          setPreloaderPhase('exiting');
        }
      }
    };

    let touchStartY = 0;
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };
    const handleTouchMove = (e: TouchEvent) => {
      const touchY = e.touches[0].clientY;
      if (touchStartY - touchY > 40) {
        setPreloaderPhase('exiting');
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
  }, [preloaderPhase, isCompilingFinished]);

  // When reverse downward/upward slide finishes, switch to simulator and reset preloader
  const handlePreloaderExited = () => {
    setCurrentView('simulator');
    setPreloaderPhase('idle');
  };

  return (
    <div className="relative w-full min-h-screen bg-[#0b141a] text-white selection:bg-[#00a884] selection:text-white">
      {/* 
        Initial Visitor Arrival: Greeting Word Preloader
        Runs ONLY once when the user first opens the site
      */}
      {!hasVisited && (
        <GreetingPreloader
          onComplete={() => {
            try {
              sessionStorage.setItem('gvh_greeting_seen', 'true');
            } catch {}
            setHasVisited(true);
          }}
        />
      )}

      {/* 
        Compiling Studio Preloader with Rising WebGL2 Gradient & Lumen Shader Background:
        Only appears when the visitor clicks the soap bubble button on the homepage.
      */}
      <WordsPreloader
        phase={preloaderPhase}
        buttonOrigin={buttonOrigin}
        onExpanded={handleBubbleExpanded}
        onLoadingComplete={handleLoadingComplete}
        onExited={handlePreloaderExited}
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
