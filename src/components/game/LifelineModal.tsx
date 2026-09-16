import React, { useState } from 'react';
import { Question } from '../../types/game';
import { PhoneCall, Users, CheckCircle2, MessageSquare, Bot, User, Sparkles } from 'lucide-react';
import { audioManager } from '../../utils/audioManager';

interface LifelineModalProps {
  type: 'phone' | 'audience' | null;
  currentQuestion: Question;
  onClose: () => void;
}

export const LifelineModal: React.FC<LifelineModalProps> = ({
  type,
  currentQuestion,
  onClose,
}) => {
  if (!type) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-sm bg-slate-900 border-2 border-slate-700 rounded-3xl p-5 shadow-[0_20px_50px_rgba(0,0,0,0.8)] flex flex-col relative overflow-hidden">
        {type === 'phone' ? (
          <PhoneModalContent currentQuestion={currentQuestion} onClose={onClose} />
        ) : (
          <AudienceModalContent currentQuestion={currentQuestion} onClose={onClose} />
        )}
      </div>
    </div>
  );
};

// ================= TELEFON JOKERİ İÇERİĞİ =================
const PhoneModalContent: React.FC<{
  currentQuestion: Question;
  onClose: () => void;
}> = ({ currentQuestion, onClose }) => {
  const [selectedFriend, setSelectedFriend] = useState<string | null>(null);
  const [isCalling, setIsCalling] = useState(false);
  const [dialogue, setDialogue] = useState<string | null>(null);

  const friends = [
    {
      id: 'prof',
      name: 'Prof. Bilgin',
      role: 'Dahi Danışman',
      icon: <User className="w-5 h-5 text-sky-400" />,
      hintText: () => {
        const letters = ['A', 'B', 'C', 'D'];
        const correctLetter = letters[currentQuestion.correctAnswer];
        return `Kütüphanemdeki kaynaklara ve genel mantığa göre hiç şüphem yok, cevap kesinlikle ${correctLetter} şıkkı!`;
      },
    },
    {
      id: 'kanka',
      name: 'Kanka Burak',
      role: 'Mahalle Çocuğu',
      icon: <MessageSquare className="w-5 h-5 text-amber-400" />,
      hintText: () => {
        const letters = ['A', 'B', 'C', 'D'];
        const correctLetter = letters[currentQuestion.correctAnswer];
        return `Alo kanka! Valla bence ${correctLetter} gibi duruyor ama yanlış çıkarsa bana kızma, parayı kırışırız ona göre!`;
      },
    },
    {
      id: 'ai',
      name: 'Yapay Zeka (AI)',
      role: 'Süper Asistan',
      icon: <Bot className="w-5 h-5 text-emerald-400" />,
      hintText: () => {
        const letters = ['A', 'B', 'C', 'D'];
        const correctLetter = letters[currentQuestion.correctAnswer];
        return `Büyük dil modelleri ve veri tabanı taranıyor... %89 güven skoruyla doğru seçenek: ${correctLetter} şıkkı.`;
      },
    },
  ];

  const handleCall = (friendId: string) => {
    setSelectedFriend(friendId);
    setIsCalling(true);
    audioManager.playClick();

    setTimeout(() => {
      setIsCalling(false);
      const chosen = friends.find((f) => f.id === friendId);
      if (chosen) {
        setDialogue(chosen.hintText());
        audioManager.playLifeline();
      }
    }, 1500);
  };

  return (
    <div className="flex flex-col items-center text-center">
      {/* Başlık */}
      <div className="w-12 h-12 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 mb-3 shadow-inner">
        <PhoneCall className="w-6 h-6 animate-bounce" />
      </div>
      <h3 className="text-lg font-black text-slate-100 mb-1">
        Kimi Aramak İstiyorsun?
      </h3>
      <p className="text-xs text-slate-400 mb-4">
        Bir arkadaşını seç, sana 30 saniye içinde en iyi fikrini söylesin!
      </p>

      {!dialogue && !isCalling && (
        <div className="w-full flex flex-col gap-2.5 mb-4">
          {friends.map((friend) => (
            <button
              key={friend.id}
              onClick={() => handleCall(friend.id)}
              className="w-full p-3 rounded-2xl bg-slate-800/80 hover:bg-slate-750 border border-slate-700/80 hover:border-amber-400/50 flex items-center gap-3 transition-all cursor-pointer active:scale-95 group text-left"
            >
              <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center border border-slate-700 shrink-0">
                {friend.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-sm text-slate-200 group-hover:text-amber-400 transition-colors">
                  {friend.name}
                </div>
                <div className="text-xs text-slate-400 font-medium">
                  {friend.role}
                </div>
              </div>
              <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
                Ara
              </span>
            </button>
          ))}
        </div>
      )}

      {isCalling && (
        <div className="py-8 flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-amber-500/20 border border-amber-400 flex items-center justify-center mb-3 animate-pulse">
            <PhoneCall className="w-8 h-8 text-amber-400" />
          </div>
          <p className="text-sm font-bold text-slate-200">Bağlantı kuruluyor...</p>
          <span className="text-xs text-slate-400">Telefon çalıyor...</span>
        </div>
      )}

      {dialogue && (
        <div className="w-full bg-slate-800/90 border border-amber-500/40 rounded-2xl p-4 mb-4 text-left shadow-lg animate-fadeIn">
          <div className="flex items-center gap-2 mb-2 text-amber-400 text-xs font-bold">
            <Sparkles className="w-4 h-4" />
            <span>
              {friends.find((f) => f.id === selectedFriend)?.name} Konuşuyor:
            </span>
          </div>
          <p className="text-sm text-slate-100 font-semibold leading-relaxed">
            "{dialogue}"
          </p>
        </div>
      )}

      {dialogue && (
        <button
          onClick={onClose}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black text-sm tracking-wide shadow-md active:scale-95 transition-all cursor-pointer"
        >
          Teşekkürler, Oyuna Dön!
        </button>
      )}
    </div>
  );
};

// ================= SEYİRCİ JOKERİ İÇERİĞİ =================
const AudienceModalContent: React.FC<{
  currentQuestion: Question;
  onClose: () => void;
}> = ({ currentQuestion, onClose }) => {
  // Seyirci oyları üretimi (Doğru şıkka ağırlıklı %55-80 arası)
  const [votes] = useState(() => {
    const letters = ['A', 'B', 'C', 'D'];
    const correctIdx = currentQuestion.correctAnswer;
    const correctPct = Math.floor(Math.random() * 25) + 55; // 55% - 80%
    const remaining = 100 - correctPct;

    const r1 = Math.floor(Math.random() * (remaining - 4));
    const r2 = Math.floor(Math.random() * (remaining - r1 - 2));
    const r3 = remaining - r1 - r2;

    const otherPcts = [r1, r2, r3];
    let otherPtr = 0;

    return letters.map((letter, idx) => {
      let pct = 0;
      if (idx === correctIdx) {
        pct = correctPct;
      } else {
        pct = otherPcts[otherPtr++];
      }
      return { letter, pct };
    });
  });

  return (
    <div className="flex flex-col items-center text-center">
      <div className="w-12 h-12 rounded-full bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 mb-3 shadow-inner">
        <Users className="w-6 h-6 animate-pulse" />
      </div>

      <h3 className="text-lg font-black text-slate-100 mb-1">
        Seyircilerin Oylama Sonucu
      </h3>
      <p className="text-xs text-slate-400 mb-5">
        Stüdyodaki izleyiciler butonlarına bastı ve sonuçlar toplandı:
      </p>

      {/* Dikey Grafik Barları */}
      <div className="w-full flex items-end justify-around gap-2 h-44 px-2 py-3 bg-slate-950/70 border border-slate-800 rounded-2xl mb-5">
        {votes.map((item) => (
          <div key={item.letter} className="flex-1 flex flex-col items-center h-full justify-end">
            {/* Yüzde metni */}
            <span className="text-[11px] font-black text-amber-400 mb-1">
              %{item.pct}
            </span>

            {/* Bar */}
            <div className="w-full max-w-[36px] bg-slate-800 rounded-t-lg overflow-hidden flex flex-col justify-end">
              <div
                style={{ height: `${item.pct}%` }}
                className="w-full bg-gradient-to-t from-amber-600 via-amber-400 to-amber-300 rounded-t-lg transition-all duration-700 shadow-[0_0_10px_rgba(245,158,11,0.4)]"
              />
            </div>

            {/* Şık Harfi */}
            <span className="text-xs font-black text-slate-200 mt-2">
              {item.letter}
            </span>
          </div>
        ))}
      </div>

      <button
        onClick={onClose}
        className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-black text-sm tracking-wide shadow-md active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
      >
        <CheckCircle2 className="w-4 h-4" />
        Oyuna Dön
      </button>
    </div>
  );
};
