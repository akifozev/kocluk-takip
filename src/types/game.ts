export type QuestionCategory =
  | 'genel'
  | 'populer'
  | 'sinema-dizi'
  | 'tarih'
  | 'bilim'
  | 'spor'
  | 'muzik'
  | 'sanat'
  | 'edebiyat'
  | 'komik';

export interface Question {
  id: string;
  level: number; // 1 to 15
  category: QuestionCategory;
  question: string;
  options: [string, string, string, string]; // A, B, C, D
  correctAnswer: 0 | 1 | 2 | 3; // index 0..3
  explanation?: string; // Eğlenceli açıklama / ek bilgi
}

export type HostType = 'kenan' | 'kanka' | 'prof';

export interface HostInfo {
  id: HostType;
  name: string;
  title: string;
  avatar: string;
  description: string;
}

export type LifelineType = 'fifty' | 'phone' | 'audience' | 'change' | 'double';

export interface LifelineState {
  fifty: boolean; // true = available
  phone: boolean;
  audience: boolean;
  change: boolean;
  double: boolean;
}

export type GameMode = 'classic' | 'speed' | 'custom';

export type GameStatus =
  | 'menu'
  | 'playing'
  | 'lifeline_modal'
  | 'walk_away'
  | 'game_over'
  | 'victory'
  | 'question_bank'
  | 'stats';

export interface GameStats {
  totalGames: number;
  highestLevel: number;
  totalWon: number;
  highestWon: number;
  correctAnswersCount: number;
  wrongAnswersCount: number;
  lifelinesUsedCount: number;
}

export interface LadderStep {
  level: number;
  amount: number;
  formattedAmount: string;
  isMilestone: boolean;
}
