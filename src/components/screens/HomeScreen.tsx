import React from 'react';
import { HostInfo, HostType, GameStats } from '../../types/game';
import { HOSTS } from '../../data/hostLines';
import { SoundToggle } from '../common/SoundToggle';
import { Play, Sparkles, BookOpen, BarChart3, ChevronRight, Crown } from 'lucide-react';
import { audioManager } from '../../utils/audioManager';

interface HomeScreenProps {
  selectedHost: HostInfo;
  onSelectHost: (host: HostType) => void;
  onStartGame: () => void;
  onOpenQuestionBank: () => void;
  onOpenStats: () => void;
  stats: GameStats;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  selectedHost,
  onSelectHost,
  onStartGame,
  onOpenQuestionBank,
  onOpenStats,
  stats,
}) => {
  const hostList: HostInfo[] = Object.values(HOSTS);

  const handleStart = () => {
    audioManager.playClick();
    onStartGame();
  };

  return (
    <div className="flex-1 flex flex-col justify-between p-4 sm:p-5 max-w-md mx-auto w-full overflow-y-auto">
      {/* ÜST ÇUBUK */}
      <div className="flex items-center justify-between shrink-0 mb-3">
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-400 text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Eğlenceli Bilgi Yarışması</span>
        </div>
        <SoundToggle />
      </div>

      {/* LOGO & BAŞLIK ALANI */}
      <div className="flex flex-col items-center text-center my-auto py-2">
        {/* Altın Logo Rozeti */}
        <div className="relative mb-3">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-tr from-amber-600 via-amber-400 to-yellow-300 p-1 shadow-[0_0_35px_rgba(245,158,11,0.5)] flex items-center justify-center rotate-3 hover:rotate-0 transition-transform duration-300">
            <div className="w-full h-full bg-slate-950 rounded-[22px] flex flex-col items-center justify-center p-2 text-center">
              <Crown className="w-8 h-8 sm:w-9 sm:h-9 text-amber-400 mb-0.5 animate-bounce" />
              <span className="text-[10px] sm:text-xs font-black text-amber-300 tracking-wider">
                10 MİLYON
              </span>
            </div>
          </div>
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-500 tracking-tight leading-none mb-1">
          MİLYONER KAFASI
        </h1>
        <p className="text-xs text-slate-400 font-medium max-w-xs">
          15 Basamak, Çılgın Jokerler, Esprili Sunucular ve 10.000.000 ₺ Büyük Ödül!
        </p>

        {/* Hızlı İstatistik Kartı */}
        <div className="flex items-center justify-center gap-4 mt-3 py-1.5 px-4 rounded-2xl bg-slate-800/40 border border-slate-700/50 text-[11px] text-slate-300">
          <div>
            En Yüksek Ödül:{' '}
            <span className="text-amber-400 font-extrabold">
              {stats.highestWon.toLocaleString('tr-TR')} ₺
            </span>
          </div>
          <div className="w-1 h-1 rounded-full bg-slate-600" />
          <div>
            Oyun:{' '}
            <span className="text-emerald-400 font-extrabold">
              {stats.totalGames}
            </span>
          </div>
        </div>
      </div>

      {/* SUNUCU SEÇİMİ */}
      <div className="shrink-0 mb-4">
        <div className="text-xs font-bold text-slate-300 mb-2 flex items-center justify-between px-1">
          <span>Sunucunu Seç:</span>
          <span className="text-[11px] text-amber-400 font-semibold">
            {selectedHost.name}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {hostList.map((host) => {
            const isSelected = host.id === selectedHost.id;
            return (
              <button
                key={host.id}
                onClick={() => {
                  audioManager.playClick();
                  onSelectHost(host.id);
                }}
                className={`flex flex-col items-center p-2.5 rounded-2xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-amber-500/15 border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.25)] scale-[1.02]'
                    : 'bg-slate-800/60 border-slate-700 hover:border-slate-600 opacity-70 hover:opacity-100'
                }`}
              >
                <span className="text-2xl mb-1">{host.avatar}</span>
                <span className="text-xs font-bold text-slate-200">
                  {host.name}
                </span>
                <span className="text-[9px] text-slate-400 leading-tight">
                  {host.title}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* AKSİYON BUTONLARI */}
      <div className="flex flex-col gap-2.5 shrink-0">
        {/* OYNA BUTONU */}
        <button
          onClick={handleStart}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-slate-950 font-black text-base uppercase tracking-wider shadow-[0_0_30px_rgba(245,158,11,0.5)] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer border border-amber-200"
        >
          <Play className="w-5 h-5 fill-slate-950" />
          <span>Yarışmaya Başla</span>
        </button>

        {/* ALT SEÇENEKLER (Soru Bankası & İstatistikler) */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => {
              audioManager.playClick();
              onOpenQuestionBank();
            }}
            className="p-3 rounded-xl bg-slate-800/80 hover:bg-slate-750 border border-slate-700/80 flex items-center justify-between text-xs font-bold text-slate-200 transition cursor-pointer active:scale-95"
          >
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-sky-400" />
              <span>Soru Havuzu</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
          </button>

          <button
            onClick={() => {
              audioManager.playClick();
              onOpenStats();
            }}
            className="p-3 rounded-xl bg-slate-800/80 hover:bg-slate-750 border border-slate-700/80 flex items-center justify-between text-xs font-bold text-slate-200 transition cursor-pointer active:scale-95"
          >
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-emerald-400" />
              <span>İstatistikler</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
          </button>
        </div>
      </div>
    </div>
  );
};
