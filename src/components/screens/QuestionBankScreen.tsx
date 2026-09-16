import React, { useState } from 'react';
import { Question, QuestionCategory } from '../../types/game';
import { saveCustomQuestion } from '../../utils/gameStorage';
import { ArrowLeft, Plus, Search, HelpCircle, Check, X } from 'lucide-react';
import { audioManager } from '../../utils/audioManager';

interface QuestionBankScreenProps {
  questions: Question[];
  onBack: () => void;
  onQuestionsUpdated: (updatedList: Question[]) => void;
}

export const QuestionBankScreen: React.FC<QuestionBankScreenProps> = ({
  questions,
  onBack,
  onQuestionsUpdated,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Yeni soru form state
  const [newQuestionText, setNewQuestionText] = useState('');
  const [newOptions, setNewOptions] = useState<[string, string, string, string]>(['', '', '', '']);
  const [newCorrectAnswer, setNewCorrectAnswer] = useState<0 | 1 | 2 | 3>(0);
  const [newLevel, setNewLevel] = useState<number>(5);
  const [newCategory, setNewCategory] = useState<QuestionCategory>('genel');
  const [newExplanation, setNewExplanation] = useState('');
  const [formError, setFormError] = useState('');

  // Filtreleme
  const filtered = questions.filter((q) => {
    const matchesSearch =
      q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.options.some((opt) => opt.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory =
      selectedCategory === 'all' || q.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleSaveQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestionText.trim()) {
      setFormError('Lütfen soru metnini giriniz.');
      return;
    }
    if (newOptions.some((opt) => !opt.trim())) {
      setFormError('Lütfen 4 şıkkın tamamını doldurunuz.');
      return;
    }

    const created: Question = {
      id: `custom_${Date.now()}`,
      level: newLevel,
      category: newCategory,
      question: newQuestionText.trim(),
      options: [
        newOptions[0].trim(),
        newOptions[1].trim(),
        newOptions[2].trim(),
        newOptions[3].trim(),
      ],
      correctAnswer: newCorrectAnswer,
      explanation: newExplanation.trim() || undefined,
    };

    const updated = saveCustomQuestion(created);
    onQuestionsUpdated(updated);
    audioManager.playCorrect();

    // Formu sıfırla
    setNewQuestionText('');
    setNewOptions(['', '', '', '']);
    setNewExplanation('');
    setFormError('');
    setIsAddModalOpen(false);
  };

  return (
    <div className="flex-1 flex flex-col p-4 max-w-md mx-auto w-full overflow-hidden">
      {/* Üst Çubuk */}
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

        <div className="text-center">
          <h2 className="text-sm font-black text-slate-100">Soru Havuzu</h2>
          <span className="text-[10px] text-amber-400 font-bold">
            {questions.length} Soru Kayıtlı
          </span>
        </div>

        <button
          onClick={() => {
            audioManager.playClick();
            setIsAddModalOpen(true);
          }}
          className="px-2.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition cursor-pointer flex items-center gap-1 shadow"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Soru Ekle</span>
        </button>
      </div>

      {/* Arama Çubuğu */}
      <div className="relative shrink-0 mb-2">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Soru veya şık ara..."
          className="w-full bg-slate-800/80 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:border-amber-400 transition"
        />
      </div>

      {/* Kategori Filtre Butonları */}
      <div className="flex gap-1.5 overflow-x-auto pb-2 shrink-0 no-scrollbar">
        {[
          { id: 'all', label: 'Tümü' },
          { id: 'genel', label: 'Genel Kültür' },
          { id: 'populer', label: 'Popüler' },
          { id: 'sinema-dizi', label: 'Sinema/Dizi' },
          { id: 'tarih', label: 'Tarih' },
          { id: 'bilim', label: 'Bilim' },
          { id: 'spor', label: 'Spor' },
          { id: 'sanat', label: 'Sanat' },
          { id: 'edebiyat', label: 'Edebiyat' },
          { id: 'komik', label: 'Komik' },
        ].map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap transition cursor-pointer ${
              selectedCategory === cat.id
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Soru Listesi */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-1 my-1">
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-slate-500 text-xs">
            Eşleşen soru bulunamadı.
          </div>
        ) : (
          filtered.map((q) => (
            <div
              key={q.id}
              className="p-3 rounded-2xl bg-slate-850/80 border border-slate-750 hover:border-slate-600 transition flex flex-col gap-2"
            >
              <div className="flex items-center justify-between text-[10px]">
                <span className="px-2 py-0.5 rounded-full bg-slate-800 text-amber-400 font-bold border border-slate-700">
                  Seviye {q.level}
                </span>
                <span className="text-slate-400 font-semibold capitalize">
                  {q.category}
                </span>
              </div>

              <div className="text-xs font-bold text-slate-100 leading-snug">
                {q.question}
              </div>

              <div className="grid grid-cols-2 gap-1 pt-1">
                {q.options.map((opt, oIdx) => {
                  const isCorrect = oIdx === q.correctAnswer;
                  const label = ['A', 'B', 'C', 'D'][oIdx];
                  return (
                    <div
                      key={oIdx}
                      className={`text-[11px] px-2 py-1 rounded-lg border flex items-center gap-1.5 ${
                        isCorrect
                          ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300 font-bold'
                          : 'bg-slate-800/40 border-slate-700/50 text-slate-400'
                      }`}
                    >
                      <span className="font-bold opacity-80">{label}:</span>
                      <span className="truncate">{opt}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>

      {/* YENİ SORU EKLEME MODALI */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-sm max-h-[92vh] bg-slate-900 border-2 border-slate-700 rounded-3xl p-4 shadow-2xl flex flex-col overflow-hidden">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800 shrink-0">
              <h3 className="text-sm font-black text-slate-100 flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-amber-400" />
                <span>Havuza Yeni Soru Ekle</span>
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-full bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={handleSaveQuestion}
              className="flex-1 overflow-y-auto space-y-3 py-2 pr-1"
            >
              {formError && (
                <div className="p-2 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-[11px] font-bold">
                  {formError}
                </div>
              )}

              <div>
                <label className="text-[11px] font-bold text-slate-300 block mb-1">
                  Soru Metni
                </label>
                <textarea
                  value={newQuestionText}
                  onChange={(e) => setNewQuestionText(e.target.value)}
                  rows={2}
                  placeholder="Soruyu buraya yazın..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Seviye & Kategori */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">
                    Seviye (1 - 15)
                  </label>
                  <select
                    value={newLevel}
                    onChange={(e) => setNewLevel(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2 text-xs text-slate-200 focus:outline-none focus:border-amber-400"
                  >
                    {Array.from({ length: 15 }, (_, i) => i + 1).map((lvl) => (
                      <option key={lvl} value={lvl}>
                        Seviye {lvl}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">
                    Kategori
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as QuestionCategory)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2 text-xs text-slate-200 focus:outline-none focus:border-amber-400"
                  >
                    <option value="genel">Genel Kültür</option>
                    <option value="populer">Popüler Kültür</option>
                    <option value="sinema-dizi">Sinema & Dizi</option>
                    <option value="tarih">Tarih</option>
                    <option value="bilim">Bilim</option>
                    <option value="spor">Spor</option>
                    <option value="sanat">Sanat</option>
                    <option value="edebiyat">Edebiyat</option>
                    <option value="komik">İlginç / Komik</option>
                  </select>
                </div>
              </div>

              {/* 4 Şık */}
              <div>
                <label className="text-[11px] font-bold text-slate-300 block mb-1.5">
                  Şıklar (Doğru olanı yeşil daire ile seçin)
                </label>
                <div className="space-y-1.5">
                  {(['A', 'B', 'C', 'D'] as const).map((label, idx) => {
                    const isSelected = newCorrectAnswer === idx;
                    return (
                      <div
                        key={label}
                        className="flex items-center gap-2 bg-slate-800/80 border border-slate-700/80 rounded-xl px-2.5 py-1.5"
                      >
                        <button
                          type="button"
                          onClick={() => setNewCorrectAnswer(idx as 0 | 1 | 2 | 3)}
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black transition cursor-pointer ${
                            isSelected
                              ? 'bg-emerald-500 text-slate-950 shadow'
                              : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
                          }`}
                        >
                          {isSelected ? <Check className="w-3.5 h-3.5" /> : label}
                        </button>
                        <input
                          type="text"
                          value={newOptions[idx]}
                          onChange={(e) => {
                            const copy: [string, string, string, string] = [...newOptions];
                            copy[idx] = e.target.value;
                            setNewOptions(copy);
                          }}
                          placeholder={`${label} Şıkkı...`}
                          className="flex-1 bg-transparent text-xs text-slate-100 placeholder-slate-500 focus:outline-none"
                        />
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Açıklama */}
              <div>
                <label className="text-[11px] font-bold text-slate-300 block mb-1">
                  Açıklama (Biliyor muydun? Notu)
                </label>
                <input
                  type="text"
                  value={newExplanation}
                  onChange={(e) => setNewExplanation(e.target.value)}
                  placeholder="Cevapla ilgili ilginç bir bilgi (opsiyonel)..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black text-xs tracking-wider shadow active:scale-95 transition cursor-pointer"
                >
                  Soruyu Kaydet ve Havuza Ekle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
