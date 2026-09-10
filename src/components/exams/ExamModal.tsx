import React, { useState } from 'react';
import { ExamResult, ExamScoreDetail } from '../../types';
import { X, TrendingUp, Plus, Trash2, Save, Award } from 'lucide-react';
import { triggerSuccessConfetti } from '../../utils/confetti';

interface ExamModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Omit<ExamResult, 'id'>) => void;
  studentId: string;
  studentName: string;
  defaultExamType?: string;
}

const TEMPLATES: { [key: string]: string[] } = {
  TYT: ['Türkçe (40)', 'Sosyal Bilgiler (20)', 'Temel Matematik (40)', 'Fen Bilimleri (20)'],
  AYT_SAY: ['Matematik (40)', 'Fizik (14)', 'Kimya (13)', 'Biyoloji (13)'],
  AYT_EA: ['Matematik (40)', 'Edebiyat (24)', 'Tarih-1 (10)', 'Coğrafya-1 (6)'],
  LGS: ['Türkçe (20)', 'Matematik (20)', 'Fen Bilimleri (20)', 'İnkılap Tarihi (10)', 'Din Kültürü (10)', 'Yabancı Dil (10)'],
  GENEL: ['Ders 1', 'Ders 2', 'Ders 3']
};

export const ExamModal: React.FC<ExamModalProps> = ({
  isOpen,
  onClose,
  onSave,
  studentId,
  studentName,
  defaultExamType = 'TYT'
}) => {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [type, setType] = useState(defaultExamType);
  const [ranking, setRanking] = useState('');
  const [coachNotes, setCoachNotes] = useState('');

  const [scores, setScores] = useState<ExamScoreDetail[]>([
    { subject: 'Türkçe', correct: 32, wrong: 5, net: 30.75 },
    { subject: 'Sosyal Bilgiler', correct: 15, wrong: 3, net: 14.25 },
    { subject: 'Temel Matematik', correct: 34, wrong: 4, net: 33.0 },
    { subject: 'Fen Bilimleri', correct: 16, wrong: 3, net: 15.25 }
  ]);

  if (!isOpen) return null;

  const handleScoreChange = (index: number, field: 'correct' | 'wrong', val: number) => {
    const updated = [...scores];
    const correct = field === 'correct' ? val : updated[index].correct;
    const wrong = field === 'wrong' ? val : updated[index].wrong;
    // Calculate net: Correct - (Wrong / 4)
    const net = Math.max(0, Number((correct - wrong / 4).toFixed(2)));
    updated[index] = { ...updated[index], [field]: val, net };
    setScores(updated);
  };

  const handleSubjectNameChange = (index: number, val: string) => {
    const updated = [...scores];
    updated[index].subject = val;
    setScores(updated);
  };

  const handleAddRow = () => {
    setScores([...scores, { subject: 'Yeni Ders', correct: 10, wrong: 2, net: 9.5 }]);
  };

  const handleRemoveRow = (index: number) => {
    setScores(scores.filter((_, i) => i !== index));
  };

  const handleLoadTemplate = (templateKey: string) => {
    const list = TEMPLATES[templateKey] || TEMPLATES.GENEL;
    setScores(
      list.map((name) => ({
        subject: name.replace(/\s*\(\d+\)/, ''),
        correct: 0,
        wrong: 0,
        net: 0
      }))
    );
  };

  const totalNet = Number(scores.reduce((sum, s) => sum + s.net, 0).toFixed(2));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return alert('Lütfen deneme adını giriniz.');

    onSave({
      studentId,
      title,
      date,
      type,
      scores,
      totalNet,
      ranking,
      coachNotes
    });

    triggerSuccessConfetti();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative my-8">
        <button
          onClick={onClose}
          className="absolute right-5 top-5 p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">Deneme Sınavı Net Girişi</h2>
            <p className="text-xs text-slate-500">
              <span className="font-bold text-indigo-600">{studentName}</span> için deneme sonuçları ve analizi
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-sm">
          {/* Title & Date */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">Deneme Adı / Yayın *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Örn: 3D Türkiye Geneli TYT Denemesi 3"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Tarih</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Type & Ranking */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Sınav Formatı</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white"
              >
                <option value="TYT">TYT (Temel Yeterlilik)</option>
                <option value="AYT">AYT (Alan Yeterlilik)</option>
                <option value="LGS">LGS</option>
                <option value="KPSS">KPSS</option>
                <option value="GENEL">Genel Deneme</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Sıralama / Derece</label>
              <input
                type="text"
                value={ranking}
                onChange={(e) => setRanking(e.target.value)}
                placeholder="Örn: Türkiye 1.250 / 190.000"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Quick Template Buttons */}
          <div className="flex items-center gap-2 text-xs">
            <span className="font-bold text-slate-500">Şablon Yükle:</span>
            <button
              type="button"
              onClick={() => handleLoadTemplate('TYT')}
              className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition"
            >
              TYT
            </button>
            <button
              type="button"
              onClick={() => handleLoadTemplate('AYT_SAY')}
              className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition"
            >
              AYT Sayısal
            </button>
            <button
              type="button"
              onClick={() => handleLoadTemplate('AYT_EA')}
              className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition"
            >
              AYT EA
            </button>
            <button
              type="button"
              onClick={() => handleLoadTemplate('LGS')}
              className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition"
            >
              LGS
            </button>
          </div>

          {/* Scores Table */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700">Ders Bazlı Sonuçlar</label>
              <div className="flex items-center gap-3">
                <span className="text-xs font-extrabold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-lg">
                  Toplam Net: {totalNet}
                </span>
                <button
                  type="button"
                  onClick={handleAddRow}
                  className="flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-800"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Ders Ekle</span>
                </button>
              </div>
            </div>

            <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
              {scores.map((s, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 p-2 rounded-xl border border-slate-200 bg-slate-50/50 text-xs"
                >
                  <input
                    type="text"
                    value={s.subject}
                    onChange={(e) => handleSubjectNameChange(idx, e.target.value)}
                    className="flex-1 min-w-[100px] px-2 py-1.5 rounded-lg border border-slate-300 bg-white font-semibold"
                  />

                  <div className="flex items-center gap-1.5">
                    <input
                      type="number"
                      placeholder="D"
                      value={s.correct}
                      onChange={(e) => handleScoreChange(idx, 'correct', Number(e.target.value))}
                      className="w-12 px-1.5 py-1.5 rounded-lg border border-emerald-300 bg-emerald-50 text-emerald-800 font-bold text-center"
                      title="Doğru Sayısı"
                    />
                    <input
                      type="number"
                      placeholder="Y"
                      value={s.wrong}
                      onChange={(e) => handleScoreChange(idx, 'wrong', Number(e.target.value))}
                      className="w-12 px-1.5 py-1.5 rounded-lg border border-rose-300 bg-rose-50 text-rose-800 font-bold text-center"
                      title="Yanlış Sayısı"
                    />
                    <div
                      className="w-14 px-1.5 py-1.5 rounded-lg border border-indigo-200 bg-indigo-50 text-indigo-800 font-extrabold text-center"
                      title="Hesaplanan Net"
                    >
                      {s.net}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemoveRow(idx)}
                    className="p-1 text-slate-400 hover:text-rose-600 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Coach Notes */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Koç Deneme Analiz & Değerlendirme Notu
            </label>
            <textarea
              rows={2}
              value={coachNotes}
              onChange={(e) => setCoachNotes(e.target.value)}
              placeholder="Örn: Matematikte süre yönetimini iyi yaptı, fende biyolojiye ağırlık vermeli..."
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
              <span>Denemeyi Kaydet</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
