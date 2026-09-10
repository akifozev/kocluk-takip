import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Sparkles,
  PlusCircle,
  Share2,
  Copy,
  Flame,
  Award,
  CheckCircle2,
  Target,
  Zap,
  BookOpen,
  Trash2
} from 'lucide-react';
import { triggerSuccessConfetti } from '../../utils/confetti';

interface MotivationViewProps {
  onOpenMotivationModal: () => void;
}

export const MotivationView: React.FC<MotivationViewProps> = ({ onOpenMotivationModal }) => {
  const { motivations, deleteMotivation, selectedStudent, dailyLogs, homeworks } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredMotivations = motivations.filter((m) => {
    if (selectedCategory === 'ALL') return true;
    return m.category === selectedCategory;
  });

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleWhatsAppShare = (title: string, content: string, author: string) => {
    const text = `🌟 *${title}*\n\n"${content}"\n\n— *${author}*\n\n_CoachTrack Pro ile gönderildi._`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  // Student achievements calculation
  const studentLogs = dailyLogs.filter((l) => l.studentId === selectedStudent?.id);
  const totalSolved = studentLogs.reduce(
    (sum, l) => sum + l.subjects.reduce((sSum, s) => sSum + (s.correct + s.wrong + s.empty), 0),
    0
  );
  const totalMinutes = studentLogs.reduce((sum, l) => sum + l.studyMinutes, 0);
  const completedHws = homeworks.filter(
    (h) => h.studentId === selectedStudent?.id && h.status === 'completed'
  ).length;

  const streak = selectedStudent?.streak || 0;

  const badges = [
    {
      id: 'streak-7',
      title: 'İstikrar Şampiyonu',
      desc: '7 gün kesintisiz çalışma serisi',
      icon: Flame,
      color: 'from-amber-500 to-orange-600',
      earned: streak >= 7,
      progress: `${streak}/7 Gün`
    },
    {
      id: 'questions-1000',
      title: '1.000 Soru Kulübü',
      desc: 'Toplam 1.000 soru barajını aşma',
      icon: Target,
      color: 'from-indigo-500 to-violet-600',
      earned: totalSolved >= 1000,
      progress: `${totalSolved}/1000 Soru`
    },
    {
      id: 'focus-10h',
      title: 'Derin Odaklanma',
      desc: '10 saat (600 dk) pomodoro çalışma',
      icon: Zap,
      color: 'from-emerald-500 to-teal-600',
      earned: totalMinutes >= 600,
      progress: `${totalMinutes}/600 Dk`
    },
    {
      id: 'homework-master',
      title: 'Ödev Canavarı',
      desc: '5 ödevi eksiksiz tamamlama',
      icon: CheckCircle2,
      color: 'from-blue-500 to-cyan-600',
      earned: completedHws >= 5,
      progress: `${completedHws}/5 Ödev`
    }
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Sparkles className="w-7 h-7 text-amber-500" />
            Motivasyon & İlham Merkezi
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Öğrencilerinize sınav yolculuğunda güç verecek motivasyon paylaşımları ve başarı rozetleri.
          </p>
        </div>

        <button
          onClick={onOpenMotivationModal}
          className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-900 font-extrabold text-sm shadow-md shadow-amber-200 transition active:scale-95 self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Yeni Söz / İlham Paylaş</span>
        </button>
      </div>

      {/* Featured Spotlight Card */}
      {motivations.length > 0 && (
        <div className="bg-linear-to-r from-amber-500 via-orange-500 to-rose-500 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
          <div className="absolute right-0 bottom-0 translate-x-8 translate-y-8 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold text-amber-100">
              <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
              <span>Günün Öne Çıkan Sözü</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black italic leading-snug">
              "{motivations[0].content}"
            </h2>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
              <span className="text-sm font-bold text-amber-100">
                — {motivations[0].author} ({motivations[0].title})
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    handleCopy(
                      motivations[0].id,
                      `"${motivations[0].content}" - ${motivations[0].author}`
                    );
                    triggerSuccessConfetti();
                  }}
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-white text-slate-900 rounded-xl text-xs font-bold shadow-md hover:bg-amber-50 transition"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copiedId === motivations[0].id ? 'Kopyalandı!' : 'Kopyala'}</span>
                </button>

                <button
                  onClick={() =>
                    handleWhatsAppShare(
                      motivations[0].title,
                      motivations[0].content,
                      motivations[0].author
                    )
                  }
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-md transition"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>WhatsApp'ta Paylaş</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Gamification / Badges Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Award className="w-5 h-5 text-indigo-600" />
              {selectedStudent?.name} - Başarı Rozetleri & Ödüller
            </h2>
            <p className="text-xs text-slate-500">
              Öğrencinin istikrarı ve çözdüğü sorularla kazandığı dijital tebrik rozetleri
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {badges.map((b) => {
            const Icon = b.icon;
            return (
              <div
                key={b.id}
                className={`p-4 rounded-2xl border transition-all ${
                  b.earned
                    ? 'bg-linear-to-b from-slate-50 to-white border-amber-200 shadow-xs'
                    : 'bg-slate-50/50 border-slate-200/70 opacity-60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-12 h-12 rounded-2xl bg-linear-to-tr ${b.color} text-white flex items-center justify-center shadow-md ${
                      !b.earned ? 'grayscale' : ''
                    }`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-xs font-extrabold text-slate-900 leading-tight">
                      {b.title}
                    </h4>
                    <span
                      className={`inline-block text-[10px] font-bold px-1.5 py-0.5 rounded mt-1 ${
                        b.earned
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {b.earned ? 'Kazanıldı 🎉' : b.progress}
                    </span>
                  </div>
                </div>
                <p className="text-[11px] text-slate-500 mt-2">{b.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <span className="font-bold text-slate-500 pr-1">Kategoriler:</span>
        {[
          { id: 'ALL', label: 'Tümü' },
          { id: 'grit', label: '🔥 Azim & Kararlılık' },
          { id: 'focus', label: '🎯 Odaklanma' },
          { id: 'stress', label: '🧘 Stres Yönetimi' },
          { id: 'success', label: '🏆 Başarı' },
          { id: 'routine', label: '⏰ Rutin & Alışkanlık' }
        ].map((c) => (
          <button
            key={c.id}
            onClick={() => setSelectedCategory(c.id)}
            className={`px-3 py-1.5 rounded-xl font-bold transition whitespace-nowrap ${
              selectedCategory === c.id
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Motivation Quotes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredMotivations.map((m) => (
          <div
            key={m.id}
            className="bg-white rounded-3xl p-5 border border-slate-200/80 hover:border-amber-200 hover:shadow-md transition flex flex-col justify-between space-y-4"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-lg border border-amber-100">
                  {m.title}
                </span>
                {m.isCustom && (
                  <button
                    onClick={() => {
                      if (confirm('Bu motivasyon sözünü silmek istiyor musunuz?')) {
                        deleteMotivation(m.id);
                      }
                    }}
                    className="p-1 text-slate-400 hover:text-rose-600 transition"
                    title="Sil"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <p className="text-sm font-semibold text-slate-800 italic leading-relaxed">
                "{m.content}"
              </p>

              <p className="text-xs font-bold text-slate-500 text-right">— {m.author}</p>

              {m.coachNote && (
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/60 text-xs text-slate-600">
                  <span className="font-bold text-indigo-600">Koç Notu:</span> {m.coachNote}
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
              <button
                onClick={() =>
                  handleCopy(m.id, `"${m.content}" - ${m.author}`)
                }
                className="text-slate-500 hover:text-indigo-600 font-semibold flex items-center gap-1"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copiedId === m.id ? 'Kopyalandı!' : 'Kopyala'}</span>
              </button>

              <button
                onClick={() => handleWhatsAppShare(m.title, m.content, m.author)}
                className="text-emerald-700 hover:text-emerald-800 font-bold flex items-center gap-1"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>WhatsApp Paylaş</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
