export type Screen = "login" | "dashboard" | "game" | "leaderboards" | "settings";

export type Difficulty = "easy" | "normal" | "hard" | "expert";

export interface BridgeNode {
  id: string;
  x: number; // normalized 0..1
  y: number; // normalized 0..1
}

export interface BridgeEdge {
  id: string;
  from: string;
  to: string;
}

export interface BridgeLevel {
  id: number;
  name: string;
  difficulty: Difficulty;
  nodes: BridgeNode[];
  edges: BridgeEdge[];
  startNodeId?: string;
}

/** Mutable-by-copy gameplay state for a single level attempt. */
export interface GameState {
  level: BridgeLevel;
  currentNode: string | null;
  /** edge ids already crossed, in order. */
  usedEdges: string[];
  /** node ids visited, in order (includes the start node). */
  path: string[];
  moveCount: number;
}

export interface LevelProgress {
  levelId: number;
  completed: boolean;
  bestStars: number;
  bestMoves: number;
  bestTimeMs?: number;
}

export interface HistoryEntry {
  levelId: number;
  stars: number;
  date: string;
  metadata?: Record<string, unknown>;
}

export interface LocalStats {
  bestScore: number;
  lastScore: number;
  totalGames: number;
  highestLevel: number;
  completedLevels: number;
  totalStars: number;
  history: HistoryEntry[];
}
