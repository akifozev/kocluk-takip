import React, { useState, useEffect } from 'react';
import { GameStatus, HostInfo, HostType, Question } from './types/game';
import { HOSTS } from './data/hostLines';
import {
  getAllQuestions,
  getSavedHost,
  getSavedStats,
  recordGameResult,
  saveSelectedHost,
} from './utils/gameStorage';
import { MobileLayout } from './components/common/MobileLayout';
import { HomeScreen } from './components/screens/HomeScreen';
import { GameScreen } from './components/game/GameScreen';
import { GameOverScreen } from './components/screens/GameOverScreen';
import { VictoryScreen } from './components/screens/VictoryScreen';
import { QuestionBankScreen } from './components/screens/QuestionBankScreen';
import { StatsScreen } from './components/screens/StatsScreen';

export const App: React.FC = () => {
  const [status, setStatus] = useState<GameStatus>('menu');
  const [hostId, setHostId] = useState<HostType>(getSavedHost());
  const [questions, setQuestions] = useState<Question[]>([]);
  const [stats, setStats] = useState(getSavedStats());

  // Oyun sonu verileri
  const [amountWon, setAmountWon] = useState<number>(0);
  const [levelReached, setLevelReached] = useState<number>(1);
  const [gameExplanation, setGameExplanation] = useState<string | undefined>(undefined);

  // Oturum içi sayaçlar
  const [sessionCorrectCount, setSessionCorrectCount] = useState(0);
  const [sessionWrongCount, setSessionWrongCount] = useState(0);
  const [sessionLifelinesUsed, setSessionLifelinesUsed] = useState(0);

  useEffect(() => {
    setQuestions(getAllQuestions());
    setStats(getSavedStats());
  }, []);

  const currentHost: HostInfo = HOSTS[hostId] || HOSTS.kenan;

  const handleSelectHost = (newHost: HostType) => {
    setHostId(newHost);
    saveSelectedHost(newHost);
  };

  const handleStartGame = () => {
    setSessionCorrectCount(0);
    setSessionWrongCount(0);
    setSessionLifelinesUsed(0);
    setStatus('playing');
  };

  const handleGameOver = (
    won: number,
    finalLevel: number,
    explanation?: string
  ) => {
    setAmountWon(won);
    setLevelReached(finalLevel);
    setGameExplanation(explanation);

    const updated = recordGameResult(
      finalLevel,
      won,
      sessionCorrectCount,
      sessionWrongCount + 1,
      sessionLifelinesUsed
    );
    setStats(updated);
    setStatus('game_over');
  };

  const handleVictory = () => {
    setAmountWon(10000000);
    setLevelReached(15);
    const updated = recordGameResult(
      15,
      10000000,
      sessionCorrectCount + 1,
      sessionWrongCount,
      sessionLifelinesUsed
    );
    setStats(updated);
    setStatus('victory');
  };

  const handleAnswerLogged = (isCorrect: boolean) => {
    if (isCorrect) {
      setSessionCorrectCount((prev) => prev + 1);
    } else {
      setSessionWrongCount((prev) => prev + 1);
    }
  };

  const handleLifelineLogged = () => {
    setSessionLifelinesUsed((prev) => prev + 1);
  };

  return (
    <MobileLayout>
      {status === 'menu' && (
        <HomeScreen
          selectedHost={currentHost}
          onSelectHost={handleSelectHost}
          onStartGame={handleStartGame}
          onOpenQuestionBank={() => setStatus('question_bank')}
          onOpenStats={() => setStatus('stats')}
          stats={stats}
        />
      )}

      {status === 'playing' && (
        <GameScreen
          host={currentHost}
          allQuestions={questions}
          onGameOver={handleGameOver}
          onVictory={handleVictory}
          onExitToMenu={() => setStatus('menu')}
          onAnswerLogged={handleAnswerLogged}
          onLifelineLogged={handleLifelineLogged}
        />
      )}

      {status === 'game_over' && (
        <GameOverScreen
          amountWon={amountWon}
          levelReached={levelReached}
          explanation={gameExplanation}
          host={currentHost}
          onPlayAgain={handleStartGame}
          onHome={() => setStatus('menu')}
        />
      )}

      {status === 'victory' && (
        <VictoryScreen
          host={currentHost}
          onPlayAgain={handleStartGame}
          onHome={() => setStatus('menu')}
        />
      )}

      {status === 'question_bank' && (
        <QuestionBankScreen
          questions={questions}
          onBack={() => setStatus('menu')}
          onQuestionsUpdated={(updated) => setQuestions(updated)}
        />
      )}

      {status === 'stats' && (
        <StatsScreen stats={stats} onBack={() => setStatus('menu')} />
      )}
    </MobileLayout>
  );
};

export default App;
