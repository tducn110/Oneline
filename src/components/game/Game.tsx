import { useCallback, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { LayoutGrid, Trophy, Settings as SettingsIcon, ListTree, Volume2, VolumeX } from "lucide-react";
import { GameBoard } from "./GameBoard";
import { GameHUD } from "./GameHUD";
import { Mascot } from "./Mascot";
import { themeForLevel } from "./gameThemes";
import { IconButton } from "../ui/IconButton";
import { Button } from "../ui/Button";
import { Stars } from "../ui/Stars";
import { useBridgeGame } from "../../hooks/useBridgeGame";
import { BRIDGE_LEVELS } from "../../constants/bridgeLevels";
import { TOTAL_LEVELS } from "../../constants/gameConfig";
import type { GameAudio } from "../../hooks/useGameAudio";
import type { LocalStatsApi } from "../../hooks/useLocalStats";
import type { Screen } from "../../types";
import { useWinkIntegration } from "../../integrations/wink/useWinkIntegration";
import { useRef } from "react";

interface GameProps {
  initialLevelId: number;
  playerName: string;
  audio: GameAudio;
  statsApi: LocalStatsApi;
  inputEnabled: boolean; // false when a support screen is open
  onNavigate: (s: Screen) => void;
}

export function Game({ initialLevelId, playerName, audio, statsApi, inputEnabled, onNavigate }: GameProps) {
  const { t } = useTranslation();
  const [showLevels, setShowLevels] = useState(false);
  const [recorded, setRecorded] = useState(false);
  const wink = useWinkIntegration();
  const roundActiveRef = useRef(false);

  const game = useBridgeGame({
    initialLevelId,
    onInvalid: () => audio.playSfx("invalid"),
    onStart: () => {
      audio.playSfx("tap");
      if (!roundActiveRef.current) {
        wink.gameplayStart();
        roundActiveRef.current = true;
      }
    },
    onMove: () => audio.playSfx("move"),
    onUndo: () => audio.playSfx("undo"),
    onWin: () => {
      audio.playSfx("win");
      if (roundActiveRef.current) {
        wink.gameplayStop();
        roundActiveRef.current = false;
      }
    },
    onStuck: () => {
      audio.playSfx("lose");
      if (roundActiveRef.current) {
        wink.gameplayStop();
        roundActiveRef.current = false;
      }
    },
  });

  const theme = useMemo(() => themeForLevel(game.levelId), [game.levelId]);
  const progress = statsApi.progress[game.levelId];

  // Record completion exactly once per win.
  useEffect(() => {
    if (game.phase === "won" && !recorded) {
      statsApi.recordCompletion(game.levelId, game.stars, game.state.moveCount, game.elapsedMs(), playerName);
      wink.submitFinalScore({ score: statsApi.stats.bestScore || game.levelId * 100 });
      wink.track("level_cleared", { level: game.levelId, stars: game.stars });
      setRecorded(true);
    }
    if (game.phase !== "won" && recorded) setRecorded(false);
  }, [game, playerName, recorded, statsApi, wink]);

  const goLevel = useCallback(
    (id: number) => {
      game.loadLevel(id);
      setShowLevels(false);
    },
    [game]
  );

  const nextLevelId = Math.min(game.levelId + 1, TOTAL_LEVELS);
  const hasNext = game.levelId < TOTAL_LEVELS && statsApi.isUnlocked(nextLevelId);

  const mood = game.phase === "won" ? "happy" : game.phase === "stuck" ? "sad" : "idle";

  return (
    <div
      style={{
        background: theme.panelBackground,
        border: `2px solid ${theme.panelBorder}`,
        borderRadius: "var(--r-card)",
        boxShadow: "var(--shadow-panel)",
        display: "flex",
        flexDirection: "column",
        gap: 14,
        position: "relative",
        width: "100%",
        maxWidth: 390,
        margin: "0 auto",
        padding: "14px 14px 18px",
        boxSizing: "border-box",
        overflow: "hidden",
      }}
    >
      {/* top action buttons */}
      <div style={{ display: "flex", gap: 8, justifyContent: "space-between" }}>
        <div style={{ display: "flex", gap: 8 }}>
          <IconButton label={t("game.levelBoard")} onClick={() => setShowLevels(true)}>
            <ListTree size={18} />
          </IconButton>
          <IconButton label={t("game.dashboard")} onClick={() => onNavigate("dashboard")}>
            <LayoutGrid size={18} />
          </IconButton>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <IconButton
            label={t("settings.soundToggle")}
            onClick={() => audio.setSfxEnabled(!audio.sfxEnabled)}
          >
            {audio.sfxEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
          </IconButton>
          <IconButton label={t("game.leaderboard")} onClick={() => onNavigate("leaderboards")}>
            <Trophy size={18} />
          </IconButton>
          <IconButton label={t("settings.title")} onClick={() => onNavigate("settings")}>
            <SettingsIcon size={18} />
          </IconButton>
        </div>
      </div>

      {/* title */}
      <div style={{ textAlign: "center" }}>
        <h1 style={{ margin: 0, fontSize: 30, fontWeight: 800, color: "var(--ink-dark)", lineHeight: 1.1 }}>
          {t("game.title")}
        </h1>
        <p style={{ margin: "4px 0 0", fontSize: 13, fontWeight: 600, color: "var(--body-text)" }}>
          {t("game.subtitle")}
        </p>
      </div>

      {/* mascot + level name */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, justifyContent: "center" }}>
        <Mascot emoji={theme.mascot} mood={mood} size={62} />
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--pencil-gray)" }}>
            {t("game.level", { level: game.levelId })} · {game.level.difficulty}
          </div>
          <div style={{ fontSize: 18, fontWeight: 800, color: "var(--ink-dark)" }}>{game.level.name}</div>
          <div style={{ fontSize: 12, fontWeight: 600, color: "var(--body-text)" }}>
            {game.state.currentNode === null ? t("game.chooseStart") : t("game.bridgesRemaining", { count: game.bridgesLeft })}
          </div>
        </div>
      </div>

      {/* board + overlays */}
      <div style={{ position: "relative" }}>
        <GameBoard
          level={game.level}
          used={game.used}
          currentNode={game.state.currentNode}
          validStarts={game.validStarts}
          hintEdgeId={game.hintEdgeId}
          theme={theme}
          disabled={!inputEnabled || wink.hostPaused || game.phase === "won"}
          onTapNode={game.tapNode}
        />

        {game.phase === "won" && (
          <Overlay>
            <Stars value={game.stars} size={28} />
            <h2 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: "var(--ink-dark)" }}>{t("game.winTitle")}</h2>
            <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: "var(--body-text)" }}>
              {t("game.winSubtitle", { level: game.levelId })}
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center" }}>
              {hasNext && (
                <Button onClick={() => goLevel(nextLevelId)}>{t("common.next")}</Button>
              )}
              <Button variant="secondary" onClick={game.reset}>{t("common.retry")}</Button>
              <Button variant="secondary" onClick={() => setShowLevels(true)}>{t("game.levelBoard")}</Button>
            </div>
          </Overlay>
        )}

        {game.phase === "stuck" && (
          <Overlay>
            <h2 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: "var(--alert-red)" }}>{t("game.stuckTitle")}</h2>
            <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: "var(--body-text)" }}>
              {t("game.stuckSubtitle")}
            </p>
            <div style={{ display: "flex", gap: 8 }}>
              <Button onClick={game.undo}>{t("common.undo")}</Button>
              <Button variant="secondary" onClick={game.reset}>{t("common.retry")}</Button>
            </div>
          </Overlay>
        )}
      </div>

      {/* HUD */}
      <GameHUD
        levelId={game.levelId}
        levelName={game.level.name}
        bridgesLeft={game.bridgesLeft}
        totalBridges={game.level.edges.length}
        bestStars={progress?.bestStars ?? 0}
        canUndo={game.canUndo && game.phase !== "won"}
        onReset={game.reset}
        onUndo={game.undo}
        onHint={game.hint}
      />

      {showLevels && (
        <Overlay onClose={() => setShowLevels(false)}>
          <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: "var(--ink-dark)" }}>{t("game.levelBoard")}</h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(5, 1fr)",
              gap: 8,
              maxHeight: 240,
              overflowY: "auto",
              padding: 2,
            }}
          >
            {BRIDGE_LEVELS.map((lv) => {
              const unlocked = statsApi.isUnlocked(lv.id);
              const stars = statsApi.progress[lv.id]?.bestStars ?? 0;
              const isCurrent = lv.id === game.levelId;
              return (
                <button
                  key={lv.id}
                  aria-label={unlocked ? t("game.level", { level: lv.id }) : t("game.levelLocked", { level: lv.id })}
                  disabled={!unlocked}
                  onClick={() => goLevel(lv.id)}
                  style={{
                    aspectRatio: "1/1",
                    borderRadius: 10,
                    border: isCurrent ? "2px solid var(--orange-cta)" : "2px solid rgba(42,36,24,0.14)",
                    background: unlocked ? "var(--cream-card)" : "rgba(42,36,24,0.06)",
                    color: unlocked ? "var(--ink-dark)" : "var(--pencil-gray)",
                    fontWeight: 800,
                    fontSize: 14,
                    cursor: unlocked ? "pointer" : "not-allowed",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {unlocked ? lv.id : "🔒"}
                  {unlocked && stars > 0 && <span style={{ fontSize: 9 }}>{"★".repeat(stars)}</span>}
                </button>
              );
            })}
          </div>
          <Button variant="secondary" onClick={() => setShowLevels(false)}>{t("common.back")}</Button>
        </Overlay>
      )}
    </div>
  );
}

function Overlay({ children, onClose }: { children: ReactNode; onClose?: () => void }) {
  return (
    <div
      onClick={onClose}
      style={{
        position: "absolute",
        inset: 0,
        borderRadius: 20,
        background: "rgba(58, 38, 17, 0.28)",
        backdropFilter: "blur(4px)",
        padding: 16,
        boxSizing: "border-box",
        zIndex: 20,
        animation: "ctm-pop 0.22s ease",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          height: "100%",
          borderRadius: 22,
          background: "var(--cream-card)",
          border: "2px solid rgba(184,151,95,0.5)",
          boxShadow: "0 10px 24px rgba(58,38,17,0.16), 0 2px 0 rgba(255,255,255,0.74) inset",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 14,
          padding: 22,
          boxSizing: "border-box",
        }}
      >
        {children}
      </div>
    </div>
  );
}
