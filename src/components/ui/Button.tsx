import type { ButtonHTMLAttributes, CSSProperties, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger";
  children: ReactNode;
}

/** Primary / secondary buttons per DESIGN.md §14. */
export function Button({ variant = "primary", children, style, ...rest }: ButtonProps) {
  const base: CSSProperties = {
    borderRadius: "var(--r-btn)",
    padding: "11px 18px",
    fontSize: 15,
    fontWeight: 800,
    cursor: rest.disabled ? "not-allowed" : "pointer",
    opacity: rest.disabled ? 0.55 : 1,
    transition: "transform 0.06s ease, filter 0.12s ease",
    border: "2px solid",
    lineHeight: 1.1,
  };

  const variants: Record<string, CSSProperties> = {
    primary: {
      background: "linear-gradient(180deg, #ff7b38 0%, #e95b22 100%)",
      borderColor: "#c74818",
      color: "#fff",
      boxShadow: "0 3px 0 #b23a11, 0 8px 16px rgba(182, 72, 18, 0.28)",
    },
    secondary: {
      background: "var(--cream-card)",
      borderColor: "rgba(42, 36, 24, 0.16)",
      color: "var(--ink-dark)",
      fontWeight: 700,
      boxShadow: "0 2px 0 rgba(42, 36, 24, 0.12)",
    },
    danger: {
      background: "linear-gradient(180deg, #d6504f 0%, #c23838 100%)",
      borderColor: "#9c2a2a",
      color: "#fff",
      boxShadow: "0 3px 0 #8c2424",
    },
  };

  return (
    <button
      {...rest}
      style={{ ...base, ...variants[variant], ...style }}
      onMouseDown={(e) => (e.currentTarget.style.transform = "translateY(2px)")}
      onMouseUp={(e) => (e.currentTarget.style.transform = "translateY(0)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
    >
      {children}
    </button>
  );
}
