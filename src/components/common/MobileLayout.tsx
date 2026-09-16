import React from 'react';

interface MobileLayoutProps {
  children: React.ReactNode;
}

export const MobileLayout: React.FC<MobileLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-[100dvh] w-full bg-slate-950 flex items-center justify-center font-sans overflow-x-hidden relative selection:bg-amber-500 selection:text-slate-950">
      {/* Arka Plan Atmosferi - Milyoner Stüdyosu Neon Işıkları */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-blue-600/15 rounded-full blur-[120px]" />
        <div className="absolute top-1/3 -left-32 w-80 h-80 bg-amber-500/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-10 -right-20 w-96 h-96 bg-purple-600/15 rounded-full blur-[110px]" />
        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-25" />
      </div>

      {/* Mobil Cihaz Çerçevesi (Masaüstünde telefon gibi, mobilde tam ekran) */}
      <main className="w-full sm:max-w-[430px] h-[100dvh] sm:h-[880px] sm:max-h-[92vh] sm:rounded-[40px] sm:border-[4px] sm:border-slate-800/80 bg-slate-900/95 sm:shadow-[0_25px_70px_rgba(0,0,0,0.8),0_0_40px_rgba(59,130,246,0.15)] flex flex-col relative z-10 overflow-hidden backdrop-blur-xl">
        {/* iOS Stil Dinamik Ada / Çentik Çubuğu (Masaüstü önizleme için) */}
        <div className="hidden sm:flex justify-center pt-2 pb-1 shrink-0">
          <div className="w-24 h-4 bg-slate-950 rounded-full border border-slate-800/50" />
        </div>

        {/* Ana Oyun İçeriği */}
        <div className="flex-1 flex flex-col overflow-hidden relative">
          {children}
        </div>
      </main>
    </div>
  );
};
