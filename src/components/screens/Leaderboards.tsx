import { useTranslation } from "react-i18next";
import { ScreenShell } from "./ScreenShell";
import type { LocalStatsApi } from "../../hooks/useLocalStats";

interface LeaderboardsProps {
  playerName: string;
  statsApi: LocalStatsApi;
  onBack: () => void;
}

interface Row {
  name: string;
  score: number;
  you?: boolean;
}

// Local mock opponents so the board never feels empty (no backend, DESIGN §18).
const MOCK: Row[] = [
  { name: "Bé Na", score: 1840 },
  { name: "Chú Tư", score: 1520 },
  { name: "Cô Ba", score: 1190 },
  { name: "Anh Bảy", score: 860 },
  { name: "Út Cưng", score: 540 },
];

export function Leaderboards({ playerName, statsApi, onBack }: LeaderboardsProps) {
  const { t } = useTranslation();
  const me: Row = { name: playerName, score: statsApi.stats.bestScore, you: true };
  const rows = [...MOCK, me].sort((a, b) => b.score - a.score);

  return (
    <ScreenShell title={t("leaderboard.title")} onBack={onBack}>
      {statsApi.stats.bestScore === 0 && (
        <p style={{ margin: 0, fontSize: 13, fontWeight: 500, color: "var(--body-text)" }}>
          {t("leaderboard.empty")}
        </p>
      )}
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {rows.map((r, i) => (
          <div
            key={`${r.name}-${i}`}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              background: r.you ? "rgba(232,116,50,0.14)" : "var(--input-background)",
              border: r.you ? "2px solid var(--orange-cta)" : "2px solid transparent",
              borderRadius: 10,
              padding: "9px 12px",
            }}
          >
            <span style={{ fontSize: 16, fontWeight: 800, color: "var(--pencil-gray)", width: 24 }}>{i + 1}</span>
            <span style={{ flex: 1, fontSize: 14, fontWeight: 700, color: "var(--ink-dark)" }}>
              {r.name} {r.you && <span style={{ fontSize: 11, color: "var(--orange-cta)" }}>{t("leaderboard.you")}</span>}
            </span>
            <span style={{ fontSize: 15, fontWeight: 800, color: "var(--ink-dark)" }}>{r.score}</span>
          </div>
        ))}
      </div>
    </ScreenShell>
  );
}
