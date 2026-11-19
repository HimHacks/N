import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Terminal, BookOpen, Layers } from 'lucide-react';

export const MechanismExplainer: React.FC = () => {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      <motion.div
        whileHover={{ y: -4 }}
        transition={{ duration: 0.2 }}
        className="rounded-2xl border border-white/10 bg-[#0d111a]/60 p-6 backdrop-blur-md relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Layers className="h-16 w-16 text-cyan-400" />
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 mb-4">
          <span className="font-mono font-bold text-sm">01</span>
        </div>
        <h4 className="text-base font-bold text-slate-100 mb-2">The Invisible Matrix</h4>
        <p className="text-xs text-slate-400 leading-relaxed">
          Behind every smartphone glass is an ultra-fine grid of transparent Indium Tin Oxide (ITO) micro-wires. Transmit (TX) lines pump a high-frequency AC field into Receive (RX) lines, creating continuous mutual capacitance across every intersection node.
        </p>
      </motion.div>

      <motion.div
        whileHover={{ y: -4 }}
        transition={{ duration: 0.2 }}
        className="rounded-2xl border border-white/10 bg-[#0d111a]/60 p-6 backdrop-blur-md relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Sparkles className="h-16 w-16 text-rose-400" />
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20 mb-4">
          <span className="font-mono font-bold text-sm">02</span>
        </div>
        <h4 className="text-base font-bold text-slate-100 mb-2">The Human Shunt Effect</h4>
        <p className="text-xs text-slate-400 leading-relaxed">
          The human body is an electrical conductor with a natural capacitance of ~100 pF. When your finger approaches the dielectric glass, it shunts part of the fringing electrostatic field straight to ground, causing a localized drop (-ΔC) in mutual capacitance.
        </p>
      </motion.div>

      <motion.div
        whileHover={{ y: -4 }}
        transition={{ duration: 0.2 }}
        className="rounded-2xl border border-white/10 bg-[#0d111a]/60 p-6 backdrop-blur-md relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Terminal className="h-16 w-16 text-emerald-400" />
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-4">
          <span className="font-mono font-bold text-sm">03</span>
        </div>
        <h4 className="text-base font-bold text-slate-100 mb-2">DSP Centroid Interpolation</h4>
        <p className="text-xs text-slate-400 leading-relaxed">
          The touch controller scans the matrix hundreds of times per second. By taking the differential measurement between adjacent nodes, a Digital Signal Processor (DSP) calculates the centroid to sub-millimeter precision, converting physics into UI taps.
        </p>
      </motion.div>
    </div>
  );
};
