import { ScreenShell } from "./ScreenShell";
import { Button } from "../ui/Button";
import type { GameAudio } from "../../hooks/useGameAudio";

interface SettingsProps {
  audio: GameAudio;
  onBack: () => void;
}

function Toggle({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      role="switch"
      aria-checked={value}
      aria-label={label}
      onClick={() => onChange(!value)}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
        background: "var(--input-background)",
        border: "2px solid rgba(184,151,95,0.4)",
        borderRadius: 12,
        padding: "12px 14px",
        cursor: "pointer",
      }}
    >
      <span style={{ fontSize: 15, fontWeight: 700, color: "var(--ink-dark)" }}>{label}</span>
      <span
        style={{
          width: 48,
          height: 28,
          borderRadius: 999,
          background: value ? "var(--bamboo-green)" : "rgba(42,36,24,0.2)",
          position: "relative",
          transition: "background 0.15s ease",
        }}
      >
        <span
          style={{
            position: "absolute",
            top: 3,
            left: value ? 23 : 3,
            width: 22,
            height: 22,
            borderRadius: "50%",
            background: "#fff",
            transition: "left 0.15s ease",
            boxShadow: "0 1px 3px rgba(0,0,0,0.25)",
          }}
        />
      </span>
    </button>
  );
}

export function Settings({ audio, onBack }: SettingsProps) {
  return (
    <ScreenShell title="Cài đặt" onBack={onBack}>
      <Toggle label="Nhạc nền" value={audio.musicEnabled} onChange={audio.setMusicEnabled} />
      <Toggle label="Âm thanh (SFX)" value={audio.sfxEnabled} onChange={audio.setSfxEnabled} />
      <Button onClick={onBack}>Về game</Button>
    </ScreenShell>
  );
}
