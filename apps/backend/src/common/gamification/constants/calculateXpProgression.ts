// gamification.utils.ts

import { calculateRankFromLevel, RankThemeType } from './rankThemes';
import { getXpRequiredForNextLevel } from './xpCalculator';

export interface XpCalculationResult {
  newLevel: string;
  newXp: string;
  newRank: string;
}

export function calculateXpProgression(
  currentLevel: number,
  currentXp: number,
  xpGained: number,
  theme: RankThemeType = 'GENERAL',
): XpCalculationResult {
  let accumulatedXp = currentXp + xpGained;
  let computedLevel = currentLevel;
  let xpTarget = getXpRequiredForNextLevel(computedLevel);

  // Core progression loop
  while (accumulatedXp >= xpTarget) {
    accumulatedXp -= xpTarget;
    computedLevel += 1;
    xpTarget = getXpRequiredForNextLevel(computedLevel);
  }

  const computedRank = calculateRankFromLevel(computedLevel, theme);

  return {
    newLevel: String(computedLevel),
    newXp: String(accumulatedXp),
    newRank: computedRank,
  };
}
