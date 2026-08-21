export type RankThemeType = 'GENERAL';

export const RANK_THEMES: Record<RankThemeType, string[]> = {
  GENERAL: [
    'Beginner',
    'Explorer',
    'Achiever',
    'Specialist',
    'Pro',
    'Expert',
    'Elite',
    'Veteran',
    'Master',
    'Icon',
    'Titan',
    'Apex',
  ],
};

export function calculateRankFromLevel(
  level: number,
  theme: RankThemeType = 'GENERAL',
) {
  const themeArray = RANK_THEMES[theme] || RANK_THEMES.GENERAL;

  const calculatedIndex = Math.floor((level - 1) / 10);

  const targetIndex = Math.min(calculatedIndex, themeArray.length - 1);

  return themeArray[targetIndex];
}
