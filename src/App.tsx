import React, { useState, useEffect } from 'react';
import { E2EEHomePage } from './components/features/E2EEHomePage';
import { E2EESimulatorPortal } from './components/features/E2EESimulatorPortal';
import { DoubleStairsPreloader } from './components/DoubleStairsPreloader';

export const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<'home' | 'simulator'>('home');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Elegant entrance preloader timer (1.4s display before cascading double-stairs split)
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1400);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <DoubleStairsPreloader isLoading={isLoading} />
      {currentView === 'simulator' ? (
        <E2EESimulatorPortal onBackToHome={() => setCurrentView('home')} />
      ) : (
        <E2EEHomePage onNavigateToSimulator={() => setCurrentView('simulator')} />
      )}
    </>
  );
};

export default App;
