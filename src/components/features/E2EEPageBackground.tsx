import React, { useEffect, useRef } from 'react';
import Iridescence, { type IridescenceProps } from '../Iridescence';

export type WhatsAppBackgroundPreset =
  | 'whatsapp-iridescent' // Full multi-hued iridescence (Image 1 style) in WhatsApp emerald/teal/mint spectrum
  | 'whatsapp-dual'       // Dual-accent undulation (WhatsApp Deep Forest Teal #075E54 + Vibrant Green #25D366)
  | 'whatsapp-dark';      // Deep obsidian night with cipher emerald and luminous sheen

interface E2EEPageBackgroundProps {
  children?: React.ReactNode;
  preset?: WhatsAppBackgroundPreset;
  /** Optional custom color override (hex or RGB array) */
  color?: string | [number, number, number];
  /** Optional secondary accent color for dual-fold wave highlights */
  accentColor?: string | [number, number, number];
  /** Color rotation angle in degrees (e.g. 115-130 for WhatsApp emerald) */
  hueShift?: number;
  speed?: number;
  amplitude?: number;
  stir?: number;
  sheen?: number;
  /** Opacity of the background canvas (0 to 1) */
  opacity?: number;
  /** Whether to show subtle dark contrast scrim for maximum typography readability */
  enableContrastScrim?: boolean;
  className?: string;
  iridescenceProps?: Partial<IridescenceProps>;
}

export const E2EEPageBackground: React.FC<E2EEPageBackgroundProps> = ({
  children,
  preset = 'whatsapp-iridescent',
  color,
  accentColor,
  hueShift,
  speed = 1.1,
  amplitude = 0.12,
  stir = 0.55,
  sheen = 0.35,
  opacity = 0.95,
  enableContrastScrim = true,
  className = '',
  iridescenceProps = {},
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Preset Configurations
  let activeColor = color;
  let activeAccent = accentColor;
  let activeHue = hueShift;

  if (preset === 'whatsapp-iridescent') {
    // Retains full multi-chromatic iridescence from Image 1, shifted into WhatsApp's emerald/teal spectrum
    activeColor = activeColor ?? '#ffffff';
    activeHue = activeHue ?? 120; // 120° maps magenta/purple into WhatsApp emerald & cyan into deep teal
  } else if (preset === 'whatsapp-dual') {
    // Dual-tone wave folds: Deep Forest Teal + Vibrant WhatsApp Green
    activeColor = activeColor ?? '#075E54';
    activeAccent = activeAccent ?? '#25D366';
    activeHue = activeHue ?? 0;
  } else if (preset === 'whatsapp-dark') {
    // Obsidian Cyber Foundation: Dark night + vibrant cipher highlights
    activeColor = activeColor ?? '#0B141A';
    activeAccent = activeAccent ?? '#128C7E';
    activeHue = activeHue ?? 90;
  }

  // Forward viewport pointer events to the Iridescence canvas host
  // so stirring and cursor wave interactions work smoothly anywhere on the page
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
    <div className={`relative w-full min-h-screen text-slate-100 ${className}`}>
      {/* Fixed Fullscreen Page Background Layer */}
      <div
        ref={containerRef}
        className="fixed inset-0 -z-10 h-screen w-screen overflow-hidden pointer-events-none select-none bg-[#0B141A]"
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
          detail={9}
          warp={1.2}
          rotation={-15}
          mouseReact={true}
          clickSwirl={true}
          grain={0.02}
          fade={0}
          opacity={opacity}
          className="h-full w-full pointer-events-auto"
          {...iridescenceProps}
        />

        {/* Contrast Scrim: Ensures fonts, headings, and cryptographic badges are razor-sharp */}
        {enableContrastScrim && (
          <div
            className="pointer-events-none absolute inset-0 transition-opacity duration-700"
            style={{
              backgroundImage: `
                radial-gradient(circle at 50% 25%, rgba(11, 20, 26, 0.45) 0%, rgba(11, 20, 26, 0.8) 100%),
                linear-gradient(to bottom, rgba(11, 20, 26, 0.5) 0%, transparent 40%, rgba(11, 20, 26, 0.85) 100%)
              `,
            }}
          />
        )}
      </div>

      {/* Foreground Content / Typography Layer */}
      <div className="relative z-10 w-full min-h-screen">{children}</div>
    </div>
  );
};
