import React from 'react';

export type OptionStatus = 'idle' | 'selected' | 'correct' | 'wrong' | 'revealed' | 'eliminated';

interface OptionButtonProps {
  label: 'A' | 'B' | 'C' | 'D';
  text: string;
  status: OptionStatus;
  disabled: boolean;
  onClick: () => void;
}

export const OptionButton: React.FC<OptionButtonProps> = ({
  label,
  text,
  status,
  disabled,
  onClick,
}) => {
  if (status === 'eliminated') {
    return (
      <div className="w-full min-h-[56px] rounded-2xl border border-slate-800/40 bg-slate-900/20 opacity-20 cursor-not-allowed flex items-center px-4 py-2 select-none" />
    );
  }

  let bgStyles = 'bg-gradient-to-r from-slate-800/90 to-slate-850/90 border-slate-700/80 hover:border-amber-500/60 hover:bg-slate-800 text-slate-100 shadow-md';
  let badgeStyles = 'text-amber-400 border-amber-500/40 bg-amber-500/10';

  if (status === 'selected') {
    bgStyles = 'bg-gradient-to-r from-amber-600 to-amber-500 border-amber-300 text-slate-950 shadow-[0_0_20px_rgba(245,158,11,0.5)] animate-pulse font-bold';
    badgeStyles = 'text-slate-950 border-slate-950 bg-amber-300';
  } else if (status === 'correct' || status === 'revealed') {
    bgStyles = 'bg-gradient-to-r from-emerald-600 to-green-500 border-emerald-300 text-white shadow-[0_0_25px_rgba(16,185,129,0.7)] font-bold';
    badgeStyles = 'text-white border-white bg-emerald-700';
  } else if (status === 'wrong') {
    bgStyles = 'bg-gradient-to-r from-red-600 to-rose-600 border-red-300 text-white shadow-[0_0_25px_rgba(239,68,68,0.7)] font-bold animate-shake';
    badgeStyles = 'text-white border-white bg-red-700';
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`group w-full min-h-[54px] sm:min-h-[58px] rounded-2xl border-2 transition-all duration-200 flex items-center px-3 sm:px-4 py-2.5 text-left active:scale-[0.98] cursor-pointer disabled:cursor-default relative overflow-hidden backdrop-blur-md ${bgStyles}`}
    >
      {/* Harf Rozeti (A, B, C, D) */}
      <span
        className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl border flex items-center justify-center font-black text-xs sm:text-sm mr-3 shrink-0 transition-colors ${badgeStyles}`}
      >
        {label}
      </span>

      {/* Şık Metni */}
      <span className="flex-1 text-xs sm:text-sm font-semibold leading-snug tracking-wide">
        {text}
      </span>

      {/* Hafif parlama ışığı */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none" />
    </button>
  );
};
