import React, { useState, useEffect, useRef } from 'react';
import { E2EEHomePage } from './components/features/E2EEHomePage';
import { MainGuidedSimulator } from './components/features/MainGuidedSimulator';
import { CaesarCipherInteraction } from './components/features/CaesarCipherInteraction';
import { GreetingPreloader } from './components/GreetingPreloader';
import { WordsPreloader, type WordPreloaderPhase } from './components/WordsPreloader';

export const App: React.FC = () => {
  // Original Greeting Preloader ('Hello', 'Bonjour', ...) plays at calm natural cadence
  const [hasVisited, setHasVisited] = useState(false);
  const [currentView, setCurrentView] = useState<'home' | 'simulator' | 'caesar'>('home');
  const [preloaderPhase, setPreloaderPhase] = useState<WordPreloaderPhase>('idle');
  const [triggerType, setTriggerType] = useState<'button' | 'scroll'>('scroll');
  const [scrollFraction, setScrollFraction] = useState<number>(0);
  const [isInteractiveScroll, setIsInteractiveScroll] = useState<boolean>(false);
  const [buttonOrigin, setButtonOrigin] = useState<{ x: number; y: number } | null>(null);
  const [isCompilingFinished, setIsCompilingFinished] = useState(false);
  const simulatorRef = useRef<HTMLDivElement>(null);

  // 1. User clicks the "Find out in 2 minutes" primary button on HomePage -> auto-scrolls to loading page!
  const handleStartDeepDive = (origin?: { x: number; y: number }) => {
    if (preloaderPhase !== 'idle') return;
    if (origin) {
      setButtonOrigin(origin);
      setTriggerType('button');
    } else {
      setTriggerType('scroll');
    }
    setIsInteractiveScroll(false);
    setScrollFraction(1);
    setIsCompilingFinished(false);
    setPreloaderPhase('expanding');
  };

  // Scroll detection on HomePage:
  // - Interactive scrubbing: scrolling down moves Biscotti cream + fluid gradient upward in real-time
  // - Reversible: user can scroll back up when under 75% coverage
  // - Lock-in threshold: when reaching >= 75% coverage (0.75), automatically locks and rolls to 100%
  useEffect(() => {
    if (!hasVisited || currentView !== 'home' || preloaderPhase !== 'idle') return;

    let accumulatedScroll = 0;
    const maxScrollDistance = 550; // px of wheel/touch movement to reach 100%

    const handleWheel = (e: WheelEvent) => {
      // Accumulate wheel delta (positive = downward, negative = upward)
      accumulatedScroll += e.deltaY;
      if (accumulatedScroll < 0) accumulatedScroll = 0;

      const fraction = Math.min(1, accumulatedScroll / maxScrollDistance);
      setScrollFraction(fraction);

      if (fraction > 0.05) {
        setIsInteractiveScroll(true);
      } else {
        setIsInteractiveScroll(false);
      }

      // If user reaches 75% (0.75) of the screen, automatically snap to the loading page!
      if (fraction >= 0.75) {
        setTriggerType('scroll');
        setIsInteractiveScroll(false);
        setScrollFraction(1);
        setIsCompilingFinished(false);
        setPreloaderPhase('expanding');
      }
    };

    let touchStartY = 0;
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };
    const handleTouchMove = (e: TouchEvent) => {
      const touchY = e.touches[0].clientY;
      const deltaY = touchStartY - touchY;
      accumulatedScroll += deltaY * 1.5;
      touchStartY = touchY;
      if (accumulatedScroll < 0) accumulatedScroll = 0;

      const fraction = Math.min(1, accumulatedScroll / maxScrollDistance);
      setScrollFraction(fraction);

      if (fraction > 0.05) {
        setIsInteractiveScroll(true);
      } else {
        setIsInteractiveScroll(false);
      }

      // 75% snap threshold
      if (fraction >= 0.75) {
        setTriggerType('scroll');
        setIsInteractiveScroll(false);
        setScrollFraction(1);
        setIsCompilingFinished(false);
        setPreloaderPhase('expanding');
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
  }, [hasVisited, currentView, preloaderPhase]);

  // 2. Rolling curtain reaches full screen -> opens compiling studio card
  const handleBubbleExpanded = () => {
    setPreloaderPhase('loading');
  };

  // 3. Compiling reaches 100% -> mark compiling finished
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
    setIsInteractiveScroll(false);
    setScrollFraction(0);
  };

  return (
    <div className="relative w-full min-h-screen bg-[#F7F4EC] text-[#153A32] selection:bg-[#176B50] selection:text-white">
      {/* 
        Initial Visitor Arrival: Original Greeting Preloader
        Cycles multilingual greetings ('Hello', 'Bonjour', ...) with calm natural cadence
      */}
      {!hasVisited && (
        <GreetingPreloader onComplete={() => setHasVisited(true)} />
      )}

      {/* 
        Compiling Studio Preloader with Rising WebGL2 Gradient & Lumen Shader Background:
        - Interactive real-time scrubbing with 75% auto-snap threshold
        - Auto-scrolls on clicking 'Find out in 2 minutes'
      */}
      <WordsPreloader
        phase={preloaderPhase}
        buttonOrigin={buttonOrigin}
        triggerType={triggerType}
        scrollFraction={scrollFraction}
        isInteractiveScroll={isInteractiveScroll}
        onExpanded={handleBubbleExpanded}
        onLoadingComplete={handleLoadingComplete}
        onExited={handlePreloaderExited}
      />

      {/* 
        View Routing:
        - 'home': Human-to-Human E2EE Showcase (Aarav, Meera)
        - 'simulator': Working E2EE Simulator (Sender Device A, Delivery Server Relay, Recipient Device B)
        - 'caesar': Interactive Caesar Cipher
      */}
      {currentView === 'home' && (
        <E2EEHomePage
          onNavigateToSimulator={handleStartDeepDive}
          isInitialReady={hasVisited}
        />
      )}

      {currentView === 'simulator' && (
        <div ref={simulatorRef} className="relative w-full min-h-screen bg-[#E9EEE5] py-8 px-4 sm:px-8">
          <div className="max-w-6xl mx-auto mb-4 flex items-center justify-between">
            <button
              onClick={() => setCurrentView('home')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#D3CDC2] bg-white text-[#153A32] text-xs font-semibold hover:bg-[#E3EDE3] transition-colors cursor-pointer shadow-xs"
            >
              &larr; Back to Home
            </button>
            <button
              onClick={() => setCurrentView('caesar')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#176B50] text-white text-xs font-semibold hover:bg-[#12553F] transition-colors cursor-pointer shadow-xs"
            >
              Interactive Caesar Cipher Lab &rarr;
            </button>
          </div>
          <MainGuidedSimulator />
        </div>
      )}

      {currentView === 'caesar' && (
        <div className="relative w-full min-h-screen">
          <div className="fixed top-4 left-4 z-50">
            <button
              onClick={() => setCurrentView('simulator')}
              className="px-4 py-2 rounded-full bg-[#153A32] text-white text-xs font-semibold hover:bg-[#176B50] transition-colors cursor-pointer shadow-md"
            >
              &larr; Back to E2EE Simulator
            </button>
          </div>
          <CaesarCipherInteraction onScrollToTop={() => setCurrentView('simulator')} />
        </div>
      )}
    </div>
  );
};

export default App;
