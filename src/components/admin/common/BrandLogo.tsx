export function BrandLogo({ className = "h-10 w-auto" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 235 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Retro Club Football Jerseys"
    >
      {/* Left Retro Number Block */}
      <g fill="currentColor" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="900">
        <text x="2" y="21" fontSize="18" letterSpacing="-0.5">
          7 10 13
        </text>
        <text x="2" y="39" fontSize="19" letterSpacing="-0.5">
          1990
        </text>
        <text x="2" y="57" fontSize="18" letterSpacing="-0.5">
          87 82
        </text>
      </g>

      {/* Vertical Divider */}
      <rect x="64" y="8" width="2" height="48" rx="1" fill="currentColor" opacity="0.25" />

      {/* Main Brand Title */}
      <text
        x="74"
        y="29"
        fill="currentColor"
        fontFamily="system-ui, -apple-system, sans-serif"
        fontWeight="900"
        fontSize="26"
        letterSpacing="-0.8"
      >
        Retro
      </text>
      <text
        x="74"
        y="50"
        fill="currentColor"
        fontFamily="system-ui, -apple-system, sans-serif"
        fontWeight="900"
        fontSize="26"
        letterSpacing="-0.8"
      >
        Club.
      </text>

      {/* Subtitle */}
      <text
        x="75"
        y="61"
        fill="currentColor"
        opacity="0.75"
        fontFamily="system-ui, -apple-system, sans-serif"
        fontWeight="700"
        fontSize="8.5"
        letterSpacing="1.6"
      >
        FOOTBALL JERSEYS
      </text>
    </svg>
  );
}