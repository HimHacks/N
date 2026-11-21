import React, { useState } from 'react';
import { PhoneHero3D } from './PhoneHero3D';
import { calculateCapacitance, type SimulationParams, type TouchPoint } from '../../lib/simulation/capacitivePhysics';
import { SimulationCanvas } from '../simulation/SimulationCanvas';
import { ParameterControls } from '../simulation/ParameterControls';
import { MetricsPanel } from '../simulation/MetricsPanel';

const DEFAULT_PARAMS: SimulationParams = {
  frequencyKhz: 180,
  voltageV: 3.3,
  plateDistanceMm: 1.1,
  fingerPressure: 0.6,
  chargeCarrierSpeed: 1.2,
};

interface E2EESimulatorPortalProps {
  onBackToHome: () => void;
}

export const E2EESimulatorPortal: React.FC<E2EESimulatorPortalProps> = ({ onBackToHome }) => {
  const [params, setParams] = useState<SimulationParams>(DEFAULT_PARAMS);
  const [touch, setTouch] = useState<TouchPoint>({ x: 0, y: 0, active: false });

  const simState = calculateCapacitance(params, touch);

  return (
    <div className="relative w-full min-h-screen bg-[#07090e] text-white">
      {/* Top Header with Return Button */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-black/80 backdrop-blur-xl px-6 py-4 flex items-center justify-between">
        <button
          onClick={onBackToHome}
          className="flex items-center gap-2 rounded-full bg-white px-5 py-2 text-xs font-bold text-black shadow-lg transition-transform hover:scale-105 active:scale-95 cursor-pointer"
        >
          <span>&larr; Back to Homepage</span>
        </button>

        <div className="flex items-center gap-2 font-mono text-xs text-slate-300">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>SIMULATOR ENGINE TEMPLATE</span>
        </div>
      </header>

      {/* Simulator Content Area */}
      <main className="max-w-7xl mx-auto px-6 py-10 space-y-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-5 space-y-6">
            <h1 className="text-3xl font-extrabold text-white">
              Interactive Hardware Simulator
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              This is the preserved simulator template. Touch, rotate, and interact with the 3D phone model and electrodynamic field.
            </p>

            <ParameterControls params={params} onChange={setParams} />
          </div>

          <div className="lg:col-span-7 flex flex-col items-center">
            <PhoneHero3D isTouched={touch.active} />
          </div>
        </div>

        {/* Real-Time Canvas Simulation */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8">
            <SimulationCanvas
              params={params}
              touch={touch}
              onTouchChange={setTouch}
              simState={simState}
            />
          </div>
          <div className="lg:col-span-4">
            <MetricsPanel state={simState} />
          </div>
        </div>
      </main>
    </div>
  );
};
