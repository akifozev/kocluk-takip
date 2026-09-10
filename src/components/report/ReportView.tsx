import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  FileSpreadsheet,
  Printer,
  Share2,
  Copy,
  Target,
  CheckCircle2,
  Clock,
  TrendingUp,
  Award,
  Sparkles,
  Calendar
} from 'lucide-react';
import { triggerSuccessConfetti } from '../../utils/confetti';

export const ReportView: React.FC = () => {
  const { selectedStudent, homeworks, dailyLogs, exams } = useApp();
  const [copiedSummary, setCopiedSummary] = useState(false);
  const [coachCustomComment, setCoachCustomComment] = useState(
    'Bu hafta gösterdiğin disiplin ve soru çözüm istikrarın takdire şayan. Önümüzdeki hafta matematik geometri denemeleri ve biyoloji sistem tekrarlarına odaklanarak netlerimizi daha da yukarı taşıyacağız. Başarılarının devamını dilerim!'
  );

  const studentHws = homeworks.filter((h) => h.studentId === selectedStudent?.id);
  const studentLogs = dailyLogs.filter((l) => l.studentId === selectedStudent?.id);
  const studentExams = exams.filter((e) => e.studentId === selectedStudent?.id);

  // Solved questions calculation
  const totalQuestions = studentLogs.reduce(
    (sum, l) => sum + l.subjects.reduce((sSum, s) => sSum + (s.correct + s.wrong + s.empty), 0),
    0
  );

  const totalCorrect = studentLogs.reduce(
    (sum, l) => sum + l.subjects.reduce((sSum, s) => sSum + s.correct, 0),
    0
  );

  const totalMinutes = studentLogs.reduce((sum, l) => sum + l.studyMinutes, 0);

  const accuracyRate = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;

  // Homework completion rate
  const completedHws = studentHws.filter((h) => h.status === 'completed' || h.status === 'reviewed').length;
  const hwRate = studentHws.length > 0 ? Math.round((completedHws / studentHws.length) * 100) : 100;

  // Latest exam
  const latestExam = studentExams.length > 0 ? studentExams[studentExams.length - 1] : null;

  const todayStr = new Date().toLocaleDateString('tr-TR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const handlePrint = () => {
    window.print();
  };

  const handleCopyWhatsAppText = () => {
    const text = `📊 *ÖĞRENCİ GELİŞİM VE PERFORMANS RAPORU* 🎓\n\n` +
      `👤 *Öğrenci:* ${selectedStudent?.name}\n` +
      `🎯 *Hedef:* ${selectedStudent?.targetDepartment} (${selectedStudent?.examType})\n` +
      `📅 *Rapor Tarihi:* ${todayStr}\n\n` +
      `📈 *Haftalık İstatistikler:*\n` +
      `• Çözülen Soru: ${totalQuestions} / ${selectedStudent?.weeklyTargetQuestions} Soru\n` +
      `• Çalışma Süresi: ${Math.floor(totalMinutes / 60)} saat ${totalMinutes % 60} dakika\n` +
      `• Soru Doğruluk Oranı: %${accuracyRate}\n` +
      `• Ödev Tamamlama Başarısı: %${hwRate} (${completedHws}/${studentHws.length} Ödev)\n` +
      (latestExam ? `• Son Deneme Neti: ${latestExam.totalNet} Net (${latestExam.title})\n` : '') +
      `• İstikrar Serisi: ${selectedStudent?.streak} Gün Kesintisiz Çalışma 🔥\n\n` +
      `📝 *Koç Değerlendirmesi:*\n` +
      `"${coachCustomComment}"\n\n` +
      `_CoachTrack Pro Eğitim Danışmanlığı_`;

    navigator.clipboard.writeText(text);
    triggerSuccessConfetti();
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2500);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Action Header - Hidden on print */}
      <div className="print:hidden flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <FileSpreadsheet className="w-7 h-7 text-indigo-600" />
            Haftalık Gelişim Karnesi & Veli Raporu
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Öğrencinin haftalık performansını velisiyle veya öğrenciyle paylaşmak için profesyonel karne çıktısı.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <button
            onClick={handleCopyWhatsAppText}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-200 transition active:scale-95"
          >
            <Share2 className="w-4 h-4" />
            <span>{copiedSummary ? 'Metin Kopyalandı! ✔' : 'WhatsApp Raporu Kopyala'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-indigo-200 transition active:scale-95"
          >
            <Printer className="w-4 h-4" />
            <span>Yazdır / PDF Kaydet</span>
          </button>
        </div>
      </div>

      {/* The Printable Report Card */}
      <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/90 shadow-lg print:shadow-none print:border-none print:p-0 max-w-4xl mx-auto space-y-8">
        {/* Report Card Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-slate-100 pb-6">
          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 rounded-2xl bg-linear-to-tr from-indigo-600 to-violet-600 text-white flex items-center justify-center shadow-md shadow-indigo-200">
              <Award className="w-8 h-8" />
            </div>
            <div>
              <span className="text-xs font-extrabold tracking-wider uppercase text-indigo-600">
                Eğitim & Koçluk Değerlendirme Raporu
              </span>
              <h2 className="text-2xl font-black text-slate-900 leading-tight">
                {selectedStudent?.name}
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                {selectedStudent?.examType} Hazırlık Grubu • {todayStr}
              </p>
            </div>
          </div>

          <div className="sm:text-right space-y-1">
            <span className="inline-block text-xs font-bold px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full">
              Hedef: {selectedStudent?.targetDepartment}
            </span>
            <p className="text-xs text-slate-500">
              Sıralama Hedefi: <b className="text-slate-800">{selectedStudent?.targetRanking}</b>
            </p>
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 text-center">
            <span className="text-xs font-semibold text-slate-500">Çözülen Soru</span>
            <p className="text-2xl font-black text-slate-900 mt-1">{totalQuestions}</p>
            <span className="text-[11px] text-indigo-600 font-bold">
              Hedef: {selectedStudent?.weeklyTargetQuestions}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 text-center">
            <span className="text-xs font-semibold text-slate-500">Çalışma Süresi</span>
            <p className="text-2xl font-black text-slate-900 mt-1">
              {Math.floor(totalMinutes / 60)}s {totalMinutes % 60}d
            </p>
            <span className="text-[11px] text-emerald-600 font-bold">Odaklanma</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 text-center">
            <span className="text-xs font-semibold text-slate-500">Doğruluk Oranı</span>
            <p className="text-2xl font-black text-emerald-600 mt-1">%{accuracyRate}</p>
            <span className="text-[11px] text-slate-500 font-medium">
              {totalCorrect} Doğru Soru
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 text-center">
            <span className="text-xs font-semibold text-slate-500">Ödev Başarısı</span>
            <p className="text-2xl font-black text-indigo-600 mt-1">%{hwRate}</p>
            <span className="text-[11px] text-slate-500 font-medium">
              {completedHws}/{studentHws.length} Görev
            </span>
          </div>
        </div>

        {/* Latest Exam & Homework Table */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Latest Exam Summary */}
          <div className="p-5 rounded-2xl border border-slate-200/80 bg-slate-50/40 space-y-3">
            <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-indigo-600" />
              Son Deneme Performansı
            </h3>

            {latestExam ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700">{latestExam.title}</span>
                  <span className="text-sm font-black text-indigo-600">
                    {latestExam.totalNet} Net
                  </span>
                </div>
                <div className="space-y-1 text-xs">
                  {latestExam.scores.map((s, idx) => (
                    <div key={idx} className="flex justify-between text-slate-600 py-0.5 border-b border-slate-100">
                      <span>{s.subject}</span>
                      <span className="font-bold text-slate-800">{s.net} Net</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-400">Henüz deneme kaydı girilmedi.</p>
            )}
          </div>

          {/* Weekly Homeworks Summary */}
          <div className="p-5 rounded-2xl border border-slate-200/80 bg-slate-50/40 space-y-3">
            <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Ödev & Sorumluluk Durumu
            </h3>

            <div className="space-y-2 text-xs">
              {studentHws.slice(0, 4).map((hw) => (
                <div
                  key={hw.id}
                  className="flex items-center justify-between p-2 rounded-xl bg-white border border-slate-200/60"
                >
                  <div className="truncate pr-2">
                    <span className="font-bold text-slate-800">{hw.title}</span>
                    <span className="text-slate-400 block text-[10px]">{hw.subject} • {hw.targetCount} Soru</span>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                      hw.status === 'completed'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {hw.status === 'completed' ? 'Tamamlandı' : 'Bekliyor'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Coach Evaluation Text Area */}
        <div className="space-y-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
            Eğitim Koçunun Haftalık Değerlendirmesi & Tavsiyeleri
          </label>
          <textarea
            rows={4}
            value={coachCustomComment}
            onChange={(e) => setCoachCustomComment(e.target.value)}
            className="w-full p-4 rounded-2xl border border-slate-200 bg-slate-50/50 text-sm font-medium text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none leading-relaxed print:bg-transparent print:border-none print:p-0"
          />
        </div>

        {/* Report Card Signature Footer */}
        <div className="pt-8 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <div>
            <span className="font-bold text-slate-700">CoachTrack Pro Eğitim Danışmanlığı</span>
            <p className="text-[11px] text-slate-400 mt-0.5">Hedefe giden yolda birlikteyiz.</p>
          </div>
          <div className="text-right">
            <span className="font-bold text-slate-700">Koç Onayı</span>
            <div className="w-32 border-b border-slate-300 mt-6" />
          </div>
        </div>
      </div>
    </div>
  );
};
