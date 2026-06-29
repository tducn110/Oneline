export type MascotMood = "idle" | "happy" | "sad";

/** Small playful mascot (DESIGN.md §11). Subtle idle breathing only. */
export function Mascot({ emoji, mood = "idle", size = 64 }: { emoji: string; mood?: MascotMood; size?: number }) {
  const face = mood === "happy" ? "😄" : mood === "sad" ? "😟" : "";
  return (
    <div
      aria-hidden
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: "rgba(255, 245, 211, 0.9)",
        border: "2px solid rgba(184, 151, 95, 0.5)",
        display: "grid",
        placeItems: "center",
        fontSize: size * 0.5,
        position: "relative",
        boxShadow: "0 4px 0 rgba(48, 31, 18, 0.12)",
        animation: mood === "idle" ? "ctm-breathe 3.2s ease-in-out infinite" : "ctm-pop 0.3s ease",
      }}
    >
      <span>{emoji}</span>
      {face && (
        <span style={{ position: "absolute", bottom: -6, right: -4, fontSize: size * 0.32 }}>{face}</span>
      )}
    </div>
  );
}
