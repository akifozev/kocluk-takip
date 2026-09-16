import { LadderStep } from '../types/game';

export const PRIZE_LADDER: LadderStep[] = [
  { level: 15, amount: 10000000, formattedAmount: '10.000.000 ₺', isMilestone: true },
  { level: 14, amount: 5000000, formattedAmount: '5.000.000 ₺', isMilestone: false },
  { level: 13, amount: 2500000, formattedAmount: '2.500.000 ₺', isMilestone: false },
  { level: 12, amount: 1000000, formattedAmount: '1.000.000 ₺', isMilestone: false },
  { level: 11, amount: 500000, formattedAmount: '500.000 ₺', isMilestone: false },
  { level: 10, amount: 250000, formattedAmount: '250.000 ₺', isMilestone: true }, // 2. Baraj
  { level: 9, amount: 150000, formattedAmount: '150.000 ₺', isMilestone: false },
  { level: 8, amount: 100000, formattedAmount: '100.000 ₺', isMilestone: false },
  { level: 7, amount: 60000, formattedAmount: '60.000 ₺', isMilestone: false },
  { level: 6, amount: 40000, formattedAmount: '40.000 ₺', isMilestone: false },
  { level: 5, amount: 20000, formattedAmount: '20.000 ₺', isMilestone: true }, // 1. Baraj
  { level: 4, amount: 10000, formattedAmount: '10.000 ₺', isMilestone: false },
  { level: 3, amount: 5000, formattedAmount: '5.000 ₺', isMilestone: false },
  { level: 2, amount: 2000, formattedAmount: '2.000 ₺', isMilestone: false },
  { level: 1, amount: 1000, formattedAmount: '1.000 ₺', isMilestone: false },
];

export const getGuaranteedAmount = (currentLevel: number): number => {
  if (currentLevel > 10) return 250000;
  if (currentLevel > 5) return 20000;
  return 0;
};

export const getWalkAwayAmount = (currentLevel: number): number => {
  if (currentLevel <= 1) return 0;
  const previousStep = PRIZE_LADDER.find((s) => s.level === currentLevel - 1);
  return previousStep ? previousStep.amount : 0;
};
