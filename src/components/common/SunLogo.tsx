import React from 'react';

interface SunLogoProps {
  className?: string;
  variant?: 'light' | 'dark';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
  standalone?: boolean;
}

export const SunLogo: React.FC<SunLogoProps> = ({
  className = '',
  variant = 'dark',
  size = 'md',
  showSubtitle = true,
  standalone = false,
}) => {
  const isLight = variant === 'light';
  const logoImageSrc = '/assets/aistudio/WhatsApp_Image_2026-10-30_at_6.24.56_PM_70f77bb9.jpeg';

  const imageSizes = {
    sm: 'w-7 h-7 sm:w-8 sm:h-8',
    md: 'w-8 h-8 sm:w-10 sm:h-10 md:w-11 md:h-11',
    lg: 'w-12 h-12 sm:w-16 sm:h-16',
    xl: 'w-16 h-16 sm:w-24 sm:h-24',
  };

  const textSizes = {
    sm: 'text-xs sm:text-sm font-black',
    md: 'text-sm sm:text-lg md:text-2xl font-black',
    lg: 'text-lg sm:text-2xl sm:text-3xl font-black',
    xl: 'text-2xl sm:text-4xl font-black',
  };

  if (standalone) {
    return (
      <div className={`relative inline-flex items-center justify-center shrink-0 ${className}`}>
        <img
          src={logoImageSrc}
          alt="SUNPROPMART"
          className={`${imageSizes[size]} object-contain rounded-xl shadow-lg border border-amber-500/30 bg-[#0B1528]`}
        />
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2 sm:gap-3 select-none min-w-0 ${className}`}>
      {/* Official Master Logo Emblem */}
      <div
        className={`relative ${imageSizes[size]} rounded-lg sm:rounded-xl overflow-hidden shrink-0 border border-amber-500/30 bg-[#0B1528] shadow-md flex items-center justify-center group`}
      >
        <img
          src={logoImageSrc}
          alt="SUNPROPMART Logo"
          className="w-full h-full object-cover transform scale-105 transition-transform duration-300 group-hover:scale-110"
        />
      </div>

      {/* Brand Typography */}
      <div className="flex flex-col min-w-0">
        <span
          className={`tracking-wider ${textSizes[size]} leading-none truncate ${
            isLight ? 'text-slate-900' : 'text-[#E5B842]'
          }`}
          style={{ letterSpacing: '0.06em', fontFamily: 'serif' }}
        >
          SUNPROPMART
        </span>
        {showSubtitle && (
          <span
            className={`text-[7px] sm:text-[8px] md:text-[9.5px] uppercase tracking-[0.14em] sm:tracking-[0.22em] font-semibold mt-0.5 sm:mt-1 truncate ${
              isLight ? 'text-slate-600' : 'text-amber-200/90'
            }`}
          >
            Real Estate & Construction
          </span>
        )}
      </div>
    </div>
  );
};
