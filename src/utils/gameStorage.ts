import { GameStats, HostType, Question } from '../types/game';
import { INITIAL_QUESTIONS } from '../data/questions';

const STATS_KEY = 'milyoner_stats_v1';
const HOST_KEY = 'milyoner_selected_host';
const CUSTOM_QUESTIONS_KEY = 'milyoner_custom_questions';

export const getSavedStats = (): GameStats => {
  const saved = localStorage.getItem(STATS_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      // fallback
    }
  }
  return {
    totalGames: 0,
    highestLevel: 1,
    totalWon: 0,
    highestWon: 0,
    correctAnswersCount: 0,
    wrongAnswersCount: 0,
    lifelinesUsedCount: 0,
  };
};

export const saveStats = (stats: GameStats) => {
  localStorage.setItem(STATS_KEY, JSON.stringify(stats));
};

export const recordGameResult = (
  finalLevel: number,
  wonAmount: number,
  correctCount: number,
  wrongCount: number,
  lifelinesUsed: number
): GameStats => {
  const current = getSavedStats();
  const updated: GameStats = {
    totalGames: current.totalGames + 1,
    highestLevel: Math.max(current.highestLevel, finalLevel),
    totalWon: current.totalWon + wonAmount,
    highestWon: Math.max(current.highestWon, wonAmount),
    correctAnswersCount: current.correctAnswersCount + correctCount,
    wrongAnswersCount: current.wrongAnswersCount + wrongCount,
    lifelinesUsedCount: current.lifelinesUsedCount + lifelinesUsed,
  };
  saveStats(updated);
  return updated;
};

export const getSavedHost = (): HostType => {
  const saved = localStorage.getItem(HOST_KEY);
  if (saved === 'kenan' || saved === 'kanka' || saved === 'prof') {
    return saved as HostType;
  }
  return 'kenan';
};

export const saveSelectedHost = (host: HostType) => {
  localStorage.setItem(HOST_KEY, host);
};

export const getAllQuestions = (): Question[] => {
  const custom = localStorage.getItem(CUSTOM_QUESTIONS_KEY);
  let customList: Question[] = [];
  if (custom) {
    try {
      customList = JSON.parse(custom);
    } catch {
      customList = [];
    }
  }
  return [...INITIAL_QUESTIONS, ...customList];
};

export const saveCustomQuestion = (newQ: Question): Question[] => {
  const custom = localStorage.getItem(CUSTOM_QUESTIONS_KEY);
  let customList: Question[] = [];
  if (custom) {
    try {
      customList = JSON.parse(custom);
    } catch {
      customList = [];
    }
  }
  customList.push(newQ);
  localStorage.setItem(CUSTOM_QUESTIONS_KEY, JSON.stringify(customList));
  return getAllQuestions();
};
