import React, { useEffect, useRef } from 'react';
import Iridescence, { type IridescenceProps } from '../Iridescence';

export type WhatsAppBackgroundPreset =
  | 'whatsapp-iridescent'
  | 'whatsapp-dual'
  | 'whatsapp-dark';

export interface E2EEPageBackgroundProps {
  children?: React.ReactNode;
  preset?: WhatsAppBackgroundPreset;
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
  className?: string;
  iridescenceProps?: Partial<IridescenceProps>;
}

export const E2EEPageBackground: React.FC<E2EEPageBackgroundProps> = ({
  children,
  preset = 'whatsapp-iridescent',
  color,
  accentColor,
  cyanColor,
  darkColor,
  whiteColor,
  hueShift,
  speed = 0.75,
  amplitude = 0.12,
  stir = 0.45,
  sheen = 0.35,
  opacity = 0.92,
  className = '',
  iridescenceProps = {},
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // WhatsApp & Cyan silk color configurations
  let activeColor = color;
  let activeAccent = accentColor;
  let activeCyan = cyanColor;
  let activeDark = darkColor;
  let activeWhite = whiteColor;
  let activeHue = hueShift;

  if (preset === 'whatsapp-iridescent') {
    // Harmonious blend of WhatsApp green, radiant mint, oceanic cyan, deep emerald, and soft silk glints
    activeColor = activeColor ?? '#1da860';
    activeAccent = activeAccent ?? '#2dd4bf';
    activeCyan = activeCyan ?? '#06b6d4';
    activeDark = activeDark ?? '#03261e';
    activeWhite = activeWhite ?? '#dcfce7';
    activeHue = activeHue ?? 0;
  } else if (preset === 'whatsapp-dual') {
    activeColor = activeColor ?? '#064e3b';
    activeAccent = activeAccent ?? '#10b981';
    activeCyan = activeCyan ?? '#06b6d4';
    activeDark = activeDark ?? '#02130e';
    activeWhite = activeWhite ?? '#ffffff';
    activeHue = activeHue ?? 0;
  } else if (preset === 'whatsapp-dark') {
    activeColor = activeColor ?? '#080e12';
    activeAccent = activeAccent ?? '#0f766e';
    activeCyan = activeCyan ?? '#22d3ee';
    activeDark = activeDark ?? '#040b08';
    activeWhite = activeWhite ?? '#ffffff';
    activeHue = activeHue ?? 90;
  }

  // Forward viewport pointer events so cursor interaction stirs the liquid seamlessly
  useEffect(() => {
    let ticking = false;

    const handlePointerMove = (e: PointerEvent) => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const hostEl = containerRef.current?.querySelector('.iridescence-container');
          if (hostEl) {
            hostEl.dispatchEvent(
              new PointerEvent('pointermove', {
                clientX: e.clientX,
                clientY: e.clientY,
                pointerType: e.pointerType || 'mouse',
                bubbles: false,
              })
            );
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    const handlePointerDown = (e: PointerEvent) => {
      const hostEl = containerRef.current?.querySelector('.iridescence-container');
      if (hostEl) {
        hostEl.dispatchEvent(
          new PointerEvent('pointerdown', {
            clientX: e.clientX,
            clientY: e.clientY,
            pointerType: e.pointerType || 'mouse',
            bubbles: false,
          })
        );
      }
    };

    const handlePointerLeave = () => {
      const hostEl = containerRef.current?.querySelector('.iridescence-container');
      if (hostEl) {
        hostEl.dispatchEvent(new PointerEvent('pointerleave', { bubbles: false }));
      }
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerdown', handlePointerDown, { passive: true });
    window.addEventListener('pointerleave', handlePointerLeave, { passive: true });

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointerleave', handlePointerLeave);
    };
  }, []);

  return (
    <div className={`relative w-full min-h-screen text-white ${className}`}>
      {/* Fixed Fullscreen Page Background Layer */}
      <div
        ref={containerRef}
        className="fixed inset-0 -z-10 h-screen w-screen overflow-hidden pointer-events-none select-none bg-[#070b0e]"
      >
        <Iridescence
          color={activeColor}
          accentColor={activeAccent}
          cyanColor={activeCyan}
          darkColor={activeDark}
          whiteColor={activeWhite}
          hueShift={activeHue}
          speed={speed}
          amplitude={amplitude}
          stir={stir}
          sheen={sheen}
          scale={1}
          detail={5}
          warp={0.32}
          rotation={-35}
          saturation={1.05}
          contrast={1.05}
          brightness={1.18}
          mouseReact={true}
          clickSwirl={true}
          grain={0}
          fade={0}
          opacity={opacity}
          className="h-full w-full pointer-events-auto"
          {...iridescenceProps}
        />

        {/* Soft dark crease vignette that preserves the silk ripples */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: `
              radial-gradient(circle at 50% 35%, rgba(3, 16, 12, 0.15) 0%, rgba(3, 16, 12, 0.55) 100%),
              linear-gradient(to bottom, rgba(3, 14, 10, 0.35) 0%, transparent 40%, rgba(2, 10, 8, 0.65) 100%)
            `,
          }}
        />
      </div>

      {/* Foreground Content */}
      <div className="relative z-10 w-full min-h-screen">{children}</div>
    </div>
  );
};
