/**
 * Fixed, decorative Vietnamese countryside backdrop (DESIGN.md §5).
 * Non-interactive, low-noise, sits behind everything.
 */
export function CountrysideBackdrop() {
  return (
    <div
      aria-hidden
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        overflow: "hidden",
        pointerEvents: "none",
      }}
    >
      <svg width="100%" height="100%" viewBox="0 0 400 800" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fdf3da" />
            <stop offset="55%" stopColor="#f5ecd7" />
            <stop offset="100%" stopColor="#eadfbf" />
          </linearGradient>
          <radialGradient id="sun" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffe9a8" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#ffe9a8" stopOpacity="0" />
          </radialGradient>
        </defs>

        <rect width="400" height="800" fill="url(#sky)" />
        <circle cx="310" cy="120" r="150" fill="url(#sun)" />
        <circle cx="310" cy="120" r="42" fill="#f6cf72" opacity="0.85" />

        {/* mountains */}
        <path d="M0 300 L90 210 L170 300 Z" fill="#bcc79a" opacity="0.7" />
        <path d="M120 300 L230 195 L340 300 Z" fill="#aab987" opacity="0.7" />
        <path d="M250 300 L330 225 L400 300 Z" fill="#c2cda1" opacity="0.7" />

        {/* rice fields */}
        <rect y="300" width="400" height="120" fill="#cdd98f" opacity="0.65" />
        <rect y="420" width="400" height="120" fill="#bcca7a" opacity="0.6" />
        <rect y="540" width="400" height="160" fill="#a8bb66" opacity="0.55" />
        <rect y="700" width="400" height="120" fill="#94ab52" opacity="0.6" />

        {/* coconut tree */}
        <g opacity="0.85">
          <path d="M52 560 q6 -120 -2 -190" stroke="#8e6a3a" strokeWidth="9" fill="none" />
          <g fill="#5d7d36">
            <path d="M50 370 q-55 -16 -78 8 q44 -2 78 12" />
            <path d="M50 370 q55 -16 78 8 q-44 -2 -78 12" />
            <path d="M50 370 q-20 -56 -52 -64 q22 30 52 78" />
            <path d="M50 370 q20 -56 52 -64 q-22 30 -52 78" />
          </g>
        </g>

        {/* bamboo on the right */}
        <g opacity="0.8" stroke="#6b8e3d" strokeWidth="6" fill="none">
          <path d="M372 700 L372 360" />
          <path d="M386 700 L386 400" />
          <g stroke="#5d7d36" strokeWidth="4">
            <path d="M372 470 q22 -14 40 -8" />
            <path d="M386 510 q22 -14 40 -8" />
          </g>
        </g>

        {/* birds */}
        <g stroke="#6b5d44" strokeWidth="2.5" fill="none" opacity="0.6">
          <path d="M120 110 q10 -10 20 0 q10 -10 20 0" />
          <path d="M170 140 q8 -8 16 0 q8 -8 16 0" />
        </g>

        {/* kite */}
        <g opacity="0.7" style={{ transformOrigin: "230px 90px", animation: "ctm-float 9s ease-in-out infinite" }}>
          <polygon points="230,70 246,92 230,114 214,92" fill="#e87432" />
          <path d="M230 114 q-6 16 4 28" stroke="#b85a22" strokeWidth="2" fill="none" />
        </g>

        {/* foreground grass */}
        <g fill="#6b8e3d" opacity="0.85">
          <path d="M0 800 L0 740 q14 -34 28 0 q14 -40 28 0 q14 -30 28 0 L84 800 Z" />
          <path d="M320 800 L320 745 q14 -32 28 0 q14 -38 28 0 q14 -28 28 0 L400 800 Z" />
        </g>
      </svg>
    </div>
  );
}
