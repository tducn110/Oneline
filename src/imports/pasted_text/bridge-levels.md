You are working inside an existing React + TypeScript + Vite mini-game repo.

Read `DESIGN.md` first and follow it strictly.

Build a new mini game called:

# Cầu Tre Một Nét

Game type: One Line / Euler Bridge puzzle.

Core rule:
The player must draw one continuous path through every bridge exactly once. This is an Euler trail puzzle. Every level must be a connected graph with either 0 odd-degree nodes or exactly 2 odd-degree nodes.

Do not turn the app into a landing page.
Do not add TopNav, Footer, Sidebar, hero sections, marketing sections, backend auth, backend leaderboard, shop, inventory, ads, multiplayer, or complex routing.
Keep the existing mini-game style:

* fixed Vietnamese countryside background
* centered game card
* mobile portrait first
* compact HUD
* small Dashboard screen
* small Leaderboard screen
* small Settings screen
* simple Login / guest entry
* localStorage stats only

Replace the current 2048 gameplay with the new One Line / Euler Bridge gameplay, but preserve the project’s visual identity and current app shell style.

## Game Concept

Theme:
A small Vietnamese countryside bridge puzzle. Nodes are village spots / bamboo posts / river banks. Edges are bamboo bridges. The player must walk through every bridge once to help the mascot cross the village.

Vietnamese UI copy:

* Title: “Cầu Tre Một Nét”
* Short instruction: “Đi qua mỗi cây cầu đúng 1 lần”
* Start hint: “Chọn điểm bắt đầu”
* Invalid move: “Không đi lại cầu cũ”
* Win: “Qua cầu thành công!”
* Lose/blocked: “Kẹt đường rồi!”
* Reset: “Chơi lại”
* Undo: “Lùi bước”
* Hint: “Gợi ý”
* Level: “Màn”
* Bridges left: “Cầu còn lại”
* Best: “Tốt nhất”

## Gameplay Rules

A level is a graph:

```ts
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
  difficulty: "easy" | "normal" | "hard" | "expert";
  nodes: BridgeNode[];
  edges: BridgeEdge[];
  startNodeId?: string;
}
```

Rules:

1. Player taps a node to start.
2. After starting, player can only move to an adjacent node through an unused edge.
3. Each edge can be used exactly once.
4. The player wins when all edges are used.
5. If player is stuck before all edges are used, show a soft “Kẹt đường rồi!” state but allow Undo/Reset.
6. If a level has exactly 2 odd-degree nodes, the start should be one of the odd nodes.
7. If a level has 0 odd-degree nodes, any node may start.
8. Do not allow invalid levels.

## Required Level Count

Create exactly 40 levels.

Difficulty distribution:

* Levels 1–10: easy tutorial
* Levels 11–20: normal
* Levels 21–30: hard
* Levels 31–40: expert

Level progression:

* Start with 2–4 nodes and 1–4 bridges.
* Gradually introduce cycles, branches, shared nodes, and multiple possible paths.
* Expert levels should use 8–10 nodes and 11–16 bridges.
* Keep all levels readable on mobile.
* Do not make visual layouts too dense.
* Do not use random level generation at runtime.
* Hand-author the 40 levels in `src/constants/bridgeLevels.ts`.

Important:
Also implement a validator and tests to verify all 40 levels are valid Euler puzzles.

## Euler Validation

Create pure functions in `src/utils/eulerLogic.ts`:

```ts
getDegreeMap(level: BridgeLevel): Record<string, number>
getOddDegreeNodes(level: BridgeLevel): string[]
isConnectedGraph(level: BridgeLevel): boolean
hasEulerTrail(level: BridgeLevel): boolean
getValidStartNodes(level: BridgeLevel): string[]
isValidMove(state, nextNodeId): boolean
applyMove(state, nextNodeId): state
undoMove(state): state
isLevelComplete(state): boolean
isPlayerStuck(state): boolean
```

Validation rules:

* Graph must be connected.
* Graph must have 0 or 2 odd-degree nodes.
* If `startNodeId` exists and graph has 2 odd-degree nodes, `startNodeId` must be one of them.
* Every edge must have a unique id.
* Every edge endpoint must reference an existing node.
* No isolated gameplay nodes.

Create tests:
`src/utils/eulerLogic.test.ts`

Test requirements:

* all 40 levels pass `hasEulerTrail`
* every level is connected
* every level has 0 or 2 odd-degree nodes
* valid start nodes are correct
* cannot reuse an edge
* cannot move to non-adjacent node
* undo restores previous state
* level completes only after all edges are used
* stuck detection works

## UI / Component Structure

Use the current source style, but rename game-specific files away from 2048.

Recommended structure:

```txt
src/
  app/
    App.tsx

  components/
    background/
      CountrysideBackdrop.tsx

    game/
      Game.tsx
      GameBoard.tsx
      GameHeader.tsx
      GameHUD.tsx
      BridgeRenderer.ts
      Mascot.tsx
      gameThemes.ts

    screens/
      Login.tsx
      Dashboard.tsx
      Leaderboards.tsx
      Settings.tsx

    ui/
      Button.tsx
      LogoBubble.tsx

  constants/
    bridgeLevels.ts
    gameConfig.ts

  hooks/
    useBridgeGame.ts
    useGameAudio.ts
    useLocalStats.ts

  utils/
    eulerLogic.ts
    eulerLogic.test.ts

  types/
    index.ts
```

If renaming everything is too risky in one pass, do it safely:

1. Add new bridge game files.
2. Wire `App.tsx` to the new `Game`.
3. Remove or quarantine old 2048 files only after build/tests pass.

## React / Renderer Boundary

React owns:

* screen state
* HUD
* buttons
* overlays
* local stats
* settings
* audio flags
* accessibility labels

