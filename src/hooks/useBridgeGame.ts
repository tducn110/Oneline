import { useCallback, useMemo, useRef, useState } from "react";
import {
  applyMove,
  createInitialState,
  getValidStartNodes,
  isLevelComplete,
  isPlayerStuck,
  isValidMove,
  undoMove,
  usedEdgeSet,
} from "../utils/eulerLogic";
import { getLevel } from "../constants/bridgeLevels";
import { computeStars } from "../constants/gameConfig";
import type { GameState } from "../types";

export type Phase = "ready" | "playing" | "won" | "stuck";

interface UseBridgeGameArgs {
  initialLevelId: number;
  onInvalid?: () => void;
  onMove?: () => void;
  onStart?: () => void;
  onUndo?: () => void;
  onWin?: () => void;
  onStuck?: () => void;
}

export function useBridgeGame(args: UseBridgeGameArgs) {
  const [levelId, setLevelId] = useState(args.initialLevelId);
  const level = getLevel(levelId)!;
  const [state, setState] = useState<GameState>(() => createInitialState(level));
  const [phase, setPhase] = useState<Phase>("ready");
  const [undoCount, setUndoCount] = useState(0);
  const [hintCount, setHintCount] = useState(0);
  const [hintEdgeId, setHintEdgeId] = useState<string | null>(null);
  const startTimeRef = useRef<number>(Date.now());

  const validStarts = useMemo(() => getValidStartNodes(level), [level]);
  const used = useMemo(() => usedEdgeSet(state), [state]);

  const loadLevel = useCallback((id: number) => {
    const lv = getLevel(id);
    if (!lv) return;
    setLevelId(id);
    setState(createInitialState(lv));
    setPhase("ready");
    setUndoCount(0);
    setHintCount(0);
    setHintEdgeId(null);
    startTimeRef.current = Date.now();
  }, []);

  const reset = useCallback(() => loadLevel(levelId), [levelId, loadLevel]);

  const tapNode = useCallback(
    (nodeId: string) => {
      if (phase === "won") return;
      setHintEdgeId(null);
      if (!isValidMove(state, nodeId)) {
        args.onInvalid?.();
        return;
      }
      const isStart = state.currentNode === null;
      const next = applyMove(state, nodeId);
      setState(next);
      if (isStart) {
        setPhase("playing");
        args.onStart?.();
      } else {
        args.onMove?.();
      }
      if (isLevelComplete(next)) {
        setPhase("won");
        args.onWin?.();
      } else if (isPlayerStuck(next)) {
        setPhase("stuck");
        args.onStuck?.();
      }
    },
    [args, phase, state]
  );

  const undo = useCallback(() => {
    if (state.path.length === 0) return;
    setState(undoMove(state));
    setUndoCount((c) => c + 1);
    setHintEdgeId(null);
    if (phase === "stuck") setPhase(state.path.length > 1 ? "playing" : "ready");
    args.onUndo?.();
  }, [args, phase, state]);

  /** Highlights one legal next bridge from the current node. */
  const hint = useCallback(() => {
    if (phase === "won") return;
    setHintCount((c) => c + 1);
    if (state.currentNode === null) {
      // suggest a valid start node by highlighting one of its edges
      const startId = validStarts[0];
      const e = level.edges.find((ed) => ed.from === startId || ed.to === startId);
      setHintEdgeId(e?.id ?? null);
      return;
    }
    const e = level.edges.find(
      (ed) =>
        !used.has(ed.id) && (ed.from === state.currentNode || ed.to === state.currentNode)
    );
    setHintEdgeId(e?.id ?? null);
  }, [level.edges, phase, state.currentNode, used, validStarts]);

  const stars = useMemo(() => computeStars(undoCount, hintCount), [undoCount, hintCount]);
  const elapsedMs = () => Date.now() - startTimeRef.current;

  return {
    levelId,
    level,
    state,
    phase,
    used,
    validStarts,
    undoCount,
    hintCount,
    hintEdgeId,
    stars,
    bridgesLeft: level.edges.length - state.usedEdges.length,
    canUndo: state.path.length > 0,
    loadLevel,
    reset,
    tapNode,
    undo,
    hint,
    elapsedMs,
  };
}

export type BridgeGameApi = ReturnType<typeof useBridgeGame>;
