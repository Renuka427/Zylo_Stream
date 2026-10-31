import React from 'react';

/**
 * ZyloLogo - The official brand emblem and typographic wordmark for Zylo Stream.
 * Features a continuous flowing stream & recurring cycle ribbon icon with
 * Cherry Red (#C41E3A) and Champagne Gold (#D6B779) gradients.
 */
export const ZyloLogo = ({
  variant = 'dark', // 'dark' (on light backgrounds) or 'light' (on dark backgrounds)
  size = 'md', // 'sm', 'md', 'lg', 'xl'
  showWordmark = true,
  showTagline = false,
  className = ''
}) => {
  const isLight = variant === 'light';

  // Sizing definitions
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-11 h-11',
    xl: 'w-14 h-14'
  };

  const textSizes = {
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl'
  };

  const taglineSizes = {
    sm: 'text-[8px]',
    md: 'text-[9.5px]',
    lg: 'text-[11px]',
    xl: 'text-xs'
  };

  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      {/* Stream Flow & Cycle Emblem */}
      <div
        className={`${iconSizes[size]} relative rounded-xl flex items-center justify-center shrink-0 shadow-sm transition-transform duration-300 group-hover:scale-105 ${
          isLight
            ? 'bg-gradient-to-br from-ivory to-champagne/90 border border-white/20 shadow-cherry-darker/30'
            : 'bg-gradient-to-br from-cherry-dark to-[#501322] border border-stone-warm shadow-stone-300/40'
        }`}
      >
        <svg
          viewBox="0 0 36 36"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-3/4 h-3/4"
        >
          <defs>
            <linearGradient id="zyloStreamCherry" x1="4" y1="4" x2="32" y2="32" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#C41E3A" />
              <stop offset="100%" stopColor="#791D32" />
            </linearGradient>
            <linearGradient id="zyloStreamGold" x1="4" y1="32" x2="32" y2="4" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#E2CA99" />
              <stop offset="50%" stopColor="#D6B779" />
              <stop offset="100%" stopColor="#B38E46" />
            </linearGradient>
            <linearGradient id="zyloLightCherry" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#C41E3A" />
              <stop offset="100%" stopColor="#9E182E" />
            </linearGradient>
          </defs>

          {/* Flowing river ribbon lower arc */}
          <path
            d="M 6 22 C 10 14, 18 10, 24 13 C 28 15, 30 19, 29 23 C 28 27, 24 29, 20 28 C 14 26, 12 18, 16 11"
            stroke={isLight ? 'url(#zyloLightCherry)' : 'url(#zyloStreamGold)'}
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Continuous stream upper cycle intersecting arc */}
          <path
            d="M 30 14 C 26 22, 18 26, 12 23 C 8 21, 6 17, 7 13 C 8 9, 12 7, 16 8 C 22 10, 24 18, 20 25"
            stroke={isLight ? 'url(#zyloStreamGold)' : '#FFFAF2'}
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeOpacity={isLight ? '1' : '0.95'}
          />

          {/* Dynamic flow node accent */}
          <circle
            cx="24"
            cy="13"
            r="2"
            fill={isLight ? '#C41E3A' : '#D6B779'}
          />
        </svg>
      </div>

      {/* Typographic Wordmark */}
      {showWordmark && (
        <div className="flex flex-col leading-none">
          <div className="flex items-baseline gap-1.5">
            <span
              className={`font-display font-black tracking-tight ${textSizes[size]} ${
                isLight ? 'text-ivory' : 'text-espresso'
              }`}
            >
              Zylo
            </span>
            <span
              className={`font-display font-bold tracking-tight italic ${textSizes[size]} ${
                isLight ? 'text-champagne-gold' : 'text-cherry'
              }`}
            >
              Stream
            </span>
          </div>

          {showTagline && (
            <span
              className={`font-sans uppercase font-bold tracking-widest mt-1 ${taglineSizes[size]} ${
                isLight ? 'text-champagne-gold/90' : 'text-stone-500'
              }`}
            >
              Your Subscription, On Autopilot.
            </span>
          )}
        </div>
      )}
    </div>
  );
};
