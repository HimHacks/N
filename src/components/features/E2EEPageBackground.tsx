import React, { useRef } from 'react';
import FluxLines from '../FluxLines';

export interface E2EEPageBackgroundProps {
  children?: React.ReactNode;
  className?: string;
  preset?: string;
  color?: string | [number, number, number];
  accentColor?: string | [number, number, number];
  cyanColor?: string | [number, number, number];
  darkColor?: string | [number, number, number];
  whiteColor?: string | [number, number, number];
  hueShift?: number;
  speed?: number;
  amplitude?: number;
  stir?: number;
  sheen?: number;
  opacity?: number;
  iridescenceProps?: any;
}

export const E2EEPageBackground: React.FC<E2EEPageBackgroundProps> = ({
  children,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Signature WhatsApp & Onda magnetic fluid streamline colors:
  // Dark emerald depths, vibrant WhatsApp green ribbon paths, mint accents, and deep forest hues
  const ondaFluxColors = [
    '#059669', // Emerald
    '#25D366', // Signature WhatsApp Green
    '#34d399', // Radiant Mint
    '#10b981', // Emerald Mint
    '#0b5c48', // Deep Forest
    '#128c7e', // WhatsApp Teal-Green
  ];

  return (
    <div className={`relative w-full min-h-screen text-white bg-[#020504] ${className}`}>
      {/* Fixed Fullscreen Page Background Layer */}
      <div
        ref={containerRef}
        className="fixed inset-0 -z-10 h-screen w-screen overflow-hidden pointer-events-auto select-none bg-[#020504]"
      >
        <FluxLines
          colors={ondaFluxColors}
          backgroundColor="#020504"
          transparent={false}
          speed={0.45}
          scale={1.4}
          turbulence={0.9}
          fluidity={0.12}
          rimWidth={0.25}
          sharpness={2.2}
          shimmer={1.2}
          glow={2.2}
          lineWidth={1.5}
          flowDirection="down"
          opacity={0.95}
          mouseInteraction={true}
          mouseStrength={1.2}
          mouseRadius={0.45}
          mouseDampening={0.12}
          clickSwirl={true}
          intro={false}
          className="h-full w-full"
        />

        {/* Soft edge & center vignette to keep typography crystal legible */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: `
              radial-gradient(circle at 50% 45%, rgba(2, 5, 4, 0.25) 0%, rgba(2, 5, 4, 0.72) 100%),
              linear-gradient(to bottom, rgba(2, 5, 4, 0.5) 0%, transparent 35%, rgba(2, 5, 4, 0.8) 100%)
            `,
          }}
        />
      </div>

      {/* Foreground Content */}
      <div className="relative z-10 w-full min-h-screen">{children}</div>
    </div>
  );
};
