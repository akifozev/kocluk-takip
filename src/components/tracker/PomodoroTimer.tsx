import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Clock, Coffee, Sparkles } from 'lucide-react';
import { triggerSuccessConfetti } from '../../utils/confetti';

interface PomodoroTimerProps {
  onSessionComplete?: (minutes: number) => void;
}

export const PomodoroTimer: React.FC<PomodoroTimerProps> = ({ onSessionComplete }) => {
  const [mode, setMode] = useState<'focus' | 'break'>('focus');
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const timerRef = useRef<any>(null);

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setIsRunning(false);
            handleFinishSession();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isRunning]);

  const handleFinishSession = () => {
    triggerSuccessConfetti();
    if (mode === 'focus') {
      alert('🎉 Tebrikler! 25 dakikalık odaklanma seansını tamamladın!');
      if (onSessionComplete) onSessionComplete(25);
      setMode('break');
      setTimeLeft(5 * 60);
    } else {
      alert('☕ Mola bitti! Yeni bir odaklanma seansına hazır mısın?');
      setMode('focus');
      setTimeLeft(25 * 60);
    }
  };

  const toggleTimer = () => setIsRunning(!isRunning);

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(mode === 'focus' ? 25 * 60 : 5 * 60);
  };

  const switchMode = (newMode: 'focus' | 'break') => {
    setIsRunning(false);
    setMode(newMode);
    setTimeLeft(newMode === 'focus' ? 25 * 60 : 5 * 60);
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const totalDuration = mode === 'focus' ? 25 * 60 : 5 * 60;
  const progressPercent = ((totalDuration - timeLeft) / totalDuration) * 100;

  return (
    <div className="bg-linear-to-br from-indigo-900 to-slate-900 text-white rounded-3xl p-6 sm:p-7 shadow-lg relative overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-indigo-400" />
          <h3 className="font-bold text-sm sm:text-base">Pomodoro Odaklanma Sayacı</h3>
        </div>

        {/* Mode Selector */}
        <div className="flex bg-white/10 p-1 rounded-xl text-xs font-semibold backdrop-blur-md">
          <button
            onClick={() => switchMode('focus')}
            className={`px-3 py-1 rounded-lg transition ${
              mode === 'focus' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-300 hover:text-white'
            }`}
          >
            Odaklan (25dk)
          </button>
          <button
            onClick={() => switchMode('break')}
            className={`flex items-center gap-1 px-3 py-1 rounded-lg transition ${
              mode === 'break' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-300 hover:text-white'
            }`}
          >
            <Coffee className="w-3 h-3" />
            Mola (5dk)
          </button>
        </div>
      </div>

      {/* Timer Display */}
      <div className="flex flex-col items-center justify-center my-6 space-y-2">
        <div className="text-5xl sm:text-6xl font-black tracking-widest font-mono text-white drop-shadow-md">
          {formattedTime}
        </div>
        <p className="text-xs text-indigo-200 font-medium">
          {mode === 'focus' ? '🎯 Derin Odaklanma Modu' : '☕ Zihnini Dinlendir'}
        </p>

        {/* Progress Bar */}
        <div className="w-full max-w-xs bg-white/10 rounded-full h-2 mt-4 overflow-hidden">
          <div
            className={`h-2 rounded-full transition-all duration-1000 ${
              mode === 'focus' ? 'bg-indigo-400' : 'bg-emerald-400'
            }`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-3">
        <button
          onClick={toggleTimer}
          className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm shadow-md transition active:scale-95 ${
            isRunning
              ? 'bg-amber-500 hover:bg-amber-600 text-slate-900'
              : 'bg-white hover:bg-indigo-50 text-indigo-900'
          }`}
        >
          {isRunning ? (
            <>
              <Pause className="w-4 h-4" />
              <span>Durdur</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-indigo-900" />
              <span>Başlat</span>
            </>
          )}
        </button>

        <button
          onClick={resetTimer}
          className="p-3 rounded-2xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition"
          title="Sıfırla"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
