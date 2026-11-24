import React, { useEffect, useState, useRef } from 'react';

interface BlockRevealProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  blockColor?: string;
  isReady?: boolean;
  repeatInterval?: number;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * BlockReveal Component
 * Recreates the stylish block reveal effect:
 * A colored block sweeps across from the left (scaleX 0 -> 1 with transform-origin: left),
 * the text behind it is revealed, and the block pulls away to the right (scaleX 1 -> 0 with transform-origin: right).
 */
export const BlockReveal: React.FC<BlockRevealProps> = ({
  children,
  delay = 100,
  duration = 0.5,
  blockColor = '#176B50',
  isReady = true,
  repeatInterval = 5200,
  className = '',
  style = {},
}) => {
  const [textOpacity, setTextOpacity] = useState(0);
  const [scaleX, setScaleX] = useState(0);
  const [origin, setOrigin] = useState<'left' | 'right'>('left');
  const [transitionEnabled, setTransitionEnabled] = useState(false);
  const hasTriggeredRef = useRef(false);

  const triggerAnimation = () => {
    // 1. Reset origin to left and scale to 0 without transition
    setTransitionEnabled(false);
    setOrigin('left');
    setScaleX(0);

    // 2. Expand block from left to right
    const t1 = setTimeout(() => {
      setTransitionEnabled(true);
      setScaleX(1);
    }, 50);

    // 3. At peak (when fully covered), reveal text, flip origin to right, and contract block
    const t2 = setTimeout(() => {
      setTextOpacity(1);
      setOrigin('right');
      setScaleX(0);
    }, duration * 1000 + 70);

    return [t1, t2];
  };

  useEffect(() => {
    if (!isReady) return;

    let timers: ReturnType<typeof setTimeout>[] = [];
    let interval: ReturnType<typeof setInterval> | null = null;

    const initialTimer = setTimeout(() => {
      hasTriggeredRef.current = true;
      timers = triggerAnimation();

      if (repeatInterval > 0) {
        interval = setInterval(() => {
          timers.forEach((t) => clearTimeout(t));
          timers = triggerAnimation();
        }, repeatInterval);
      }
    }, delay);

    return () => {
      clearTimeout(initialTimer);
      timers.forEach((t) => clearTimeout(t));
      if (interval) clearInterval(interval);
    };
  }, [isReady, delay, duration, repeatInterval]);

  return (
    <span
      className={`relative inline-block overflow-hidden py-0.5 sm:py-1 px-1 sm:px-2 align-middle ${className}`}
      style={{
        ...style,
      }}
    >
      {/* Content to reveal */}
      <span
        style={{
          opacity: textOpacity,
          display: 'inline-block',
          transition: 'opacity 0.06s ease',
        }}
      >
        {children}
      </span>

      {/* Sliding reveal block overlay */}
      <span
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: blockColor,
          transformOrigin: origin,
          transform: `scaleX(${scaleX})`,
          transition: transitionEnabled
            ? `transform ${duration}s cubic-bezier(0.86, 0, 0.07, 1)`
            : 'none',
          pointerEvents: 'none',
          zIndex: 10,
        }}
      />
    </span>
  );
};

export default BlockReveal;
