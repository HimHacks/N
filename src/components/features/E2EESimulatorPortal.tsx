import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, ArrowLeft, Key, Lock, Terminal, RefreshCw, Cpu, CheckCircle2 } from 'lucide-react';
import { E2EEPageBackground } from './E2EEPageBackground';

interface E2EESimulatorPortalProps {
  onBackToHome: () => void;
}

export const E2EESimulatorPortal: React.FC<E2EESimulatorPortalProps> = ({ onBackToHome }) => {
  return (
    <E2EEPageBackground preset="whatsapp-iridescent">
      <div className="mx-auto max-w-6xl px-6 py-10">
        {/* Top Header / Back Nav */}
        <div className="flex items-center justify-between border-b border-white/10 pb-6 mb-10">
          <button
            onClick={onBackToHome}
            className="group flex items-center gap-2 rounded-xl border border-white/10 bg-[#111B21]/80 px-4 py-2 text-xs font-mono text-slate-200 backdrop-blur-xl transition hover:border-emerald-500/50 hover:bg-[#111B21] hover:text-emerald-400 cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            <span>Return to Homepage</span>
          </button>

          <div className="flex items-center gap-3">
            <span className="flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-mono text-emerald-400">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              SIMULATOR STAGING ENVIRONMENT
            </span>
          </div>
        </div>

        {/* Portal Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-4 max-w-3xl mx-auto mb-12"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-[#111B21]/80 px-3.5 py-1 text-xs font-mono text-emerald-400 shadow-sm backdrop-blur-md">
            <Lock className="h-3.5 w-3.5" />
            <span>CRYPTOGRAPHIC PROTOCOL RUNTIME</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white">
            End-to-End Encryption <span className="text-emerald-400">Deep Dive</span>
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed">
            Welcome to the deeper exploration zone. Here, the underlying mathematics of the Signal Protocol, Elliptic Curve Diffie-Hellman (X25519), and AES-256-GCM authenticated cipher streams will be interactively animated.
          </p>
        </motion.div>

        {/* Architectural Wireframe / Teaser Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Node 1: Sender (Alice) */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="rounded-2xl border border-emerald-500/30 bg-[#111B21]/75 p-6 backdrop-blur-xl shadow-xl space-y-4"
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-emerald-400 font-semibold">SENDER NODE [ALICE]</span>
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            </div>
            <div className="rounded-lg bg-black/40 p-3 font-mono text-[11px] text-slate-300 space-y-1">
              <p className="text-slate-500">// Ephemeral Keypair</p>
              <p className="text-emerald-300 truncate">priv: 9f8a...31c2</p>
              <p className="text-teal-300 truncate">pub:  3a4b...89e1</p>
            </div>
            <p className="text-xs text-slate-300 leading-normal">
              Encrypts plain text locally on user device using a shared secret negotiated without ever sending the secret over the wire.
            </p>
          </motion.div>

          {/* Node 2: Untrusted Network / WhatsApp Relay */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="rounded-2xl border border-white/10 bg-[#111B21]/75 p-6 backdrop-blur-xl shadow-xl space-y-4"
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-amber-400 font-semibold">TRANSIT / SERVER RELAY</span>
              <Lock className="h-4 w-4 text-amber-400" />
            </div>
            <div className="rounded-lg bg-black/40 p-3 font-mono text-[11px] text-slate-300 space-y-1">
              <p className="text-slate-500">// Indistinguishable Ciphertext</p>
              <p className="text-amber-300/90 truncate">0x7F2A...E9810C</p>
              <p className="text-slate-400 text-[10px]">Zero-Knowledge: Server sees only ciphertext bytes</p>
            </div>
            <p className="text-xs text-slate-300 leading-normal">
              Even with subpoena or server compromise, neither WhatsApp, ISPs, nor eavesdroppers can decrypt this stream.
            </p>
          </motion.div>

          {/* Node 3: Recipient (Bob) */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="rounded-2xl border border-emerald-500/30 bg-[#111B21]/75 p-6 backdrop-blur-xl shadow-xl space-y-4"
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-emerald-400 font-semibold">RECIPIENT NODE [BOB]</span>
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            </div>
            <div className="rounded-lg bg-black/40 p-3 font-mono text-[11px] text-slate-300 space-y-1">
              <p className="text-slate-500">// Derived Shared Secret</p>
              <p className="text-emerald-300 truncate">shared: K_df(pub_A, priv_B)</p>
              <p className="text-teal-300 truncate">auth:   HMAC-SHA256 OK</p>
            </div>
            <p className="text-xs text-slate-300 leading-normal">
              Recombines sender's public key with recipient's private key to derive the identical decryption cipher key in milliseconds.
            </p>
          </motion.div>
        </div>

        {/* Development Notification Box */}
        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-6 backdrop-blur-xl text-center space-y-3">
          <div className="flex items-center justify-center gap-2 text-emerald-400 font-mono text-xs">
            <Cpu className="h-4 w-4" />
            <span>HOMEPAGE FOCUS PROTOCOL ACTIVE</span>
          </div>
          <h2 className="text-lg font-bold text-white">Full Simulator Implementation Standing By</h2>
          <p className="text-xs text-slate-300 max-w-xl mx-auto leading-relaxed">
            Per your development direction, the main interactive simulation engine is reserved for Phase 2 after the homepage reaches complete aesthetic perfection.
          </p>
          <button
            onClick={onBackToHome}
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-5 py-2.5 text-xs font-bold text-slate-950 shadow-lg shadow-emerald-500/20 transition hover:bg-emerald-400 cursor-pointer mt-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Return to Homepage</span>
          </button>
        </div>
      </div>
    </E2EEPageBackground>
  );
};
