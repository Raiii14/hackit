import { motion } from "motion/react";

interface CashHealthGaugeProps {
  score: number; // 0–100
  size?: number;
}

const STATUS_COLOR = {
  red: "#dc2626",
  yellow: "#d97706",
  green: "#16a34a",
};

const STATUS_LABEL = {
  red: "Danger Zone",
  yellow: "Caution Zone",
  green: "Safe Zone",
};

export function CashHealthGauge({ score, size = 280 }: CashHealthGaugeProps) {
  const cx = size / 2;
  const cy = Math.round(size * 0.53);
  const r = Math.round(size * 0.4);
  const sw = Math.round(size * 0.115);

  const toRad = (a: number) => (a * Math.PI) / 180;
  const pt = (a: number, radius = r) => ({
    x: +(cx + radius * Math.cos(toRad(a))).toFixed(2),
    y: +(cy + radius * Math.sin(toRad(a))).toFixed(2),
  });

  // Gauge: 180° (left) → 360°/0° (right) clockwise through 270° (top)
  const arcD = (a: number, b: number, radius = r) => {
    const s = pt(a, radius);
    const e = pt(b, radius);
    return `M ${s.x} ${s.y} A ${radius} ${radius} 0 0 1 ${e.x} ${e.y}`;
  };

  const clampedScore = Math.max(0, Math.min(100, score));
  const status = clampedScore >= 66 ? "green" : clampedScore >= 33 ? "yellow" : "red";
  const color = STATUS_COLOR[status];

  // Needle starts pointing UP (270°), rotate to map score→angle
  const needleRotate = -90 + (clampedScore / 100) * 180;
  const svgH = cy + sw / 2 + 56;

  const tickAt = (angle: number) => {
    const outer = pt(angle, r + sw / 2 + 1);
    const inner = pt(angle, r - sw / 2 - 1);
    return (
      <line
        key={angle}
        x1={outer.x} y1={outer.y}
        x2={inner.x} y2={inner.y}
        stroke="white" strokeWidth={2.5}
      />
    );
  };

  return (
    <svg width={size} height={svgH} viewBox={`0 0 ${size} ${svgH}`}>
      {/* Background */}
      <path d={arcD(180, 360)} fill="none" stroke="#e2e8f0" strokeWidth={sw} strokeLinecap="butt" />

      {/* Red zone: 180–240 */}
      <path
        d={arcD(180, 240)} fill="none" stroke="#ef4444" strokeWidth={sw}
        strokeLinecap="butt" opacity={status === "red" ? 1 : 0.3}
      />
      {/* Yellow zone: 240–300 */}
      <path
        d={arcD(240, 300)} fill="none" stroke="#f59e0b" strokeWidth={sw}
        strokeLinecap="butt" opacity={status === "yellow" ? 1 : 0.3}
      />
      {/* Green zone: 300–360 */}
      <path
        d={arcD(300, 360)} fill="none" stroke="#22c55e" strokeWidth={sw}
        strokeLinecap="butt" opacity={status === "green" ? 1 : 0.3}
      />

      {/* Zone dividers */}
      {tickAt(240)}
      {tickAt(300)}

      {/* Zone labels */}
      {(["R", "Y", "G"] as const).map((z, i) => {
        const angles = [210, 270, 330];
        const colors = ["#dc2626", "#d97706", "#16a34a"];
        const labelR = r - sw / 2 - 8;
        const p = pt(angles[i], labelR);
        return (
          <text key={z} x={p.x} y={p.y} textAnchor="middle" dominantBaseline="middle"
            fill={colors[i]} fontSize={size * 0.032} fontWeight="600" opacity="0.75">
            {z}
          </text>
        );
      })}

      {/* Needle */}
      <motion.g
        style={{ transformOrigin: `${cx}px ${cy}px` }}
        animate={{ rotate: needleRotate }}
        initial={{ rotate: -90 }}
        transition={{ type: "spring", stiffness: 90, damping: 16 }}
      >
        <line
          x1={cx} y1={cy}
          x2={cx} y2={cy - r * 0.86}
          stroke={color} strokeWidth={3.5} strokeLinecap="round"
        />
      </motion.g>

      {/* Hub */}
      <circle cx={cx} cy={cy} r={sw * 0.3} fill={color} />
      <circle cx={cx} cy={cy} r={sw * 0.15} fill="white" />

      {/* Status label */}
      <text
        x={cx} y={cy + sw * 0.5 + 20}
        textAnchor="middle" fill={color}
        fontSize={size * 0.063} fontWeight="700"
      >
        {STATUS_LABEL[status]}
      </text>
      <text
        x={cx} y={cy + sw * 0.5 + 40}
        textAnchor="middle" fill="#6b7280"
        fontSize={size * 0.037}
      >
        Score: {Math.round(clampedScore)} / 100
      </text>
    </svg>
  );
}