Renderer owns:

* drawing nodes
* drawing bridges
* highlighting used bridges
* hover/touch feedback
* simple particles
* resize handling
* cleanup

Pure logic owns:

* graph validation
* legal moves
* edge usage
* undo
* win/stuck detection
* scoring

Do not mix pure Euler logic into the renderer.
Do not hide important game state only inside canvas.
HUD must remain in React DOM.

## Rendering Requirements

Use PixiJS if the current project already uses PixiJS cleanly.

The board should render:

* soft river/field play area
* bamboo bridge edges
* round village nodes
* selected current node
* used bridges highlighted
* invalid move feedback
* completion animation

Mobile interactions:

* tap node to start
* tap adjacent node to move
* optional drag across bridge if simple
* large hitboxes around nodes
* no tiny precision targets
* prevent page scroll inside board

Board style:

* inside central game card
* framed play area
* rounded corners
* warm paper/countryside colors
* readable on mobile

## HUD

GameHUD should show:

* Level number
* Bridges left
* Score or Stars
* Best / Progress
* Reset button
* Undo button
* optional Hint button

Keep HUD compact.
Do not show too many stats.

## Scoring

Simple local scoring:

* Completing a level gives stars.
* 3 stars: no hints and few/no undo
* 2 stars: some undo or one hint
* 1 star: completed with many undo/hints

Store local progress:

```ts
interface LevelProgress {
  levelId: number;
  completed: boolean;
  bestStars: number;
  bestMoves: number;
  bestTimeMs?: number;
}

interface LocalStats {
  bestScore: number;
  lastScore: number;
  totalGames: number;
  highestLevel: number;
  completedLevels: number;
  totalStars: number;
  history: HistoryEntry[];
}
```

Keep localStorage only.
Do not add backend.

## 40 Level Design Requirement

Create 40 level objects manually in `bridgeLevels.ts`.

Use this difficulty curve:

Levels 1–5:

* teach straight paths
* teach simple choice
* 2–4 nodes
* 1–4 edges

Levels 6–10:

* introduce cycles
* 4–5 nodes
* 4–6 edges

Levels 11–20:

* introduce odd-degree start logic
* 5–7 nodes
* 6–9 edges

Levels 21–30:

* harder graph shapes
* 7–9 nodes
* 8–12 edges
* more branches and cycles

Levels 31–40:

* expert graph shapes
* 8–10 nodes
* 11–16 edges
* still readable on mobile
* no impossible levels

Do not just generate random graphs. Hand-author readable node coordinates.

Each level should have a Vietnamese name, for example:

1. “Cầu Đầu Làng”
2. “Qua Bờ Ruộng”
3. “Vòng Ao Nhỏ”
4. “Bến Tre”
5. “Lối Ra Chợ”
   ...
6. “Làng Qua Sông”

## Level Unlocking

Use simple progression:

* Level 1 unlocked by default.
* Completing level N unlocks level N+1.
* Player can replay completed levels.
* Level select screen can be part of Dashboard or a compact overlay inside Game.
* Do not build a huge map screen.

## Overlays

Use compact overlays:

* Start level
* Level complete
* Stuck
* Pause/settings is handled by Settings screen

Level complete overlay:

* title: “Qua cầu thành công!”
* subtitle: “Bạn hoàn thành Màn {levelId}”
* stars
* buttons: “Màn tiếp”, “Chơi lại”, “Bảng màn”

Stuck overlay:

* title: “Kẹt đường rồi!”
* subtitle: “Bạn đã hết nước đi hợp lệ”
* buttons: “Lùi bước”, “Chơi lại”

## Audio

Use existing audio pattern:

```ts
musicEnabled: boolean;
sfxEnabled: boolean;
```

SFX:

* tap
* move
* invalid
* undo
* win
* lose/stuck

Never play SFX when `sfxEnabled` is false.
Never play music when `musicEnabled` is false.

## Accessibility

Requirements:

* Every icon button needs `aria-label`.
* Board container needs `aria-label="Bàn chơi Cầu Tre Một Nét"`.
* HUD values should be readable in DOM.
* Touch targets should be large.
* Do not rely only on color for used/unused bridge state; also use thickness/texture/dash or icon state.

## Cleanup / Non-goals

Do not add:

* backend
* real auth
* ads
* shop
* inventory
* multiplayer
* landing page
* top nav
* footer
* sidebar
* complex routing
* complex global state library
* chart dashboard

If old files become unused, report them clearly instead of deleting blindly.

## Implementation Steps

1. Read `DESIGN.md`.
2. Inspect current `src` structure.
3. Create bridge game types.
4. Create `bridgeLevels.ts` with exactly 40 levels.
5. Create pure Euler logic in `eulerLogic.ts`.
6. Create tests for Euler logic and level validity.
7. Create `useBridgeGame.ts`.
8. Create/replace game UI components:

   * `Game.tsx`
   * `GameBoard.tsx`
   * `GameHUD.tsx`
   * `BridgeRenderer.ts`
9. Wire `App.tsx` to the new game.
10. Preserve Dashboard/Settings/Leaderboards as compact support screens.
11. Update local stats to track level progress and stars.
12. Run:

```bash
npm run build
npm test
```

13. Fix all TypeScript/test errors.
14. Produce a final report.

## Final Report Format

After implementation, report:

```txt
Summary
- What changed

Files changed
- path: reason

Gameplay
- How the Euler Bridge game works
- How 40 levels are structured

Validation
- Confirm all 40 levels pass Euler validation
- Confirm tests pass
- Confirm build passes

Tradeoffs
- Anything simplified
- Anything intentionally not added
```

Hard rule:
Protect this loop:

open → play → solve bridge → next level → replay

Do not build anything that does not support this loop.
