import { useMemo } from "react";
import type { BridgeLevel } from "../../types";
import type { GameTheme } from "./gameThemes";

interface GameBoardProps {
  level: BridgeLevel;
  used: Set<string>;
  currentNode: string | null;
  validStarts: string[];
  hintEdgeId: string | null;
  disabled?: boolean;
  theme: GameTheme;
  onTapNode: (nodeId: string) => void;
}

const VB = 100; // viewBox units

/**
 * SVG renderer for the bridge board (DESIGN.md §13, §24 renderer boundary).
 * Pure presentation: it receives state and emits node taps only.
 */
export function GameBoard({
  level,
  used,
  currentNode,
  validStarts,
  hintEdgeId,
  disabled,
  theme,
  onTapNode,
}: GameBoardProps) {
  const pos = useMemo(() => {
    const m: Record<string, { x: number; y: number }> = {};
    for (const n of level.nodes) m[n.id] = { x: n.x * VB, y: n.y * VB };
    return m;
  }, [level]);

  return (
    <div
      role="application"
      aria-label="Bàn chơi Cầu Tre Một Nét"
      style={{
        background: theme.boardFrameBg,
        borderRadius: "var(--r-panel)",
        padding: 8,
        border: `3px solid ${theme.boardFrameBorder}`,
        boxShadow: "0 3px 0 rgba(115, 76, 38, 0.18) inset",
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      <svg
        viewBox={`0 0 ${VB} ${VB}`}
        width="100%"
        style={{
          display: "block",
          aspectRatio: "1 / 1",
          background: theme.boardBg,
          borderRadius: 12,
          touchAction: "none",
          overscrollBehavior: "contain",
          userSelect: "none",
        }}
      >
        {/* gentle water ripples */}
        <g opacity="0.18" stroke="#5b8c86" strokeWidth="0.6" fill="none">
          <path d="M8 24 q6 -3 12 0 t12 0" />
          <path d="M62 80 q6 -3 12 0 t12 0" />
        </g>

        {/* bridges */}
        {level.edges.map((e) => {
          const a = pos[e.from];
          const b = pos[e.to];
          const isUsed = used.has(e.id);
          const isHint = hintEdgeId === e.id;
          return (
            <g key={e.id}>
              {/* shadow/base plank */}
              <line
                x1={a.x}
                y1={a.y}
                x2={b.x}
                y2={b.y}
                stroke={isUsed ? theme.bridgeUsed : theme.bridgeUnused}
                strokeWidth={isUsed ? 3.6 : 2}
                strokeLinecap="round"
                strokeDasharray={isUsed ? undefined : "0.1 3.4"}
                opacity={isUsed ? 1 : 0.95}
              />
              {/* plank texture lines for used bridges (non-color cue, DESIGN §accessibility) */}
              {isUsed && (
                <line
                  x1={a.x}
                  y1={a.y}
                  x2={b.x}
                  y2={b.y}
                  stroke="#fbe7c4"
                  strokeWidth={0.7}
                  strokeDasharray="1.4 1.6"
                  strokeLinecap="round"
                  opacity={0.7}
                />
              )}
              {isHint && (
                <line
                  x1={a.x}
                  y1={a.y}
                  x2={b.x}
                  y2={b.y}
                  stroke="var(--orange-cta)"
                  strokeWidth={4.6}
                  strokeLinecap="round"
                  opacity={0.45}
                />
              )}
            </g>
          );
        })}

        {/* nodes */}
        {level.nodes.map((n) => {
          const p = pos[n.id];
          const isCurrent = currentNode === n.id;
          const isStartOption = currentNode === null && validStarts.includes(n.id);
          const fill = isCurrent ? theme.nodeActive : isStartOption ? theme.nodeStart : theme.nodeFill;
          const textColor = isCurrent || isStartOption ? "#fff" : theme.nodeBorder;
          return (
            <g
              key={n.id}
              onPointerDown={(ev) => {
                ev.preventDefault();
                if (!disabled) onTapNode(n.id);
              }}
              style={{ cursor: disabled ? "default" : "pointer" }}
            >
              {/* large invisible hitbox for easy tapping */}
              <circle cx={p.x} cy={p.y} r={9} fill="transparent" />
              {isStartOption && (
                <circle cx={p.x} cy={p.y} r={6.6} fill="none" stroke={theme.nodeStart} strokeWidth={0.8} opacity={0.6}>
                  <animate attributeName="r" values="5.8;7.2;5.8" dur="1.6s" repeatCount="indefinite" />
                </circle>
              )}
              <circle
                cx={p.x}
                cy={p.y}
                r={4.4}
                fill={fill}
                stroke={isCurrent ? "#fff" : theme.nodeBorder}
                strokeWidth={1.2}
              />
              <text
                x={p.x}
                y={p.y + 1.6}
                textAnchor="middle"
                fontSize={3.4}
                fontWeight={800}
                fill={textColor}
                style={{ pointerEvents: "none" }}
              >
                {n.id}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
