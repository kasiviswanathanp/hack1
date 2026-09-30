import React from 'react';
import { APP_NAME, APP_TAGLINE } from '@/constants';

interface CivicEmblemProps {
  className?: string;
  size?: number | string;
}

/**
 * Modern Smart City & AI Vector Emblem
 * Features:
 * - Futuristic city skyline & architectural towers
 * - Interconnected AI neural nodes & data grid
 * - Apex AI beacon with radiant communication waves
 * - Dynamic vibrant Indigo-Blue-Cyan civic gradient
 */
export const CivicEmblem: React.FC<CivicEmblemProps> = ({ className = 'w-10 h-10', size }) => {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={size ? { width: size, height: size } : undefined}
      aria-label="CivicAI Emblem"
    >
      <defs>
        {/* Main Background Gradient */}
        <linearGradient id="civicBadgeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4338CA" /> {/* Indigo-700 */}
          <stop offset="45%" stopColor="#2563EB" /> {/* Blue-600 */}
          <stop offset="100%" stopColor="#0284C7" /> {/* Sky-600 */}
        </linearGradient>

        {/* AI Wave Radiant Gradient */}
        <linearGradient id="civicPulseGrad" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#38BDF8" />
          <stop offset="100%" stopColor="#A5F3FC" />
        </linearGradient>

        {/* Building Highlights */}
        <linearGradient id="towerGlassGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.08" />
        </linearGradient>

        {/* Ambient Glow */}
        <filter id="civicGlow" x="-20%" y="-20%" width="140%" height="140%" filterUnits="userSpaceOnUse">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Rounded Squircle Shield Base */}
      <rect
        x="2.5"
        y="2.5"
        width="43"
        height="43"
        rx="13"
        fill="url(#civicBadgeGrad)"
      />

      {/* Inner Border Accent */}
      <rect
        x="3"
        y="3"
        width="42"
        height="42"
        rx="12.5"
        stroke="#FFFFFF"
        strokeOpacity="0.25"
        strokeWidth="1"
      />

      {/* Subtle Top Glass Reflection */}
      <path
        d="M4 14C4 7.925 8.925 3 15 3H33C39.075 3 44 7.925 44 14V17C44 17 33 22 24 22C15 22 4 17 4 17V14Z"
        fill="#FFFFFF"
        fillOpacity="0.12"
      />

      {/* Ground / Civic Foundation Baseline */}
      <line
        x1="9"
        y1="37"
        x2="39"
        y2="37"
        stroke="#FFFFFF"
        strokeOpacity="0.85"
        strokeWidth="2"
        strokeLinecap="round"
      />

      {/* Left Modern Building Tower */}
      <rect
        x="11.5"
        y="23"
        width="6.5"
        height="14"
        rx="1.5"
        fill="url(#towerGlassGrad)"
        stroke="#FFFFFF"
        strokeOpacity="0.7"
        strokeWidth="1.2"
      />
      {/* Left Tower Window Dashes */}
      <line x1="14.75" y1="26" x2="14.75" y2="28" stroke="#FFFFFF" strokeOpacity="0.9" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="14.75" y1="30" x2="14.75" y2="32" stroke="#FFFFFF" strokeOpacity="0.9" strokeWidth="1.2" strokeLinecap="round" />

      {/* Right Modern Building Tower */}
      <rect
        x="30"
        y="20"
        width="6.5"
        height="17"
        rx="1.5"
        fill="url(#towerGlassGrad)"
        stroke="#FFFFFF"
        strokeOpacity="0.7"
        strokeWidth="1.2"
      />
      {/* Right Tower Window Dashes */}
      <line x1="33.25" y1="23" x2="33.25" y2="25" stroke="#FFFFFF" strokeOpacity="0.9" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="33.25" y1="27" x2="33.25" y2="29" stroke="#FFFFFF" strokeOpacity="0.9" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="33.25" y1="31" x2="33.25" y2="33" stroke="#FFFFFF" strokeOpacity="0.9" strokeWidth="1.2" strokeLinecap="round" />

      {/* Center High-Tech Smart Skyscraper */}
      <rect
        x="20"
        y="16.5"
        width="8"
        height="20.5"
        rx="1.5"
        fill="url(#towerGlassGrad)"
        stroke="#FFFFFF"
        strokeOpacity="0.95"
        strokeWidth="1.3"
      />
      {/* Center Skyscraper Illuminated Grid / Sensor Line */}
      <line x1="24" y1="19" x2="24" y2="34" stroke="#67E8F9" strokeOpacity="0.9" strokeWidth="1.2" strokeDasharray="2 1.5" />

      {/* AI Neural Network Connection Lines Linking Smart Towers */}
      <path
        d="M14.75 23 L24 16.5 L33.25 20"
        stroke="#A5F3FC"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.85"
      />

      {/* Vertical AI Uplink to Beacon */}
      <line
        x1="24"
        y1="16.5"
        x2="24"
        y2="10.5"
        stroke="#E0F2FE"
        strokeWidth="1.4"
        strokeDasharray="1.5 1"
      />

      {/* AI Neural Beacon & Smart Nodes */}
      {/* Left Tower Node */}
      <circle cx="14.75" cy="23" r="1.5" fill="#38BDF8" stroke="#FFFFFF" strokeWidth="0.8" />
      {/* Right Tower Node */}
      <circle cx="33.25" cy="20" r="1.5" fill="#38BDF8" stroke="#FFFFFF" strokeWidth="0.8" />
      {/* Center Tower Spire Node */}
      <circle cx="24" cy="16.5" r="1.6" fill="#67E8F9" stroke="#FFFFFF" strokeWidth="0.8" />

      {/* Glowing AI Apex Beacon (Pulsing Center) */}
      <circle
        cx="24"
        cy="9.5"
        r="2.8"
        fill="#FFFFFF"
        filter="url(#civicGlow)"
      />
      <circle
        cx="24"
        cy="9.5"
        r="1.6"
        fill="#38BDF8"
      />

      {/* Radiating AI Smart Waves / Satellite Pulse */}
      {/* Inner Wave Arc */}
      <path
        d="M19 8C20.3 6.8 22.1 6 24 6C25.9 6 27.7 6.8 29 8"
        stroke="url(#civicPulseGrad)"
        strokeWidth="1.4"
        strokeLinecap="round"
        fill="none"
      />
      {/* Outer Wave Arc */}
      <path
        d="M16 5.2C18.2 3.8 21 3 24 3C27 3 29.8 3.8 32 5.2"
        stroke="url(#civicPulseGrad)"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeOpacity="0.75"
        fill="none"
      />
    </svg>
  );
};

