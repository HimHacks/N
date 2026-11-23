import React, { useRef } from 'react';
import { HeroExhibit } from './components/features/HeroExhibit';
import { ScrollBridge } from './components/features/ScrollBridge';
import { MainGuidedSimulator } from './components/features/MainGuidedSimulator';
import { WhyPrivacyMattersStory } from './components/features/WhyPrivacyMattersStory';
import { DeeperExplorationSection } from './components/features/DeeperExplorationSection';
import { ClosingSectionAndFooter } from './components/features/ClosingSectionAndFooter';

export const App: React.FC = () => {
  const simulatorRef = useRef<HTMLDivElement>(null);

  const scrollToSimulator = () => {
    const el = document.getElementById('simulator-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToDeeper = () => {
    const el = document.getElementById('deeper-exploration');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative w-full min-h-screen bg-[#F7F4EC] text-[#153A32] antialiased selection:bg-[#E3EDE3] selection:text-[#176B50]">
      {/* 
        NO WAITING SCREENS:
        Direct, instantaneous page arrival. No preloader, no fake percentages, no delays.
      */}

      {/* 1. Hero with vector characters and live browser-generated message journey */}
      <HeroExhibit
        onStartSimulator={scrollToSimulator}
        onExploreDetails={scrollToDeeper}
      />

      {/* 2. Scroll Transition Bridge with larger sender character */}
      <ScrollBridge onOpenSimulator={scrollToSimulator} />

      {/* 3. Main 5-Step Guided Simulator (90-120s Core Journey) */}
      <div ref={simulatorRef}>
        <MainGuidedSimulator />
      </div>

      {/* 4. "Why Privacy Matters" Story (Human Context & Two Views of Same Packet) */}
      <WhyPrivacyMattersStory />

      {/* 5. Deeper Technical Exploration (Topics A through H with Tiny DH) */}
      <DeeperExplorationSection />

      {/* 6. High-Contrast Forest Green Closing & Comprehensive Footers */}
      <ClosingSectionAndFooter
        onRestartSimulator={scrollToSimulator}
        onExploreMechanism={scrollToDeeper}
      />
    </div>
  );
};

export default App;
