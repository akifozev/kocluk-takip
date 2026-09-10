import React from 'react';
import { X, Smartphone, Share2, PlusSquare, ArrowDown } from 'lucide-react';

interface InstallPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInstallAndroid?: () => void;
  canInstallDirectly?: boolean;
}

export const InstallPromptModal: React.FC<InstallPromptModalProps> = ({
  isOpen,
  onClose,
  onInstallAndroid,
  canInstallDirectly
}) => {
  if (!isOpen) return null;

  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-xs p-4">
      <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 relative space-y-4">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Smartphone className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-black text-slate-900">Uygulamayı Telefona Ekle</h3>
            <p className="text-xs text-slate-500">Ana ekranınızdan tek tıkla açın</p>
          </div>
        </div>

        {canInstallDirectly ? (
          <div className="space-y-3 pt-2">
            <p className="text-xs text-slate-600 leading-relaxed">
              Telefonunuza tam ekran uygulama olarak yüklemek için aşağıdaki butona dokunun:
            </p>
            <button
              onClick={onInstallAndroid}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-2xl shadow-md transition"
            >
              Uygulamayı Şimdi Yükle
            </button>
          </div>
        ) : isIOS ? (
          <div className="space-y-3 text-xs text-slate-700 pt-1">
            <div className="p-3.5 bg-indigo-50/70 rounded-2xl border border-indigo-100 space-y-2.5">
              <div className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center shrink-0 text-[11px]">
                  1
                </span>
                <p>
                  Safari'nin altındaki <b>Paylaş</b> (kare içinde yukarı ok ⬆️) simgesine dokunun.
                </p>
              </div>

              <div className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center shrink-0 text-[11px]">
                  2
                </span>
                <p>
                  Açılan menüde aşağı kaydırıp <b>"Ana Ekrana Ekle"</b> (➕) seçeneğine tıklayın.
                </p>
              </div>

              <div className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center shrink-0 text-[11px]">
                  3
                </span>
                <p>
                  Sağ üstteki <b>"Ekle"</b>ye dokunun. Artık telefonunuzda hazır! 🎉
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-3 text-xs text-slate-700 pt-1">
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <p><b>Android / Chrome Kullanıcıları:</b></p>
              <p>1. Tarayıcının sağ üstündeki <b>üç noktaya (⋮)</b> dokunun.</p>
              <p>2. <b>"Uygulamayı yükle"</b> veya <b>"Ana ekrana ekle"</b> seçeneğini seçin.</p>
            </div>
          </div>
        )}

        <button
          onClick={onClose}
          className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition"
        >
          Anladım, Kapat
        </button>
      </div>
    </div>
  );
};
