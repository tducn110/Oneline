import type { ButtonHTMLAttributes, ReactNode } from "react";

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string; // required for accessibility
  children: ReactNode;
}

/** Round top-action button per DESIGN.md §10. `label` becomes aria-label. */
export function IconButton({ label, children, style, ...rest }: IconButtonProps) {
  return (
    <button
      {...rest}
      aria-label={label}
      title={label}
      style={{
        width: 40,
        height: 40,
        borderRadius: "50%",
        border: "2px solid rgba(184, 151, 95, 0.6)",
        background: "var(--cream-card)",
        color: "var(--ink-dark)",
        display: "grid",
        placeItems: "center",
        cursor: "pointer",
        boxShadow: "0 3px 0 rgba(48, 31, 18, 0.2)",
        flex: "0 0 auto",
        ...style,
      }}
    >
      {children}
    </button>
  );
}
