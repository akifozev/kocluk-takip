import React from 'react';
import { HostInfo } from '../../types/game';
import { Trophy, RotateCcw, Home, HelpCircle } from 'lucide-react';
import { audioManager } from '../../utils/audioManager';

interface GameOverScreenProps {
  amountWon: number;
  levelReached: number;
  explanation?: string;
  host: HostInfo;
  onPlayAgain: () => void;
  onHome: () => void;
}

export const GameOverScreen: React.FC<GameOverScreenProps> = ({
  amountWon,
  levelReached,
  explanation,
  host,
  onPlayAgain,
  onHome,
}) => {
  const isWinner = amountWon > 0;

  return (
    <div className="flex-1 flex flex-col justify-between p-4 sm:p-5 max-w-md mx-auto w-full text-center overflow-y-auto animate-fadeIn">
      {/* Üst İkon & Durum */}
      <div className="my-auto py-3 flex flex-col items-center">
        <div
          className={`w-20 h-20 rounded-3xl flex items-center justify-center mb-3 shadow-xl border-2 ${
            isWinner
              ? 'bg-amber-500/20 border-amber-400 text-amber-400 shadow-amber-500/20'
              : 'bg-rose-500/20 border-rose-400 text-rose-400 shadow-rose-500/20'
          }`}
        >
          <Trophy className="w-10 h-10" />
        </div>

        <h2 className="text-xl sm:text-2xl font-black text-slate-100 mb-1">
          {isWinner ? 'Tebrikler, Kazandın!' : 'Oyun Bitti!'}
        </h2>
        <p className="text-xs text-slate-400 font-medium mb-4">
          {levelReached}. soruya kadar başarıyla yarıştın.
        </p>

        {/* Kazanılan Tutar Kartı */}
        <div className="w-full bg-gradient-to-b from-slate-800/90 to-slate-850/90 border-2 border-slate-700 rounded-3xl p-5 shadow-2xl mb-4">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">
            Kazanılan Toplam Ödül
          </div>
          <div className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500">
            {amountWon.toLocaleString('tr-TR')} ₺
          </div>
        </div>

        {/* Sunucu Yorumu */}
        <div className="w-full flex items-center gap-3 p-3 bg-slate-800/50 border border-slate-700/60 rounded-2xl mb-3 text-left">
          <span className="text-3xl shrink-0 select-none">{host.avatar}</span>
          <div className="flex-1 min-w-0">
            <div className="text-[11px] font-bold text-amber-400">
              {host.name} Diyor ki:
            </div>
            <p className="text-xs text-slate-200 font-medium italic">
              {isWinner
                ? `Harika bir performans sergiledin! ${amountWon.toLocaleString('tr-TR')} ₺ ödülün tadını çıkar!`
                : 'Şans bir dahaki sefere gülecektir, pes etmek yok!'}
            </p>
          </div>
        </div>

        {/* Biliyor Muydun? Açıklama Kutusu */}
        {explanation && (
          <div className="w-full p-3 bg-sky-950/40 border border-sky-800/50 rounded-2xl text-left">
            <div className="flex items-center gap-1.5 text-sky-400 font-bold text-xs mb-1">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Biliyor muydun?</span>
            </div>
            <p className="text-xs text-sky-100/90 leading-relaxed">
              {explanation}
            </p>
          </div>
        )}
      </div>

      {/* Düğmeler */}
      <div className="flex flex-col gap-2 shrink-0 pt-2">
        <button
          onClick={() => {
            audioManager.playClick();
            onPlayAgain();
          }}
          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black text-sm uppercase tracking-wider shadow-lg active:scale-[0.98] transition flex items-center justify-center gap-2 cursor-pointer border border-amber-300"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Yeniden Yarış</span>
        </button>

        <button
          onClick={() => {
            audioManager.playClick();
            onHome();
          }}
          className="w-full py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition active:scale-[0.98]"
        >
          <Home className="w-4 h-4" />
          <span>Ana Menüye Dön</span>
        </button>
      </div>
    </div>
  );
};
