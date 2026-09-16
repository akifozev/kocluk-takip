import React from 'react';
import { PRIZE_LADDER } from '../../data/ladder';
import { X, Check, Award } from 'lucide-react';

interface MoneyLadderProps {
  currentLevel: number;
  isOpen: boolean;
  onClose: () => void;
}

export const MoneyLadder: React.FC<MoneyLadderProps> = ({
  currentLevel,
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-sm max-h-[90vh] bg-slate-900 border-2 border-slate-700 rounded-3xl p-4 sm:p-5 shadow-2xl flex flex-col relative overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2 text-amber-400 font-black text-base">
            <Award className="w-5 h-5" />
            <span>Ödül Merdiveni</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 15 Basamak Listesi (Aşağıdan yukarıya sıralı) */}
        <div className="flex-1 overflow-y-auto py-2 space-y-1.5 pr-1 my-2">
          {PRIZE_LADDER.map((step) => {
            const isCurrent = step.level === currentLevel;
            const isPassed = step.level < currentLevel;

            let rowStyles = 'bg-slate-850/50 border-slate-800/80 text-slate-400';
            if (isCurrent) {
              rowStyles =
                'bg-gradient-to-r from-amber-500/25 to-amber-600/35 border-amber-400 text-amber-300 font-extrabold shadow-[0_0_15px_rgba(245,158,11,0.3)] scale-[1.02]';
            } else if (isPassed) {
              rowStyles = 'bg-emerald-950/30 border-emerald-900/50 text-emerald-400 font-medium';
            } else if (step.isMilestone) {
              rowStyles = 'bg-slate-800/80 border-amber-500/40 text-amber-200 font-bold';
            }

            return (
              <div
                key={step.level}
                className={`flex items-center justify-between px-3 py-2 rounded-xl border text-xs sm:text-sm transition-all ${rowStyles}`}
              >
                <div className="flex items-center gap-2">
                  <span className="w-6 text-center font-bold text-slate-400">
                    {step.level}
                  </span>
                  {isPassed ? (
                    <Check className="w-4 h-4 text-emerald-400" />
                  ) : step.isMilestone ? (
                    <span className="text-[10px] bg-amber-500/20 text-amber-400 px-1.5 py-0.5 rounded font-bold border border-amber-500/30">
                      BARAJ
                    </span>
                  ) : (
                    <span className="w-4" />
                  )}
                </div>

                <span className="tracking-wide">{step.formattedAmount}</span>
              </div>
            );
          })}
        </div>

        {/* Bilgilendirme */}
        <div className="pt-2 border-t border-slate-800 text-center text-[11px] text-slate-400">
          5. ve 10. soru <span className="text-amber-400 font-bold">GARANTİ</span> baraj sorularıdır.
        </div>
      </div>
    </div>
  );
};
