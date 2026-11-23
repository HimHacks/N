import React, { useState } from 'react';
import { E2EEHomePage } from './components/features/E2EEHomePage';
import { E2EESimulatorPortal } from './components/features/E2EESimulatorPortal';
import { WordsPreloader, type WordPreloaderPhase } from './components/WordsPreloader';
import { GreetingPreloader } from './components/GreetingPreloader';

export const App: React.FC = () => {
  const [hasVisited, setHasVisited] = useState(false);
  const [currentView, setCurrentView] = useState<'home' | 'simulator'>('home');
  const [preloaderPhase, setPreloaderPhase] = useState<WordPreloaderPhase>('idle');
  const [buttonOrigin, setButtonOrigin] = useState<{ x: number; y: number } | null>(null);

  // Triggered when user clicks the "Let's take a deep dive" bubble button on HomePage
  // origin contains the exact viewport coordinates of the bubble button
  const handleStartDeepDive = (origin?: { x: number; y: number }) => {
    if (origin) {
      setButtonOrigin(origin);
    }
    // 1. Black screen expands directly outward from the bubble button
    setPreloaderPhase('expanding');
  };

  // Called when the spreading bubble curtain covers the entire screen
  const handleBubbleExpanded = () => {
    // 2. Open compiling card with cycling crypto words and 6s counter with rising flat Soffit gradient
    setPreloaderPhase('loading');
  };

  // Called when 100% is reached
  const handleLoadingComplete = () => {
    // 3. Mount the simulator portal behind the curtain
    setCurrentView('simulator');

    // 4. Reverse word preloader: the black curtain smoothly contracts back into the bubble button origin,
    // revealing the loaded simulator portal!
    setPreloaderPhase('exiting');
  };

  // Called when the reverse preloader finishes contracting
  const handlePreloaderExited = () => {
    setPreloaderPhase('idle');
  };

  return (
    <>
      {/* 
        Initial Page Load Greeting Word Preloader (Skiper 8 / Dennis Snellenberg reverse animation):
        Translucent white/Biscotti cream screen cycling through greetings, then sliding up in reverse curve
      */}
      {!hasVisited && (
        <GreetingPreloader onComplete={() => setHasVisited(true)} />
      )}

      <WordsPreloader
        phase={preloaderPhase}
        buttonOrigin={buttonOrigin}
        onExpanded={handleBubbleExpanded}
        onLoadingComplete={handleLoadingComplete}
        onExited={handlePreloaderExited}
      />
      {currentView === 'simulator' ? (
        <E2EESimulatorPortal onBackToHome={() => setCurrentView('home')} />
      ) : (
        <E2EEHomePage onNavigateToSimulator={handleStartDeepDive} />
      )}
    </>
  );
};

export default App;
