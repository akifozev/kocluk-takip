import React from 'react';
import { HostInfo } from '../../types/game';

interface HostDialogProps {
  host: HostInfo;
  speech: string;
  isPondering?: boolean;
}

export const HostDialog: React.FC<HostDialogProps> = ({
  host,
  speech,
  isPondering = false,
}) => {
  return (
    <div className="flex items-center gap-3 px-3 py-2 bg-slate-800/60 border border-slate-700/50 rounded-2xl backdrop-blur-md shadow-inner transition-all duration-300">
      {/* Sunucu Avatarı */}
      <div className="relative shrink-0">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-500/20 to-indigo-600/20 border-2 border-amber-400/60 flex items-center justify-center text-2xl shadow-md select-none">
          {host.avatar}
        </div>
        {isPondering && (
          <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-amber-500"></span>
          </span>
        )}
      </div>

      {/* Konuşma Baloncuğu */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
            {host.name}
          </span>
          <span className="text-[10px] text-slate-400 font-medium">
            {host.title}
          </span>
        </div>
        <p className="text-xs sm:text-sm text-slate-200 leading-snug font-medium line-clamp-2 transition-all">
          "{speech}"
        </p>
      </div>
    </div>
  );
};
