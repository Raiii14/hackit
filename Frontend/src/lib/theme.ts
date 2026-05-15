/** LoanWise design tokens — aligned with DESIGN.md / LandingPage */
export const theme = {
  canvas: "#F3F0EE",
  paper: "#FCFBFA",
  ink: "#141413",
  charcoal: "#262627",
  slate: "#696969",
  line: "#D1CDC7",
  orange: "#F37338",
  rust: "#CF4500",
  green: "#168345",
  amber: "#9A5A00",
  danger: "#B42318",
  white: "#FFFFFF",
} as const;

export const statusColors = {
  green: { bg: "#E7F3EA", border: "#B8D9C0", text: theme.green, dot: theme.green },
  yellow: { bg: "#FFF6E8", border: "#F0D9A8", text: theme.amber, dot: theme.orange },
  red: { bg: "#FDECEC", border: "#F0B8B8", text: theme.danger, dot: theme.danger },
} as const;

export const card = {
  background: theme.paper,
  border: `1px solid ${theme.line}`,
  borderRadius: 24,
  boxShadow: "rgba(0, 0, 0, 0.04) 0px 4px 24px 0px",
} as const;

export const cardFlat = {
  background: theme.paper,
  border: `1px solid ${theme.line}`,
  borderRadius: 24,
} as const;

export const pillButton = {
  background: theme.ink,
  color: theme.canvas,
  border: `1.5px solid ${theme.ink}`,
  borderRadius: 20,
} as const;

export const pillButtonOutline = {
  background: theme.white,
  color: theme.ink,
  border: `1.5px solid ${theme.ink}`,
  borderRadius: 20,
} as const;

export const inputStyle = {
  width: "100%",
  padding: "11px 14px",
  border: `1.5px solid ${theme.line}`,
  borderRadius: 20,
  backgroundColor: theme.white,
  color: theme.ink,
  fontSize: "0.95rem",
  outline: "none",
  transition: "border-color 0.15s",
} as const;
