import React, { useState } from 'react';
import { DailyLog, SubjectStat } from '../../types';
import { X, Clock, Plus, Trash2, Save, Smile, CheckCircle } from 'lucide-react';
import { triggerSuccessConfetti } from '../../utils/confetti';

interface DailyLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Omit<DailyLog, 'id'>) => void;
  studentId: string;
  studentName: string;
}

const COMMON_SUBJECTS = [
  'Matematik',
  'Geometri',
  'Fizik',
  'Kimya',
  'Biyoloji',
  'Türkçe',
  'Edebiyat',
  'Tarih',
  'Coğrafya',
  'Fen Bilimleri (LGS)'
];

export const DailyLogModal: React.FC<DailyLogModalProps> = ({
  isOpen,
  onClose,
  onSave,
  studentId,
  studentName
}) => {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [studyMinutes, setStudyMinutes] = useState(240);
  const [mood, setMood] = useState<'super' | 'good' | 'tired' | 'stressed'>('good');
  const [notes, setNotes] = useState('');

  const [subjects, setSubjects] = useState<SubjectStat[]>([
    { subject: 'Matematik', correct: 50, wrong: 5, empty: 2 },
    { subject: 'Fizik', correct: 30, wrong: 4, empty: 1 }
  ]);

  if (!isOpen) return null;

  const handleAddSubject = () => {
    setSubjects([...subjects, { subject: 'Kimya', correct: 20, wrong: 2, empty: 0 }]);
  };

  const handleRemoveSubject = (index: number) => {
    setSubjects(subjects.filter((_, i) => i !== index));
  };

  const handleSubjectChange = (index: number, field: keyof SubjectStat, value: any) => {
    const updated = [...subjects];
    updated[index] = { ...updated[index], [field]: value };
    setSubjects(updated);
  };

  const totalQuestions = subjects.reduce((sum, s) => sum + (s.correct + s.wrong + s.empty), 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (subjects.length === 0) return alert('Lütfen en az bir ders ekleyin.');

    onSave({
      studentId,
      date,
      studyMinutes: Number(studyMinutes) || 120,
      subjects,
      notes,
      mood
    });

    triggerSuccessConfetti();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full p-4 sm:p-8 shadow-2xl border border-slate-200 relative my-4 sm:my-8">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 sm:right-5 sm:top-5 p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5 sm:mb-6 pr-8">
          <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">Günlük Çalışma & Soru Girişi</h2>
            <p className="text-xs text-slate-500">
              <span className="font-bold text-indigo-600">{studentName}</span> için bugünkü soru ve çalışma verileri
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5 text-sm">
          {/* Date, Minutes, Mood */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Tarih</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none text-xs sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Çalışma Süresi (Dk)
              </label>
              <input
                type="number"
                required
                value={studyMinutes}
                onChange={(e) => setStudyMinutes(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none text-xs sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Günün Modu</label>
              <select
                value={mood}
                onChange={(e) => setMood(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white text-xs sm:text-sm"
              >
                <option value="super">🚀 Harika / Zirvede</option>
                <option value="good">😊 İyi / Verimli</option>
                <option value="tired">🥱 Yorgun / Yoğun</option>
                <option value="stressed">🤯 Stresli / Zorlandı</option>
              </select>
            </div>
          </div>

          {/* Subjects Table */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700">
                Çözülen Sorular (Toplam: {totalQuestions} Soru)
              </label>
              <button
                type="button"
                onClick={handleAddSubject}
                className="flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-800"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Ders Ekle</span>
              </button>
            </div>

            <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
              {subjects.map((s, idx) => (
                <div
                  key={idx}
                  className="p-3 sm:p-2.5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2 sm:space-y-0 sm:flex sm:items-center sm:gap-2"
                >
                  {/* Subject Name & Mobile Delete Button */}
                  <div className="flex items-center justify-between gap-2 sm:flex-1">
                    <select
                      value={s.subject}
                      onChange={(e) => handleSubjectChange(idx, 'subject', e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs bg-white font-semibold focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    >
                      {COMMON_SUBJECTS.map((sub) => (
                        <option key={sub} value={sub}>
                          {sub}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() => handleRemoveSubject(idx)}
                      className="sm:hidden p-1.5 text-slate-400 hover:text-rose-600 transition shrink-0"
                      title="Dersi Sil"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* D / Y / B inputs */}
                  <div className="grid grid-cols-3 gap-2 sm:flex sm:items-center sm:gap-1.5">
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] font-bold text-emerald-700 sm:hidden">D:</span>
                      <input
                        type="number"
                        title="Doğru Sayısı"
                        placeholder="D"
                        value={s.correct}
                        onChange={(e) => handleSubjectChange(idx, 'correct', Number(e.target.value))}
                        className="w-full sm:w-14 px-2 py-1.5 rounded-lg border border-emerald-300 bg-emerald-50/50 text-xs font-bold text-emerald-800 text-center"
                      />
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] font-bold text-rose-700 sm:hidden">Y:</span>
                      <input
                        type="number"
                        title="Yanlış Sayısı"
                        placeholder="Y"
                        value={s.wrong}
                        onChange={(e) => handleSubjectChange(idx, 'wrong', Number(e.target.value))}
                        className="w-full sm:w-14 px-2 py-1.5 rounded-lg border border-rose-300 bg-rose-50/50 text-xs font-bold text-rose-800 text-center"
                      />
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] font-bold text-slate-500 sm:hidden">B:</span>
                      <input
                        type="number"
                        title="Boş Sayısı"
                        placeholder="B"
                        value={s.empty}
                        onChange={(e) => handleSubjectChange(idx, 'empty', Number(e.target.value))}
                        className="w-full sm:w-14 px-2 py-1.5 rounded-lg border border-slate-300 bg-white text-xs font-semibold text-slate-700 text-center"
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemoveSubject(idx)}
                    className="hidden sm:block p-1.5 text-slate-400 hover:text-rose-600 transition shrink-0"
                    title="Dersi Sil"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Günün Özeti / Notlar
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Hangi konularda takılma yaşandı, genel verimlilik nasıldı?"
              className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-600 font-semibold hover:bg-slate-50 transition"
            >
              Vazgeç
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-md shadow-indigo-200 transition"
            >
              <Save className="w-4 h-4" />
              <span>Kaydet</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
