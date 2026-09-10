import React from 'react';
import { useApp, ActiveTab } from '../../context/AppContext';
import {
  LayoutDashboard,
  Users,
  CheckSquare,
  Clock,
  TrendingUp,
  Sparkles,
  FileSpreadsheet,
  Target,
  Flame,
  Award
} from 'lucide-react';

interface SidebarProps {
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileMenuOpen, setMobileMenuOpen }) => {
  const { activeTab, setActiveTab, selectedStudent, homeworks, dailyLogs } = useApp();

  const menuItems: { id: ActiveTab; label: string; icon: React.ElementType; badge?: number | string }[] = [
    { id: 'dashboard', label: 'Genel Bakış', icon: LayoutDashboard },
    { id: 'students', label: 'Öğrenci Yönetimi', icon: Users },
    {
      id: 'homework',
      label: 'Ödev & Görevler',
      icon: CheckSquare,
      badge: selectedStudent
        ? homeworks.filter((h) => h.studentId === selectedStudent.id && h.status === 'pending').length
        : undefined
    },
    { id: 'tracker', label: 'Günlük Takip & Kronometre', icon: Clock },
    { id: 'exams', label: 'Deneme Netleri & Analiz', icon: TrendingUp },
    { id: 'motivation', label: 'Motivasyon & Rozetler', icon: Sparkles },
    { id: 'report', label: 'Haftalık Karne & Rapor', icon: FileSpreadsheet }
  ];

  // Calculate today's solved questions for active student
  const todayStr = new Date().toISOString().split('T')[0];
  const todayLogs = dailyLogs.filter(
    (l) => l.studentId === selectedStudent?.id && l.date === todayStr
  );
  const todayTotalSolved = todayLogs.reduce((acc, log) => {
    return acc + log.subjects.reduce((sAcc, s) => sAcc + (s.correct + s.wrong + s.empty), 0);
  }, 0);

  const dailyTarget = selectedStudent?.dailyTargetQuestions || 200;
  const progressPercent = Math.min(100, Math.round((todayTotalSolved / dailyTarget) * 100));

  const handleNavClick = (tabId: ActiveTab) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile backdrop */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-30 bg-slate-900/50 backdrop-blur-xs lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      <aside
        className={`fixed top-16 left-0 bottom-0 z-30 w-72 bg-white border-r border-slate-200 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          mobileMenuOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        } flex flex-col justify-between overflow-y-auto`}
      >
        <div className="p-4 space-y-6">
          {/* Active Student Mini Profile Card */}
          {selectedStudent && (
            <div className="bg-linear-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-4 shadow-md relative overflow-hidden">
              <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-indigo-500/10 rounded-full blur-xl pointer-events-none" />
              
              <div className="flex items-center gap-3">
                <img
                  src={selectedStudent.avatar}
                  alt={selectedStudent.name}
                  className="w-12 h-12 rounded-xl object-cover ring-2 ring-indigo-400/40"
                />
                <div className="overflow-hidden">
                  <h3 className="text-sm font-bold truncate leading-tight">{selectedStudent.name}</h3>
                  <span className="inline-block text-[11px] font-semibold text-indigo-300 bg-indigo-900/60 px-2 py-0.5 rounded mt-1">
                    {selectedStudent.examType}
                  </span>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-slate-800 text-xs space-y-1">
                <div className="flex items-center justify-between text-slate-300">
                  <span className="flex items-center gap-1">
                    <Target className="w-3.5 h-3.5 text-indigo-400" />
                    Hedef:
                  </span>
                  <span className="font-medium text-white truncate max-w-[130px]" title={selectedStudent.targetDepartment}>
                    {selectedStudent.targetDepartment}
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span className="flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5 text-amber-400" />
                    Seri (Streak):
                  </span>
                  <span className="font-bold text-amber-300">{selectedStudent.streak} Gün 🔥</span>
                </div>
              </div>

              {/* Mini Daily Progress Bar */}
              <div className="mt-3">
                <div className="flex justify-between text-[11px] font-medium text-slate-300 mb-1">
                  <span>Bugünkü Soru</span>
                  <span className="font-bold text-indigo-300">{todayTotalSolved} / {dailyTarget}</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-linear-to-r from-indigo-500 to-emerald-400 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            <div className="px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              Ana Menü
            </div>
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all group ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-5 h-5 transition-colors ${
                        isActive ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-600'
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && Number(item.badge) > 0 && (
                    <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-indigo-100 text-indigo-700">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Motivational Tip at Footer of Sidebar */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/70">
          <div className="flex items-start gap-2.5">
            <Award className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-slate-800">Koç Tavsiyesi</h4>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                Her gün yapılan 15 dakikalık soru analizi, haftalık 5 net artış sağlar!
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
