import React from 'react';

/**
 * Three Sliding Squares Puzzle Loader
 * 3 rounded cubes (Red, Olive Green, Amber/Orange) in a 2x2 grid framework.
 * They slide past each other along the edges into the empty slot one by one
 * (like a 15-puzzle / sliding block puzzle), NEVER combining or morphing.
 */
export const ThreeSquaresLoader: React.FC<{ size?: number }> = ({ size = 26 }) => {
  return (
    <div
      className="relative select-none inline-flex items-center justify-center shrink-0"
      style={{ width: size, height: size }}
    >
      <div className="relative w-full h-full">
        {/* Cube 1: Coral Red (starts at top-left [0,0]) */}
        <div className="absolute w-[calc(50%-2px)] h-[calc(50%-2px)] rounded-[3.5px] bg-[#ef4444] shadow-sm cube-1" />

        {/* Cube 2: Olive Green (starts at top-right [1,0]) */}
        <div className="absolute w-[calc(50%-2px)] h-[calc(50%-2px)] rounded-[3.5px] bg-[#84cc16] shadow-sm cube-2" />

        {/* Cube 3: Warm Amber/Orange (starts at bottom-left [0,1]) */}
        <div className="absolute w-[calc(50%-2px)] h-[calc(50%-2px)] rounded-[3.5px] bg-[#f97316] shadow-sm cube-3" />
      </div>

      <style>{`
        /* 
          Grid Coordinates:
          TL: top-left     (0, 0)
          TR: top-right    (calc(100% + 4px), 0)
          BR: bottom-right (calc(100% + 4px), calc(100% + 4px))
          BL: bottom-left  (0, calc(100% + 4px))

          Empty slot starts at BR (bottom-right).
          Movement order:
          1. Cube 2 (TR) slides down to BR
          2. Cube 1 (TL) slides right to TR
          3. Cube 3 (BL) slides up to TL
          4. Cube 2 (BR) slides left to BL
        */

        .cube-1 {
          top: 0;
          left: 0;
          animation: slideCube1 2.4s cubic-bezier(0.65, 0, 0.35, 1) infinite;
        }

        .cube-2 {
          top: 0;
          right: 0;
          animation: slideCube2 2.4s cubic-bezier(0.65, 0, 0.35, 1) infinite;
        }

        .cube-3 {
          bottom: 0;
          left: 0;
          animation: slideCube3 2.4s cubic-bezier(0.65, 0, 0.35, 1) infinite;
        }

        @keyframes slideCube1 {
          0%, 100% {
            transform: translate(0, 0);
          }
          25% {
            transform: translate(0, 0);
          }
          50% {
            transform: translate(calc(100% + 4px), 0);
          }
          75% {
            transform: translate(calc(100% + 4px), calc(100% + 4px));
          }
        }

        @keyframes slideCube2 {
          0%, 100% {
            transform: translate(0, 0);
          }
          25% {
            transform: translate(0, calc(100% + 4px));
          }
          50% {
            transform: translate(calc(-100% - 4px), calc(100% + 4px));
          }
          75% {
            transform: translate(calc(-100% - 4px), 0);
          }
        }

        @keyframes slideCube3 {
          0%, 100% {
            transform: translate(0, 0);
          }
          25% {
            transform: translate(0, 0);
          }
          50% {
            transform: translate(0, 0);
          }
          75% {
            transform: translate(0, calc(-100% - 4px));
          }
        }
      `}</style>
    </div>
  );
};
