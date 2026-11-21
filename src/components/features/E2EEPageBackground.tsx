import React, { useEffect, useRef } from 'react';
import Iridescence, { type IridescenceProps } from '../Iridescence';

export type WhatsAppBackgroundPreset =
  | 'whatsapp-iridescent'
  | 'whatsapp-dual'
  | 'whatsapp-dark';

interface E2EEPageBackgroundProps {
  children?: React.ReactNode;
  preset?: WhatsAppBackgroundPreset;
  color?: string | [number, number, number];
  accentColor?: string | [number, number, number];
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
  hueShift,
  speed = 0.85,
  amplitude = 0.1,
  stir = 0.45,
  sheen = 0.25,
  opacity = 0.85,
  className = '',
  iridescenceProps = {},
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Muted, non-oversaturated WhatsApp color configurations
  let activeColor = color;
  let activeAccent = accentColor;
  let activeHue = hueShift;

  if (preset === 'whatsapp-iridescent') {
    // Elegant desaturated WhatsApp emerald and teal spectrum
    activeColor = activeColor ?? '#ffffff';
    activeHue = activeHue ?? 125;
  } else if (preset === 'whatsapp-dual') {
    activeColor = activeColor ?? '#064e3b';
    activeAccent = activeAccent ?? '#10b981';
    activeHue = activeHue ?? 0;
  } else if (preset === 'whatsapp-dark') {
    activeColor = activeColor ?? '#080e12';
    activeAccent = activeAccent ?? '#0f766e';
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
          hueShift={activeHue}
          speed={speed}
          amplitude={amplitude}
          stir={stir}
          sheen={sheen}
          scale={1}
          detail={8}
          warp={1.1}
          rotation={-10}
          saturation={0.62} // Desaturated per user instruction
          contrast={0.95}
          brightness={1.05}
          mouseReact={true}
          clickSwirl={true}
          grain={0} // No grain texture per user instruction
          fade={0}
          opacity={opacity}
          className="h-full w-full pointer-events-auto"
          {...iridescenceProps}
        />

        {/* Soft dark vignette */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: `
              radial-gradient(circle at 50% 30%, rgba(7, 11, 14, 0.4) 0%, rgba(7, 11, 14, 0.85) 100%),
              linear-gradient(to bottom, rgba(7, 11, 14, 0.6) 0%, transparent 40%, rgba(7, 11, 14, 0.9) 100%)
            `,
          }}
        />
      </div>

      {/* Foreground Content */}
      <div className="relative z-10 w-full min-h-screen">{children}</div>
    </div>
  );
};
