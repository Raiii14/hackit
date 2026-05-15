import { motion } from "motion/react";
import {
  Shield,
  ArrowRight,
  Zap,
  TrendingDown,
  BarChart3,
  BookmarkCheck,
  Lock,
  Users,
  Target,
  AlertTriangle,
} from "lucide-react";
import { Button } from "./ui/button";
import { CashHealthGauge } from "./CashHealthGauge";
import { AppNavbar } from "./AppNavbar";
import { theme } from "../../lib/theme";

interface LandingPageProps {
  onStartTest: () => void;
  onUseAccount: () => void;
  savedCount: number;
}

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  }),
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { delay: 0.32, duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
};

const FEATURES = [
  {
    icon: <BarChart3 size={21} />,
    title: "True Cost Reveal",
    desc: "See the fees, repayment total, and estimated daily cost before the offer becomes a commitment.",
    color: theme.ink,
    bg: "#EFEAE5",
  },
  {
    icon: <TrendingDown size={21} />,
    title: "Stress-Test Resilience",
    desc: "Try generic income drops like 10%, 30%, or 60% and see when cash falls below your buffer.",
    color: theme.rust,
    bg: "#FDE8DC",
  },
  {
    icon: <BookmarkCheck size={21} />,
    title: "Save & Review",
    desc: "Keep checks in local history so the pitch demo can show past offers without requiring login.",
    color: theme.green,
    bg: "#E7F3EA",
  },
];

const STEPS_PREVIEW = [
  {
    num: 1,
    label: "Baseline",
    detail: "Enter the six loan and cash-flow inputs.",
    icon: <Target size={16} />,
  },
  {
    num: 2,
    label: "Verdict",
    detail: "See status, true cost, projected cash, and stress controls in one place.",
    icon: <AlertTriangle size={16} />,
  },
  {
    num: 3,
    label: "History",
    detail: "Save, reload, and compare checks from local history.",
    icon: <BookmarkCheck size={16} />,
  },
];

function MiniMetric({
  label,
  value,
  tone = theme.ink,
}: {
  label: string;
  value: string;
  tone?: string;
}) {
  return (
    <div>
      <div style={{ color: theme.slate, fontSize: "0.76rem", marginBottom: 4 }}>
        {label}
      </div>
      <div style={{ color: tone, fontSize: "1.02rem", fontWeight: 700 }}>
        {value}
      </div>
    </div>
  );
}

