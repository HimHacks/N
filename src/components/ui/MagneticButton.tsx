import React, { useRef, useState } from 'react';
import { useSpring, animated } from '@react-spring/web';

interface MagneticButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: 'primary' | 'secondary' | 'glow';
}

export const MagneticButton: React.FC<MagneticButtonProps> = ({
  children,
  onClick,
  className = '',
  variant = 'primary',
}) => {
  const btnRef = useRef<HTMLButtonElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // React Spring physics spring for smooth magnetic pull
  const [{ x, y, scale }, api] = useSpring(() => ({
    x: 0,
    y: 0,
    scale: 1,
    config: { mass: 0.15, tension: 350, friction: 18 },
  }));

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!btnRef.current) return;
    const rect = btnRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const distanceX = (e.clientX - centerX) * 0.35;
    const distanceY = (e.clientY - centerY) * 0.35;

    api.start({ x: distanceX, y: distanceY, scale: 1.05 });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    api.start({ x: 0, y: 0, scale: 1 });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'glow':
        return 'border border-cyan-400/40 bg-gradient-to-r from-cyan-500/20 via-sky-500/10 to-indigo-500/20 text-cyan-200 shadow-[0_0_30px_rgba(6,182,212,0.35)]';
      case 'secondary':
        return 'border border-white/10 bg-white/5 text-slate-300 hover:border-white/20 hover:text-white';
      default:
        return 'border border-cyan-500/30 bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-lg shadow-cyan-500/20';
    }
  };

  return (
    <animated.button
      ref={btnRef}
      style={{
        transform: x.to((xVal) => `translate3d(${xVal}px, ${y.get()}px, 0px) scale(${scale.get()})`),
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      className={`relative inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 font-mono text-xs font-semibold tracking-wide transition-colors cursor-pointer select-none backdrop-blur-md overflow-hidden ${getVariantStyles()} ${className}`}
    >
      {/* Liquid shine wave */}
      {isHovered && (
        <span className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none" />
      )}
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </animated.button>
  );
};
