import React from 'react';
import { GameStats } from '../../types/game';
import { ArrowLeft, Trophy, Award, Target, Zap, ShieldCheck, Flame } from 'lucide-react';
import { audioManager } from '../../utils/audioManager';

interface StatsScreenProps {
  stats: GameStats;
  onBack: () => void;
}

export const StatsScreen: React.FC<StatsScreenProps> = ({ stats, onBack }) => {
  const totalAnswers = stats.correctAnswersCount + stats.wrongAnswersCount;
  const accuracy =
    totalAnswers > 0
      ? Math.round((stats.correctAnswersCount / totalAnswers) * 100)
      : 0;

  const achievements = [
    {
      id: 'first_game',
      title: 'İlk Adım',
      desc: 'En az 1 oyun tamamlandı',
      achieved: stats.totalGames >= 1,
      icon: <Target className="w-5 h-5 text-sky-400" />,
    },
    {
      id: 'milestone_1',
      title: 'Baraj Avcısı',
      desc: '5. Soru (20.000 ₺) barajını aştın',
      achieved: stats.highestLevel >= 5,
      icon: <ShieldCheck className="w-5 h-5 text-emerald-400" />,
    },
    {
      id: 'milestone_2',
      title: 'Zirveye Yakın',
      desc: '10. Soru (250.000 ₺) barajını aştın',
      achieved: stats.highestLevel >= 10,
      icon: <Flame className="w-5 h-5 text-amber-400" />,
    },
    {
      id: 'millionaire',
      title: 'Büyük Şampiyon',
      desc: '10 Milyon TL büyük ödülü kazandın',
      achieved: stats.highestWon >= 10000000,
      icon: <Trophy className="w-5 h-5 text-yellow-300" />,
    },
    {
      id: 'lifeline_user',
      title: 'Taktik Dehası',
      desc: '5 veya daha fazla joker kullandın',
      achieved: stats.lifelinesUsedCount >= 5,
      icon: <Zap className="w-5 h-5 text-purple-400" />,
    },
  ];

  return (
    <div className="flex-1 flex flex-col p-4 max-w-md mx-auto w-full overflow-hidden">
      {/* Üst Bar */}
      <div className="flex items-center justify-between gap-2 shrink-0 mb-3">
        <button
          onClick={() => {
            audioManager.playClick();
            onBack();
          }}
          className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition cursor-pointer flex items-center gap-1 text-xs font-bold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Geri</span>
        </button>
        <h2 className="text-sm font-black text-slate-100">Kariyer & İstatistikler</h2>
        <div className="w-8" />
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 pr-1">
        {/* En Yüksek Ödül Kartı */}
        <div className="w-full bg-gradient-to-br from-amber-500/20 via-yellow-500/10 to-amber-600/10 border-2 border-amber-400/60 rounded-3xl p-4 text-center shadow-lg">
          <span className="text-[10px] font-bold text-amber-300 uppercase tracking-widest block mb-0.5">
            EN YÜKSEK KAZANÇ
          </span>
          <div className="text-2xl sm:text-3xl font-black text-amber-300">
            {stats.highestWon.toLocaleString('tr-TR')} ₺
          </div>
          <div className="text-xs text-slate-300 mt-1">
            Toplam Kazanılan: {stats.totalWon.toLocaleString('tr-TR')} ₺
          </div>
        </div>

        {/* 2x2 İstatistik Izgarası */}
        <div className="grid grid-cols-2 gap-2">
          <div className="p-3 bg-slate-850 border border-slate-750 rounded-2xl">
            <span className="text-[10px] text-slate-400 font-bold block">
              Toplam Oyun
            </span>
            <span className="text-lg font-black text-slate-100">
              {stats.totalGames}
            </span>
          </div>

          <div className="p-3 bg-slate-850 border border-slate-750 rounded-2xl">
            <span className="text-[10px] text-slate-400 font-bold block">
              En Yüksek Seviye
            </span>
            <span className="text-lg font-black text-amber-400">
              {stats.highestLevel} / 15
            </span>
          </div>

          <div className="p-3 bg-slate-850 border border-slate-750 rounded-2xl">
            <span className="text-[10px] text-slate-400 font-bold block">
              Başarı Oranı
            </span>
            <span className="text-lg font-black text-emerald-400">
              %{accuracy}
            </span>
          </div>

          <div className="p-3 bg-slate-850 border border-slate-750 rounded-2xl">
            <span className="text-[10px] text-slate-400 font-bold block">
              Kullanılan Jokerler
            </span>
            <span className="text-lg font-black text-purple-400">
              {stats.lifelinesUsedCount}
            </span>
          </div>
        </div>

        {/* Başarımlar / Rozetler */}
        <div>
          <h3 className="text-xs font-black text-slate-200 mb-2 flex items-center gap-1.5 px-1">
            <Award className="w-4 h-4 text-amber-400" />
            <span>Kazanılan Başarımlar</span>
          </h3>

          <div className="space-y-2">
            {achievements.map((ach) => (
              <div
                key={ach.id}
                className={`p-3 rounded-2xl border flex items-center gap-3 transition ${
                  ach.achieved
                    ? 'bg-slate-800/90 border-amber-500/40 text-slate-100'
                    : 'bg-slate-900/40 border-slate-800/40 opacity-40 text-slate-500'
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center shrink-0">
                  {ach.icon}
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <div className="text-xs font-bold flex items-center gap-1.5">
                    <span>{ach.title}</span>
                    {ach.achieved && (
                      <span className="text-[9px] bg-emerald-500/20 text-emerald-400 font-bold px-1.5 py-0.2 rounded">
                        KAZANILDI
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] text-slate-400 leading-tight">
                    {ach.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
