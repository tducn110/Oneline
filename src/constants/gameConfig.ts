export const STORAGE_KEYS = {
  stats: "ctm.stats.v1",
  progress: "ctm.progress.v1",
  player: "ctm.player.v1",
  audio: "ctm.audio.v1",
  leaderboard: "ctm.leaderboard.v1",
} as const;

export const TOTAL_LEVELS = 40;

/** Stars are based on how much help the player needed. */
export function computeStars(undoCount: number, hintCount: number): number {
  if (hintCount === 0 && undoCount <= 1) return 3;
  if (hintCount <= 1 && undoCount <= 4) return 2;
  return 1;
}

/** Simple score: stars weighted by level depth. */
export function scoreForLevel(levelId: number, stars: number): number {
  return levelId * 10 + stars * 50;
}
