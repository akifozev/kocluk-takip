import React from 'react';
import { QuestionCategory } from '../../types/game';
import { Award, Sparkles, HelpCircle } from 'lucide-react';

interface QuestionCardProps {
  level: number;
  prizeAmount: string;
  category: QuestionCategory;
  question: string;
  isMilestone?: boolean;
}

const CATEGORY_NAMES: Record<QuestionCategory, string> = {
  genel: 'Genel Kültür',
  populer: 'Popüler Kültür',
  'sinema-dizi': 'Sinema & Dizi',
  tarih: 'Tarih',
  bilim: 'Bilim & Doğa',
  spor: 'Spor',
  muzik: 'Müzik',
  sanat: 'Sanat',
  edebiyat: 'Edebiyat',
  komik: 'İlginç & Komik',
};

const CATEGORY_COLORS: Record<QuestionCategory, string> = {
  genel: 'text-sky-400 bg-sky-500/10 border-sky-500/30',
  populer: 'text-pink-400 bg-pink-500/10 border-pink-500/30',
  'sinema-dizi': 'text-purple-400 bg-purple-500/10 border-purple-500/30',
  tarih: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
  bilim: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
  spor: 'text-orange-400 bg-orange-500/10 border-orange-500/30',
  muzik: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30',
  sanat: 'text-violet-400 bg-violet-500/10 border-violet-500/30',
  edebiyat: 'text-rose-400 bg-rose-500/10 border-rose-500/30',
  komik: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30',
};

export const QuestionCard: React.FC<QuestionCardProps> = ({
  level,
  prizeAmount,
  category,
  question,
  isMilestone = false,
}) => {
  return (
    <div className="w-full relative">
      {/* Üst Bilgi Rozetleri */}
      <div className="flex items-center justify-between gap-2 mb-2 px-1">
        {/* Kategori */}
        <span
          className={`text-[11px] font-bold px-2.5 py-1 rounded-full border flex items-center gap-1 backdrop-blur-md ${CATEGORY_COLORS[category] || CATEGORY_COLORS.genel}`}
        >
          <Sparkles className="w-3 h-3" />
          {CATEGORY_NAMES[category] || 'Genel Kültür'}
        </span>

        {/* Seviye & Ödül Değeri */}
        <div className="flex items-center gap-2">
          {isMilestone && (
            <span className="text-[10px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse">
              BARAJ SORUSU
            </span>
          )}
          <span className="text-xs font-black text-amber-400 bg-slate-800/80 border border-slate-700 px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
            <Award className="w-3.5 h-3.5 text-amber-400" />
            {prizeAmount}
          </span>
        </div>
      </div>

      {/* Soru Gövdesi */}
      <div className="w-full min-h-[110px] sm:min-h-[125px] p-4 sm:p-5 rounded-3xl bg-gradient-to-b from-slate-800/90 to-slate-900/90 border-2 border-slate-700/80 shadow-[0_10px_30px_rgba(0,0,0,0.5)] flex flex-col justify-center items-center text-center relative overflow-hidden backdrop-blur-xl">
        {/* Dekoratif Arka Plan Işığı */}
        <div className="absolute top-0 inset-x-1/4 h-1 bg-gradient-to-r from-transparent via-amber-400/50 to-transparent" />
        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-48 h-16 bg-amber-500/10 rounded-full blur-xl pointer-events-none" />

        <div className="flex items-center gap-2 mb-1.5 text-slate-400 text-xs font-semibold">
          <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
          <span>Soru {level} / 15</span>
        </div>

        <h2 className="text-sm sm:text-base md:text-lg font-bold text-slate-100 leading-snug tracking-wide">
          {question}
        </h2>
      </div>
    </div>
  );
};
