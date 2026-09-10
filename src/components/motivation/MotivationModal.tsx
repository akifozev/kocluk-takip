import React, { useState } from 'react';
import { MotivationMessage } from '../../types';
import { X, Sparkles, Send } from 'lucide-react';
import { triggerSuccessConfetti } from '../../utils/confetti';

interface MotivationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Omit<MotivationMessage, 'id' | 'date'>) => void;
}

export const MotivationModal: React.FC<MotivationModalProps> = ({ isOpen, onClose, onSave }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('Eğitim Koçu');
  const [category, setCategory] = useState<'focus' | 'stress' | 'grit' | 'success' | 'routine'>('grit');
  const [coachNote, setCoachNote] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return alert('Lütfen motivasyon mesajını yazınız.');

    onSave({
      title: title || 'Günün İlhamı',
      content,
      author: author || 'Koçunuz',
      category,
      coachNote: coachNote || undefined
    });

    triggerSuccessConfetti();
    setTitle('');
    setContent('');
    setCoachNote('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative my-8">
        <button
          onClick={onClose}
          className="absolute right-5 top-5 p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">Motivasyon Mesajı Paylaş</h2>
            <p className="text-xs text-slate-500">
              Öğrencilerinize ilham verecek bir söz veya haftanın tavsiyesini paylaşın
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-sm">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Başlık</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Örn: Asla Vazgeçmeyenler Kazanır"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Kategori</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 focus:outline-none bg-white"
              >
                <option value="grit">🔥 Azim & Kararlılık</option>
                <option value="focus">🎯 Odaklanma & Verim</option>
                <option value="stress">🧘 Stres & Sakinlik</option>
                <option value="success">🏆 Başarı & Hedef</option>
                <option value="routine">⏰ Rutin & Alışkanlık</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Söz Sahibi / Kaynak</label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Örn: Marcus Aurelius / Koçun"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Motivasyon Sözü *</label>
            <textarea
              rows={3}
              required
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="İlham verici sözü buraya yazın..."
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 focus:outline-none resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Koçun Öğrencilere Özel Ek Notu (İsteğe bağlı)
            </label>
            <textarea
              rows={2}
              value={coachNote}
              onChange={(e) => setCoachNote(e.target.value)}
              placeholder="Örn: Bu hafta zorlandığınız soruların üzerine cesaretle gidin..."
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 focus:outline-none resize-none"
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
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold shadow-md shadow-amber-200 transition"
            >
              <Send className="w-4 h-4" />
              <span>Yayınla & Paylaş</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
