import type { Difficulty } from "../../types";

export interface GameTheme {
  id: number;
  mascot: string; // emoji mascot
  panelBackground: string;
  panelBorder: string;
  boardFrameBg: string;
  boardFrameBorder: string;
  boardBg: string;
  bridgeUnused: string;
  bridgeUsed: string;
  nodeFill: string;
  nodeBorder: string;
  nodeActive: string;
  nodeStart: string;
}

export const GAME_THEMES: GameTheme[] = [
  {
    id: 1,
    mascot: "🐃",
    panelBackground: "var(--cream-card)",
    panelBorder: "rgba(184, 151, 95, 0.55)",
    boardFrameBg: "var(--board-frame)",
    boardFrameBorder: "var(--board-frame-edge)",
    boardBg: "#d7ecdf",
    bridgeUnused: "#cdb78c",
    bridgeUsed: "#8e4e22",
    nodeFill: "#fff6e3",
    nodeBorder: "#b89457",
    nodeActive: "#e87432",
    nodeStart: "#6b8e3d",
  },
  {
    id: 2,
    mascot: "🦆",
    panelBackground: "#fdf0d8",
    panelBorder: "rgba(214, 150, 70, 0.55)",
    boardFrameBg: "#e6c98f",
    boardFrameBorder: "#c79a52",
    boardBg: "#f6e2b8",
    bridgeUnused: "#d8b783",
    bridgeUsed: "#b85a22",
    nodeFill: "#fffaf0",
    nodeBorder: "#c79a52",
    nodeActive: "#e87432",
    nodeStart: "#6b8e3d",
  },
  {
    id: 3,
    mascot: "🐸",
    panelBackground: "#f2f4dd",
    panelBorder: "rgba(108, 142, 61, 0.5)",
    boardFrameBg: "#c8d68a",
    boardFrameBorder: "#8aa455",
    boardBg: "#dceabf",
    bridgeUnused: "#b6c98a",
    bridgeUsed: "#4c6630",
    nodeFill: "#fbffe9",
    nodeBorder: "#8aa455",
    nodeActive: "#e87432",
    nodeStart: "#4c6630",
  },
  {
    id: 4,
    mascot: "🐔",
    panelBackground: "#fbe9d6",
    panelBorder: "rgba(200, 110, 50, 0.5)",
    boardFrameBg: "#e7b88c",
    boardFrameBorder: "#c07a45",
    boardBg: "#f3d8be",
    bridgeUnused: "#dcab7f",
    bridgeUsed: "#a4471c",
    nodeFill: "#fff4ea",
    nodeBorder: "#c07a45",
    nodeActive: "#d4541f",
    nodeStart: "#6b8e3d",
  },
];

export function themeForLevel(levelId: number): GameTheme {
  const byDifficulty: Record<Difficulty, number> = {
    easy: 0,
    normal: 1,
    hard: 2,
    expert: 3,
  };
  // Rotate within difficulty bands for variety but keep it stable per level.
  return GAME_THEMES[Math.max(0, (levelId - 1) % GAME_THEMES.length)] ?? GAME_THEMES[0];
}

export function themeForDifficulty(difficulty: Difficulty): GameTheme {
  const map: Record<Difficulty, number> = { easy: 0, normal: 1, hard: 2, expert: 3 };
  return GAME_THEMES[map[difficulty]];
}
