/**
 * Inline SVG compass rose used on the auth screens' right-column.
 *
 * Editorial illustration — a stylised nautical compass on a dark panel,
 * cream tick marks, plum centre dot. No raster image; renders crisply at any size.
 */
export function CompassIllustration({ size = 200 }: { size?: number }) {
  // 60 ticks around the rose: every 5th is a major mark.
  const ticks = Array.from({ length: 60 }, (_, i) => i);

  return (
    <div
      className="relative overflow-hidden rounded-2xl bg-ink-700 shadow-soft"
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 200 200"
        className="h-full w-full"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        {/* outer rings */}
        <circle cx="100" cy="100" r="92" stroke="#DFD4BE" strokeWidth="0.5" opacity="0.5" />
        <circle cx="100" cy="100" r="80" stroke="#DFD4BE" strokeWidth="0.4" opacity="0.4" />
        <circle cx="100" cy="100" r="62" stroke="#DFD4BE" strokeWidth="0.3" opacity="0.25" />

        {/* tick marks */}
        {ticks.map((i) => {
          const angle = (i * 6 * Math.PI) / 180;
          const isMajor = i % 5 === 0;
          const r1 = 92;
          const r2 = isMajor ? 82 : 87;
          return (
            <line
              key={i}
              x1={100 + r1 * Math.sin(angle)}
              y1={100 - r1 * Math.cos(angle)}
              x2={100 + r2 * Math.sin(angle)}
              y2={100 - r2 * Math.cos(angle)}
              stroke="#DFD4BE"
              strokeWidth={isMajor ? 1 : 0.45}
              opacity={isMajor ? 0.85 : 0.55}
            />
          );
        })}

        {/* secondary 4-point star (E-W axis), behind */}
        <path
          d="M30 100 L100 92 L170 100 L100 108 Z"
          fill="#DFD4BE"
          opacity="0.35"
        />

        {/* primary 4-point star (N-S axis) */}
        <path
          d="M100 30 L108 100 L100 170 L92 100 Z"
          fill="#FBF8F3"
          opacity="0.95"
        />
        <path
          d="M100 30 L100 100 L92 100 Z"
          fill="#DFD4BE"
          opacity="0.7"
        />

        {/* centre pivot */}
        <circle cx="100" cy="100" r="5.5" fill="#7B4F5C" />
        <circle cx="100" cy="100" r="2" fill="#FBF8F3" />

        {/* N E S W labels */}
        <text
          x="100"
          y="22"
          textAnchor="middle"
          fontSize="11"
          fontFamily="Fraunces, Georgia, serif"
          fill="#DFD4BE"
        >
          N
        </text>
        <text
          x="100"
          y="186"
          textAnchor="middle"
          fontSize="11"
          fontFamily="Fraunces, Georgia, serif"
          fill="#DFD4BE"
        >
          S
        </text>
        <text
          x="183"
          y="104"
          textAnchor="middle"
          fontSize="11"
          fontFamily="Fraunces, Georgia, serif"
          fill="#DFD4BE"
        >
          E
        </text>
        <text
          x="17"
          y="104"
          textAnchor="middle"
          fontSize="11"
          fontFamily="Fraunces, Georgia, serif"
          fill="#DFD4BE"
        >
          W
        </text>
      </svg>
    </div>
  );
}
