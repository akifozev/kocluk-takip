import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { HomeworkStatus } from '../../types';
import {
  CheckSquare,
  PlusCircle,
  Calendar,
  Book,
  Clock,
  CheckCircle2,
  AlertTriangle,
  MessageSquare,
  Trash2,
  Flame,
  Send
} from 'lucide-react';
import { triggerSuccessConfetti } from '../../utils/confetti';

interface HomeworkViewProps {
  onOpenHomeworkModal: () => void;
}

export const HomeworkView: React.FC<HomeworkViewProps> = ({ onOpenHomeworkModal }) => {
  const {
    selectedStudent,
    homeworks,
    toggleHomeworkStatus,
    updateHomework,
    deleteHomework
  } = useApp();

  const [statusFilter, setStatusFilter] = useState<'ALL' | HomeworkStatus>('ALL');
  const [editingFeedbackId, setEditingFeedbackId] = useState<string | null>(null);
  const [feedbackText, setFeedbackText] = useState('');

  // Filter homeworks for the currently selected student
  const studentHws = homeworks.filter((h) => h.studentId === selectedStudent?.id);

  const filteredHws = studentHws.filter((h) => {
    if (statusFilter === 'ALL') return true;
    return h.status === statusFilter;
  });

  const pendingCount = studentHws.filter((h) => h.status === 'pending').length;
  const completedCount = studentHws.filter((h) => h.status === 'completed' || h.status === 'reviewed').length;
  const incompletedCount = studentHws.filter((h) => h.status === 'incompleted').length;

  const handleSaveFeedback = (hwId: string) => {
    updateHomework(hwId, { coachFeedback: feedbackText });
    setEditingFeedbackId(null);
    setFeedbackText('');
  };

  const getDueDateLabel = (dueDateStr: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(dueDateStr);
    due.setHours(0, 0, 0, 0);

    const diffDays = Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return { text: `${Math.abs(diffDays)} gün gecikti`, color: 'text-rose-600 bg-rose-50 border-rose-200' };
    } else if (diffDays === 0) {
      return { text: 'Bugün teslim!', color: 'text-amber-700 bg-amber-50 border-amber-200 font-bold' };
    } else if (diffDays === 1) {
      return { text: 'Yarın teslim', color: 'text-indigo-700 bg-indigo-50 border-indigo-200' };
    } else {
      return { text: `${diffDays} gün kaldı`, color: 'text-slate-600 bg-slate-100 border-slate-200' };
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <CheckSquare className="w-7 h-7 text-indigo-600" />
            Ödev & Görev Takibi
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            <span className="font-bold text-slate-800">{selectedStudent?.name}</span> öğrencisine özel ödevler, kaynaklar ve koç dönütleri.
          </p>
        </div>

        <button
          onClick={onOpenHomeworkModal}
          className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md shadow-indigo-200 transition active:scale-95 self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Yeni Ödev Ata</span>
        </button>
      </div>

      {/* Mini Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div
          onClick={() => setStatusFilter('ALL')}
          className={`p-4 rounded-2xl border transition cursor-pointer ${
            statusFilter === 'ALL'
              ? 'bg-indigo-50/70 border-indigo-300 ring-2 ring-indigo-500/20'
              : 'bg-white border-slate-200/80 hover:bg-slate-50'
          }`}
        >
          <span className="text-xs font-bold text-slate-500">Toplam Ödev</span>
          <p className="text-2xl font-black text-slate-900 mt-1">{studentHws.length}</p>
        </div>

        <div
          onClick={() => setStatusFilter('pending')}
          className={`p-4 rounded-2xl border transition cursor-pointer ${
            statusFilter === 'pending'
              ? 'bg-amber-50/70 border-amber-300 ring-2 ring-amber-500/20'
              : 'bg-white border-slate-200/80 hover:bg-slate-50'
          }`}
        >
          <span className="text-xs font-bold text-amber-700">Bekleyen</span>
          <p className="text-2xl font-black text-amber-900 mt-1">{pendingCount}</p>
        </div>

        <div
          onClick={() => setStatusFilter('completed')}
          className={`p-4 rounded-2xl border transition cursor-pointer ${
            statusFilter === 'completed'
              ? 'bg-emerald-50/70 border-emerald-300 ring-2 ring-emerald-500/20'
              : 'bg-white border-slate-200/80 hover:bg-slate-50'
          }`}
        >
          <span className="text-xs font-bold text-emerald-700">Tamamlanan</span>
          <p className="text-2xl font-black text-emerald-900 mt-1">{completedCount}</p>
        </div>

        <div
          onClick={() => setStatusFilter('incompleted')}
          className={`p-4 rounded-2xl border transition cursor-pointer ${
            statusFilter === 'incompleted'
              ? 'bg-rose-50/70 border-rose-300 ring-2 ring-rose-500/20'
              : 'bg-white border-slate-200/80 hover:bg-slate-50'
          }`}
        >
          <span className="text-xs font-bold text-rose-700">Eksik / Yapılmadı</span>
          <p className="text-2xl font-black text-rose-900 mt-1">{incompletedCount}</p>
        </div>
      </div>

      {/* Homework List */}
      <div className="space-y-4">
        {filteredHws.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-xs">
            <CheckSquare className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-700">Ödev Bulunamadı</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              Seçili filtreye ait ödev bulunamadı. "Yeni Ödev Ata" butonunu kullanarak ödev ekleyebilirsiniz.
            </p>
          </div>
        ) : (
          filteredHws.map((hw) => {
            const isDone = hw.status === 'completed' || hw.status === 'reviewed';
            const isMissing = hw.status === 'incompleted';
            const dueInfo = getDueDateLabel(hw.dueDate);

            return (
              <div
                key={hw.id}
                className={`bg-white rounded-3xl p-5 sm:p-6 border transition-all duration-200 shadow-xs ${
                  isDone
                    ? 'border-emerald-200/90 bg-emerald-50/10'
                    : isMissing
                    ? 'border-rose-200 bg-rose-50/10'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Left Info */}
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-extrabold px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-100">
                        {hw.subject}
                      </span>
                      <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2 py-1 rounded-lg">
                        🎯 {hw.targetCount} Soru
                      </span>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-lg border ${dueInfo.color}`}>
                        🗓️ {dueInfo.text} ({hw.dueDate})
                      </span>
                    </div>

                    <h3 className={`text-base font-bold text-slate-900 ${isDone ? 'line-through text-slate-400' : ''}`}>
                      {hw.title}
                    </h3>

                    {hw.source && (
                      <p className="text-xs text-slate-600 flex items-center gap-1.5">
                        <Book className="w-3.5 h-3.5 text-slate-400" />
                        <span className="font-medium">{hw.source}</span>
                      </p>
                    )}

                    {hw.studentNotes && (
                      <p className="text-xs text-slate-600 bg-slate-50 p-2 rounded-xl border border-slate-200 inline-block">
                        <span className="font-bold text-indigo-700">Öğrenci Notu:</span> {hw.studentNotes}
                      </p>
                    )}
                  </div>

                  {/* Right Status Actions */}
                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    <button
                      onClick={() => {
                        toggleHomeworkStatus(hw.id, 'completed');
                        triggerSuccessConfetti();
                      }}
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition ${
                        isDone
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700'
                      }`}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Tamamlandı</span>
                    </button>

                    <button
                      onClick={() => toggleHomeworkStatus(hw.id, 'incompleted')}
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition ${
                        isMissing
                          ? 'bg-rose-600 text-white shadow-xs'
                          : 'bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-700'
                      }`}
                    >
                      <AlertTriangle className="w-4 h-4" />
                      <span>Eksik / Yapılmadı</span>
                    </button>

                    <button
                      onClick={() => toggleHomeworkStatus(hw.id, 'pending')}
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition ${
                        hw.status === 'pending'
                          ? 'bg-amber-600 text-white shadow-xs'
                          : 'bg-slate-100 hover:bg-amber-50 text-slate-700 hover:text-amber-700'
                      }`}
                    >
                      <Clock className="w-4 h-4" />
                      <span>Bekliyor</span>
                    </button>

                    <button
                      onClick={() => {
                        if (confirm('Bu ödevi silmek istediğinize emin misiniz?')) {
                          deleteHomework(hw.id);
                        }
                      }}
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition ml-1"
                      title="Ödevi Sil"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Coach Feedback Box */}
                <div className="mt-4 pt-3 border-t border-slate-100">
                  {editingFeedbackId === hw.id ? (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={feedbackText}
                        onChange={(e) => setFeedbackText(e.target.value)}
                        placeholder="Örn: 2 yanlış soruyu beraber çözeceğiz..."
                        className="flex-1 px-3 py-1.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      />
                      <button
                        onClick={() => handleSaveFeedback(hw.id)}
                        className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition flex items-center gap-1"
                      >
                        <Send className="w-3 h-3" />
                        <span>Kaydet</span>
                      </button>
                      <button
                        onClick={() => setEditingFeedbackId(null)}
                        className="px-2 py-1.5 text-xs text-slate-500 hover:bg-slate-100 rounded-xl"
                      >
                        İptal
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between gap-2 text-xs">
                      <div className="flex items-center gap-2">
                        <MessageSquare className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                        <span className="text-slate-500 font-medium">Koç Değerlendirmesi:</span>
                        <span className="text-slate-800 italic">
                          {hw.coachFeedback || 'Henüz değerlendirme notu eklenmedi.'}
                        </span>
                      </div>
                      <button
                        onClick={() => {
                          setEditingFeedbackId(hw.id);
                          setFeedbackText(hw.coachFeedback || '');
                        }}
                        className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 underline shrink-0"
                      >
                        {hw.coachFeedback ? 'Düzenle' : 'Not Ekle'}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
