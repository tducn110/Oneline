import { useCallback, useEffect, useRef, useState } from "react";
import { STORAGE_KEYS } from "../constants/gameConfig";

export type Sfx = "tap" | "move" | "invalid" | "undo" | "win" | "lose";

interface AudioPrefs {
  musicEnabled: boolean;
  sfxEnabled: boolean;
}

const DEFAULT: AudioPrefs = { musicEnabled: false, sfxEnabled: true };

function load(): AudioPrefs {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.audio);
    if (raw) return { ...DEFAULT, ...JSON.parse(raw) };
  } catch {
    /* ignore */
  }
  return DEFAULT;
}

/**
 * Lightweight WebAudio-based SFX so we ship no binary assets.
 * Respects the sfx/music flags strictly (DESIGN.md §22).
 */
export function useGameAudio() {
  const [prefs, setPrefs] = useState<AudioPrefs>(load);
  const ctxRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.audio, JSON.stringify(prefs));
    } catch {
      /* ignore */
    }
  }, [prefs]);

  const ensureCtx = useCallback(() => {
    if (!ctxRef.current) {
      const Ctor = window.AudioContext || (window as any).webkitAudioContext;
      if (Ctor) ctxRef.current = new Ctor();
    }
    return ctxRef.current;
  }, []);

  const beep = useCallback(
    (freq: number, durMs: number, type: OscillatorType = "sine", gain = 0.06) => {
      const ctx = ensureCtx();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = type;
      osc.frequency.value = freq;
      g.gain.value = gain;
      osc.connect(g).connect(ctx.destination);
      const now = ctx.currentTime;
      g.gain.setValueAtTime(gain, now);
      g.gain.exponentialRampToValueAtTime(0.0001, now + durMs / 1000);
      osc.start(now);
      osc.stop(now + durMs / 1000);
    },
    [ensureCtx]
  );

  const playSfx = useCallback(
    (sfx: Sfx) => {
      if (!prefs.sfxEnabled) return;
      switch (sfx) {
        case "tap":
          beep(420, 70, "triangle");
          break;
        case "move":
          beep(560, 90, "sine");
          break;
        case "invalid":
          beep(150, 160, "sawtooth", 0.05);
          break;
        case "undo":
          beep(320, 90, "sine");
          break;
        case "win":
          beep(660, 120, "triangle");
          setTimeout(() => beep(880, 160, "triangle"), 120);
          break;
        case "lose":
          beep(240, 200, "sawtooth", 0.05);
          break;
      }
    },
    [beep, prefs.sfxEnabled]
  );

  return {
    musicEnabled: prefs.musicEnabled,
    sfxEnabled: prefs.sfxEnabled,
    setMusicEnabled: (v: boolean) => setPrefs((p) => ({ ...p, musicEnabled: v })),
    setSfxEnabled: (v: boolean) => setPrefs((p) => ({ ...p, sfxEnabled: v })),
    playSfx,
  };
}

export type GameAudio = ReturnType<typeof useGameAudio>;
