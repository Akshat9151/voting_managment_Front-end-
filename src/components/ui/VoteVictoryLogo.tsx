import React from 'react';

interface VoteVictoryLogoProps {
  className?: string;
  size?: number | string;
}

export const VoteVictoryLogo: React.FC<VoteVictoryLogoProps> = ({
  className = 'w-8 h-8',
}) => {
  return (
    <svg
      className={className}
      viewBox="0 0 120 120"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="VoteVictory logo"
    >
      <defs>
        <linearGradient id="vv-saffron-base" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F59E0B" />
          <stop offset="60%" stopColor="#D97706" />
          <stop offset="100%" stopColor="#B45309" />
        </linearGradient>
        <linearGradient id="vv-saffron-crown" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FEF3C7" />
          <stop offset="50%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#D97706" />
        </linearGradient>
        <linearGradient id="vv-saffron-gold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFBEB" />
          <stop offset="100%" stopColor="#F59E0B" />
        </linearGradient>
      </defs>

      {/* Outer Saffron Base Circle */}
      <circle cx="60" cy="56" r="48" fill="url(#vv-saffron-base)" />

      {/* Inner subtle glass ring */}
      <circle
        cx="60"
        cy="56"
        r="36"
        fill="rgba(255,255,255,0.12)"
        stroke="rgba(255,255,255,0.3)"
        strokeWidth="1.5"
      />

      {/* Specular Highlight */}
      <ellipse
        cx="44"
        cy="36"
        rx="20"
        ry="11"
        fill="rgba(255,255,255,0.25)"
        transform="rotate(-22,44,36)"
      />

      {/* Crown */}
      <g transform="translate(60,16)">
        <rect x="-13" y="8" width="26" height="5" rx="2.5" fill="url(#vv-saffron-crown)" />
        <polygon points="-13,8 -10,0 -6,8" fill="url(#vv-saffron-crown)" />
        <polygon points="-4,8  0,-6  4,8" fill="url(#vv-saffron-gold)" />
        <polygon points="6,8  10,0  13,8" fill="url(#vv-saffron-crown)" />
        <circle cx="-9" cy="5" r="2" fill="white" opacity="0.85" />
        <circle cx="0" cy="3" r="2.5" fill="white" opacity="0.95" />
        <circle cx="9" cy="5" r="2" fill="white" opacity="0.85" />
      </g>

      {/* V-Checkmark */}
      <g transform="translate(60,62)">
        <polyline
          points="-20,2 -5,20 22,-19"
          fill="none"
          stroke="rgba(15,23,42,0.25)"
          strokeWidth="12"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <polyline
          points="-20,2 -5,20 22,-19"
          fill="none"
          stroke="white"
          strokeWidth="9"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
};
