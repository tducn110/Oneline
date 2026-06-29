import type { BridgeEdge, BridgeLevel, GameState } from "../types";

/** Map of nodeId -> degree (number of incident edges, counting parallels). */
export function getDegreeMap(level: BridgeLevel): Record<string, number> {
  const deg: Record<string, number> = {};
  for (const n of level.nodes) deg[n.id] = 0;
  for (const e of level.edges) {
    deg[e.from] = (deg[e.from] ?? 0) + 1;
    deg[e.to] = (deg[e.to] ?? 0) + 1;
  }
  return deg;
}

export function getOddDegreeNodes(level: BridgeLevel): string[] {
  const deg = getDegreeMap(level);
  return Object.keys(deg)
    .filter((id) => deg[id] % 2 === 1)
    .sort();
}

/** Connected across nodes that actually participate in at least one edge. */
export function isConnectedGraph(level: BridgeLevel): boolean {
  if (level.nodes.length === 0) return false;
  const adj: Record<string, string[]> = {};
  for (const n of level.nodes) adj[n.id] = [];
  for (const e of level.edges) {
    adj[e.from].push(e.to);
    adj[e.to].push(e.from);
  }
  // Start BFS from a node that has at least one edge.
  const start = level.nodes.find((n) => adj[n.id].length > 0)?.id ?? level.nodes[0].id;
  const seen = new Set<string>([start]);
  const queue = [start];
  while (queue.length) {
    const cur = queue.shift()!;
    for (const next of adj[cur]) {
      if (!seen.has(next)) {
        seen.add(next);
        queue.push(next);
      }
    }
  }
  // Every node with edges must be reachable (no isolated gameplay nodes allowed).
  return level.nodes.every((n) => adj[n.id].length === 0 || seen.has(n.id));
}

/** An Euler trail exists iff the graph is connected and has 0 or 2 odd nodes. */
export function hasEulerTrail(level: BridgeLevel): boolean {
  if (!isConnectedGraph(level)) return false;
  const odd = getOddDegreeNodes(level).length;
  return odd === 0 || odd === 2;
}

/** Nodes from which a full Euler trail can begin. */
export function getValidStartNodes(level: BridgeLevel): string[] {
  const odd = getOddDegreeNodes(level);
  if (odd.length === 2) return odd;
  // Euler circuit: any node with an edge can start.
  const deg = getDegreeMap(level);
  return level.nodes.filter((n) => deg[n.id] > 0).map((n) => n.id);
}

/** Structural + Euler validation. Returns null when valid, else a reason. */
export function validateLevel(level: BridgeLevel): string | null {
  const nodeIds = new Set(level.nodes.map((n) => n.id));
  if (nodeIds.size !== level.nodes.length) return "duplicate node id";
  const edgeIds = new Set(level.edges.map((e) => e.id));
  if (edgeIds.size !== level.edges.length) return "duplicate edge id";
  for (const e of level.edges) {
    if (!nodeIds.has(e.from) || !nodeIds.has(e.to)) return `edge ${e.id} references missing node`;
    if (e.from === e.to) return `edge ${e.id} is a self loop`;
  }
  const deg = getDegreeMap(level);
  if (level.nodes.some((n) => deg[n.id] === 0)) return "isolated node";
  if (!isConnectedGraph(level)) return "graph not connected";
  const odd = getOddDegreeNodes(level);
  if (odd.length !== 0 && odd.length !== 2) return `has ${odd.length} odd-degree nodes`;
  if (odd.length === 2 && level.startNodeId && !odd.includes(level.startNodeId)) {
    return "startNodeId is not an odd-degree node";
  }
  return null;
}

export function createInitialState(level: BridgeLevel): GameState {
  return { level, currentNode: null, usedEdges: [], path: [], moveCount: 0 };
}

/** Find an unused edge connecting `a` and `b` (handles parallel bridges). */
function findUnusedEdge(state: GameState, a: string, b: string): BridgeEdge | undefined {
  return state.level.edges.find(
    (e) =>
      !state.usedEdges.includes(e.id) &&
      ((e.from === a && e.to === b) || (e.from === b && e.to === a))
  );
}

/** Start the trail on a node, or step to an adjacent node via an unused bridge. */
export function isValidMove(state: GameState, nextNodeId: string): boolean {
  if (!state.level.nodes.some((n) => n.id === nextNodeId)) return false;
  if (state.currentNode === null) {
    return getValidStartNodes(state.level).includes(nextNodeId);
  }
  if (nextNodeId === state.currentNode) return false;
  return !!findUnusedEdge(state, state.currentNode, nextNodeId);
}

export function applyMove(state: GameState, nextNodeId: string): GameState {
  if (!isValidMove(state, nextNodeId)) return state;
  if (state.currentNode === null) {
    return {
      ...state,
      currentNode: nextNodeId,
      path: [nextNodeId],
      usedEdges: [],
      moveCount: 0,
    };
  }
  const edge = findUnusedEdge(state, state.currentNode, nextNodeId)!;
  return {
    ...state,
    currentNode: nextNodeId,
    usedEdges: [...state.usedEdges, edge.id],
    path: [...state.path, nextNodeId],
    moveCount: state.moveCount + 1,
  };
}

export function undoMove(state: GameState): GameState {
  if (state.path.length === 0) return state;
  if (state.usedEdges.length === 0) {
    // Only the start node was placed -> clear selection.
    return { ...state, currentNode: null, path: [], usedEdges: [], moveCount: state.moveCount };
  }
  const usedEdges = state.usedEdges.slice(0, -1);
  const path = state.path.slice(0, -1);
  return {
    ...state,
    usedEdges,
    path,
    currentNode: path[path.length - 1] ?? null,
    moveCount: state.moveCount + 1,
  };
}

export function isLevelComplete(state: GameState): boolean {
  return state.level.edges.length > 0 && state.usedEdges.length === state.level.edges.length;
}

export function isPlayerStuck(state: GameState): boolean {
  if (state.currentNode === null) return false;
  if (isLevelComplete(state)) return false;
  // Stuck when no unused edge is incident to the current node.
  return !state.level.edges.some(
    (e) =>
      !state.usedEdges.includes(e.id) &&
      (e.from === state.currentNode || e.to === state.currentNode)
  );
}

/** Used-edge ids as a Set for fast renderer lookup. */
export function usedEdgeSet(state: GameState): Set<string> {
  return new Set(state.usedEdges);
}
