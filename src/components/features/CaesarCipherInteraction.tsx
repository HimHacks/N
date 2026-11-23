import React from 'react';
import { motion } from 'framer-motion';
import { SoffitGradient } from '../SoffitGradient';
import { MainGuidedSimulator } from './MainGuidedSimulator';
import { ArrowUp, ArrowLeft } from 'lucide-react';

interface CaesarCipherInteractionProps {
  onScrollToTop?: () => void;
}

export const CaesarCipherInteraction: React.FC<CaesarCipherInteractionProps> = ({ onScrollToTop }) => {
  return (
    <section className="relative w-full min-h-screen py-16 px-4 sm:px-8 md:px-12 flex flex-col items-center justify-between overflow-x-hidden select-none bg-[#071b12]">
      {/* 
        Original Retained Soffit Gradient Background
        Lush emerald, forest dark green & Biscotti cream aura with subtle depth
      */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-90">
        <SoffitGradient
          bgColor="#071b12"
          colorA="#00a884"
          colorB="#02523e"
          colorC="#efeae2"
          colorD="#052c21"
          scale={1.2}
          speed={0.3}
          breathe={0.15}
          glow={0.7}
        />
      </div>

      {/* Floating Header with Return to Home Button */}
      <div className="relative z-20 w-full max-w-6xl mx-auto flex items-center justify-between pb-6 mb-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <span className="w-2.5 h-2.5 rounded-full bg-[#00a884] animate-pulse" />
          <span className="font-mono text-xs sm:text-sm font-semibold tracking-wider text-white/90 uppercase">
            The Syntax Unveilers • E2EE Educational Lab
          </span>
        </div>
        {onScrollToTop && (
          <button
            onClick={onScrollToTop}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-xs font-semibold text-white transition-all cursor-pointer shadow-xs active:scale-95"
            aria-label="Back to home page"
          >
            <ArrowLeft size={14} />
            <span>Back to Home</span>
          </button>
        )}
      </div>

      {/* 
        The Step-by-Step Educational Lab Card (from screenshot):
        - Step 1: Write (with editable message)
        - Step 2: Keys (ECDH P-256 agreement)
        - Step 3: Encrypt (AES-GCM fresh 96-bit nonce)
        - Step 4: Decrypt (Authentication tag verification)
        - Step 5: Tamper Test (Bit-flip attack and rejection)
        - "What is happening?" explanation panel
      */}
      <div className="relative z-10 w-full max-w-6xl mx-auto my-auto rounded-3xl bg-[#F7F4EC] border-2 border-[#176B50]/30 shadow-[0_25px_80px_rgba(0,0,0,0.6)] p-4 sm:p-8 md:p-10 text-[#153A32]">
        <MainGuidedSimulator />
      </div>

      {/* Footer Return Action */}
      <div className="relative z-10 mt-12 mb-4 text-center">
        {onScrollToTop && (
          <button
            onClick={onScrollToTop}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-medium text-white transition-all cursor-pointer"
          >
            <ArrowUp size={14} />
            <span>Return to top of page</span>
          </button>
        )}
      </div>
    </section>
  );
};
