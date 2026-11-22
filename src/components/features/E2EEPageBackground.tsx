import React, { useRef } from 'react';
import FloatingLines from '../FloatingLines';

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

  // Exact dark theme inspired by the Onda aesthetic with WhatsApp encryption accents:
  // Pure deep black backdrop, dark emerald depths, vibrant WhatsApp green ribbon cores,
  // and subtle glowing mint highlights.
  const ondaGradient = [
    '#059669', // Rich Emerald Green
    '#25D366', // Signature WhatsApp Green
    '#34d399', // Radiant Mint
    '#10b981', // Emerald
    '#0b5c48', // Deep Forest Green
    '#064e3b', // Dark WhatsApp Pine
  ];

  return (
    <div className={`relative w-full min-h-screen text-white bg-[#030705] ${className}`}>
      {/* Fixed Fullscreen Page Background Layer (Hardware-accelerated Floating Lines) */}
      <div
        ref={containerRef}
        className="fixed inset-0 -z-10 h-screen w-screen overflow-hidden pointer-events-auto select-none bg-[#020504]"
      >
        <FloatingLines
          linesGradient={ondaGradient}
          backgroundColor="#020504"
          lineCount={[10, 14, 10]}
          lineDistance={[4, 5, 4]}
          animationSpeed={0.65}
          amplitude={1.1}
          lineWidth={1.2}
          glow={1.4}
          brightness={1.15}
          depthOfField={0.3}
          edgeFade={0.15}
          interactive={true}
          bendRadius={3.0}
          bendStrength={-0.35}
          mouseDamping={0.06}
          parallax={true}
          parallaxStrength={0.18}
          clickSwirl={true}
          className="h-full w-full"
        />

        {/* Cinematic subtle edge & center vignette to keep typography crystal legible */}
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
