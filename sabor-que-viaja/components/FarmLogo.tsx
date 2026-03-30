interface FarmLogoProps {
  className?: string;
  size?: number;
}

export default function FarmLogo({ className = "", size = 32 }: FarmLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Sabor que viaja — logo granja"
    >
      {/* Sol */}
      <circle cx="22" cy="6" r="3" fill="#F4C542" />
      <line x1="22" y1="1" x2="22" y2="0" stroke="#F4C542" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="22" y1="11" x2="22" y2="12" stroke="#F4C542" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="17" y1="6" x2="16" y2="6" stroke="#F4C542" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="27" y1="6" x2="28" y2="6" stroke="#F4C542" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="18.5" y1="2.5" x2="17.8" y2="1.8" stroke="#F4C542" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="25.5" y1="9.5" x2="26.2" y2="10.2" stroke="#F4C542" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="25.5" y1="2.5" x2="26.2" y2="1.8" stroke="#F4C542" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="18.5" y1="9.5" x2="17.8" y2="10.2" stroke="#F4C542" strokeWidth="1.5" strokeLinecap="round" />

      {/* Granero — cuerpo */}
      <rect x="3" y="14" width="16" height="14" rx="1" fill="#8B5E3C" />
      {/* Granero — techo */}
      <polygon points="1,14 11,6 21,14" fill="#2F6F3E" />
      {/* Granero — puerta */}
      <rect x="8" y="20" width="6" height="8" rx="1" fill="#F4C542" opacity="0.9" />
      {/* Granero — ventana */}
      <rect x="4" y="17" width="4" height="4" rx="0.5" fill="white" opacity="0.7" />
      <rect x="14" y="17" width="4" height="4" rx="0.5" fill="white" opacity="0.7" />

      {/* Trigo derecho */}
      <line x1="26" y1="28" x2="26" y2="18" stroke="#4CAF50" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="29" y1="28" x2="29" y2="20" stroke="#4CAF50" strokeWidth="1.5" strokeLinecap="round" />
      <ellipse cx="26" cy="16" rx="2" ry="3" fill="#4CAF50" />
      <ellipse cx="29" cy="18" rx="1.5" ry="2.5" fill="#4CAF50" />

      {/* Suelo */}
      <line x1="1" y1="28" x2="31" y2="28" stroke="#4CAF50" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
