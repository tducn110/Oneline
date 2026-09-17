import { useTranslation } from "react-i18next";
import { Button } from "../ui/Button";
import { ScreenShell } from "./ScreenShell";
import { TOTAL_LEVELS } from "../../constants/gameConfig";
import type { LocalStatsApi } from "../../hooks/useLocalStats";

interface DashboardProps {
  playerName: string;
  statsApi: LocalStatsApi;
  onPlay: () => void;
  onBack: () => void;
}

function rankTitle(stars: number, t: (k: string) => string): string {
  if (stars >= 90) return t("dashboard.ranks.master");
  if (stars >= 60) return t("dashboard.ranks.expert");
  if (stars >= 30) return t("dashboard.ranks.traveler");
  if (stars >= 10) return t("dashboard.ranks.visitor");
  return t("dashboard.ranks.novice");
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        background: "rgba(255,245,211,0.9)",
        border: "2px solid rgba(185,132,57,0.28)",
        borderRadius: 10,
        padding: "10px 12px",
        flex: 1,
        minWidth: 90,
      }}
    >
      <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--pencil-gray)" }}>
        {label}
      </div>
      <div style={{ fontSize: 22, fontWeight: 800, color: "var(--ink-dark)" }}>{value}</div>
    </div>
  );
}

export function Dashboard({ playerName, statsApi, onPlay, onBack }: DashboardProps) {
  const { t } = useTranslation();
  const { stats } = statsApi;
  return (
    <ScreenShell title={t("dashboard.title")} onBack={onBack} maxWidth={520}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontSize: 18, fontWeight: 800, color: "var(--ink-dark)" }}>{playerName}</div>
          <div style={{ fontSize: 12, fontWeight: 600, color: "var(--bamboo-green)" }}>{rankTitle(stats.totalStars, t)}</div>
        </div>
        <Button onClick={onPlay}>{t("common.playNow")}</Button>
      </div>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <StatCard label={t("dashboard.highScore")} value={String(stats.bestScore)} />
        <StatCard label={t("dashboard.totalStars")} value={`${stats.totalStars}★`} />
        <StatCard label={t("dashboard.completed")} value={`${stats.completedLevels}/${TOTAL_LEVELS}`} />
        <StatCard label={t("dashboard.totalGames")} value={String(stats.totalGames)} />
      </div>

      <div>
        <div style={{ fontSize: 12, fontWeight: 700, color: "var(--pencil-gray)", marginBottom: 6 }}>{t("dashboard.recent")}</div>
        {stats.history.length === 0 ? (
          <p style={{ margin: 0, fontSize: 13, fontWeight: 500, color: "var(--body-text)" }}>
            {t("dashboard.noGames")}
          </p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 6, maxHeight: 180, overflowY: "auto" }}>
            {stats.history.map((h, i) => (
              <div
                key={`${h.date}-${i}`}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  background: "var(--input-background)",
                  borderRadius: 8,
                  padding: "8px 10px",
                  fontSize: 13,
                  fontWeight: 600,
                  color: "var(--body-text)",
                }}
              >
                <span>{t("game.level", { level: h.levelId })}</span>
                <span style={{ color: "var(--mascot-yellow)" }}>{"★".repeat(h.stars)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </ScreenShell>
  );
}
