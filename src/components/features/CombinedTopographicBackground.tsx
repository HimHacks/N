import React, { useEffect, useRef, useState } from 'react';
import { TopographicFlow } from '../topographic-flow';

interface CombinedTopographicBackgroundProps {
  children?: React.ReactNode;
  className?: string;
  is3dShaded?: boolean;
}

export const CombinedTopographicBackground: React.FC<CombinedTopographicBackgroundProps> = ({
  children,
  className = '',
  is3dShaded = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });

  // Forward viewport pointer events to the TopographicFlow canvas host
  // so cursor hover interactions (rings, ripples, deformation) trigger anywhere on screen.
  useEffect(() => {
    let ticking = false;

    const handlePointerMove = (e: PointerEvent) => {
      if (!ticking) {
        requestAnimationFrame(() => {
          // Update dynamic 3D lighting coordinates
          setMousePos({
            x: Math.round((e.clientX / window.innerWidth) * 100),
            y: Math.round((e.clientY / window.innerHeight) * 100),
          });

          // Forward synthetic pointermove to TopographicFlow host element
          const hostEl = containerRef.current?.querySelector('.topographic-flow');
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
      const hostEl = containerRef.current?.querySelector('.topographic-flow');
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
      const hostEl = containerRef.current?.querySelector('.topographic-flow');
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
    <div className={`relative w-full min-h-screen ${className}`}>
      {/* Fixed Full-Viewport Topographic Flow Canvas */}
      <div ref={containerRef} className="fixed inset-0 -z-10 h-screen w-screen overflow-hidden">
        {/* Layer 1: 3D Volumetric Elevation Shading & Interactive Lighting (Image 1 depth relief) */}
        {is3dShaded && (
          <div
            className="absolute inset-0 pointer-events-none opacity-55 mix-blend-multiply transition-all duration-300 ease-out"
            style={{
              backgroundImage: `
                radial-gradient(circle at ${mousePos.x}% ${mousePos.y}%, rgba(0, 0, 0, 0.09) 0%, transparent 45%),
                radial-gradient(circle at ${100 - mousePos.x * 0.5}% ${100 - mousePos.y * 0.5}%, rgba(0, 0, 0, 0.12) 0%, transparent 60%),
                radial-gradient(circle at 30% 25%, rgba(0, 0, 0, 0.05) 0%, transparent 50%),
                linear-gradient(135deg, rgba(255, 255, 255, 0.7) 0%, rgba(220, 226, 235, 0.3) 100%)
              `,
            }}
          />
        )}

        {/* Layer 2: Official ReactDrops Topographic Flow (Image 2 survey isolines) */}
        {/* Tuned for noticeably fluid dynamics and high-responsiveness to cursor interaction */}
        <TopographicFlow
          animateEntrance={true}
          scale={460}
          density={5.2}
          speed={2.2}
          distortion={2.8}
          lineWidth={1.25}
          opacity={1}
          dashLength={7}
          dashGap={8}
          seed={42}
          gradientDiffusion={0}
          paused={false}
          hover={0.85}
          hoverRadius={240}
          hoverFollow={0.12}
          hoverFade={0.7}
          hoverEffect={'rings'}
          backgroundColor={'#ffffff'}
          backgroundImage={'none'}
          gradientColors={[]}
          grain={0}
          lineColor={'#000000'}
          accentColor={'#000000'}
          lineStyle={'solid'}
          className="h-full w-full"
        />

        {/* Soft atmospheric gradient to blend into page sections */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-white/20" />
      </div>

      {/* Page Content Layer */}
      <div className="relative z-10 w-full">{children}</div>
    </div>
  );
};
