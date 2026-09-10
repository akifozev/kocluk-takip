import React, { useState, useEffect, useRef } from 'react';
import { Student, ExamType } from '../../types';
import { X, UserPlus, Save, Upload, Trash2, Camera } from 'lucide-react';
import { Avatar } from '../common/Avatar';

interface StudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Omit<Student, 'id' | 'createdAt' | 'streak'>) => void;
  editingStudent?: Student | null;
}

export const StudentModal: React.FC<StudentModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingStudent
}) => {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [avatar, setAvatar] = useState('');
  const [phone, setPhone] = useState('');
  const [parentName, setParentName] = useState('');
  const [parentPhone, setParentPhone] = useState('');
  const [examType, setExamType] = useState<ExamType>('YKS-SAY');
  const [targetDepartment, setTargetDepartment] = useState('');
  const [targetRanking, setTargetRanking] = useState('');
  const [dailyTargetQuestions, setDailyTargetQuestions] = useState(200);
  const [weeklyTargetQuestions, setWeeklyTargetQuestions] = useState(1400);
  const [notes, setNotes] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert("Lütfen 5 MB'tan küçük bir fotoğraf seçin.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (evt) => {
      const result = evt.target?.result as string;
      if (result) setAvatar(result);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  useEffect(() => {
    if (editingStudent) {
      setName(editingStudent.name);
      setCode(editingStudent.code || editingStudent.name.split(' ')[0].toUpperCase());
      setAvatar(editingStudent.avatar || '');
      setPhone(editingStudent.phone);
      setParentName(editingStudent.parentName);
      setParentPhone(editingStudent.parentPhone);
      setExamType(editingStudent.examType);
      setTargetDepartment(editingStudent.targetDepartment);
      setTargetRanking(editingStudent.targetRanking);
      setDailyTargetQuestions(editingStudent.dailyTargetQuestions);
      setWeeklyTargetQuestions(editingStudent.weeklyTargetQuestions);
      setNotes(editingStudent.notes);
    } else {
      setName('');
      setCode('');
      setAvatar('');
      setPhone('');
      setParentName('');
      setParentPhone('');
      setExamType('YKS-SAY');
      setTargetDepartment('');
      setTargetRanking('');
      setDailyTargetQuestions(200);
      setWeeklyTargetQuestions(1400);
      setNotes('');
    }
  }, [editingStudent, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return alert('Lütfen öğrenci adını giriniz.');

    onSave({
      name,
      code: code.trim().toUpperCase() || name.split(' ')[0].toUpperCase(),
      avatar,
      phone,
      parentName,
      parentPhone,
      examType,
      targetDepartment,
      targetRanking,
      dailyTargetQuestions: Number(dailyTargetQuestions) || 150,
      weeklyTargetQuestions: Number(weeklyTargetQuestions) || 1000,
      notes
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full p-4 sm:p-8 shadow-2xl border border-slate-200 relative my-4 sm:my-8">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 sm:right-5 sm:top-5 p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <UserPlus className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              {editingStudent ? 'Öğrenci Profilini Düzenle' : 'Yeni Öğrenci Ekle'}
            </h2>
            <p className="text-xs text-slate-500">
              Öğrenci hedefleri, iletişim ve çalışma kotalarını belirleyin
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-sm">
          {/* Avatar Upload / Initial Preview */}
          <div className="flex items-center gap-4 p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
            <Avatar name={name || 'Öğrenci'} avatar={avatar} size="lg" />
            <div className="flex-1 min-w-0">
              <span className="block text-xs font-bold text-slate-800">Profil Fotoğrafı</span>
              <p className="text-[11px] text-slate-500 truncate">
                {avatar
                  ? 'Özel fotoğraf yüklendi'
                  : 'İsteğe bağlı. Fotoğraf yoksa baş harfler kullanılır.'}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleAvatarFileChange}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold transition shadow-2xs"
                >
                  <Upload className="w-3.5 h-3.5 text-indigo-600" />
                  <span>{avatar ? 'Fotoğrafı Değiştir' : 'Fotoğraf Yükle'}</span>
                </button>
                {avatar && (
                  <button
                    type="button"
                    onClick={() => setAvatar('')}
                    className="flex items-center gap-1 px-2.5 py-1.5 text-rose-600 hover:bg-rose-50 rounded-xl text-xs font-bold transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Kaldır</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Name, Code & Exam Type */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-1">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Öğrenci Adı Soyadı *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (!code) setCode(e.target.value.split(' ')[0].toUpperCase());
                }}
                placeholder="Örn: Zeynep Kaya"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Giriş Kodu (Şifre) *
              </label>
              <input
                type="text"
                required
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="Örn: ZEYNEP"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none font-bold text-indigo-700 uppercase"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Sınav / Alan *</label>
              <select
                value={examType}
                onChange={(e) => setExamType(e.target.value as ExamType)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white"
              >
                <option value="YKS-SAY">YKS - Sayısal</option>
                <option value="YKS-EA">YKS - Eşit Ağırlık</option>
                <option value="YKS-SOZ">YKS - Sözel</option>
                <option value="LGS">LGS</option>
                <option value="KPSS">KPSS</option>
                <option value="DGS">DGS</option>
                <option value="GENEL">Genel Okul / Diğer</option>
              </select>
            </div>
          </div>

          {/* Target Department & Ranking */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Hedef Bölüm / Okul</label>
              <input
                type="text"
                value={targetDepartment}
                onChange={(e) => setTargetDepartment(e.target.value)}
                placeholder="Örn: Hacettepe Tıp"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Hedef Sıralama</label>
              <input
                type="text"
                value={targetRanking}
                onChange={(e) => setTargetRanking(e.target.value)}
                placeholder="Örn: İlk 2.000 / %0.5"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Goals */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Günlük Soru Hedefi
              </label>
              <input
                type="number"
                value={dailyTargetQuestions}
                onChange={(e) => setDailyTargetQuestions(Number(e.target.value))}
                placeholder="200"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Haftalık Soru Hedefi
              </label>
              <input
                type="number"
                value={weeklyTargetQuestions}
                onChange={(e) => setWeeklyTargetQuestions(Number(e.target.value))}
                placeholder="1400"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Contact Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Öğrenci Telefonu</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="05XX XXX XX XX"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Veli Adı & Tel</label>
              <input
                type="text"
                value={parentName}
                onChange={(e) => setParentName(e.target.value)}
                placeholder="Örn: Ayşe Kaya (05XX...)"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Coach Notes */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Koç Özel Değerlendirme Notu
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Öğrencinin güçlü ve zayıf yönleri, dikkat edilecek konular..."
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none"
            />
          </div>

          {/* Action buttons */}
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
              <span>{editingStudent ? 'Değişiklikleri Kaydet' : 'Öğrenciyi Kaydet'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
