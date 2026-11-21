import React, { useState } from 'react';
import { E2EEHomePage } from './components/features/E2EEHomePage';
import { E2EESimulatorPortal } from './components/features/E2EESimulatorPortal';

export const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<'home' | 'simulator'>('home');

  if (currentView === 'simulator') {
    return <E2EESimulatorPortal onBackToHome={() => setCurrentView('home')} />;
  }

  return <E2EEHomePage onNavigateToSimulator={() => setCurrentView('simulator')} />;
};

export default App;
