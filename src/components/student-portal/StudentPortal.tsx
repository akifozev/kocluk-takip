import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Sparkles,
  Flame,
  CheckCircle2,
  Clock,
  TrendingUp,
  Target,
  Book,
  Calendar,
  Award,
  Plus,
  Smartphone,
  Camera
} from 'lucide-react';
import { PomodoroTimer } from '../tracker/PomodoroTimer';
import { triggerSuccessConfetti } from '../../utils/confetti';
import { InstallPromptModal } from '../common/InstallPromptModal';
import { Avatar } from '../common/Avatar';

interface StudentPortalProps {
  onOpenDailyLogModal: () => void;
}

export const StudentPortal: React.FC<StudentPortalProps> = ({ onOpenDailyLogModal }) => {
  const {
    selectedStudent,
    updateStudent,
    homeworks,
    toggleHomeworkStatus,
    dailyLogs,
    exams,
    motivations,
    addDailyLog
  } = useApp();

  const studentHws = homeworks.filter((h) => h.studentId === selectedStudent?.id);
  const pendingHws = studentHws.filter((h) => h.status === 'pending');
  const completedHws = studentHws.filter((h) => h.status === 'completed' || h.status === 'reviewed');

  const studentLogs = dailyLogs.filter((l) => l.studentId === selectedStudent?.id);
  const todayStr = new Date().toISOString().split('T')[0];
  const todayLogs = studentLogs.filter((l) => l.date === todayStr);

  const todayQuestions = todayLogs.reduce((acc, log) => {
    return acc + log.subjects.reduce((sAcc, s) => sAcc + (s.correct + s.wrong + s.empty), 0);
  }, 0);

  const dailyTarget = selectedStudent?.dailyTargetQuestions || 200;
  const progressPercent = Math.min(100, Math.round((todayQuestions / dailyTarget) * 100));

  const studentExams = exams.filter((e) => e.studentId === selectedStudent?.id);
  const latestExam = studentExams.length > 0 ? studentExams[studentExams.length - 1] : null;

  const todayQuote = motivations[0] || {
    title: 'Günün İlhamı',
    content: 'Bugün yapacağın her fedakarlık yarın hedefine giden yolu aydınlatacak.',
    author: 'Koçluk İlkesi'
  };

  const [installModalOpen, setInstallModalOpen] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    const handleBeforeInstall = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  const handleInstallAndroid = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then(() => {
        setDeferredPrompt(null);
        setInstallModalOpen(false);
      });
    }
  };

  const handleStudentAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedStudent) return;
    if (file.size > 5 * 1024 * 1024) {
      alert("Lütfen 5 MB'tan küçük bir fotoğraf seçin.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (evt) => {
      const result = evt.target?.result as string;
      if (result) {
        updateStudent(selectedStudent.id, { avatar: result });
        triggerSuccessConfetti();
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handlePomodoroComplete = (minutes: number) => {
    addDailyLog({
      studentId: selectedStudent?.id || '',
      date: todayStr,
      studyMinutes: minutes,
      subjects: [],
      notes: `⏱️ Öğrenci Pomodoro Seansı (${minutes} dk odaklanma).`,
      mood: 'super'
    });
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Student Welcome Card */}
      <div className="bg-linear-to-r from-violet-900 via-indigo-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 bg-violet-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="relative group shrink-0">
              <Avatar
                name={selectedStudent?.name || ''}
                avatar={selectedStudent?.avatar}
                size="xl"
                className="ring-2 ring-violet-400/50 shadow-md"
              />
              <label
                htmlFor="student-avatar-input"
                className="absolute -bottom-1 -right-1 w-7 h-7 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full flex items-center justify-center shadow-lg cursor-pointer transition active:scale-95 border-2 border-slate-900"
                title="Kendi fotoğrafını yükle veya değiştir"
              >
                <Camera className="w-3.5 h-3.5" />
              </label>
              <input
                id="student-avatar-input"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleStudentAvatarUpload}
              />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-violet-500/30 text-violet-200 text-xs font-bold mb-1">
                <Sparkles className="w-3 h-3 text-amber-300" />
                <span>Öğrenci Çalışma Portalı</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                Merhaba, {selectedStudent?.name}! 👋
              </h1>
              <p className="text-xs sm:text-sm text-violet-200 flex items-center gap-1.5 mt-1">
                <Target className="w-3.5 h-3.5 text-amber-400" />
                Hedefin: <b className="text-white">{selectedStudent?.targetDepartment}</b> ({selectedStudent?.targetRanking})
              </p>
              {selectedStudent?.avatar && (
                <button
                  type="button"
                  onClick={() => selectedStudent && updateStudent(selectedStudent.id, { avatar: '' })}
                  className="text-[11px] text-violet-300 hover:text-rose-300 font-semibold underline mt-1 block transition cursor-pointer"
                >
                  Fotoğrafı Kaldır
                </button>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 self-start sm:self-auto">
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/10">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                <Flame className="w-6 h-6 fill-amber-500" />
              </div>
              <div>
                <span className="text-[11px] font-semibold text-violet-200 block uppercase tracking-wider">
                  Kesintisiz Seri
                </span>
                <span className="text-xl font-black text-white">{selectedStudent?.streak} Gün 🔥</span>
              </div>
            </div>

            <button
              onClick={() => setInstallModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-3 rounded-2xl bg-white/15 hover:bg-white/25 text-white text-xs font-bold transition border border-white/20 shadow-xs active:scale-95"
              title="Uygulamayı telefonun ana ekranına ekle"
            >
              <Smartphone className="w-4 h-4 text-violet-300" />
              <span>Telefona Yükle</span>
            </button>
          </div>
        </div>
      </div>

      {/* Daily Motivation Spotlight */}
      <div className="bg-linear-to-r from-amber-50 to-orange-50 border border-amber-200/80 rounded-2xl p-5 shadow-xs flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-xs">
          <Sparkles className="w-5 h-5" />
        </div>
        <div>
          <span className="text-xs font-extrabold uppercase tracking-wider text-amber-800">
            Günün İlhamı
          </span>
          <p className="text-sm font-semibold text-slate-800 italic mt-0.5 leading-snug">
            "{todayQuote.content}"
          </p>
          <span className="text-xs font-bold text-amber-900/80 block mt-1">
            — {todayQuote.author}
          </span>
        </div>
      </div>

      {/* Progress & Today Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Bugünkü Soru Hedefin
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">{todayQuestions}</span>
            <span className="text-xs font-semibold text-slate-500">/ {dailyTarget} Soru</span>
          </div>
          <div className="mt-3">
            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
              <div
                className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className="text-[11px] font-bold text-indigo-600 mt-1 block">
              %{progressPercent} Tamamlandı
            </span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Bekleyen Görevler
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black text-amber-600">{pendingHws.length}</span>
            <span className="text-xs font-semibold text-slate-500">
              ({completedHws.length} Yapıldı)
            </span>
          </div>
          <p className="mt-3 text-xs text-slate-500">Ödevlerini vaktinde teslim et</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Son Deneme Netin
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black text-violet-600">
              {latestExam ? latestExam.totalNet : '—'}
            </span>
            <span className="text-xs font-bold text-slate-500">
              {latestExam ? `${latestExam.type}` : ''}
            </span>
          </div>
          <p className="mt-3 text-xs text-slate-500 truncate">
            {latestExam ? latestExam.title : 'Henüz deneme girilmedi'}
          </p>
        </div>
      </div>

      {/* Main Grid: Homework List + Pomodoro Timer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: My Assignments */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Yapılacak Ödevlerim</h2>
              <p className="text-xs text-slate-500">
                Koçunun senin için tanımladığı ders ve soru hedefleri
              </p>
            </div>

            <button
              onClick={onOpenDailyLogModal}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold rounded-xl transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Soru Girişi Yap</span>
            </button>
          </div>

          <div className="space-y-3">
            {studentHws.length === 0 ? (
              <div className="text-center py-12 text-slate-400">
                <CheckCircle2 className="w-10 h-10 mx-auto mb-2 opacity-40 text-emerald-500" />
                <p className="text-sm font-semibold text-slate-600">Harika! Bekleyen ödevin yok.</p>
              </div>
            ) : (
              studentHws.map((hw) => {
                const isDone = hw.status === 'completed' || hw.status === 'reviewed';

                return (
                  <div
                    key={hw.id}
                    className={`p-4 rounded-2xl border transition-all ${
                      isDone
                        ? 'bg-slate-50/60 border-slate-200 text-slate-400'
                        : 'bg-white border-slate-200 hover:border-indigo-200 shadow-2xs'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                      <div className="space-y-1.5 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700">
                            {hw.subject}
                          </span>
                          <span className="text-xs font-semibold text-slate-500">
                            🎯 {hw.targetCount} Soru
                          </span>
                          <span className="text-[11px] text-slate-400 flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {hw.dueDate}
                          </span>
                        </div>

                        <h4 className={`text-sm font-bold ${isDone ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                          {hw.title}
                        </h4>

                        {hw.source && (
                          <p className="text-xs text-slate-500 flex items-center gap-1">
                            <Book className="w-3 h-3 text-slate-400" />
                            {hw.source}
                          </p>
                        )}

                        {hw.coachFeedback && (
                          <p className="text-xs text-indigo-700 bg-indigo-50/60 p-2 rounded-xl mt-2 border border-indigo-100">
                            <span className="font-bold">Koçunun Notu:</span> {hw.coachFeedback}
                          </p>
                        )}
                      </div>

                      <button
                        onClick={() => {
                          const newStatus = isDone ? 'pending' : 'completed';
                          toggleHomeworkStatus(hw.id, newStatus);
                          if (newStatus === 'completed') triggerSuccessConfetti();
                        }}
                        className={`flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition w-full sm:w-auto shrink-0 ${
                          isDone
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs active:scale-95'
                        }`}
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>{isDone ? 'Tamamlandı ✔' : 'Bitirdim!'}</span>
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right 1 Col: Pomodoro Timer Widget */}
        <div className="lg:col-span-1">
          <PomodoroTimer onSessionComplete={handlePomodoroComplete} />
        </div>
      </div>

      {/* Phone Install Guide Modal */}
      <InstallPromptModal
        isOpen={installModalOpen}
        onClose={() => setInstallModalOpen(false)}
        onInstallAndroid={handleInstallAndroid}
        canInstallDirectly={!!deferredPrompt}
      />
    </div>
  );
};