interface CivicLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'light' | 'dark';
  showTagline?: boolean;
  showBadge?: boolean;
  badgeText?: string;
  className?: string;
  onClick?: () => void;
}

export const CivicLogo: React.FC<CivicLogoProps> = ({
  size = 'md',
  variant = 'light',
  showTagline = true,
  showBadge = true,
  badgeText = 'GOV',
  className = '',
  onClick,
}) => {
  // Size-specific dimensions and typography scales
  const sizeMap = {
    sm: {
      emblem: 'w-8 h-8',
      title: 'text-base',
      badge: 'text-[9px] px-1 py-0.2',
      tagline: 'text-[10px]',
      gap: 'gap-2',
    },
    md: {
      emblem: 'w-10 h-10',
      title: 'text-lg',
      badge: 'text-[10px] px-1.5 py-0.5',
      tagline: 'text-[11px]',
      gap: 'gap-2.5',
    },
    lg: {
      emblem: 'w-12 h-12',
      title: 'text-xl',
      badge: 'text-xs px-2 py-0.5',
      tagline: 'text-xs',
      gap: 'gap-3',
    },
    xl: {
      emblem: 'w-16 h-16',
      title: 'text-2xl sm:text-3xl',
      badge: 'text-xs px-2.5 py-1',
      tagline: 'text-sm',
      gap: 'gap-3.5',
    },
  };

  const currentSize = sizeMap[size];
  const isDark = variant === 'dark';

  return (
    <div
      onClick={onClick}
      className={`flex items-center ${currentSize.gap} ${onClick ? 'cursor-pointer group select-none' : ''} ${className}`}
    >
      {/* Emblem with 3D drop-glow and micro-hover interaction */}
      <div className="relative shrink-0 transition-transform duration-300 group-hover:scale-105 group-hover:-translate-y-0.5">
        <CivicEmblem className={`${currentSize.emblem} drop-shadow-md transition-all duration-300 group-hover:drop-shadow-lg`} />
        {/* Soft background ambient glow */}
        <div className="absolute inset-0 -z-10 rounded-2xl bg-blue-500/25 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Typography & Badge */}
      <div className="flex flex-col justify-center leading-none">
        <div className="flex items-center gap-1.5">
          <span className={`${currentSize.title} font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'} flex items-center`}>
            <span>Civic</span>
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 bg-clip-text text-transparent ml-0.5">
              AI
            </span>
          </span>

          {showBadge && (
            <span
              className={`inline-flex items-center gap-1 rounded-md font-bold tracking-wider border shadow-2xs ${currentSize.badge} ${
                isDark
                  ? 'bg-blue-500/20 text-blue-300 border-blue-400/30'
                  : 'bg-blue-50 text-blue-700 border-blue-200/80'
              }`}
            >
              {/* Subtle Pulsing Beacon Dot */}
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-blue-600" />
              </span>
              <span>{badgeText}</span>
            </span>
          )}
        </div>

        {showTagline && (
          <p
            className={`hidden sm:block ${currentSize.tagline} font-medium tracking-tight mt-1 ${
              isDark ? 'text-slate-400' : 'text-slate-500'
            }`}
          >
            {APP_TAGLINE}
          </p>
        )}
      </div>
    </div>
  );
};

export default CivicLogo;
