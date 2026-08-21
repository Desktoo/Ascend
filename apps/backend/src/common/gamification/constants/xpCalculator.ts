export const TASK_XP = {
  LOW: 10,
  MEDIUM: 20,
  HIGH: 30,
};

export function getXpRequiredForNextLevel(level: number): number {
  return Math.floor(100 + level * level * 0.8 + Math.floor(level / 10) * 150);
}

export function getXpMultiplier(level: number): number {
  return 1 + Math.floor(level / 10) * 0.15;
}

export function getTaskXp(level: number, baseXp: number): number {
  return Math.floor(baseXp * getXpMultiplier(level));
}
