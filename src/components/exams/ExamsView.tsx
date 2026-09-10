import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  TrendingUp,
  PlusCircle,
  Calendar,
  Award,
  Trash2,
  BarChart3,
  CheckCircle2,
  MessageSquare
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from 'recharts';

interface ExamsViewProps {
  onOpenExamModal: () => void;
}

export const ExamsView: React.FC<ExamsViewProps> = ({ onOpenExamModal }) => {
  const { selectedStudent, exams, deleteExam } = useApp();

  const studentExams = exams
    .filter((e) => e.studentId === selectedStudent?.id)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Chart data for Net progression
  const netProgressData = studentExams.map((e) => ({
    name: e.title.length > 16 ? e.title.substring(0, 14) + '...' : e.title,
    date: e.date,
    net: e.totalNet
  }));

  // Latest exam breakdown for Bar chart
  const latestExam = studentExams.length > 0 ? studentExams[studentExams.length - 1] : null;
  const latestSubjectData = latestExam
    ? latestExam.scores.map((s) => ({
        subject: s.subject,
        net: s.net,
        dogru: s.correct,
        yanlis: s.wrong
      }))
    : [];

  const highestNet = studentExams.length > 0
    ? Math.max(...studentExams.map((e) => e.totalNet))
    : 0;

  const averageNet = studentExams.length > 0
    ? (studentExams.reduce((sum, e) => sum + e.totalNet, 0) / studentExams.length).toFixed(2)
    : 0;

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <TrendingUp className="w-7 h-7 text-indigo-600" />
            Deneme Sınavı Net Analizi
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            <span className="font-bold text-slate-800">{selectedStudent?.name}</span> öğrencisinin deneme net gelişim eğrisi ve ders bazlı istatistikleri.
          </p>
        </div>

        <button
          onClick={onOpenExamModal}
          className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md shadow-indigo-200 transition active:scale-95 self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Yeni Deneme Ekle</span>
        </button>
      </div>

      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Girilen Deneme
          </span>
          <p className="text-3xl font-black text-slate-900 mt-2">{studentExams.length}</p>
          <p className="text-xs text-slate-500 mt-1">Kayıtlı sınav sayısı</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Zirve Net (En Yüksek)
          </span>
          <p className="text-3xl font-black text-emerald-600 mt-2">{highestNet}</p>
          <p className="text-xs text-slate-500 mt-1">Öğrencinin rekor neti</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Ortalama Net
          </span>
          <p className="text-3xl font-black text-indigo-600 mt-2">{averageNet}</p>
          <p className="text-xs text-slate-500 mt-1">Tüm denemelerin ortalaması</p>
        </div>
      </div>

      {/* 2 Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Net Progression Area Chart */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Net Gelişim Trendi</h3>
              <p className="text-xs text-slate-500">Zaman içerisindeki toplam net değişimi</p>
            </div>
            <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg">
              Toplam Netler
            </span>
          </div>

          <div className="h-64 w-full">
            {netProgressData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-xs text-slate-400">
                Grafik için en az bir deneme girilmelidir.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={netProgressData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="netGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1e293b',
                      borderRadius: '12px',
                      color: '#fff',
                      border: 'none',
                      fontSize: '12px'
                    }}
                    formatter={(val: any) => [`${val} Net`, 'Toplam Net']}
                  />
                  <Area
                    type="monotone"
                    dataKey="net"
                    stroke="#4f46e5"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#netGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Latest Exam Subject Net Bar Chart */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Son Deneme Ders Dağılımı</h3>
              <p className="text-xs text-slate-500">
                {latestExam ? latestExam.title : 'Henüz deneme yok'}
              </p>
            </div>
            {latestExam && (
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg">
                {latestExam.totalNet} Net
              </span>
            )}
          </div>

          <div className="h-64 w-full">
            {latestSubjectData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-xs text-slate-400">
                Son deneme verisi bulunmuyor.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={latestSubjectData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="subject" stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1e293b',
                      borderRadius: '12px',
                      color: '#fff',
                      border: 'none',
                      fontSize: '12px'
                    }}
                    formatter={(val: any) => [`${val} Net`, 'Net']}
                  />
                  <Bar dataKey="net" fill="#10b981" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      {/* Detailed Exam Results Cards */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
        <h2 className="text-lg font-bold text-slate-900">Tüm Deneme Sınavı Raporları</h2>

        {studentExams.length === 0 ? (
          <div className="text-center py-10 text-slate-400">
            <Award className="w-10 h-10 mx-auto mb-2 opacity-40" />
            <p className="text-xs font-medium">Henüz kayıtlı deneme sınavı bulunmuyor.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {[...studentExams].reverse().map((exam) => (
              <div
                key={exam.id}
                className="p-5 rounded-2xl border border-slate-200 bg-slate-50/40 hover:bg-white transition space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/60 pb-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-lg bg-indigo-100 text-indigo-800">
                        {exam.type}
                      </span>
                      <h4 className="text-base font-bold text-slate-900">{exam.title}</h4>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {exam.date}
                      </span>
                      {exam.ranking && (
                        <span className="text-indigo-600 font-semibold flex items-center gap-1">
                          <Award className="w-3.5 h-3.5" />
                          {exam.ranking}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-center">
                    <div className="text-right">
                      <span className="text-xl font-black text-indigo-700">{exam.totalNet}</span>
                      <span className="text-xs text-slate-400 block font-medium">Toplam Net</span>
                    </div>

                    <button
                      onClick={() => {
                        if (confirm('Bu deneme sonucunu silmek istiyor musunuz?')) {
                          deleteExam(exam.id);
                        }
                      }}
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition"
                      title="Sil"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Scores breakdown pills */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  {exam.scores.map((s, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-xl bg-white border border-slate-200/80 flex items-center justify-between"
                    >
                      <span className="font-semibold text-slate-700">{s.subject}</span>
                      <div className="text-right">
                        <span className="font-bold text-emerald-700">{s.net} Net</span>
                        <span className="block text-[10px] text-slate-400">
                          {s.correct}D - {s.wrong}Y
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Coach notes */}
                {exam.coachNotes && (
                  <div className="bg-indigo-50/50 p-3 rounded-xl border border-indigo-100/80 text-xs flex items-start gap-2">
                    <MessageSquare className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-indigo-900">Koç Değerlendirmesi:</span>
                      <p className="text-indigo-800 mt-0.5">{exam.coachNotes}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
