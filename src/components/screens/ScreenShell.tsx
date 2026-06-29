import { ArrowLeft } from "lucide-react";
import { IconButton } from "../ui/IconButton";

/** Shared compact card shell for the support screens. */
export function ScreenShell({
  title,
  onBack,
  children,
  maxWidth = 460,
}: {
  title: string;
  onBack: () => void;
  children: React.ReactNode;
  maxWidth?: number;
}) {
  return (
    <div
      style={{
        background: "var(--cream-card)",
        border: "2px solid rgba(184,151,95,0.5)",
        borderRadius: "var(--r-card)",
        boxShadow: "var(--shadow-panel)",
        width: "100%",
        maxWidth,
        margin: "0 auto",
        padding: 18,
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        gap: 14,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <IconButton label="Quay lại" onClick={onBack}>
          <ArrowLeft size={18} />
        </IconButton>
        <h2 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: "var(--ink-dark)" }}>{title}</h2>
      </div>
      {children}
    </div>
  );
}
