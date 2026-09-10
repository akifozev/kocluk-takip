import React, { useRef } from 'react';
import { useApp } from '../../context/AppContext';
import {
  GraduationCap,
  Flame,
  UserCheck,
  User,
  Download,
  Upload,
  RotateCcw,
  Sparkles,
  Menu,
  X,
  LogOut
} from 'lucide-react';

interface NavbarProps {
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ mobileMenuOpen, setMobileMenuOpen }) => {
  const {
    students,
    selectedStudentId,
    setSelectedStudentId,
    selectedStudent,
    viewRole,
    setViewRole,
    exportData,
    importData,
    resetToDefaults,
    logout
  } = useApp();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const content = evt.target?.result as string;
      if (content) {
        const success = importData(content);
        if (success) {
          alert('Yedek başarıyla yüklendi!');
        } else {
          alert('Yedek dosyası okunamadı veya hatalı format!');
        }
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand and Mobile Toggle */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 focus:outline-none"
              aria-label="Menüyü Aç"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-linear-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-200">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xl font-extrabold bg-linear-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                  CoachTrack
                </span>
                <span className="text-xs font-semibold uppercase tracking-wider text-violet-600 ml-1 px-1.5 py-0.5 bg-violet-50 rounded-md">
                  Pro
                </span>
              </div>
            </div>
          </div>

          {/* Center: Selected Student Dropdown */}
          <div className="hidden md:flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 shadow-xs">
            <span className="text-xs font-medium text-slate-500">Aktif Öğrenci:</span>
            <select
              value={selectedStudentId}
              onChange={(e) => setSelectedStudentId(e.target.value)}
              className="bg-transparent text-sm font-semibold text-slate-800 focus:outline-none cursor-pointer pr-2"
            >
              {students.map((st) => (
                <option key={st.id} value={st.id}>
                  {st.name} ({st.examType})
                </option>
              ))}
            </select>

            {selectedStudent && (
              <div className="flex items-center gap-1.5 pl-2 border-l border-slate-200">
                <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200/60">
                  <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  {selectedStudent.streak} Gün
                </span>
              </div>
            )}
          </div>

          {/* Right: Role Switcher & Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Role Switcher Pill */}
            <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-semibold">
              <button
                onClick={() => setViewRole('coach')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                  viewRole === 'coach'
                    ? 'bg-white text-indigo-600 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Koç Paneli</span>
              </button>
              <button
                onClick={() => setViewRole('student')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                  viewRole === 'student'
                    ? 'bg-white text-violet-600 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Öğrenci Portalı</span>
              </button>
            </div>

            {/* Export / Backup dropdown or buttons */}
            <div className="hidden xl:flex items-center gap-1">
              <button
                onClick={exportData}
                title="Verileri Dışa Aktar (JSON Yedek)"
                className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition"
              >
                <Download className="w-4 h-4" />
              </button>

              <button
                onClick={() => fileInputRef.current?.click()}
                title="Yedek Yükle"
                className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition"
              >
                <Upload className="w-4 h-4" />
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".json"
                className="hidden"
              />

              <button
                onClick={resetToDefaults}
                title="Varsayılan Verilere Sıfırla"
                className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            {/* Daily Motivation Quick Badge */}
            <div className="hidden lg:flex items-center gap-1 text-xs font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200/70 px-3 py-1.5 rounded-xl">
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
              <span>Günün İlhamı Aktif</span>
            </div>

            {/* Logout / Switch Role */}
            <button
              onClick={logout}
              title="Giriş Ekranına Dön / Çıkış"
              className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition flex items-center gap-1 text-xs font-bold"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Çıkış</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
