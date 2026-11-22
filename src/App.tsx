import React, { useState } from 'react';
import { E2EEHomePage } from './components/features/E2EEHomePage';
import { E2EESimulatorPortal } from './components/features/E2EESimulatorPortal';
import { DoubleStairsPreloader, type PreloaderPhase } from './components/DoubleStairsPreloader';

export const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<'home' | 'simulator'>('home');
  const [preloaderPhase, setPreloaderPhase] = useState<PreloaderPhase>('idle');

  // Triggered when user clicks the "Let's take a deep dive" button on HomePage
  const handleStartDeepDive = () => {
    // 1. Double stairs chunks cascade together from top and bottom
    setPreloaderPhase('closing');
  };

  // Called when the double stairs chunks finish coming together
  const handleStairsClosed = () => {
    // 2. Start the loading phase (dot matrix counts 0% -> 100% with smooth digit transitions)
    setPreloaderPhase('loading');
  };

  // Called when the 0% -> 100% digit loading animation finishes
  const handleLoadingComplete = () => {
    // 3. Mount the simulator behind the curtains
    setCurrentView('simulator');

    // 4. Retract the chunks in a reverse double stair preloader wave
    setPreloaderPhase('opening');
  };

  // Called when reverse double stairs finish retracting to reveal the simulator
  const handleStairsOpened = () => {
    setPreloaderPhase('idle');
  };

  return (
    <>
      <DoubleStairsPreloader
        phase={preloaderPhase}
        onClosed={handleStairsClosed}
        onLoadingComplete={handleLoadingComplete}
        onOpened={handleStairsOpened}
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
