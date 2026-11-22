import React from 'react';

/**
 * Three Squares Orbit / Chasing Loader
 * Exactly matching the user's uploaded screen recording:
 * 3 rounded squares in a 2x2 grid (red, green, orange/amber),
 * chasing smoothly around the 4 positions with the 4th slot empty.
 * Sized small to sit nicely next to "Compiling...".
 */
export const ThreeSquaresLoader: React.FC<{ size?: number }> = ({ size = 20 }) => {
  return (
    <div
      className="relative select-none inline-flex items-center justify-center shrink-0"
      style={{ width: size, height: size }}
    >
      <div className="three-squares-spinner w-full h-full relative" />
      <style>{`
        .three-squares-spinner {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          grid-template-rows: repeat(2, 1fr);
          gap: 2.5px;
          animation: spin3Squares 1.8s cubic-bezier(0.65, 0, 0.35, 1) infinite;
        }

        .three-squares-spinner::before,
        .three-squares-spinner::after {
          content: "";
          border-radius: 2.5px;
        }

        /* Red Square (top-left) */
        .three-squares-spinner::before {
          background-color: #ef4444; /* Coral Red */
          grid-area: 1 / 1;
        }

        /* Olive/Green Square (top-right) */
        .three-squares-spinner::after {
          background-color: #84cc16; /* Muted Olive Green */
          grid-area: 1 / 2;
        }

        @keyframes spin3Squares {
          0% {
            transform: rotate(0deg);
          }
          25% {
            transform: rotate(90deg);
          }
          50% {
            transform: rotate(180deg);
          }
          75% {
            transform: rotate(270deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
      {/* 3rd Amber/Orange square in bottom-left slot */}
      <div
        className="absolute w-[calc(50%-1.25px)] h-[calc(50%-1.25px)] rounded-[2.5px] bg-[#f97316] pointer-events-none"
        style={{
          left: 0,
          bottom: 0,
          transformOrigin: 'center center',
          animation: 'spin3Squares 1.8s cubic-bezier(0.65, 0, 0.35, 1) infinite',
        }}
      />
    </div>
  );
};
