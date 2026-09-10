import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ size = 'md', showText = true }) => {
  const sizeMap = {
    sm: { box: 'w-8 h-8 rounded-lg', svg: 'w-5 h-5', text: 'text-base', sub: 'text-[10px]' },
    md: { box: 'w-10 h-10 rounded-xl', svg: 'w-6 h-6', text: 'text-lg sm:text-xl', sub: 'text-[11px]' },
    lg: { box: 'w-14 h-14 rounded-2xl', svg: 'w-8 h-8', text: 'text-2xl', sub: 'text-xs' },
    xl: { box: 'w-18 h-18 rounded-3xl', svg: 'w-11 h-11', text: 'text-3xl', sub: 'text-xs' }
  };

  const current = sizeMap[size];

  return (
    <div className="flex items-center gap-2.5 select-none">
      {/* Visual Logo Badge */}
      <div
        className={`${current.box} flex items-center justify-center shrink-0 relative overflow-hidden shadow-md shadow-indigo-500/25`}
      >
        <img
          src="/icon.svg"
          alt="CoachTrack Logo"
          className="w-full h-full object-contain"
        />
      </div>

      {/* Brand Text */}
      {showText && (
        <div>
          <div className="flex items-center gap-1 leading-tight">
            <span className={`${current.text} font-black tracking-tight bg-linear-to-r from-indigo-600 via-indigo-700 to-violet-600 bg-clip-text text-transparent`}>
              CoachTrack
            </span>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-violet-700 bg-violet-100/90 px-1.5 py-0.2 rounded-md border border-violet-200">
              Pro
            </span>
          </div>
          <span className={`block ${current.sub} text-slate-400 font-semibold tracking-wide leading-none mt-0.5`}>
            Eğitim & Koçluk Sistemi
          </span>
        </div>
      )}
    </div>
  );
};
