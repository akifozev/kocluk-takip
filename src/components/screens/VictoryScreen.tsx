import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { HostInfo } from '../../types/game';
import { Crown, Sparkles, Home, RotateCcw } from 'lucide-react';
import { audioManager } from '../../utils/audioManager';

interface VictoryScreenProps {
  host: HostInfo;
  onPlayAgain: () => void;
  onHome: () => void;
}

export const VictoryScreen: React.FC<VictoryScreenProps> = ({
  host,
  onPlayAgain,
  onHome,
}) => {
  useEffect(() => {
    audioManager.playVictory();

    // Sürekli konfeti patlamaları
    const duration = 4 * 1000;
    const end = Date.now() + duration;

    const interval: number = window.setInterval(() => {
      if (Date.now() > end) {
        clearInterval(interval);
        return;
      }

      confetti({
        startVelocity: 30,
        spread: 360,
        ticks: 60,
        origin: { x: Math.random(), y: Math.random() - 0.2 },
        colors: ['#f59e0b', '#fbbf24', '#3b82f6', '#10b981', '#ec4899'],
      });
    }, 250);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex-1 flex flex-col justify-between p-4 sm:p-5 max-w-md mx-auto w-full text-center overflow-y-auto animate-fadeIn">
      <div className="my-auto py-4 flex flex-col items-center">
        {/* Taç / Kupa */}
        <div className="relative mb-4">
          <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 p-1.5 shadow-[0_0_50px_rgba(245,158,11,0.8)] flex items-center justify-center animate-bounce">
            <div className="w-full h-full bg-slate-950 rounded-full flex items-center justify-center">
              <Crown className="w-14 h-14 text-amber-400" />
            </div>
          </div>
          <Sparkles className="w-8 h-8 text-yellow-300 absolute -top-2 -right-2 animate-spin" />
        </div>

        <div className="text-xs font-black uppercase tracking-widest text-amber-400 mb-1 flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5" />
          <span>TÜRKİYE'NİN YENİ MİLYONERİ</span>
          <Sparkles className="w-3.5 h-3.5" />
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-500 mb-2">
          BÜYÜK ŞAMPİYON!
        </h1>

        <p className="text-xs text-slate-300 max-w-xs mb-5">
          15 sorunun tamamına doğru cevap vererek tarihi bir başarıya imza attın!
        </p>

        {/* 10 Milyon TL Plaketi */}
        <div className="w-full bg-gradient-to-br from-amber-500/20 via-yellow-500/10 to-amber-600/20 border-2 border-amber-400 rounded-3xl p-6 shadow-[0_0_35px_rgba(245,158,11,0.4)] mb-5">
          <span className="text-xs font-bold text-amber-300 uppercase tracking-widest block mb-1">
            KAZANILAN BÜYÜK ÖDÜL
          </span>
          <span className="text-3xl sm:text-4xl font-black text-amber-300 tracking-tight">
            10.000.000 ₺
          </span>
        </div>

        {/* Sunucu Repliği */}
        <div className="w-full flex items-center gap-3 p-3.5 bg-slate-800/80 border border-amber-500/50 rounded-2xl text-left">
          <span className="text-4xl shrink-0">{host.avatar}</span>
          <div>
            <div className="text-xs font-bold text-amber-400">{host.name}:</div>
            <p className="text-xs text-slate-100 font-semibold italic">
              "Tarih yazdın! Bütün Türkiye seni ayakta alkışlıyor, bu ödülü son kuruşuna kadar hak ettin!"
            </p>
          </div>
        </div>
      </div>

      {/* Düğmeler */}
      <div className="flex flex-col gap-2 shrink-0 pt-2">
        <button
          onClick={() => {
            audioManager.playClick();
            onPlayAgain();
          }}
          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black text-sm uppercase tracking-wider shadow-xl active:scale-[0.98] transition flex items-center justify-center gap-2 cursor-pointer border border-amber-200"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Tekrar Zafer Peşinde Koş</span>
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
