import React, { useState } from 'react';
import { E2EEHomePage } from './components/features/E2EEHomePage';
import { E2EESimulatorPortal } from './components/features/E2EESimulatorPortal';
import { WordsPreloader, type WordPreloaderPhase } from './components/WordsPreloader';

export const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<'home' | 'simulator'>('home');
  const [preloaderPhase, setPreloaderPhase] = useState<WordPreloaderPhase>('idle');

  // Triggered when user clicks the "Let's take a deep dive" bubble button on HomePage
  const handleStartDeepDive = () => {
    // 1. Black bubble spreads outward across the entire screen
    setPreloaderPhase('expanding');
  };

  // Called when the spreading bubble curtain covers the entire screen
  const handleBubbleExpanded = () => {
    // 2. Open the compiling card with cycling crypto words and 1% -> 100% counter
    setPreloaderPhase('loading');
  };

  // Called when 100% is reached
  const handleLoadingComplete = () => {
    // 3. Mount the simulator portal behind the curtain
    setCurrentView('simulator');

    // 4. Elastic curve (Skiper 8 / Dennis Snellenberg) lifts up off the screen to reveal the simulator
    setPreloaderPhase('exiting');
  };

  // Called when the curved curtain finishes exiting
  const handlePreloaderExited = () => {
    setPreloaderPhase('idle');
  };

  return (
    <>
      <WordsPreloader
        phase={preloaderPhase}
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
