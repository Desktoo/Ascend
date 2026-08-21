export type RankThemeType = 'GENERAL';

export const RANK_TITLES: Record<RankThemeType, string[]> = {
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
}

export function getDisplayTitle(dbRank: string, activeTheme: RankThemeType = 'GENERAL'): string {
  const generalTitles = RANK_TITLES.GENERAL;
  const targetTitles = RANK_TITLES[activeTheme] || RANK_TITLES.GENERAL;

  const rankIndex = generalTitles.indexOf(dbRank);

  if (rankIndex === -1) {
    return targetTitles[0];
  }

  const safeIndex = Math.min(rankIndex, targetTitles.length - 1);

  return targetTitles[safeIndex];
}