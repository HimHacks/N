import React, { useState } from 'react';
import { E2EEHomePage } from './components/features/E2EEHomePage';
import { E2EESimulatorPortal } from './components/features/E2EESimulatorPortal';
import { DoubleStairsPreloader, type PreloaderPhase } from './components/DoubleStairsPreloader';

export const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<'home' | 'simulator'>('home');
  const [preloaderPhase, setPreloaderPhase] = useState<PreloaderPhase>('idle');

  // Triggered when user clicks the "Let's take a deep dive" button on HomePage
  const handleStartDeepDive = () => {
    // 1. Double stairs cascade shut from top and bottom
    setPreloaderPhase('closing');
  };

  // Called when the double stairs finish closing completely
  const handleStairsClosed = () => {
    // 2. Switch the active view underneath to the simulator while curtains are shut
    setCurrentView('simulator');

    // 3. Briefly hold the modern cyber HUD telemetry screen (~500ms), then trigger reverse double stairs reveal
    setTimeout(() => {
      setPreloaderPhase('opening');
    }, 550);
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
