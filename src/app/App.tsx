import { useState } from "react";
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

export default function App() {
  const audio = useGameAudio();
  const statsApi = useLocalStats();

  const [playerName, setPlayerName] = useState<string>(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.player) ?? "";
    } catch {
      return "";
    }
  });
  const [screen, setScreen] = useState<Screen>(() => (playerName ? "game" : "login"));

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
  const resumeLevel = Math.min(statsApi.stats.highestLevel || 1, 40);

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
              playerName={playerName || "Khách"}
              audio={audio}
              statsApi={statsApi}
              inputEnabled={screen === "game"}
              onNavigate={setScreen}
            />
          </div>
        )}

        {screen === "dashboard" && (
          <Dashboard
            playerName={playerName || "Khách"}
            statsApi={statsApi}
            onPlay={() => setScreen("game")}
            onBack={() => setScreen("game")}
          />
        )}
        {screen === "leaderboards" && (
          <Leaderboards playerName={playerName || "Khách"} statsApi={statsApi} onBack={() => setScreen("game")} />
        )}
        {screen === "settings" && <Settings audio={audio} onBack={() => setScreen("game")} />}
      </main>
    </div>
  );
}
