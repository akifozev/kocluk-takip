import React from 'react';
import { useApp } from '../../context/AppContext';
import { PomodoroTimer } from './PomodoroTimer';
import {
  Clock,
  PlusCircle,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Flame,
  TrendingUp,
  Smile,
  Trash2
} from 'lucide-react';

interface TrackerViewProps {
  onOpenDailyLogModal: () => void;
}

export const TrackerView: React.FC<TrackerViewProps> = ({ onOpenDailyLogModal }) => {
  const { selectedStudent, dailyLogs, deleteDailyLog, addDailyLog } = useApp();

  const studentLogs = dailyLogs.filter((l) => l.studentId === selectedStudent?.id);

  // Today's total solved questions and study minutes
  const todayStr = new Date().toISOString().split('T')[0];
  const todayLogs = studentLogs.filter((l) => l.date === todayStr);

  const todayQuestions = todayLogs.reduce((acc, log) => {
    return acc + log.subjects.reduce((sAcc, s) => sAcc + (s.correct + s.wrong + s.empty), 0);
  }, 0);

  const todayCorrect = todayLogs.reduce((acc, log) => {
    return acc + log.subjects.reduce((sAcc, s) => sAcc + s.correct, 0);
  }, 0);

  const todayMinutes = todayLogs.reduce((acc, log) => acc + log.studyMinutes, 0);

  const dailyTarget = selectedStudent?.dailyTargetQuestions || 200;
  const progressPercent = Math.min(100, Math.round((todayQuestions / dailyTarget) * 100));
  const accuracyPercent = todayQuestions > 0 ? Math.round((todayCorrect / todayQuestions) * 100) : 0;

  // Aggregate by subject for selected student
  const subjectAggregates: { [key: string]: { correct: number; wrong: number; empty: number; total: number } } = {};
  studentLogs.forEach((log) => {
    log.subjects.forEach((sub) => {
      if (!subjectAggregates[sub.subject]) {
        subjectAggregates[sub.subject] = { correct: 0, wrong: 0, empty: 0, total: 0 };
      }
      subjectAggregates[sub.subject].correct += sub.correct;
      subjectAggregates[sub.subject].wrong += sub.wrong;
      subjectAggregates[sub.subject].empty += sub.empty;
      subjectAggregates[sub.subject].total += sub.correct + sub.wrong + sub.empty;
    });
  });

  const handlePomodoroComplete = (minutes: number) => {
    // Add to today's log or create a quick log
    addDailyLog({
      studentId: selectedStudent?.id || '',
      date: todayStr,
      studyMinutes: minutes,
      subjects: [],
      notes: `⏱️ Pomodoro seansı tamamlandı (${minutes} dk odaklanma).`,
      mood: 'super'
    });
  };

  const getMoodBadge = (mood?: string) => {
    switch (mood) {
      case 'super':
        return <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-xs font-bold">🚀 Harika</span>;
      case 'good':
        return <span className="px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-800 text-xs font-bold">😊 Verimli</span>;
      case 'tired':
        return <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 text-xs font-bold">🥱 Yorgun</span>;
      case 'stressed':
        return <span className="px-2 py-0.5 rounded-md bg-rose-100 text-rose-800 text-xs font-bold">🤯 Stresli</span>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Clock className="w-7 h-7 text-indigo-600" />
            Günlük Çalışma & Soru Takibi
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            <span className="font-bold text-slate-800">{selectedStudent?.name}</span> için günlük soru çözümleri, odaklanma süresi ve çalışma karnesi.
          </p>
        </div>

        <button
          onClick={onOpenDailyLogModal}
          className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md shadow-indigo-200 transition active:scale-95 self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Soru / Çalışma Girişi</span>
        </button>
      </div>

      {/* Top 3 Metric Cards + Pomodoro Widget */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Today's Metrics */}
        <div className="lg:col-span-2 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Questions Today */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Bugün Çözülen
              </span>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl font-black text-slate-900">{todayQuestions}</span>
                <span className="text-xs font-semibold text-slate-500">/ {dailyTarget} Hedef</span>
              </div>
              <div className="mt-3">
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <span className="text-[11px] font-bold text-indigo-600 mt-1 block">
                  Hedefin %{progressPercent}'i tamamlandı
                </span>
              </div>
            </div>

            {/* Study Minutes */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Bugünkü Süre
              </span>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl font-black text-slate-900">
                  {Math.floor(todayMinutes / 60)}s {todayMinutes % 60}dk
                </span>
              </div>
              <p className="mt-3 text-xs text-slate-500 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-indigo-500" />
                Toplam {todayMinutes} dakika çalışma
              </p>
            </div>

            {/* Accuracy */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Doğruluk Oranı
              </span>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl font-black text-emerald-600">%{accuracyPercent}</span>
                <span className="text-xs font-medium text-slate-500">
                  {todayCorrect} D / {todayQuestions} S
                </span>
              </div>
              <p className="mt-3 text-xs text-slate-500">Günlük soru verimliliği</p>
            </div>
          </div>

          {/* Subject Breakdown Card */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
            <h3 className="text-base font-bold text-slate-900 mb-4">
              Ders Bazlı Toplam Soru & Başarı Dağılımı
            </h3>

            {Object.keys(subjectAggregates).length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-6">
                Henüz ders bazlı soru verisi girilmemiş.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {Object.entries(subjectAggregates).map(([sub, stat]) => {
                  const rate = stat.total > 0 ? Math.round((stat.correct / stat.total) * 100) : 0;
                  return (
                    <div
                      key={sub}
                      className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/70 flex items-center justify-between"
                    >
                      <div>
                        <span className="text-xs font-bold text-slate-800">{sub}</span>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          {stat.correct}D - {stat.wrong}Y - {stat.empty}B ({stat.total} Soru)
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-black text-emerald-600">%{rate}</span>
                        <span className="block text-[10px] text-slate-400 font-medium">Başarı</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right 1 Col: Pomodoro Focus Timer */}
        <div className="lg:col-span-1">
          <PomodoroTimer onSessionComplete={handlePomodoroComplete} />
        </div>
      </div>

      {/* Daily Study Log History */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Günlük Çalışma Geçmişi</h2>
            <p className="text-xs text-slate-500">Tarih bazlı çözülen sorular ve koç/öğrenci notları</p>
          </div>
          <button
            onClick={onOpenDailyLogModal}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-800"
          >
            + Yeni Gün Ekle
          </button>
        </div>

        {studentLogs.length === 0 ? (
          <div className="text-center py-10 text-slate-400">
            <Clock className="w-10 h-10 mx-auto mb-2 opacity-40" />
            <p className="text-xs font-medium">Kayıtlı çalışma verisi bulunamadı.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {studentLogs.map((log) => {
              const logTotal = log.subjects.reduce(
                (acc, s) => acc + (s.correct + s.wrong + s.empty),
                0
              );
              const logCorrect = log.subjects.reduce((acc, s) => acc + s.correct, 0);

              return (
                <div
                  key={log.id}
                  className="p-4 sm:p-5 rounded-2xl border border-slate-200 bg-slate-50/40 hover:bg-white transition flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-bold text-slate-800 bg-slate-200/70 px-2.5 py-1 rounded-lg flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-500" />
                        {log.date}
                      </span>
                      <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg">
                        ⏱️ {log.studyMinutes} Dakika
                      </span>
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg">
                        🎯 {logTotal} Soru ({logCorrect} Doğru)
                      </span>
                      {getMoodBadge(log.mood)}
                    </div>

                    {/* Subject pills */}
                    {log.subjects.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1.5 pt-1">
                        {log.subjects.map((sub, sIdx) => (
                          <span
                            key={sIdx}
                            className="text-[11px] font-medium bg-white px-2 py-0.5 rounded-md border border-slate-200 text-slate-600"
                          >
                            {sub.subject}: <b className="text-emerald-600">{sub.correct}D</b> /{' '}
                            <b className="text-rose-600">{sub.wrong}Y</b> / {sub.empty}B
                          </span>
                        ))}
                      </div>
                    )}

                    {log.notes && (
                      <p className="text-xs text-slate-600 italic bg-white p-2 rounded-xl border border-slate-100">
                        "{log.notes}"
                      </p>
                    )}
                  </div>

                  <button
                    onClick={() => {
                      if (confirm('Bu çalışma günlüğünü silmek istiyor musunuz?')) {
                        deleteDailyLog(log.id);
                      }
                    }}
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition self-end sm:self-center"
                    title="Sil"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
