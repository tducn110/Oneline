import type { ReactNode } from "react";
import { RotateCcw, Undo2, Lightbulb } from "lucide-react";
import { useTranslation } from "react-i18next";

interface GameHUDProps {
  levelId: number;
  levelName: string;
  bridgesLeft: number;
  totalBridges: number;
  bestStars: number;
  canUndo: boolean;
  onReset: () => void;
  onUndo: () => void;
  onHint: () => void;
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        background: "rgba(255, 245, 211, 0.9)",
        borderRadius: 8,
        border: "2px solid rgba(185, 132, 57, 0.28)",
        padding: "7px 10px",
        minHeight: 56,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        boxSizing: "border-box",
        flex: 1,
      }}
    >
      <span
        style={{
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: "var(--pencil-gray)",
        }}
      >
        {label}
      </span>
      <span style={{ fontSize: 21, fontWeight: 800, color: "var(--ink-dark)" }}>{value}</span>
    </div>
  );
}

export function GameHUD({
  levelId,
  bridgesLeft,
  totalBridges,
  bestStars,
  canUndo,
  onReset,
  onUndo,
  onHint,
}: GameHUDProps) {
  const { t } = useTranslation();
  const hudBtn = (label: string, onClick: () => void, disabled: boolean, icon: ReactNode) => (
    <button
      aria-label={label}
      title={label}
      onClick={onClick}
      disabled={disabled}
      style={{
        flex: 1,
        height: 44,
        borderRadius: 10,
        border: "2px solid rgba(42, 36, 24, 0.14)",
        background: "var(--cream-card)",
        color: "var(--ink-dark)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
        fontSize: 13,
        fontWeight: 700,
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.5 : 1,
        boxShadow: "0 2px 0 rgba(42, 36, 24, 0.12)",
      }}
    >
      {icon}
      {label}
    </button>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <div style={{ display: "flex", gap: 8 }}>
        <Stat label={t("game.level", { level: "" }).trim()} value={String(levelId)} />
        <Stat label={t("game.bridgesLeft")} value={`${bridgesLeft}/${totalBridges}`} />
        <Stat label={t("game.best")} value={bestStars > 0 ? `${bestStars}★` : "—"} />
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        {hudBtn(t("common.undo"), onUndo, !canUndo, <Undo2 size={16} />)}
        {hudBtn(t("common.hint"), onHint, false, <Lightbulb size={16} />)}
        {hudBtn(t("common.retry"), onReset, false, <RotateCcw size={16} />)}
      </div>
    </div>
  );
}
