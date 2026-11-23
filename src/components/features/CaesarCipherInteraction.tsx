import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SoffitGradient } from '../SoffitGradient';
import {
  ShieldCheck,
  Lock,
  Unlock,
  Key,
  Smartphone,
  EyeOff,
  RotateCcw,
  Play,
  Pause,
  Info
} from 'lucide-react';

interface CaesarCipherInteractionProps {
  onScrollToTop?: () => void;
}

// Caesar cipher helper function
function caesarShift(text: string, shift: number): string {
  return text
    .split('')
    .map((char) => {
      const code = char.charCodeAt(0);
      // Uppercase letters
      if (code >= 65 && code <= 90) {
        return String.fromCharCode(((code - 65 + shift) % 26) + 65);
      }
      // Lowercase letters
      if (code >= 97 && code <= 122) {
        return String.fromCharCode(((code - 97 + shift) % 26) + 97);
      }
      return char;
    })
    .join('');
}

export const CaesarCipherInteraction: React.FC<CaesarCipherInteractionProps> = () => {
  const [shiftKey, setShiftKey] = useState<number>(3); // Caesar Shift key (e.g. k=3)
  const [message, setMessage] = useState<string>('MEET AT DAWN');
  const [animationStep, setAnimationStep] = useState<number>(0);
  // 0: Idle/Setup (Alice on left, Bob on right)
  // 1: Alice typing and encrypting locally with key
  // 2: Encrypted ciphertext traveling across insecure public network
  // 3: Bob receiving ciphertext and decrypting locally with key
  // 4: Complete: Decrypted plaintext verified!
  const [isPlaying, setIsPlaying] = useState<boolean>(true);

  const ciphertext = caesarShift(message, shiftKey);

  // Stepped animation loop
  useEffect(() => {
    if (!isPlaying) return;

    const timer = setInterval(() => {
      setAnimationStep((prev) => (prev + 1) % 5);
    }, 3200);

    return () => clearInterval(timer);
  }, [isPlaying]);

  return (
    <section className="relative w-full min-h-screen py-20 px-4 sm:px-8 md:px-16 flex flex-col items-center justify-between overflow-hidden select-none">
      {/* 
        Retained Soffit Gradient Background
        Lush emerald & Biscotti cream aura with subtle depth
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
          grain={0.08}
        />
        {/* Subtle dark backdrop overlay to keep text ultra crisp */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0b141a]/60 via-transparent to-[#0b141a]/90 pointer-events-none" />
      </div>

      {/* Header section: Section badge & Explanation */}
      <div className="relative z-10 max-w-4xl w-full text-center mb-8">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#00a884]/15 border border-[#00a884]/35 text-[#00a884] text-xs font-mono font-semibold uppercase tracking-wider backdrop-blur-md mb-4"
        >
          <ShieldCheck className="w-4 h-4" />
          Interactive Cryptography Playground
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-tight"
        >
          How Messages Travel <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00a884] via-[#25d366] to-[#efeae2]">
            End-to-End Encrypted
          </span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mt-3 text-sm sm:text-base text-[#efeae2]/85 max-w-2xl mx-auto"
        >
          Alice on the left writes a message. The device scrambles it with the secret key using the
          Caesar cipher before it leaves her phone. In transit, eavesdroppers only see scrambled
          ciphertext. Bob's device decrypts it using the matching key.
        </motion.p>
      </div>

      {/* Interactive Controller bar: Key Shift, Custom Text, Play/Pause */}
      <div className="relative z-10 w-full max-w-3xl bg-[#111b21]/75 border border-[#202c33] rounded-2xl p-4 sm:p-5 backdrop-blur-xl shadow-2xl mb-10 flex flex-wrap items-center justify-between gap-4">
        {/* Message Input */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 flex-1 min-w-[220px]">
          <span className="text-xs font-mono text-[#8696a0] uppercase tracking-wider">Message:</span>
          <input
            type="text"
            value={message}
            maxLength={18}
            onChange={(e) => setMessage(e.target.value.toUpperCase())}
            className="w-full sm:w-48 bg-[#202c33]/80 border border-[#8696a0]/30 rounded-lg px-3 py-1.5 text-sm font-mono text-white focus:outline-none focus:border-[#00a884]"
            placeholder="TYPE MESSAGE"
          />
        </div>

        {/* Caesar Key Slider */}
        <div className="flex items-center gap-3">
          <Key className="w-4 h-4 text-[#00a884]" />
          <span className="text-xs font-mono text-[#8696a0]">Shift Key (k):</span>
          <div className="flex items-center gap-2">
            <input
              type="range"
              min={1}
              max={15}
              value={shiftKey}
              onChange={(e) => setShiftKey(Number(e.target.value))}
              className="w-24 accent-[#00a884] cursor-pointer"
            />
            <span className="text-xs font-bold font-mono px-2 py-0.5 rounded bg-[#00a884]/20 border border-[#00a884]/40 text-[#00a884]">
              +{shiftKey}
            </span>
          </div>
        </div>

        {/* Step indicator & Play/Reset */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#202c33] hover:bg-[#2a3942] text-xs font-mono text-white transition cursor-pointer"
            title={isPlaying ? 'Pause simulation' : 'Play simulation'}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5 text-[#00a884]" /> : <Play className="w-3.5 h-3.5 text-[#00a884]" />}
            <span>{isPlaying ? 'Pause' : 'Resume'}</span>
          </button>
          <button
            onClick={() => {
              setAnimationStep(0);
              setIsPlaying(true);
            }}
            className="p-1.5 rounded-lg bg-[#202c33] hover:bg-[#2a3942] text-[#8696a0] hover:text-white transition cursor-pointer"
            title="Restart cycle"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 
        Two Humans Walking / Texting Interaction Stage 
        - Alice on the Left: Walking in, holding phone, typing plaintext
        - Middle: Public network cloud showing Caesar Cipher substitution in flight
        - Bob on the Right: Walking in, holding phone, decrypting ciphertext
      */}
      <div className="relative z-10 w-full max-w-5xl bg-[#111b21]/60 border border-[#202c33]/80 rounded-3xl p-6 sm:p-10 backdrop-blur-2xl shadow-[0_20px_70px_rgba(0,0,0,0.5)] my-auto overflow-hidden">
        {/* Progress Step Bar */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#202c33]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#00a884] animate-ping" />
            <span className="text-xs font-mono uppercase tracking-wider text-[#00a884]">
              {animationStep === 0 && 'Step 1: Alice preps message'}
              {animationStep === 1 && 'Step 2: Local Caesar encryption on device'}
              {animationStep === 2 && 'Step 3: Ciphertext traveling over insecure wires'}
              {animationStep === 3 && 'Step 4: Bob receives & decrypts with key'}
              {animationStep === 4 && 'Step 5: Verified End-to-End Encrypted!'}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {[0, 1, 2, 3, 4].map((step) => (
              <span
                key={step}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  animationStep === step
                    ? 'w-6 bg-[#00a884]'
                    : animationStep > step
                    ? 'w-2 bg-[#00a884]/40'
                    : 'w-2 bg-[#202c33]'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Stage Grid: Alice (Human 1) -> Transit Wire -> Bob (Human 2) */}
        <div className="grid grid-cols-1 md:grid-cols-12 items-center gap-8 min-h-[360px]">
          {/* Human 1: Alice (Left) */}
          <div className="md:col-span-4 flex flex-col items-center text-center">
            {/* Alice Animated Avatar */}
            <motion.div
              animate={{
                x: animationStep >= 1 ? [0, 8, 0] : [-30, 0],
                y: [0, -4, 0],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                repeatType: 'mirror',
                ease: 'easeInOut',
              }}
              className="relative mb-4 flex flex-col items-center"
            >
              {/* Human Figure SVG */}
              <div className="relative w-28 h-36 flex items-center justify-center">
                <svg
                  viewBox="0 0 100 130"
                  className="w-full h-full drop-shadow-[0_8px_20px_rgba(0,168,132,0.35)]"
                >
                  {/* Head */}
                  <circle cx="50" cy="22" r="14" fill="#efeae2" />
                  {/* Hair */}
                  <path d="M36 22 Q50 6 64 22 Q55 12 36 22" fill="#00a884" />
                  {/* Body / Torso */}
                  <rect x="38" y="38" width="24" height="42" rx="7" fill="#00a884" />
                  {/* Left Arm holding phone */}
                  <path
                    d="M38 42 L24 60 L36 68"
                    stroke="#efeae2"
                    strokeWidth="5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                  />
                  {/* Right Arm */}
                  <path
                    d="M62 42 L72 58 L62 66"
                    stroke="#efeae2"
                    strokeWidth="5"
                    strokeLinecap="round"
                    fill="none"
                  />
                  {/* Smartphone in hand */}
                  <rect
                    x="28"
                    y="60"
                    width="14"
                    height="20"
                    rx="2"
                    fill="#111b21"
                    stroke="#25d366"
                    strokeWidth="1.5"
                  />
                  {/* Legs with walking rhythm */}
                  <motion.line
                    x1="44"
                    y1="80"
                    x2={animationStep >= 1 ? 40 : 44}
                    y2="120"
                    stroke="#efeae2"
                    strokeWidth="6"
                    strokeLinecap="round"
                  />
                  <motion.line
                    x1="56"
                    y1="80"
                    x2={animationStep >= 1 ? 60 : 56}
                    y2="120"
                    stroke="#efeae2"
                    strokeWidth="6"
                    strokeLinecap="round"
                  />
                </svg>

                {/* Sender Tag */}
                <span className="absolute -bottom-2 px-2.5 py-0.5 rounded-full bg-[#00a884] text-white text-[11px] font-bold tracking-wider font-mono">
                  ALICE (SENDER)
                </span>
              </div>
            </motion.div>

            {/* Alice's Phone Screen Bubble */}
            <div className="w-full max-w-xs bg-[#202c33] border border-[#2a3942] rounded-2xl p-3.5 shadow-lg text-left">
              <div className="flex items-center justify-between text-[11px] font-mono text-[#8696a0] mb-2 pb-1.5 border-b border-[#2a3942]">
                <span className="flex items-center gap-1 text-[#00a884]">
                  <Smartphone className="w-3 h-3" /> Alice's Device
                </span>
                <span className="flex items-center gap-1">
                  <Key className="w-3 h-3 text-[#ffbd2e]" /> k = {shiftKey}
                </span>
              </div>

              {/* Message State */}
              <div className="space-y-1.5">
                <div className="text-[10px] uppercase font-mono text-[#8696a0]">Plaintext:</div>
                <div className="bg-[#111b21] px-2.5 py-1.5 rounded-lg text-sm font-mono font-semibold text-white tracking-wider flex items-center justify-between">
                  <span>{message}</span>
                  <Unlock className="w-3.5 h-3.5 text-[#25d366]" />
                </div>

                <AnimatePresence>
                  {animationStep >= 1 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="pt-1 overflow-hidden"
                    >
                      <div className="text-[10px] uppercase font-mono text-[#00a884] flex items-center gap-1">
                        <Lock className="w-3 h-3" /> Encrypted with (+{shiftKey}):
                      </div>
                      <div className="bg-[#0b141a] px-2.5 py-1.5 rounded-lg text-sm font-mono font-bold text-[#25d366] tracking-widest border border-[#00a884]/40 mt-0.5">
                        {ciphertext}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Middle Transit: Public Network / Eavesdroppers Wire */}
          <div className="md:col-span-4 flex flex-col items-center justify-center my-6 md:my-0">
            {/* Visual wire with traveling ciphertext packets */}
            <div className="w-full relative flex flex-col items-center">
              {/* Eavesdropper / ISP warning badge */}
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#111b21] border border-red-500/30 text-red-400 text-[11px] font-mono mb-4">
                <EyeOff className="w-3.5 h-3.5 text-red-400" />
                <span>Public Network / ISP</span>
              </div>

              {/* The Cipher Channel Bar */}
              <div className="relative w-full h-14 bg-[#0b141a] rounded-xl border border-[#202c33] flex items-center justify-between px-3 overflow-hidden shadow-inner">
                {/* Subtle moving grid */}
                <div className="absolute inset-0 opacity-20 bg-[linear-gradient(to_right,#00a884_1px,transparent_1px),linear-gradient(to_bottom,#00a884_1px,transparent_1px)] bg-[size:10px_10px]" />

                {/* Traveling packet */}
                <AnimatePresence>
                  {animationStep === 2 ? (
                    <motion.div
                      key="packet-travel"
                      initial={{ x: '-10%', opacity: 0 }}
                      animate={{ x: '100%', opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 2.8, ease: 'easeInOut' }}
                      className="relative z-10 flex items-center gap-2 bg-[#00a884] text-[#0b141a] px-3 py-1 rounded-lg shadow-lg font-mono font-bold text-xs"
                    >
                      <Lock className="w-3.5 h-3.5" />
                      <span>{ciphertext}</span>
                    </motion.div>
                  ) : (
                    <div className="w-full flex items-center justify-center text-xs font-mono text-[#8696a0]/60 gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#8696a0]/40" />
                      <span>{animationStep > 2 ? 'Packet Delivered' : 'Awaiting Transmission'}</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-[#8696a0]/40" />
                    </div>
                  )}
                </AnimatePresence>
              </div>

              {/* Caesar cipher formula annotation */}
              <div className="mt-3 text-center">
                <span className="text-[11px] font-mono text-[#8696a0] block">
                  Caesar Formula: <span className="text-[#efeae2]">C = (P + {shiftKey}) mod 26</span>
                </span>
                <span className="text-[10px] text-[#00a884] block mt-0.5">
                  Only scrambled ciphertext touches the server
                </span>
              </div>
            </div>
          </div>

          {/* Human 2: Bob (Right) */}
          <div className="md:col-span-4 flex flex-col items-center text-center">
            {/* Bob Animated Avatar */}
            <motion.div
              animate={{
                x: animationStep >= 3 ? [0, -8, 0] : [30, 0],
                y: [0, -4, 0],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                repeatType: 'mirror',
                ease: 'easeInOut',
              }}
              className="relative mb-4 flex flex-col items-center"
            >
              {/* Human Figure SVG */}
              <div className="relative w-28 h-36 flex items-center justify-center">
                <svg
                  viewBox="0 0 100 130"
                  className="w-full h-full drop-shadow-[0_8px_20px_rgba(37,211,102,0.35)]"
                >
                  {/* Head */}
                  <circle cx="50" cy="22" r="14" fill="#efeae2" />
                  {/* Hair / Cap */}
                  <path d="M36 18 Q50 8 64 18 Q66 12 50 10 Q34 12 36 18" fill="#128c7e" />
                  {/* Body / Torso */}
                  <rect x="38" y="38" width="24" height="42" rx="7" fill="#128c7e" />
                  {/* Left Arm */}
                  <path
                    d="M38 42 L28 58 L38 66"
                    stroke="#efeae2"
                    strokeWidth="5"
                    strokeLinecap="round"
                    fill="none"
                  />
                  {/* Right Arm holding phone */}
                  <path
                    d="M62 42 L76 60 L64 68"
                    stroke="#efeae2"
                    strokeWidth="5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                  />
                  {/* Smartphone in hand */}
                  <rect
                    x="58"
                    y="60"
                    width="14"
                    height="20"
                    rx="2"
                    fill="#111b21"
                    stroke="#00a884"
                    strokeWidth="1.5"
                  />
                  {/* Legs with walking rhythm */}
                  <motion.line
                    x1="44"
                    y1="80"
                    x2={animationStep >= 3 ? 48 : 44}
                    y2="120"
                    stroke="#efeae2"
                    strokeWidth="6"
                    strokeLinecap="round"
                  />
                  <motion.line
                    x1="56"
                    y1="80"
                    x2={animationStep >= 3 ? 52 : 56}
                    y2="120"
                    stroke="#efeae2"
                    strokeWidth="6"
                    strokeLinecap="round"
                  />
                </svg>

                {/* Receiver Tag */}
                <span className="absolute -bottom-2 px-2.5 py-0.5 rounded-full bg-[#128c7e] text-white text-[11px] font-bold tracking-wider font-mono">
                  BOB (RECEIVER)
                </span>
              </div>
            </motion.div>

            {/* Bob's Phone Screen Bubble */}
            <div className="w-full max-w-xs bg-[#202c33] border border-[#2a3942] rounded-2xl p-3.5 shadow-lg text-left">
              <div className="flex items-center justify-between text-[11px] font-mono text-[#8696a0] mb-2 pb-1.5 border-b border-[#2a3942]">
                <span className="flex items-center gap-1 text-[#25d366]">
                  <Smartphone className="w-3 h-3" /> Bob's Device
                </span>
                <span className="flex items-center gap-1">
                  <Key className="w-3 h-3 text-[#ffbd2e]" /> k = {shiftKey}
                </span>
              </div>

              {/* Message State on Bob's Device */}
              <div className="space-y-1.5">
                <div className="text-[10px] uppercase font-mono text-[#8696a0]">Received Ciphertext:</div>
                <div className="bg-[#111b21] px-2.5 py-1.5 rounded-lg text-sm font-mono font-bold text-[#8696a0] tracking-widest">
                  {animationStep >= 3 ? ciphertext : '--------'}
                </div>

                <AnimatePresence>
                  {animationStep >= 3 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="pt-1 overflow-hidden"
                    >
                      <div className="text-[10px] uppercase font-mono text-[#25d366] flex items-center gap-1">
                        <Unlock className="w-3 h-3" /> Decrypted Plaintext (-{shiftKey}):
                      </div>
                      <div className="bg-[#0b141a] px-2.5 py-1.5 rounded-lg text-sm font-mono font-bold text-white tracking-wider border border-[#25d366]/40 mt-0.5 flex items-center justify-between">
                        <span>{message}</span>
                        <ShieldCheck className="w-4 h-4 text-[#25d366]" />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>

        {/* Real-world E2EE Mapping Note */}
        <div className="mt-8 pt-4 border-t border-[#202c33] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-[#8696a0]">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-[#00a884]" />
            <span>Modern E2EE uses Curve25519 & AES-256 instead of simple Caesar shifts.</span>
          </div>
          <span className="text-[#efeae2] font-semibold">THE SYNTAX UNVEILERS</span>
        </div>
      </div>
    </section>
  );
};
