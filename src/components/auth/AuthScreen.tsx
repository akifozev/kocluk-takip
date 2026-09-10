import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  GraduationCap,
  User,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  KeyRound,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { triggerSuccessConfetti } from '../../utils/confetti';

interface AuthScreenProps {
  onSuccess: () => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onSuccess }) => {
  const { students, setSelectedStudentId, setViewRole } = useApp();
  const [tab, setTab] = useState<'student' | 'coach'>('student');
  const [studentCode, setStudentCode] = useState('');
  const [coachPin, setCoachPin] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const trimmed = studentCode.trim().toUpperCase();
    const found = students.find(
      (s) => s.code?.toUpperCase() === trimmed || s.name.toUpperCase().includes(trimmed)
    );

    if (found) {
      setSelectedStudentId(found.id);
      setViewRole('student');
      localStorage.setItem('coach_track_student_code', found.code);
      triggerSuccessConfetti();
      onSuccess();
    } else {
      setErrorMsg('Bu koda sahip bir öğrenci bulunamadı. Lütfen koçunuzun verdiği kodu girin.');
    }
  };

  const handleCoachSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    // Default pin 1234
    if (coachPin === '1234' || coachPin === 'admin') {
      setViewRole('coach');
      localStorage.setItem('coach_track_is_coach', 'true');
      triggerSuccessConfetti();
      onSuccess();
    } else {
      setErrorMsg('Hatalı Koç Şifresi! (Varsayılan şifre: 1234)');
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-950 via-slate-900 to-violet-950 flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Background Decorative Blur Circles */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-violet-500/20 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-white/95 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20 relative z-10 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-3xl bg-linear-to-tr from-indigo-600 to-violet-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-indigo-500/30">
            <GraduationCap className="w-9 h-9" />
          </div>
          <h1 className="text-2xl font-black bg-linear-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
            CoachTrack Pro
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Öğrenci Koçluğu & Günlük Hedef Takip Platformu
          </p>
        </div>

        {/* Role Tab Switcher */}
        <div className="grid grid-cols-2 p-1.5 bg-slate-100 rounded-2xl text-xs font-bold text-slate-600">
          <button
            type="button"
            onClick={() => {
              setTab('student');
              setErrorMsg('');
            }}
            className={`py-2.5 rounded-xl transition flex items-center justify-center gap-1.5 ${
              tab === 'student'
                ? 'bg-white text-indigo-700 shadow-sm font-extrabold'
                : 'hover:text-slate-900'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Öğrenci Girişi</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setTab('coach');
              setErrorMsg('');
            }}
            className={`py-2.5 rounded-xl transition flex items-center justify-center gap-1.5 ${
              tab === 'coach'
                ? 'bg-white text-violet-700 shadow-sm font-extrabold'
                : 'hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Koç Girişi</span>
          </button>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-2 text-xs font-semibold text-rose-700">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Student Form */}
        {tab === 'student' ? (
          <form onSubmit={handleStudentSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Öğrenci Kodunuz veya Adınız
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={studentCode}
                  onChange={(e) => setStudentCode(e.target.value)}
                  placeholder="Örn: ZEYNEP veya EMRE"
                  className="w-full px-4 py-3 rounded-2xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm font-semibold uppercase tracking-wider"
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1.5">
                💡 Koçunuzun size verdiği tek kelimelik kodu giriniz.
              </p>
            </div>

            {/* Quick Demo Student Pills */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold text-slate-400">Hızlı Test İçin Öğrenci Seç:</span>
              <div className="flex flex-wrap gap-1.5">
                {students.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setStudentCode(s.code || s.name)}
                    className="px-2.5 py-1 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 rounded-lg text-xs font-semibold border border-slate-200 transition"
                  >
                    {s.name.split(' ')[0]} ({s.code})
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-sm shadow-lg shadow-indigo-200 transition flex items-center justify-center gap-2 active:scale-95"
            >
              <span>Öğrenci Paneline Gir</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        ) : (
          /* Coach Form */
          <form onSubmit={handleCoachSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Koç Giriş Şifresi
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={coachPin}
                  onChange={(e) => setCoachPin(e.target.value)}
                  placeholder="••••"
                  className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-300 focus:ring-2 focus:ring-violet-500 focus:outline-none text-sm font-bold tracking-widest"
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1.5">
                🔒 Varsayılan Koç Şifresi: <b className="text-slate-700">1234</b>
              </p>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-4 rounded-2xl bg-violet-600 hover:bg-violet-700 text-white font-black text-sm shadow-lg shadow-violet-200 transition flex items-center justify-center gap-2 active:scale-95"
            >
              <span>Koç Yönetim Paneline Gir</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        <div className="text-center pt-2 border-t border-slate-100">
          <span className="text-[11px] text-slate-400 font-medium">
            100% Ücretsiz • Her Yerden ve Tüm Cihazlardan Kullanılabilir
          </span>
        </div>
      </div>
    </div>
  );
};
