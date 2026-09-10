import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Users,
  CheckSquare,
  Clock,
  TrendingUp,
  Sparkles,
  PlusCircle,
  Flame,
  ArrowUpRight,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Share2,
  Copy,
  BookOpen
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from 'recharts';
import { triggerSuccessConfetti } from '../../utils/confetti';

interface DashboardProps {
  onOpenHomeworkModal: () => void;
  onOpenDailyLogModal: () => void;
  onOpenExamModal: () => void;
  onOpenStudentModal: () => void;
  onOpenMotivationModal: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  onOpenHomeworkModal,
  onOpenDailyLogModal,
  onOpenExamModal,
  onOpenStudentModal,
  onOpenMotivationModal
}) => {
  const {
    students,
    selectedStudent,
    homeworks,
    dailyLogs,
    exams,
    motivations,
    toggleHomeworkStatus,
    setActiveTab
  } = useApp();

  const [copiedQuote, setCopiedQuote] = useState(false);

  // Student specific stats
  const studentHomeworks = homeworks.filter((h) => h.studentId === selectedStudent?.id);
  const pendingHw = studentHomeworks.filter((h) => h.status === 'pending');
  const completedHw = studentHomeworks.filter((h) => h.status === 'completed');

  const studentLogs = dailyLogs.filter((l) => l.studentId === selectedStudent?.id);
  const studentExams = exams.filter((e) => e.studentId === selectedStudent?.id);

  // Solved questions today
  const todayStr = new Date().toISOString().split('T')[0];
  const todayLog = studentLogs.find((l) => l.date === todayStr);
  const todayQuestions = todayLog
    ? todayLog.subjects.reduce((sum, s) => sum + (s.correct + s.wrong + s.empty), 0)
    : 0;

  const dailyTarget = selectedStudent?.dailyTargetQuestions || 200;
  const targetPercent = Math.min(100, Math.round((todayQuestions / dailyTarget) * 100));

  // Last 7 days question data for chart
  const getLast7DaysData = () => {
    const days: { day: string; sorular: number }[] = [];
    const date = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(date.getDate() - i);
      const iso = d.toISOString().split('T')[0];
      const dayName = d.toLocaleDateString('tr-TR', { weekday: 'short' });
      const log = studentLogs.find((l) => l.date === iso);
      const total = log
        ? log.subjects.reduce((acc, s) => acc + (s.correct + s.wrong + s.empty), 0)
        : 0;
      days.push({ day: dayName, sorular: total });
    }
    return days;
  };

  const chartData = getLast7DaysData();

  // Latest exam net
  const latestExam = studentExams.length > 0 ? studentExams[studentExams.length - 1] : null;

  // Daily motivation quote (pick first or latest)
  const todayQuote = motivations[0] || {
    title: 'Günün Motivasyonu',
    content: 'Başarı bir yolculuktur, varış noktası değil. Her gün atılan adımlar geleceğinizi belirler.',
    author: 'Koçluk İlkesi'
  };

  const handleCopyQuote = () => {
    navigator.clipboard.writeText(`"${todayQuote.content}" - ${todayQuote.author}`);
    setCopiedQuote(true);
    setTimeout(() => setCopiedQuote(false), 2500);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Welcome & Quick Action Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-linear-to-r from-indigo-900 via-indigo-800 to-violet-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 bg-white/5 rounded-full blur-2xl pointer-events-none" />
        
        <div className="space-y-2 z-10 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold text-indigo-200">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Koç Kontrol Merkezi</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Hoş Geldiniz! 🎯
          </h1>
          <p className="text-sm text-indigo-100/90 leading-relaxed">
            Aktif olarak <span className="font-bold text-white underline decoration-amber-400 underline-offset-2">{selectedStudent?.name}</span> öğrencisini inceliyorsunuz. Bugünün hedeflerini ve ödev durumlarını buradan yönetebilirsiniz.
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 z-10">
          <button
            onClick={onOpenHomeworkModal}
            className="flex items-center gap-2 px-4 py-2.5 bg-white text-indigo-900 hover:bg-indigo-50 font-bold rounded-xl text-xs sm:text-sm shadow-md transition-all active:scale-95"
          >
            <PlusCircle className="w-4 h-4 text-indigo-600" />
            <span>Ödev Ata</span>
          </button>
          <button
            onClick={onOpenDailyLogModal}
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-700/70 hover:bg-indigo-700 border border-indigo-500/40 text-white font-bold rounded-xl text-xs sm:text-sm shadow-md transition-all active:scale-95"
          >
            <Clock className="w-4 h-4 text-emerald-300" />
            <span>Soru / Çalışma Gir</span>
          </button>
          <button
            onClick={onOpenExamModal}
            className="flex items-center gap-2 px-4 py-2.5 bg-violet-700/70 hover:bg-violet-700 border border-violet-500/40 text-white font-bold rounded-xl text-xs sm:text-sm shadow-md transition-all active:scale-95"
          >
            <TrendingUp className="w-4 h-4 text-amber-300" />
            <span>Deneme Ekle</span>
          </button>
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Total Students */}
        <div
          onClick={() => setActiveTab('students')}
          className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Toplam Öğrenci
            </span>
            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:scale-110 transition">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">{students.length}</span>
            <span className="text-xs font-medium text-emerald-600 flex items-center">
              Aktif Danışan
            </span>
          </div>
          <p className="mt-2 text-xs text-slate-500">Tüm öğrencilerin profillerini gör →</p>
        </div>

        {/* Daily Questions */}
        <div
          onClick={() => setActiveTab('tracker')}
          className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Bugünkü Soru
            </span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 group-hover:scale-110 transition">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">{todayQuestions}</span>
            <span className="text-xs font-semibold text-slate-500">/ {dailyTarget} Hedef</span>
          </div>
          <div className="mt-2 flex items-center gap-2">
            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
              <div
                className="bg-emerald-500 h-2 rounded-full"
                style={{ width: `${targetPercent}%` }}
              />
            </div>
            <span className="text-xs font-bold text-emerald-700">%{targetPercent}</span>
          </div>
        </div>

        {/* Pending Homework */}
        <div
          onClick={() => setActiveTab('homework')}
          className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Bekleyen Ödevler
            </span>
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 group-hover:scale-110 transition">
              <CheckSquare className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">{pendingHw.length}</span>
            <span className="text-xs font-medium text-amber-700">
              {completedHw.length} Tamamlandı
            </span>
          </div>
          <p className="mt-2 text-xs text-slate-500">Ödev listesini ve teslimleri aç →</p>
        </div>

        {/* Latest Exam Net */}
        <div
          onClick={() => setActiveTab('exams')}
          className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Son Deneme Neti
            </span>
            <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center text-violet-600 group-hover:scale-110 transition">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">
              {latestExam ? latestExam.totalNet : '—'}
            </span>
            <span className="text-xs font-bold text-violet-600">
              {latestExam?.type || selectedStudent?.examType}
            </span>
          </div>
          <p className="mt-2 text-xs text-slate-500 truncate" title={latestExam?.title || 'Henüz deneme girilmedi'}>
            {latestExam ? latestExam.title : 'Net gelişim grafiğine git →'}
          </p>
        </div>
      </div>

      {/* Motivation Spotlight Banner */}
      <div className="bg-linear-to-br from-amber-50 via-orange-50 to-amber-100/60 border border-amber-200/80 rounded-2xl p-6 shadow-xs relative">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-md shadow-amber-200 shrink-0">
              <Sparkles className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-extrabold uppercase tracking-wider text-amber-800">
                  Günün Motivasyon Sözü
                </span>
                <span className="text-xs text-amber-600">• {todayQuote.title}</span>
              </div>
              <p className="text-base font-semibold text-slate-800 italic leading-snug">
                "{todayQuote.content}"
              </p>
              <p className="text-xs font-bold text-amber-900/80">— {todayQuote.author}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
            <button
              onClick={handleCopyQuote}
              className="flex items-center gap-1.5 px-3 py-2 bg-white/90 hover:bg-white text-slate-700 text-xs font-semibold rounded-xl border border-amber-200 shadow-xs transition"
              title="Sözü Kopyala"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>{copiedQuote ? 'Kopyalandı!' : 'Kopyala'}</span>
            </button>
            <button
              onClick={onOpenMotivationModal}
              className="flex items-center gap-1.5 px-3 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-xl shadow-xs transition"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Yeni Söz Paylaş</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2-Column: Weekly Progress Chart + Pending Assignments Checklist */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Question chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Haftalık Soru Çözüm Grafiği
              </h2>
              <p className="text-xs text-slate-500">
                {selectedStudent?.name} - Son 7 günün günlük soru dağılımı
              </p>
            </div>
            <button
              onClick={() => setActiveTab('tracker')}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
            >
              Detaylı Çizelge <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} />
                <Tooltip
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    borderRadius: '12px',
                    color: '#fff',
                    border: 'none',
                    fontSize: '12px'
                  }}
                  formatter={(value: any) => [`${value} Soru`, 'Çözülen']}
                />
                <Bar dataKey="sorular" fill="#6366f1" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right 1 Col: Urgent Tasks & Homework Checklist */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-bold text-slate-900">Ödev Kontrolü</h2>
                <p className="text-xs text-slate-500">Teslimi yaklaşan görevler</p>
              </div>
              <button
                onClick={onOpenHomeworkModal}
                className="p-1.5 rounded-lg text-indigo-600 hover:bg-indigo-50 transition"
                title="Yeni Ödev Ekle"
              >
                <PlusCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              {studentHomeworks.length === 0 ? (
                <div className="text-center py-8 text-slate-400">
                  <BookOpen className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-xs font-medium">Bu öğrenciye henüz ödev atanmamış.</p>
                </div>
              ) : (
                studentHomeworks.slice(0, 4).map((hw) => {
                  const isDone = hw.status === 'completed';
                  return (
                    <div
                      key={hw.id}
                      className={`p-3 rounded-xl border transition-all ${
                        isDone
                          ? 'bg-slate-50/80 border-slate-200 text-slate-400'
                          : 'bg-white border-slate-200/80 hover:border-indigo-200 shadow-2xs'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700">
                              {hw.subject}
                            </span>
                            <span className="text-xs font-medium text-slate-500">
                              {hw.targetCount} Soru
                            </span>
                          </div>
                          <h4 className={`text-xs font-bold leading-snug ${isDone ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                            {hw.title}
                          </h4>
                          <p className="text-[11px] text-slate-500 flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-slate-400" />
                            Teslim: {hw.dueDate}
                          </p>
                        </div>

                        {/* Complete button */}
                        <button
                          onClick={() => {
                            const newSt = isDone ? 'pending' : 'completed';
                            toggleHomeworkStatus(hw.id, newSt);
                            if (newSt === 'completed') triggerSuccessConfetti();
                          }}
                          className={`p-1.5 rounded-lg transition ${
                            isDone
                              ? 'text-emerald-600 bg-emerald-50 hover:bg-emerald-100'
                              : 'text-slate-400 hover:text-emerald-600 hover:bg-slate-100'
                          }`}
                          title={isDone ? 'Tamamlandı olarak işaretli' : 'Tamamlandı olarak işaretle'}
                        >
                          <CheckCircle2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <button
            onClick={() => setActiveTab('homework')}
            className="w-full mt-4 py-2 text-center text-xs font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50/50 hover:bg-indigo-50 rounded-xl transition"
          >
            Tüm Ödevleri Görüntüle ({studentHomeworks.length}) →
          </button>
        </div>
      </div>
    </div>
  );
};
