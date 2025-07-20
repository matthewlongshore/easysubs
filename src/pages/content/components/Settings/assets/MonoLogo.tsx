export const MonoLogo = () => (
  <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="blueBg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#8FD1F8" />
        <stop offset="100%" stopColor="#1C91C0" />
      </linearGradient>
      <linearGradient id="catRed" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#FF5F6D" />
        <stop offset="100%" stopColor="#FF9966" />
      </linearGradient>
    </defs>

    {/* Background */}
    <rect width="64" height="64" rx="12" fill="url(#blueBg)" />

    {/* Text */}
    <text
      x="12"
      y="46"
      fontFamily="'Segoe UI', 'Helvetica Neue', sans-serif"
      fontSize="32"
      fontWeight="700"
      fill="url(#catRed)"
    >
      L
    </text>
    <text
      x="34"
      y="46"
      fontFamily="'Segoe UI', 'Helvetica Neue', sans-serif"
      fontSize="32"
      fontWeight="700"
      fill="#ffffff"
    >
      C
    </text>
  </svg>
);