export function LandingPage({
  onStartTest,
  onUseAccount,
  savedCount,
}: LandingPageProps) {
  return (
    <div className="min-h-screen" style={{ background: theme.canvas }}>
      <section
        style={{
          background: theme.ink,
          color: theme.canvas,
          minHeight: "720px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            width: 980,
            height: 460,
            left: "50%",
            top: 150,
            border: `1px solid rgba(243, 115, 56, 0.24)`,
            borderRadius: "50%",
            transform: "translateX(-50%) rotate(-8deg)",
            pointerEvents: "none",
          }}
        />
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            width: 560,
            height: 260,
            right: -80,
            top: 260,
            border: `1px solid rgba(243, 115, 56, 0.16)`,
            borderRadius: "50%",
            transform: "rotate(18deg)",
            pointerEvents: "none",
          }}
        />
        <div className="relative z-10 max-w-6xl mx-auto px-5">
          <AppNavbar
            onLogoClick={onStartTest}
            savedCount={savedCount}
            onHistoryClick={onUseAccount}
            onAccountClick={onUseAccount}
          />

          <div
            className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-10 items-center"
            style={{ padding: "72px 0 56px" }}
          >
            <motion.div initial="hidden" animate="visible" style={{ maxWidth: 670 }}>
              <motion.div
                variants={fadeUp}
                custom={0}
                className="flex items-center gap-2"
                style={{
                  color: "#FFD8C6",
                  fontSize: "0.76rem",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  marginBottom: 22,
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
                For sari-sari and small online sellers
              </motion.div>

              <motion.h1
                variants={fadeUp}
                custom={1}
                className="text-5xl md:text-7xl"
                style={{
                  color: theme.canvas,
                  fontWeight: 600,
                  lineHeight: 1,
                  letterSpacing: 0,
                  marginBottom: 24,
                }}
              >
                LoanWise
              </motion.h1>

              <motion.p
                variants={fadeUp}
                custom={2}
                style={{
                  color: "rgba(243,240,238,0.76)",
                  fontSize: "1.12rem",
                  lineHeight: 1.65,
                  maxWidth: 570,
                  marginBottom: 32,
                }}
              >
                A repayment stress simulator that shows whether a loan still fits
                after a bad sales day, a tighter cash buffer, or a 30% income drop.
              </motion.p>

              <motion.div
                variants={fadeUp}
                custom={3}
                className="flex flex-wrap items-center gap-3"
                style={{ marginBottom: 34 }}
              >
                <Button
                  onClick={onStartTest}
                  size="lg"
                  style={{
                    background: theme.canvas,
                    color: theme.ink,
                    border: `1px solid ${theme.canvas}`,
                    borderRadius: 999,
                    minHeight: 52,
                    padding: "0 26px",
                    fontSize: "0.98rem",
                    fontWeight: 600,
                  }}
                >
                  Start free test
                  <ArrowRight size={18} />
                </Button>
                <button
                  onClick={onUseAccount}
                  style={{
                    background: "transparent",
                    border: "1px solid rgba(243,240,238,0.28)",
                    borderRadius: 999,
                    color: theme.canvas,
                    cursor: "pointer",
                    minHeight: 52,
                    padding: "0 24px",
                    fontSize: "0.98rem",
                    fontWeight: 500,
                  }}
                >
                  View history
                </button>
              </motion.div>

              <motion.div
                variants={fadeUp}
                custom={4}
                className="flex flex-wrap gap-x-6 gap-y-3"
                style={{
                  color: "rgba(243,240,238,0.72)",
                  fontSize: "0.84rem",
                }}
              >
                {[
                  { icon: <Users size={14} />, text: "Guest mode first" },
                  { icon: <Lock size={14} />, text: "Private by default" },
                  { icon: <Zap size={14} />, text: "Fast verdict" },
                ].map((badge) => (
                  <span key={badge.text} className="flex items-center gap-1.5">
                    {badge.icon}
                    {badge.text}
                  </span>
                ))}
              </motion.div>
            </motion.div>

            <motion.div
              variants={scaleIn}
              initial="hidden"
              animate="visible"
              className="hidden lg:block"
              aria-label="LoanWise sample verdict preview"
            >
              <div
                style={{
                  background: theme.paper,
                  borderRadius: 40,
                  padding: 28,
                  color: theme.ink,
                  boxShadow: "0 28px 70px rgba(0,0,0,0.28)",
                }}
              >
                <div className="flex items-start justify-between gap-4" style={{ marginBottom: 22 }}>
                  <div>
                    <div style={{ color: theme.slate, fontSize: "0.78rem", marginBottom: 4 }}>
                      Sample verdict
                    </div>
                    <div style={{ color: theme.ink, fontSize: "1.35rem", fontWeight: 700 }}>
                      Manageable now
                    </div>
                  </div>
                  <span
                    style={{
                      background: "#FFF3E9",
                      border: "1px solid #F6C5A6",
                      borderRadius: 999,
                      color: theme.rust,
                      fontSize: "0.76rem",
                      fontWeight: 700,
                      padding: "6px 10px",
                    }}
                  >
                    30% drop turns risky
                  </span>
                </div>

                <div className="flex justify-center" style={{ marginBottom: 24 }}>
                  <CashHealthGauge score={72} size={230} />
                </div>

                <div
                  className="grid grid-cols-3 gap-4"
                  style={{
                    borderTop: `1px solid ${theme.line}`,
                    paddingTop: 20,
                  }}
                >
                  <MiniMetric label="Borrow" value="₱5,000" />
                  <MiniMetric label="Repay" value="₱5,850" tone={theme.rust} />
                  <MiniMetric label="Cash left" value="₱1,250" tone={theme.green} />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section
        style={{
          background: theme.canvas,
          paddingTop: 54,
          paddingBottom: 62,
        }}
      >
        <div className="max-w-6xl mx-auto px-5">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
            className="mb-10"
            style={{ maxWidth: 620 }}
          >
            <div
              className="flex items-center gap-2"
              style={{
                color: theme.rust,
                fontSize: "0.76rem",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                marginBottom: 12,
              }}
            >
              <Zap size={14} />
              Demo loop
            </div>
            <h2
              className="text-3xl md:text-4xl"
              style={{
                color: theme.ink,
                fontWeight: 600,
                lineHeight: 1.15,
                letterSpacing: 0,
                marginBottom: 10,
              }}
            >
              Baseline, verdict, history.
            </h2>
            <p style={{ color: theme.slate, fontSize: "1rem", lineHeight: 1.6 }}>
              The landing page now points to the same lean flow the team is shipping:
              enter the loan, see one verdict surface, then save the check.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {STEPS_PREVIEW.map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.45 }}
                style={{
                  background: theme.paper,
                  border: `1px solid ${theme.line}`,
                  borderRadius: 24,
                  padding: 24,
                }}
              >
                <div className="flex items-center justify-between" style={{ marginBottom: 22 }}>
                  <span
                    className="w-9 h-9 rounded-full flex items-center justify-center"
                    style={{
                      background: theme.ink,
                      color: theme.canvas,
                      fontSize: "0.86rem",
                      fontWeight: 700,
                    }}
                  >
                    {step.num}
                  </span>
                  <span style={{ color: theme.rust }}>{step.icon}</span>
                </div>
                <h3 style={{ color: theme.ink, fontSize: "1.22rem", fontWeight: 700, marginBottom: 8 }}>
                  {step.label}
                </h3>
                <p style={{ color: theme.slate, fontSize: "0.92rem", lineHeight: 1.55, margin: 0 }}>
                  {step.detail}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ background: theme.canvas, paddingBottom: 58 }}>
        <div className="max-w-6xl mx-auto px-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {FEATURES.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.45 }}
                style={{
                  background: theme.paper,
                  borderRadius: 24,
                  padding: "28px 24px",
                  border: `1px solid ${theme.line}`,
                }}
              >
                <div
                  className="w-11 h-11 rounded-full flex items-center justify-center"
                  style={{
                    background: feature.bg,
                    color: feature.color,
                    marginBottom: 18,
                  }}
                >
                  {feature.icon}
                </div>
                <h3 style={{ color: theme.ink, fontSize: "1.12rem", fontWeight: 700, marginBottom: 8 }}>
                  {feature.title}
                </h3>
                <p style={{ color: theme.slate, fontSize: "0.92rem", lineHeight: 1.58, margin: 0 }}>
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ background: theme.canvas, paddingBottom: 70 }}>
        <div className="max-w-6xl mx-auto px-5">
          <div
            className="grid grid-cols-1 md:grid-cols-[1.1fr_0.9fr] gap-8 items-center"
            style={{
              borderTop: `1px solid ${theme.line}`,
              paddingTop: 34,
            }}
          >
            <div>
              <h2
                className="text-2xl md:text-3xl"
                style={{
                  color: theme.ink,
                  fontWeight: 600,
                  lineHeight: 1.2,
                  letterSpacing: 0,
                  marginBottom: 10,
                }}
              >
                Built for practical borrowing decisions.
              </h2>
              <p style={{ color: theme.slate, fontSize: "1rem", lineHeight: 1.65, margin: 0 }}>
                LoanWise is a prototype for sari-sari and small informal sellers.
                It shows math and risk signals only. It does not recommend taking a loan.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 md:justify-end">
              {["SDG 1", "SDG 8", "SDG 10", "Prototype, not lending advice"].map((label) => (
                <span
                  key={label}
                  style={{
                    border: `1px solid ${theme.line}`,
                    borderRadius: 999,
                    color: label.startsWith("Prototype") ? theme.rust : theme.charcoal,
                    fontSize: "0.82rem",
                    fontWeight: 600,
                    padding: "9px 13px",
                  }}
                >
                  {label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <footer
        style={{
          background: theme.ink,
          borderTop: "1px solid rgba(255,255,255,0.08)",
          padding: "24px 0",
        }}
      >
        <div className="max-w-6xl mx-auto px-5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Shield size={16} style={{ color: theme.orange }} />
            <span style={{ color: "rgba(243,240,238,0.64)", fontSize: "0.84rem" }}>
              LoanWise
            </span>
          </div>
          <span style={{ color: "rgba(243,240,238,0.48)", fontSize: "0.76rem" }}>
            Prototype only. Not financial advice.
          </span>
        </div>
      </footer>
    </div>
  );
}
