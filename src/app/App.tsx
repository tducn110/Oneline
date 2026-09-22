import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { CountrysideBackdrop } from "../components/background/CountrysideBackdrop";
import { Game } from "../components/game/Game";
import { Login } from "../components/screens/Login";
import { Dashboard } from "../components/screens/Dashboard";
import { Leaderboards } from "../components/screens/Leaderboards";
import { Settings } from "../components/screens/Settings";
import { useGameAudio } from "../hooks/useGameAudio";
import { useLocalStats } from "../hooks/useLocalStats";
import { STORAGE_KEYS } from "../constants/gameConfig";
import type { Screen } from "../types";
import { useWinkIntegration } from "../integrations/wink/useWinkIntegration";
import { preloadCriticalResources, preloadNonCriticalResources } from "../utils/game-loader";
import { completeGameLoading, onGameLoadingDismiss, setGameLoadingProgress } from "../utils/loading-controller";


export default function App() {
  const { t } = useTranslation();
  // Unified PapaStudio loading screen lifecycle barrier
  useEffect(() => {
    setGameLoadingProgress(25);
    const criticalPromise = preloadCriticalResources((pct) => {
      setGameLoadingProgress(Math.min(95, pct));
    });
    void Promise.allSettled([criticalPromise]).then(() => {
      completeGameLoading();
    });
    const unbind = onGameLoadingDismiss(() => {
      preloadNonCriticalResources();
    });
    return unbind;
  }, []);

  useEffect(() => {
    const blockCopyAction = (event: Event) => {
      event.preventDefault();
    };

    document.addEventListener("copy", blockCopyAction, true);
    document.addEventListener("cut", blockCopyAction, true);
    document.addEventListener("selectstart", blockCopyAction, true);
    document.addEventListener("dragstart", blockCopyAction, true);
    document.addEventListener("contextmenu", blockCopyAction, true);

    return () => {
      document.removeEventListener("copy", blockCopyAction, true);
      document.removeEventListener("cut", blockCopyAction, true);
      document.removeEventListener("selectstart", blockCopyAction, true);
      document.removeEventListener("dragstart", blockCopyAction, true);
      document.removeEventListener("contextmenu", blockCopyAction, true);
    };
  }, []);

  const audio = useGameAudio();
  const statsApi = useLocalStats();
  const wink = useWinkIntegration();

  const [playerName, setPlayerName] = useState<string>(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.player) ?? "";
    } catch {
      return "";
    }
  });
  const [screen, setScreen] = useState<Screen>(() => (playerName ? "game" : "login"));

  // If Wink host provides player display name, adopt it automatically
  useEffect(() => {
    if (wink.displayName && !playerName) {
      setPlayerName(wink.displayName);
      setScreen("game");
    }
  }, [wink.displayName, playerName]);

  // Sync mute with Wink host
  useEffect(() => {
    if (wink.parentMuted) {
      audio.setSfxEnabled(false);
    }
  }, [wink.parentMuted, audio]);

  const enter = (name: string, _isGuest: boolean) => {
    setPlayerName(name);
    try {
      localStorage.setItem(STORAGE_KEYS.player, name);
    } catch {
      /* ignore */
    }
    setScreen("game");
  };

  // Resume at the player's highest unlocked level.
  const resumeLevel = Math.min(statsApi.stats.highestLevel || 1, 100);

  return (
    <div
      style={{
        minHeight: "100dvh",
        width: "100vw",
        overflowX: "hidden",
        overflowY: "auto",
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        fontFamily: '"Be Vietnam Pro", sans-serif',
      }}
    >
      <CountrysideBackdrop />

      <main
        style={{
          position: "relative",
          zIndex: 1,
          width: "100%",
          maxWidth: 540,
          padding: 20,
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          gap: 20,
        }}
      >
        {screen === "login" && <Login onEnter={enter} />}

        {/* Game stays mounted (but input-disabled) under support screens so state persists. */}
        {screen !== "login" && (
          <div style={{ display: screen === "game" ? "block" : "none" }}>
            <Game
              initialLevelId={resumeLevel}
              playerName={playerName || t("common.guest")}
              audio={audio}
              statsApi={statsApi}
              inputEnabled={screen === "game"}
              onNavigate={setScreen}
            />
          </div>
        )}

        {screen === "dashboard" && (
          <Dashboard
            playerName={playerName || t("common.guest")}
            statsApi={statsApi}
            onPlay={() => setScreen("game")}
            onBack={() => setScreen("game")}
          />
        )}
        {screen === "leaderboards" && (
          <Leaderboards playerName={playerName || t("common.guest")} statsApi={statsApi} onBack={() => setScreen("game")} />
        )}
        {screen === "settings" && <Settings audio={audio} onBack={() => setScreen("game")} />}
      </main>
    </div>
  );
}