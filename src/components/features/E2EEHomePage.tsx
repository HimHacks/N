import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'motion/react';
import {
  ShieldCheck,
  Lock,
  Key,
  Clock,
  Sparkles,
  ArrowRight,
  RefreshCw,
  ExternalLink,
  Sliders,
  CheckCircle2,
} from 'lucide-react';
import { E2EEPageBackground, type WhatsAppBackgroundPreset } from './E2EEPageBackground';
import { E2EEDeepDivePopup } from './E2EEDeepDivePopup';

interface E2EEHomePageProps {
  onNavigateToSimulator: () => void;
}

export const E2EEHomePage: React.FC<E2EEHomePageProps> = ({ onNavigateToSimulator }) => {
  // Reading Time Logic
  // Homepage text word count is ~130 words. At 250 WPM = ~18 seconds.
  const ESTIMATED_READING_SECONDS = 18;
  const [secondsRemaining, setSecondsRemaining] = useState(ESTIMATED_READING_SECONDS);
  const [readingFinished, setReadingFinished] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState<WhatsAppBackgroundPreset>('whatsapp-iridescent');

  // Reading countdown timer
  useEffect(() => {
    if (readingFinished) return;

    const interval = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setReadingFinished(true);
          setIsPopupOpen(true); // Trigger bottom-center glass pop-up
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [readingFinished]);

  const progressPercent = useMemo(() => {
    return Math.round(((ESTIMATED_READING_SECONDS - secondsRemaining) / ESTIMATED_READING_SECONDS) * 100);
  }, [secondsRemaining]);

  return (
    <E2EEPageBackground preset={selectedPreset}>
      {/* Top Floating Glass Navigation Bar */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0B141A]/75 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          {/* Presenter / Team Brand */}
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 shadow-md shadow-emerald-500/20 ring-1 ring-white/15">
              <Lock className="h-4 w-4 text-white" />
            </div>
            <div>
              <span className="text-xs font-mono font-bold tracking-widest text-slate-200 uppercase flex items-center gap-2">
                The Syntax Unveilers
                <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[9px] font-mono text-emerald-400">
                  GVH 2026
                </span>
              </span>
              <p className="text-[10px] text-slate-400 font-mono">Unveiling Technology &bull; E2EE</p>
            </div>
          </div>

          {/* Reading Time Progress HUD & Simulator Link */}
          <div className="flex items-center gap-4">
            {/* Reading Timer Pill */}
            <div className="hidden sm:flex items-center gap-2.5 rounded-full border border-white/10 bg-[#111B21]/80 px-3.5 py-1.5 text-xs font-mono text-slate-300 backdrop-blur-md">
              <Clock className="h-3.5 w-3.5 text-emerald-400" />
              <span>Est. read:</span>
              {secondsRemaining > 0 ? (
                <span className="font-semibold text-emerald-300">{secondsRemaining}s</span>
              ) : (
                <span className="font-semibold text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" /> Ready
                </span>
              )}

              {/* Progress bar line */}
              <div className="h-1.5 w-12 rounded-full bg-white/10 overflow-hidden ml-1">
                <div
                  className="h-full bg-emerald-500 transition-all duration-1000 ease-linear"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Quick Deep Dive Button */}
            <button
              onClick={() => {
                setIsPopupOpen(true);
              }}
              className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1.5 text-xs font-medium text-emerald-300 backdrop-blur-md transition hover:bg-emerald-500/20 hover:text-white cursor-pointer"
            >
              <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
              <span>Deep Dive</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Hero Container */}
      <main className="relative z-10 mx-auto max-w-5xl px-6 py-16 sm:py-24">
        {/* Intro Tagline */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6 text-center max-w-3xl mx-auto"
        >
          {/* "The Syntax Unveilers presents" */}
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-[#111B21]/90 px-4 py-1 text-xs font-mono tracking-widest uppercase text-emerald-400 shadow-lg shadow-emerald-950/40 backdrop-blur-md">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>The Syntax Unveilers presents</span>
          </div>

          {/* Minimized Topic Name */}
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
            End-to-End <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">Encryption</span>
          </h1>

          {/* Clean Overview Description */}
          <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto font-normal">
            Every day, billions of messages are sent through messaging platforms like WhatsApp. 
            Yet the core mechanism remains one of computer science’s most misunderstood triumphs:
            <span className="block mt-2 font-medium text-white">
              Data scrambled so only the sender and recipient possess the keys. Not the servers. Not the networks. No eavesdroppers.
            </span>
          </p>

          {/* Reading Time Status Banner */}
          <div className="pt-2 flex items-center justify-center gap-3">
            <div className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-[#111B21]/60 px-4 py-2 text-xs font-mono text-slate-400 backdrop-blur-md">
              <Clock className="h-3.5 w-3.5 text-emerald-400" />
              <span>Reading time: ~{ESTIMATED_READING_SECONDS}s</span>
              <span className="text-slate-600">&bull;</span>
              <span className="text-slate-300">
                {secondsRemaining > 0 ? `Deep dive popup in ${secondsRemaining}s` : 'Deep dive unlocked below'}
              </span>
            </div>
          </div>
        </motion.div>

        {/* 3 Core Conceptual Cards */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Relatable */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#111B21]/70 p-6 backdrop-blur-xl transition hover:border-emerald-500/40 hover:bg-[#111B21]/90 shadow-xl"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 mb-4 group-hover:scale-105 transition-transform">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-white tracking-tight">Zero-Knowledge Transit</h3>
            <p className="mt-2 text-xs text-slate-300 leading-relaxed">
              Plaintext never touches the network wire. Your device encrypts messages using ephemeral session keys before transmission, leaving intermediate relays blind to payload contents.
            </p>
          </motion.div>

          {/* Card 2: Technically Interesting */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#111B21]/70 p-6 backdrop-blur-xl transition hover:border-emerald-500/40 hover:bg-[#111B21]/90 shadow-xl"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-500/15 border border-teal-500/30 text-teal-400 mb-4 group-hover:scale-105 transition-transform">
              <Key className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-white tracking-tight">Diffie-Hellman Ratchet</h3>
            <p className="mt-2 text-xs text-slate-300 leading-relaxed">
              Every message exchange continuously derives fresh encryption keys using elliptic curve mathematics (X25519). Compromising a single past key grants zero access to future conversations.
            </p>
          </motion.div>

          {/* Card 3: Cryptographic Integrity */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#111B21]/70 p-6 backdrop-blur-xl transition hover:border-emerald-500/40 hover:bg-[#111B21]/90 shadow-xl"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 mb-4 group-hover:scale-105 transition-transform">
              <Lock className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-white tracking-tight">Tamper-Proof Authentication</h3>
            <p className="mt-2 text-xs text-slate-300 leading-relaxed">
              Authenticated cipher modes (AES-256-GCM) accompanied by HMAC message signatures ensure any packet altered in transit is immediately rejected before decryption.
            </p>
          </motion.div>
        </div>

        {/* WhatsApp Background Preset Switcher Tool */}
        <div className="mt-16 rounded-2xl border border-white/10 bg-[#111B21]/60 p-4 backdrop-blur-xl flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
            <Sliders className="h-4 w-4 text-emerald-400" />
            <span>Background Shader Palette:</span>
          </div>
          <div className="flex items-center gap-2">
            {(
              [
                ['whatsapp-iridescent', 'WhatsApp Iridescent (Image 1 Spectrum)'],
                ['whatsapp-dual', 'WhatsApp Dual (Forest Teal + Neon Green)'],
                ['whatsapp-dark', 'WhatsApp Obsidian Dark'],
              ] as const
            ).map(([presetId, label]) => (
              <button
                key={presetId}
                onClick={() => setSelectedPreset(presetId)}
                className={`rounded-lg px-3 py-1.5 text-xs font-mono transition-all cursor-pointer ${
                  selectedPreset === presetId
                    ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                    : 'bg-white/5 text-slate-300 hover:bg-white/10'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Manual Deep Dive Trigger Banner */}
        <div className="mt-8 text-center">
          <button
            onClick={onNavigateToSimulator}
            className="inline-flex items-center gap-2.5 rounded-full border border-emerald-500/40 bg-gradient-to-r from-emerald-500 to-teal-600 px-6 py-3 text-xs font-bold text-slate-950 shadow-lg shadow-emerald-500/25 transition hover:brightness-110 active:scale-95 cursor-pointer"
          >
            <span>Let's take a deep dive into the simulator</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </main>

      {/* The Bottom-Center Frosted Glass Pop-up Card */}
      <E2EEDeepDivePopup
        isOpen={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
        onEnterSimulator={onNavigateToSimulator}
      />
    </E2EEPageBackground>
  );
};
