import { theme } from "../../lib/theme";

interface StepHeaderProps {
  eyebrow: string;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export function StepHeader({ eyebrow, title, description, action }: StepHeaderProps) {
  return (
    <div
      className="rounded-3xl p-6 flex items-start justify-between gap-4"
      style={{ background: theme.ink, color: theme.canvas }}
    >
      <div>
        <div
          className="flex items-center gap-2"
          style={{
            color: "#FFD8C6",
            fontSize: "0.76rem",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            marginBottom: 10,
          }}
        >
          <span
            style={{
              width: 7,
              height: 7,
              borderRadius: "50%",
              background: theme.orange,
              display: "inline-block",
            }}
          />
          {eyebrow}
        </div>
        <h1 style={{ color: theme.canvas, marginBottom: 6, fontWeight: 600, fontSize: "1.5rem" }}>
          {title}
        </h1>
        <p style={{ color: "rgba(243,240,238,0.72)", fontSize: "0.9rem", margin: 0, maxWidth: 520 }}>
          {description}
        </p>
      </div>
      {action}
    </div>
  );
}
