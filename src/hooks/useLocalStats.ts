import { useCallback, useEffect, useState } from "react";
import { STORAGE_KEYS, scoreForLevel } from "../constants/gameConfig";
import type { HistoryEntry, LevelProgress, LocalStats } from "../types";

const EMPTY_STATS: LocalStats = {
  bestScore: 0,
  lastScore: 0,
  totalGames: 0,
  highestLevel: 1,
  completedLevels: 0,
  totalStars: 0,
  history: [],
};

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw) as T;
  } catch {
    /* ignore */
  }
  return fallback;
}

function write<T>(key: string, value: T) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* ignore */
  }
}

export function useLocalStats() {
  const [stats, setStats] = useState<LocalStats>(() => read(STORAGE_KEYS.stats, EMPTY_STATS));
  const [progress, setProgress] = useState<Record<number, LevelProgress>>(() =>
    read(STORAGE_KEYS.progress, {})
  );

  useEffect(() => write(STORAGE_KEYS.stats, stats), [stats]);
  useEffect(() => write(STORAGE_KEYS.progress, progress), [progress]);

  const isUnlocked = useCallback(
    (levelId: number) => levelId === 1 || !!progress[levelId - 1]?.completed,
    [progress]
  );

  const recordCompletion = useCallback(
    (levelId: number, stars: number, moves: number, timeMs: number, playerName: string) => {
      const score = scoreForLevel(levelId, stars);

      setProgress((prev) => {
        const existing = prev[levelId];
        const next: LevelProgress = {
          levelId,
          completed: true,
          bestStars: Math.max(stars, existing?.bestStars ?? 0),
          bestMoves: existing ? Math.min(existing.bestMoves, moves) : moves,
          bestTimeMs: existing?.bestTimeMs ? Math.min(existing.bestTimeMs, timeMs) : timeMs,
        };
        return { ...prev, [levelId]: next };
      });

      setStats((prev) => {
        const newlyCompleted = !progress[levelId]?.completed;
        const prevStars = progress[levelId]?.bestStars ?? 0;
        const starsDelta = Math.max(0, stars - prevStars);
        const entry: HistoryEntry = {
          levelId,
          stars,
          date: new Date().toISOString(),
          metadata: { moves, timeMs, player: playerName },
        };
        return {
          ...prev,
          bestScore: Math.max(prev.bestScore, score),
          lastScore: score,
          totalGames: prev.totalGames + 1,
          highestLevel: Math.max(prev.highestLevel, Math.min(levelId + 1, 100)),
          completedLevels: prev.completedLevels + (newlyCompleted ? 1 : 0),
          totalStars: prev.totalStars + starsDelta,
          history: [entry, ...prev.history].slice(0, 20),
        };
      });

      return score;
    },
    [progress]
  );

  return { stats, progress, isUnlocked, recordCompletion };
}

export type LocalStatsApi = ReturnType<typeof useLocalStats>;
