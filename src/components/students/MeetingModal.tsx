import React, { useState } from 'react';
import { MeetingNote } from '../../types';
import { X, Calendar, MessageSquare, Clock, Save } from 'lucide-react';

interface MeetingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Omit<MeetingNote, 'id'>) => void;
  studentId: string;
  studentName: string;
}

export const MeetingModal: React.FC<MeetingModalProps> = ({
  isOpen,
  onClose,
  onSave,
  studentId,
  studentName
}) => {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [durationMinutes, setDurationMinutes] = useState(45);
  const [keyPoints, setKeyPoints] = useState('');
  const [actionItems, setActionItems] = useState('');
  const [nextMeetingDate, setNextMeetingDate] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyPoints.trim()) return alert('Lütfen görüşme notlarını giriniz.');

    onSave({
      studentId,
      date,
      durationMinutes: Number(durationMinutes) || 40,
      keyPoints,
      actionItems,
      nextMeetingDate: nextMeetingDate || undefined
    });

    setKeyPoints('');
    setActionItems('');
    setNextMeetingDate('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-md w-full p-4 sm:p-6 shadow-2xl border border-slate-200 relative my-4 sm:my-8">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 sm:right-5 sm:top-5 p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">Koçluk Seans Notu</h2>
            <p className="text-xs text-slate-500">{studentName} ile birebir görüşme</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-sm">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Görüşme Tarihi</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Süre (Dk)</label>
              <input
                type="number"
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Görüşülen Konular & Analiz *
            </label>
            <textarea
              rows={3}
              required
              value={keyPoints}
              onChange={(e) => setKeyPoints(e.target.value)}
              placeholder="Hangi derste takılma var, zaman yönetimi, deneme stratejisi..."
              className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Alınan Kararlar & Aksiyon Maddeleri
            </label>
            <textarea
              rows={2}
              value={actionItems}
              onChange={(e) => setActionItems(e.target.value)}
              placeholder="Gelecek haftaya kadar tamamlanacak 3 kritik hedef..."
              className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Bir Sonraki Seans Tarihi
            </label>
            <input
              type="date"
              value={nextMeetingDate}
              onChange={(e) => setNextMeetingDate(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-300 text-slate-600 font-semibold hover:bg-slate-50 transition text-xs"
            >
              Vazgeç
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-md shadow-indigo-200 transition text-xs"
            >
              <Save className="w-4 h-4" />
              <span>Notu Kaydet</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
