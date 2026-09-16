import React from 'react';
import { LifelineState, LifelineType } from '../../types/game';
import { Percent, PhoneCall, Users, RefreshCw, ShieldCheck } from 'lucide-react';
import { audioManager } from '../../utils/audioManager';

interface LifelineBarProps {
  lifelines: LifelineState;
  disabled: boolean;
  onUseLifeline: (type: LifelineType) => void;
}

export const LifelineBar: React.FC<LifelineBarProps> = ({
  lifelines,
  disabled,
  onUseLifeline,
}) => {
  const items: {
    type: LifelineType;
    label: string;
    icon: React.ReactNode;
    available: boolean;
  }[] = [
    {
      type: 'fifty',
      label: '%50:50',
      icon: <Percent className="w-4 h-4" />,
      available: lifelines.fifty,
    },
    {
      type: 'phone',
      label: 'Telefon',
      icon: <PhoneCall className="w-4 h-4" />,
      available: lifelines.phone,
    },
    {
      type: 'audience',
      label: 'Seyirci',
      icon: <Users className="w-4 h-4" />,
      available: lifelines.audience,
    },
    {
      type: 'change',
      label: 'Değiştir',
      icon: <RefreshCw className="w-4 h-4" />,
      available: lifelines.change,
    },
    {
      type: 'double',
      label: 'Çift Hak',
      icon: <ShieldCheck className="w-4 h-4" />,
      available: lifelines.double,
    },
  ];

  const handleClick = (type: LifelineType, available: boolean) => {
    if (!available || disabled) return;
    audioManager.playLifeline();
    onUseLifeline(type);
  };

  return (
    <div className="flex items-center justify-between gap-1.5 px-2 py-2 bg-slate-900/80 rounded-2xl border border-slate-800 shadow-md backdrop-blur-md">
      {items.map((item) => {
        return (
          <button
            key={item.type}
            disabled={!item.available || disabled}
            onClick={() => handleClick(item.type, item.available)}
            title={`${item.label} Jokeri ${item.available ? '(Kullanılabilir)' : '(Kullanıldı)'}`}
            className={`flex-1 flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all duration-200 cursor-pointer disabled:cursor-not-allowed ${
              item.available && !disabled
                ? 'bg-slate-800 hover:bg-slate-700/90 text-amber-400 border border-slate-700 active:scale-95 shadow-sm hover:border-amber-400/50'
                : 'bg-slate-950/60 text-slate-600 border border-slate-900/40 line-through opacity-40'
            }`}
          >
            <div className="mb-0.5">{item.icon}</div>
            <span className="text-[10px] font-bold tracking-tight">
              {item.label}
            </span>
          </button>
        );
      })}
    </div>
  );
};
