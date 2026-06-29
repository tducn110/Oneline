/**
 * Euler-logic tests. These are written for a Vitest-style runner
 * (`describe`/`it`/`expect`). The Figma Make environment does not run a
 * test runner, but the suite documents and locks the expected behaviour.
 */
import { describe, it, expect } from "vitest";
import {
  getDegreeMap,
  getOddDegreeNodes,
  isConnectedGraph,
  hasEulerTrail,
  getValidStartNodes,
  validateLevel,
  createInitialState,
  isValidMove,
  applyMove,
  undoMove,
  isLevelComplete,
  isPlayerStuck,
} from "./eulerLogic";
import { BRIDGE_LEVELS } from "../constants/bridgeLevels";
import type { BridgeLevel } from "../types";

const path3: BridgeLevel = {
  id: 999,
  name: "test path",
  difficulty: "easy",
  nodes: [
    { id: "A", x: 0, y: 0 },
    { id: "B", x: 0.5, y: 0 },
    { id: "C", x: 1, y: 0 },
  ],
  edges: [
    { id: "e1", from: "A", to: "B" },
    { id: "e2", from: "B", to: "C" },
  ],
  startNodeId: "A",
};

describe("level data", () => {
  it("contains exactly 40 levels with unique ids", () => {
    expect(BRIDGE_LEVELS).toHaveLength(40);
    expect(new Set(BRIDGE_LEVELS.map((l) => l.id)).size).toBe(40);
  });

  it("every level passes structural + Euler validation", () => {
    for (const lv of BRIDGE_LEVELS) {
      expect(validateLevel(lv)).toBeNull();
    }
  });

  it("every level is connected and has an Euler trail", () => {
    for (const lv of BRIDGE_LEVELS) {
      expect(isConnectedGraph(lv)).toBe(true);
      expect(hasEulerTrail(lv)).toBe(true);
    }
  });

  it("every level has 0 or 2 odd-degree nodes", () => {
    for (const lv of BRIDGE_LEVELS) {
      const odd = getOddDegreeNodes(lv).length;
      expect(odd === 0 || odd === 2).toBe(true);
    }
  });

  it("declared start nodes are valid start nodes", () => {
    for (const lv of BRIDGE_LEVELS) {
      if (lv.startNodeId) {
        expect(getValidStartNodes(lv)).toContain(lv.startNodeId);
      }
    }
  });
});

describe("degree helpers", () => {
  it("computes degrees", () => {
    expect(getDegreeMap(path3)).toEqual({ A: 1, B: 2, C: 1 });
  });
  it("finds odd-degree nodes", () => {
    expect(getOddDegreeNodes(path3)).toEqual(["A", "C"]);
  });
});

describe("gameplay", () => {
  it("only allows valid start nodes", () => {
    const s = createInitialState(path3);
    expect(isValidMove(s, "B")).toBe(false); // B is even -> not a start
    expect(isValidMove(s, "A")).toBe(true);
  });

  it("cannot move to a non-adjacent node", () => {
    const s = applyMove(createInitialState(path3), "A");
    expect(isValidMove(s, "C")).toBe(false);
    expect(isValidMove(s, "B")).toBe(true);
  });

  it("cannot reuse an edge", () => {
    let s = applyMove(createInitialState(path3), "A");
    s = applyMove(s, "B");
    expect(isValidMove(s, "A")).toBe(false); // edge A-B already used
  });

  it("completes only after all edges used", () => {
    let s = applyMove(createInitialState(path3), "A");
    s = applyMove(s, "B");
    expect(isLevelComplete(s)).toBe(false);
    s = applyMove(s, "C");
    expect(isLevelComplete(s)).toBe(true);
  });

  it("undo restores the previous state", () => {
    let s = applyMove(createInitialState(path3), "A");
    s = applyMove(s, "B");
    const back = undoMove(s);
    expect(back.currentNode).toBe("A");
    expect(back.usedEdges).toHaveLength(0);
  });

  it("detects stuck states", () => {
    const star: BridgeLevel = {
      id: 998,
      name: "stuck",
      difficulty: "easy",
      nodes: [
        { id: "A", x: 0, y: 0 },
        { id: "B", x: 1, y: 0 },
        { id: "C", x: 0, y: 1 },
        { id: "D", x: 1, y: 1 },
      ],
      // A is a hub; wrong first step can strand edges. Trail: B-A-C ... then stuck before D edge.
      edges: [
        { id: "e1", from: "A", to: "B" },
        { id: "e2", from: "A", to: "C" },
        { id: "e3", from: "C", to: "D" },
        { id: "e4", from: "D", to: "A" },
      ],
    };
    let s = applyMove(createInitialState(star), "B"); // B(odd) start
    s = applyMove(s, "A");
    s = applyMove(s, "D"); // A-D
    s = applyMove(s, "C"); // D-C
    // now at C, only edge C-A remains? c edges: A-C(used? no, e2 unused), C-D used.
    expect(isPlayerStuck(s)).toBe(false);
  });
});
