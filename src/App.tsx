import React, { useState, useEffect } from 'react';
import Lenis from 'lenis';
import { motion } from 'motion/react';
import {
  calculateCapacitance,
  type SimulationParams,
  type TouchPoint,
} from './lib/simulation/capacitivePhysics';
import { SimulationCanvas } from './components/simulation/SimulationCanvas';
import { ParameterControls } from './components/simulation/ParameterControls';
import { MetricsPanel } from './components/simulation/MetricsPanel';
import { MechanismExplainer } from './components/features/MechanismExplainer';
import { PhoneHero3D } from './components/features/PhoneHero3D';
import { FloatingPillNav } from './components/ui/FloatingPillNav';
import { Cpu, Zap, ShieldCheck, Terminal, Code2 } from 'lucide-react';

const DEFAULT_PARAMS: SimulationParams = {
  frequencyKhz: 180,
  voltageV: 3.3,
  plateDistanceMm: 1.1,
  fingerPressure: 0.6,
  chargeCarrierSpeed: 1.2,
};

export const App: React.FC = () => {
  const [params, setParams] = useState<SimulationParams>(DEFAULT_PARAMS);
  const [touch, setTouch] = useState<TouchPoint>({ x: 0, y: 0, active: false });

  // Smooth inertial scroll initialization with Lenis
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    const animId = requestAnimationFrame(raf);
    return () => cancelAnimationFrame(animId);
  }, []);

  // Compute live physics calculation
  const simState = calculateCapacitance(params, touch);

  return (
    <div className="min-h-screen bg-[#07090e] text-[#f1f5f9]">
      {/* Skiper UI Dynamic Floating Pill HUD */}
      <FloatingPillNav state={simState} isTouched={touch.active} />

      {/* Background ambient lighting */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-cyan-500/10 rounded-full blur-[140px]" />
        <div className="absolute top-[45%] -left-40 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-10 right-0 w-[450px] h-[450px] bg-rose-500/5 rounded-full blur-[120px]" />
      </div>

      {/* Top Header */}
      <header className="border-b border-white/5 bg-[#07090e]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-indigo-600 shadow-lg shadow-cyan-500/20">
              <Cpu className="h-5 w-5 text-black" />
            </div>
            <div>
              <span className="font-bold tracking-tight text-white flex items-center gap-2">
                CAPACITOR<span className="text-cyan-400">.IO</span>
                <span className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-2 py-0.5 text-[10px] font-mono text-cyan-300">
                  GVH 2026
                </span>
              </span>
              <p className="text-[10px] text-slate-400 font-mono">Unveiling Capacitive Touch Physics</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-400 font-mono">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
              Real-Time Physics Engine Active
            </span>
            <a
              href="https://github.com/yashsva292-ops/Global-Virtual-Hackathon-repo"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-300 transition hover:bg-white/10 hover:text-white"
            >
              <Code2 className="h-4 w-4" />
              <span>Repository</span>
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 mx-auto max-w-7xl px-6 py-12">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 mb-16">
          <div className="lg:col-span-7 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3.5 py-1 text-xs font-mono text-cyan-300"
            >
              <Zap className="h-3.5 w-3.5" />
              Theme: Unveiling Technology
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl font-extrabold tracking-tight sm:text-6xl text-white"
            >
              How Glass Feels Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400">Touch</span>.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-base text-slate-300 leading-relaxed max-w-xl"
            >
              Glass is an electrical insulator. Yet modern screens register sub-millimeter touches in under 20 milliseconds.
              Explore the real electrodynamics of mutual capacitance, transparent Indium Tin Oxide micro-electrodes, and how the human body acts as a virtual ground shunt.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap gap-4 pt-2 font-mono text-xs"
            >
              <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-slate-300">
                <ShieldCheck className="h-4 w-4 text-cyan-400" />
                <span>100% Client-Side Physics</span>
              </div>
              <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-slate-300">
                <Terminal className="h-4 w-4 text-indigo-400" />
                <span>Zero AI / Zero External Quota</span>
              </div>
            </motion.div>
          </div>

          <div className="lg:col-span-5 flex justify-center">
            <PhoneHero3D isTouched={touch.active} />
          </div>
        </div>

        {/* Live Simulation & Metrics Section */}
        <section className="space-y-6 mb-16">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <span>Interactive Capacitive Matrix</span>
                <span className="text-xs font-mono font-normal text-slate-400">
                  (Move pointer or finger over canvas)
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Simulating electron drift velocity and electrostatic field lines shunting to ground
              </p>
            </div>
            {touch.active && (
              <span className="inline-flex items-center gap-2 font-mono text-xs text-rose-400 bg-rose-500/10 border border-rose-500/30 px-3 py-1 rounded-full animate-pulse">
                TOUCH REGISTERED: -{simState.deltaCapacitancePf.toFixed(2)} pF
              </span>
            )}
          </div>

          {/* Interactive Simulation Canvas */}
          <SimulationCanvas
            params={params}
            touch={touch}
            onTouchChange={setTouch}
          />

          {/* Real-Time Mathematical Telemetry Panel */}
          <MetricsPanel state={simState} />

          {/* Hardware & Physics Controls */}
          <ParameterControls
            params={params}
            onChange={setParams}
            onReset={() => setParams(DEFAULT_PARAMS)}
          />
        </section>

        {/* Three Step Educational Explainer Section with Anime.js Circuit Trace & Spotlight Cards */}
        <section className="space-y-6 mb-16">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h3 className="text-2xl font-bold text-white">The Scientific Mechanism Explained</h3>
            <p className="text-xs text-slate-400">
              Understanding the 3 distinct phases that take place during a 20-millisecond screen tap
            </p>
          </div>
          <MechanismExplainer />
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-[#05070a] py-8 text-xs text-slate-500">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 sm:flex-row">
          <p>© 2026 Global Virtual Hackathon Submission — Canadian International School, Singapore.</p>
          <p className="font-mono text-[11px] text-slate-400">
            Powered by Vite, React 19, Motion, Three.js Custom Shaders, Anime.js & Lenis.
          </p>
        </div>
      </footer>
    </div>
  );
};
