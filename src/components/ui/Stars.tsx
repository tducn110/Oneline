import { Star } from "lucide-react";

export function Stars({ value, size = 22 }: { value: number; size?: number }) {
  return (
    <div style={{ display: "flex", gap: 6 }} aria-label={`${value} trên 3 sao`}>
      {[1, 2, 3].map((i) => (
        <Star
          key={i}
          size={size}
          strokeWidth={2}
          color="#c79a52"
          fill={i <= value ? "var(--mascot-yellow)" : "transparent"}
        />
      ))}
    </div>
  );
}
