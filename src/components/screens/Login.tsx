import { useState } from "react";
import { Button } from "../ui/Button";
import { Mascot } from "../game/Mascot";

interface LoginProps {
  onEnter: (name: string, isGuest: boolean) => void;
}

export function Login({ onEnter }: LoginProps) {
  const [name, setName] = useState("");

  return (
    <div
      style={{
        background: "var(--cream-card)",
        border: "2px solid rgba(184,151,95,0.5)",
        borderRadius: "var(--r-card)",
        boxShadow: "var(--shadow-panel)",
        width: "100%",
        maxWidth: 390,
        margin: "0 auto",
        padding: 22,
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 16,
      }}
    >
      <Mascot emoji="🐃" size={90} />
      <div style={{ textAlign: "center" }}>
        <h1 style={{ margin: 0, fontSize: 28, fontWeight: 800, color: "var(--ink-dark)" }}>Cầu Tre Một Nét</h1>
        <p style={{ margin: "6px 0 0", fontSize: 13, fontWeight: 600, color: "var(--body-text)" }}>
          Nhập tên để lưu điểm
          <br />
          hoặc chơi khách trên thiết bị này
        </p>
      </div>

      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Tên của bạn"
        maxLength={16}
        onKeyDown={(e) => e.key === "Enter" && name.trim() && onEnter(name.trim(), false)}
        style={{
          width: "100%",
          boxSizing: "border-box",
          padding: "12px 14px",
          borderRadius: "var(--r-btn)",
          border: "2px solid rgba(184,151,95,0.5)",
          background: "var(--input-background)",
          color: "var(--ink-dark)",
          fontSize: 15,
          fontWeight: 600,
        }}
      />

      <div style={{ display: "flex", gap: 10, width: "100%" }}>
        <Button style={{ flex: 1 }} disabled={!name.trim()} onClick={() => onEnter(name.trim(), false)}>
          Chơi ngay
        </Button>
        <Button variant="secondary" style={{ flex: 1 }} onClick={() => onEnter("Khách", true)}>
          Chơi khách
        </Button>
      </div>
      <p style={{ margin: 0, fontSize: 11, fontWeight: 500, color: "var(--pencil-gray)", textAlign: "center" }}>
        Điểm khách vẫn được lưu cục bộ trên thiết bị này.
      </p>
    </div>
  );
}
