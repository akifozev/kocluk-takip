import React, { useState, useEffect } from 'react';
import { HostInfo, LifelineState, LifelineType, Question } from '../../types/game';
import { PRIZE_LADDER, getGuaranteedAmount, getWalkAwayAmount } from '../../data/ladder';
import { getRandomLine } from '../../data/hostLines';
import { audioManager } from '../../utils/audioManager';
import { SoundToggle } from '../common/SoundToggle';
import { HostDialog } from './HostDialog';
import { QuestionCard } from './QuestionCard';
import { OptionButton, OptionStatus } from './OptionButton';
import { LifelineBar } from './LifelineBar';
import { LifelineModal } from './LifelineModal';
import { MoneyLadder } from './MoneyLadder';
import { Trophy, LogOut, CheckCircle, AlertTriangle } from 'lucide-react';

interface GameScreenProps {
  host: HostInfo;
  allQuestions: Question[];
  onGameOver: (amountWon: number, levelReached: number, explanation?: string) => void;
  onVictory: () => void;
  onExitToMenu: () => void;
  onAnswerLogged: (isCorrect: boolean) => void;
  onLifelineLogged: () => void;
}

export const GameScreen: React.FC<GameScreenProps> = ({
  host,
  allQuestions,
  onGameOver,
  onVictory,
  onExitToMenu,
  onAnswerLogged,
  onLifelineLogged,
}) => {
  const [level, setLevel] = useState(1);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isLocked, setIsLocked] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);
  const [eliminatedIndices, setEliminatedIndices] = useState<number[]>([]);

  // Joker Durumları
  const [lifelines, setLifelines] = useState<LifelineState>({
    fifty: true,
    phone: true,
    audience: true,
    change: true,
    double: true,
  });
  const [activeModal, setActiveModal] = useState<'phone' | 'audience' | null>(null);
  const [isLadderOpen, setIsLadderOpen] = useState(false);
  const [isDoubleChanceActive, setIsDoubleChanceActive] = useState(false);
  const [doubleChanceUsedFirstTry, setDoubleChanceUsedFirstTry] = useState(false);

  // Sunucu Replikleri
  const [hostSpeech, setHostSpeech] = useState<string>('');
  const [isWalkAwayConfirmOpen, setIsWalkAwayConfirmOpen] = useState(false);

  // Seviyeye uygun soru seçimi
  const pickQuestionForLevel = (targetLevel: number): Question => {
    const candidates = allQuestions.filter((q) => q.level === targetLevel);
    if (candidates.length > 0) {
      const randomIndex = Math.floor(Math.random() * candidates.length);
      return candidates[randomIndex];
    }
    // Fallback if no specific question
    return allQuestions[0];
  };

  // Yeni soru yüklendiğinde
  useEffect(() => {
    const q = pickQuestionForLevel(level);
    setCurrentQuestion(q);
    setSelectedIndex(null);
    setIsLocked(false);
    setIsRevealed(false);
    setEliminatedIndices([]);
    setIsDoubleChanceActive(false);
    setDoubleChanceUsedFirstTry(false);

    // Sunucu repliği ve gerilim sesi
    setHostSpeech(getRandomLine(host.id, 'onQuestion'));
    audioManager.startTension(level);

    return () => {
      audioManager.stopTension();
    };
  }, [level]);

  if (!currentQuestion) return null;

  const currentStep = PRIZE_LADDER.find((s) => s.level === level) || PRIZE_LADDER[PRIZE_LADDER.length - 1];
  const walkAwayAmount = getWalkAwayAmount(level);

  // Şık tıklama
  const handleSelectOption = (index: number) => {
    if (isLocked || eliminatedIndices.includes(index)) return;

    audioManager.playClick();
    setSelectedIndex(index);
    setHostSpeech(getRandomLine(host.id, 'onSelect'));
  };

  // Cevabı Onaylama ("Son Kararım!")
  const handleConfirmAnswer = () => {
    if (selectedIndex === null || isLocked) return;

    setIsLocked(true);
    audioManager.playLockIn();
    setHostSpeech('Cevabın kilitlendi... Bakalım doğru mu?');

    // 1.2 saniye gerilim bekleyişi
    setTimeout(() => {
      setIsRevealed(true);
      const isCorrect = selectedIndex === currentQuestion.correctAnswer;

      if (isCorrect) {
        // DOĞRU CEVAP
        audioManager.playCorrect();
        onAnswerLogged(true);

        if (level === 15) {
          // BÜYÜK ZAFER (10 MİLYON TL)
          setHostSpeech('İNANILMAZ! 10 MİLYON TL KAZANDIN! ŞAMPİYONSUN!');
          setTimeout(() => {
            onVictory();
          }, 1800);
        } else {
          // Bir sonraki seviyeye geçiş
          const isNextMilestone = currentStep.isMilestone;
          setHostSpeech(
            isNextMilestone
              ? getRandomLine(host.id, 'onMilestone')
              : getRandomLine(host.id, 'onCorrect')
          );

          setTimeout(() => {
            setLevel((prev) => prev + 1);
          }, 2000);
        }
      } else {
        // YANLIŞ CEVAP
        onAnswerLogged(false);

        // Çift Cevap Jokeri Kontrolü
        if (isDoubleChanceActive && !doubleChanceUsedFirstTry) {
          audioManager.playWrong();
          setDoubleChanceUsedFirstTry(true);
          setEliminatedIndices((prev) => [...prev, selectedIndex]);
          setSelectedIndex(null);
          setIsLocked(false);
          setIsRevealed(false);
          setHostSpeech('Çift cevap hakkın sayesinde elenmedin! Şimdi kalan şıklardan birini seç.');
          return;
        }

        audioManager.playWrong();
        setHostSpeech(getRandomLine(host.id, 'onWrong'));

        setTimeout(() => {
          const guaranteed = getGuaranteedAmount(level);
          onGameOver(guaranteed, level, currentQuestion.explanation);
        }, 2200);
      }
    }, 1300);
  };

  // Jokerleri Yönetme
  const handleUseLifeline = (type: LifelineType) => {
    if (isLocked) return;
    onLifelineLogged();

    if (type === 'fifty') {
      setLifelines((prev) => ({ ...prev, fifty: false }));
      // 2 yanlış şıkkı tespit et ve ele
      const wrongIndices = [0, 1, 2, 3].filter(
        (idx) => idx !== currentQuestion.correctAnswer
      );
      // Karıştırıp ilk 2 tanesini al
      const shuffled = wrongIndices.sort(() => 0.5 - Math.random());
      const toEliminate = shuffled.slice(0, 2);
      setEliminatedIndices(toEliminate);
      setHostSpeech('Yarı yarıya jokeri kullanıldı! 2 yanlış şık silindi.');
    } else if (type === 'phone') {
      setLifelines((prev) => ({ ...prev, phone: false }));
      setActiveModal('phone');
    } else if (type === 'audience') {
      setLifelines((prev) => ({ ...prev, audience: false }));
      setActiveModal('audience');
    } else if (type === 'change') {
      setLifelines((prev) => ({ ...prev, change: false }));
      // Aynı seviyede farklı bir soru bul
      const alternatives = allQuestions.filter(
        (q) => q.level === level && q.id !== currentQuestion.id
      );
      if (alternatives.length > 0) {
        const nextQ = alternatives[Math.floor(Math.random() * alternatives.length)];
        setCurrentQuestion(nextQ);
      } else {
        // Fallback
        setCurrentQuestion({ ...currentQuestion });
      }
      setSelectedIndex(null);
      setEliminatedIndices([]);
      setHostSpeech('Soru değiştirildi! Yeni bir şans, bol şans.');
    } else if (type === 'double') {
      setLifelines((prev) => ({ ...prev, double: false }));
      setIsDoubleChanceActive(true);
      setHostSpeech('Çift cevap jokeri aktif! Bu soruda bir kez hata yapma lüksün var.');
    }
  };

  // Çekilme Onayı
  const handleConfirmWalkAway = () => {
    setIsWalkAwayConfirmOpen(false);
    audioManager.stopTension();
    setHostSpeech(getRandomLine(host.id, 'onWalkAway'));
    setTimeout(() => {
      onGameOver(walkAwayAmount, level, 'Yarışmadan kendi isteğinle çekildin.');
    }, 800);
  };

  return (
    <div className="flex-1 flex flex-col justify-between p-3 sm:p-4 max-w-md mx-auto w-full relative">
      {/* ÜST BAR: Çekil, Ödül Merdiveni ve Ses Kontrolleri */}
      <div className="flex items-center justify-between gap-2 shrink-0 mb-1">
        {/* Çekil Butonu */}
        <button
          onClick={() => setIsWalkAwayConfirmOpen(true)}
          disabled={isLocked || level <= 1}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-800/80 hover:bg-rose-900/40 border border-slate-700 hover:border-rose-500/50 text-slate-300 hover:text-rose-300 text-xs font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer active:scale-95 shadow"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Çekil ({walkAwayAmount.toLocaleString('tr-TR')} ₺)</span>
        </button>

        {/* Sağ Düğmeler (Merdiven & Ses) */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsLadderOpen(true)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-400 text-xs font-black transition active:scale-95 cursor-pointer shadow"
          >
            <Trophy className="w-3.5 h-3.5" />
            <span>Merdiven</span>
          </button>
          <SoundToggle />
        </div>
      </div>

      {/* SUNUCU REPLİK DİYALOĞU */}
      <div className="shrink-0 my-1">
        <HostDialog host={host} speech={hostSpeech} isPondering={isLocked} />
      </div>

      {/* JOKERLER ÇUBUĞU */}
      <div className="shrink-0 my-1">
        <LifelineBar
          lifelines={lifelines}
          disabled={isLocked}
          onUseLifeline={handleUseLifeline}
        />
        {isDoubleChanceActive && (
          <div className="text-center text-[10px] text-emerald-400 font-bold mt-1 animate-pulse">
            🛡️ Çift Cevap Jokeri Aktif
          </div>
        )}
      </div>

      {/* SORU KARTI */}
      <div className="my-auto py-1">
        <QuestionCard
          level={level}
          prizeAmount={currentStep.formattedAmount}
          category={currentQuestion.category}
          question={currentQuestion.question}
          isMilestone={currentStep.isMilestone}
        />
      </div>

      {/* ŞIKLAR ALANI (A, B, C, D) */}
      <div className="flex flex-col gap-2 shrink-0 mt-auto pt-1">
        {currentQuestion.options.map((optionText, idx) => {
          const label = (['A', 'B', 'C', 'D'] as const)[idx];
          let status: OptionStatus = 'idle';

          if (eliminatedIndices.includes(idx)) {
            status = 'eliminated';
          } else if (isRevealed) {
            if (idx === currentQuestion.correctAnswer) {
              status = 'correct';
            } else if (idx === selectedIndex) {
              status = 'wrong';
            }
          } else if (selectedIndex === idx) {
            status = 'selected';
          }

          return (
            <OptionButton
              key={idx}
              label={label}
              text={optionText}
              status={status}
              disabled={isLocked}
              onClick={() => handleSelectOption(idx)}
            />
          );
        })}
      </div>

      {/* KİLİTLE / SON KARARIM BUTONU */}
      {selectedIndex !== null && !isLocked && (
        <div className="shrink-0 pt-2 animate-fadeIn">
          <button
            onClick={handleConfirmAnswer}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-slate-950 font-black text-sm uppercase tracking-wider shadow-[0_0_25px_rgba(245,158,11,0.6)] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer border-2 border-amber-200"
          >
            <CheckCircle className="w-5 h-5" />
            <span>Son Kararım! (Cevabı Kilitle)</span>
          </button>
        </div>
      )}

      {/* JOKER MODALI (Telefon / Seyirci) */}
      <LifelineModal
        type={activeModal}
        currentQuestion={currentQuestion}
        onClose={() => setActiveModal(null)}
      />

      {/* ÖDÜL MERDİVENİ MODALI */}
      <MoneyLadder
        currentLevel={level}
        isOpen={isLadderOpen}
        onClose={() => setIsLadderOpen(false)}
      />

      {/* ÇEKİLME ONAY MODALI */}
      {isWalkAwayConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-sm bg-slate-900 border-2 border-slate-700 rounded-3xl p-5 shadow-2xl text-center">
            <div className="w-12 h-12 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-400 flex items-center justify-center mx-auto mb-3">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black text-slate-100 mb-1">
              Yarışmadan Çekilmek İstiyor Musun?
            </h3>
            <p className="text-xs text-slate-300 mb-4">
              Şu ana kadar kazandığın{' '}
              <span className="text-amber-400 font-extrabold text-sm">
                {walkAwayAmount.toLocaleString('tr-TR')} ₺
              </span>{' '}
              ödülü alarak güvenle ayrılabilirsin. Yanlış cevap verirsen ödülün düşebilir!
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setIsWalkAwayConfirmOpen(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs cursor-pointer"
              >
                Yarışmaya Devam
              </button>
              <button
                onClick={handleConfirmWalkAway}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 text-white font-black text-xs cursor-pointer shadow"
              >
                Parayı Al ve Çekil
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
