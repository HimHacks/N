import React, { useState } from 'react';
import { E2EEHomePage } from './components/features/E2EEHomePage';
import { E2EESimulatorPortal } from './components/features/E2EESimulatorPortal';
import { DoubleStairsPreloader } from './components/DoubleStairsPreloader';

export const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<'home' | 'simulator'>('home');
  const [isPreloaderActive, setIsPreloaderActive] = useState(false);

  // Triggered when user clicks the "Let's take a deep dive" button
  const handleStartDeepDive = () => {
    setIsPreloaderActive(true);
  };

  // Called when double stairs curtain finishes closing
  const handlePreloaderComplete = () => {
    // Switch to simulator view, then unlock the curtains
    setCurrentView('simulator');
    setTimeout(() => {
      setIsPreloaderActive(false);
    }, 200);
  };

  return (
    <>
      <DoubleStairsPreloader
        isActive={isPreloaderActive}
        onTransitionComplete={handlePreloaderComplete}
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
