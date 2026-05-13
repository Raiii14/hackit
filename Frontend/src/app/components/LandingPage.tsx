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
  ChevronDown,
  Sparkles,
  Target,
  AlertTriangle,
} from "lucide-react";
import { Button } from "./ui/button";
import { CashHealthGauge } from "./CashHealthGauge";

interface LandingPageProps {
  onStartTest: () => void;
  onUseAccount: () => void;
  savedCount: number;
}

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  }),
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { delay: 0.4, duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

const FEATURES = [
  {
    icon: <BarChart3 size={22} />,
    title: "True Cost Reveal",
    desc: "See your loan's real price: cost per ₱100, daily interest, and total fees — before you sign.",
    color: "#3b82f6",
    bg: "#eff6ff",
  },
  {
    icon: <TrendingDown size={22} />,
    title: "Stress-Test Resilience",
    desc: "Simulate 10% to 100% income drops and see exactly when your cash flow breaks.",
    color: "#f59e0b",
    bg: "#fffbeb",
  },
  {
    icon: <BookmarkCheck size={22} />,
    title: "Save & Compare",
    desc: "Save every check, compare offers side by side, and track your borrowing profile over time.",
    color: "#16a34a",
    bg: "#f0fdf4",
  },
];

const STEPS_PREVIEW = [
  {
    num: 1,
    label: "Enter your loan offer & cash flow",
    icon: <Target size={16} />,
  },
  {
    num: 2,
    label: "Get your risk score & true cost",
    icon: <BarChart3 size={16} />,
  },
  {
    num: 3,
    label: "Stress-test with income drops",
    icon: <AlertTriangle size={16} />,
  },
  {
    num: 4,
    label: "Save, review, and decide",
    icon: <BookmarkCheck size={16} />,
  },
];

export function LandingPage({
  onStartTest,
  onUseAccount,
  savedCount,
}: LandingPageProps) {
  return (
    <div
      className="min-h-screen"
      style={{
        background:
          "linear-gradient(180deg, #0f172a 0%, #1e293b 40%, #f0f4f8 40%)",
      }}
    >
      {/* ─── Navigation ─────────────────────────────── */}
      <header className="relative z-10">
        <div className="max-w-5xl mx-auto px-5 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg"
              style={{
                background:
                  "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
              }}
            >
              <Shield size={20} color="white" />
            </div>
            <div>
              <div
                style={{
                  color: "white",
                  fontWeight: 800,
                  fontSize: "1.2rem",
                  lineHeight: 1.2,
                  letterSpacing: "-0.02em",
                }}
              >
                LoanWise
              </div>
              <div
                style={{
                  color: "#93c5fd",
                  fontSize: "0.65rem",
                  lineHeight: 1,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}
              >
                Repayment Stress Simulator
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {savedCount > 0 && (
              <button
                onClick={onUseAccount}
                className="hidden sm:flex items-center gap-1.5"
                style={{
                  background: "none",
                  border: "1px solid rgba(255,255,255,0.15)",
                  borderRadius: 8,
                  cursor: "pointer",
                  color: "#93c5fd",
                  fontSize: "0.82rem",
                  padding: "6px 14px",
                }}
              >
                <BookmarkCheck size={14} />
                History ({savedCount})
              </button>
            )}
            <button
              onClick={onUseAccount}
              className="flex items-center gap-1.5"
              style={{
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.15)",
                borderRadius: 8,
                cursor: "pointer",
                color: "white",
                fontSize: "0.82rem",
                fontWeight: 500,
                padding: "6px 14px",
                backdropFilter: "blur(8px)",
              }}
            >
              <Lock size={13} />
              Use account
            </button>
          </div>
        </div>
      </header>

      {/* ─── Hero ─────────────────────────────────── */}
      <section className="relative overflow-hidden" style={{ paddingBottom: 0 }}>
        {/* Gradient orb effects */}
        <div
          style={{
            position: "absolute",
            top: -120,
            left: "10%",
            width: 420,
            height: 420,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: -60,
            right: "5%",
            width: 320,
            height: 320,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(34,197,94,0.1) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        <div className="max-w-5xl mx-auto px-5 pt-8 pb-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Left copy */}
            <motion.div
              initial="hidden"
              animate="visible"
              className="relative z-10"
            >
              <motion.div
                variants={fadeUp}
                custom={0}
                className="inline-flex items-center gap-2 mb-4"
                style={{
                  background: "rgba(59,130,246,0.15)",
                  border: "1px solid rgba(59,130,246,0.25)",
                  borderRadius: 999,
                  padding: "5px 14px",
                }}
              >
                <Sparkles
                  size={13}
                  style={{ color: "#60a5fa" }}
                />
                <span
                  style={{
                    color: "#93c5fd",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    letterSpacing: "0.04em",
                  }}
                >
                  Free stress test — no sign-up needed
                </span>
              </motion.div>

              <motion.h1
                variants={fadeUp}
                custom={1}
                style={{
                  color: "white",
                  fontSize: "clamp(2rem, 5vw, 3rem)",
                  fontWeight: 800,
                  lineHeight: 1.1,
                  letterSpacing: "-0.03em",
                  marginBottom: 16,
                }}
              >
                Is your next loan{" "}
                <span
                  style={{
                    background:
                      "linear-gradient(135deg, #60a5fa, #34d399)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  safe for your store?
                </span>
              </motion.h1>

              <motion.p
                variants={fadeUp}
                custom={2}
                style={{
                  color: "#94a3b8",
                  fontSize: "1.05rem",
                  lineHeight: 1.6,
                  maxWidth: 480,
                  marginBottom: 28,
                }}
              >
                LoanWise turns any loan offer into a cash-flow stress test.
                See the real cost, test your worst-case scenario, and decide
                with confidence — all in under 2 minutes.
              </motion.p>

              <motion.div
                variants={fadeUp}
                custom={3}
                className="flex flex-wrap items-center gap-3"
              >
                <Button
                  onClick={onStartTest}
                  size="lg"
                  style={{
                    background:
                      "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
                    color: "white",
                    padding: "14px 32px",
                    fontSize: "1rem",
                    fontWeight: 700,
                    borderRadius: 12,
                    boxShadow:
                      "0 4px 14px rgba(59,130,246,0.4), 0 0 0 1px rgba(59,130,246,0.1)",
                    border: "none",
                  }}
                >
                  Start free test
                  <ArrowRight size={18} />
                </Button>

                <button
                  onClick={onUseAccount}
                  style={{
                    background: "none",
                    border: "1px solid rgba(255,255,255,0.2)",
                    borderRadius: 12,
                    padding: "13px 24px",
                    color: "#cbd5e1",
                    fontSize: "0.92rem",
                    fontWeight: 500,
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.borderColor =
                      "rgba(255,255,255,0.4)";
                    e.currentTarget.style.color = "white";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.borderColor =
                      "rgba(255,255,255,0.2)";
                    e.currentTarget.style.color = "#cbd5e1";
                  }}
                >
                  Use account
                </button>
              </motion.div>

              {/* Trust badges */}
              <motion.div
                variants={fadeUp}
                custom={4}
                className="flex flex-wrap items-center gap-4 mt-8"
              >
                {[
                  { icon: <Users size={13} />, text: "Guest mode first" },
                  { icon: <Lock size={13} />, text: "No data collected" },
                  { icon: <Zap size={13} />, text: "Instant results" },
                ].map((badge) => (
                  <div
                    key={badge.text}
                    className="flex items-center gap-1.5"
                    style={{ color: "#64748b", fontSize: "0.78rem" }}
                  >
                    {badge.icon}
                    {badge.text}
                  </div>
                ))}
              </motion.div>
            </motion.div>

            {/* Right — floating gauge preview */}
            <motion.div
              variants={scaleIn}
              initial="hidden"
              animate="visible"
              className="hidden lg:flex justify-center"
            >
              <div
                style={{
                  position: "relative",
                  background:
                    "linear-gradient(145deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.02) 100%)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 28,
                  padding: "32px 24px 20px",
                  backdropFilter: "blur(12px)",
                  boxShadow: "0 32px 64px rgba(0,0,0,0.3)",
                }}
              >
                <div
                  style={{
                    background: "white",
                    borderRadius: 20,
                    padding: "20px 16px 12px",
                    boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
                  }}
                >
                  <CashHealthGauge score={72} size={240} />
                </div>
                <div
                  className="text-center mt-3"
                  style={{
                    color: "#94a3b8",
                    fontSize: "0.72rem",
                    letterSpacing: "0.04em",
                  }}
                >
                  LIVE PREVIEW • SAMPLE DATA
                </div>
              </div>
            </motion.div>
          </div>

          {/* Scroll hint */}
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{
              repeat: Infinity,
              duration: 2,
              ease: "easeInOut",
            }}
            className="flex justify-center pt-6 pb-4"
          >
            <ChevronDown
              size={24}
              style={{ color: "#475569", opacity: 0.5 }}
            />
          </motion.div>
        </div>
      </section>

      {/* ─── How it Works ──────────────────────────── */}
      <section
        style={{
          background: "#f0f4f8",
          paddingTop: 48,
          paddingBottom: 56,
        }}
      >
        <div className="max-w-5xl mx-auto px-5">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-10"
          >
            <div
              className="inline-flex items-center gap-2 mb-3"
              style={{
                background: "#e0e7ff",
                borderRadius: 999,
                padding: "5px 14px",
              }}
            >
              <Zap size={13} style={{ color: "#4f46e5" }} />
              <span
                style={{
                  color: "#4338ca",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                }}
              >
                4-Step Process
              </span>
            </div>
            <h2
              style={{
                color: "#0f172a",
                fontSize: "clamp(1.5rem, 3vw, 2.2rem)",
                fontWeight: 800,
                lineHeight: 1.2,
                letterSpacing: "-0.02em",
              }}
            >
              Know your risk in under 2 minutes
            </h2>
            <p
              style={{
                color: "#64748b",
                fontSize: "1rem",
                marginTop: 8,
                maxWidth: 520,
                marginLeft: "auto",
                marginRight: "auto",
              }}
            >
              LoanWise walks you through a simple 4-step process to evaluate
              any loan offer against your real cash flow.
            </p>
          </motion.div>

          {/* Steps timeline */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
            {STEPS_PREVIEW.map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                style={{
                  background: "white",
                  borderRadius: 16,
                  padding: "20px 18px",
                  border: "1px solid #e2e8f0",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {/* Step number watermark */}
                <div
                  style={{
                    position: "absolute",
                    top: -8,
                    right: 8,
                    fontSize: "4rem",
                    fontWeight: 900,
                    color: "rgba(59,130,246,0.05)",
                    lineHeight: 1,
                  }}
                >
                  {step.num}
                </div>
                <div
                  className="flex items-center gap-2 mb-2"
                  style={{ position: "relative", zIndex: 1 }}
                >
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background:
                        "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
                      color: "white",
                      fontSize: "0.75rem",
                      fontWeight: 800,
                      flexShrink: 0,
                    }}
                  >
                    {step.num}
                  </div>
                  <div
                    style={{
                      color: "#64748b",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    {step.icon}
                  </div>
                </div>
                <p
                  style={{
                    color: "#334155",
                    fontSize: "0.88rem",
                    fontWeight: 500,
                    lineHeight: 1.4,
                    margin: 0,
                    position: "relative",
                    zIndex: 1,
                  }}
                >
                  {step.label}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Feature cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {FEATURES.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.5 }}
                className="group"
                style={{
                  background: "white",
                  borderRadius: 20,
                  padding: "28px 24px",
                  border: "1px solid #e2e8f0",
                  cursor: "default",
                  transition: "all 0.3s ease",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow =
                    "0 12px 32px rgba(0,0,0,0.08)";
                  e.currentTarget.style.borderColor = feature.color + "40";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "0 1px 3px rgba(0,0,0,0.04)";
                  e.currentTarget.style.borderColor = "#e2e8f0";
                }}
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                  style={{
                    backgroundColor: feature.bg,
                    color: feature.color,
                  }}
                >
                  {feature.icon}
                </div>
                <h3
                  style={{
                    color: "#0f172a",
                    fontSize: "1.1rem",
                    fontWeight: 700,
                    marginBottom: 8,
                  }}
                >
                  {feature.title}
                </h3>
                <p
                  style={{
                    color: "#64748b",
                    fontSize: "0.88rem",
                    lineHeight: 1.55,
                    margin: 0,
                  }}
                >
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Social Proof / Purpose ─────────────────── */}
      <section style={{ background: "#f0f4f8", paddingBottom: 48 }}>
        <div className="max-w-5xl mx-auto px-5">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            style={{
              background:
                "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
              borderRadius: 24,
              padding: "36px 32px",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Decorative gradient orb */}
            <div
              style={{
                position: "absolute",
                top: -60,
                right: -40,
                width: 200,
                height: 200,
                borderRadius: "50%",
                background:
                  "radial-gradient(circle, rgba(59,130,246,0.2) 0%, transparent 70%)",
                pointerEvents: "none",
              }}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center relative z-10">
              <div>
                <h3
                  style={{
                    color: "white",
                    fontSize: "1.4rem",
                    fontWeight: 700,
                    marginBottom: 8,
                    lineHeight: 1.3,
                  }}
                >
                  Built for sari-sari and small online sellers
                </h3>
                <p
                  style={{
                    color: "#94a3b8",
                    fontSize: "0.92rem",
                    lineHeight: 1.6,
                    margin: 0,
                  }}
                >
                  LoanWise is a FinTech-for-Change prototype aligned with
                  SDG 1, SDG 8, and SDG 10. It helps micro-entrepreneurs
                  make informed borrowing decisions — no data collected, no
                  lending advice, just math.
                </p>
              </div>

              <div className="flex flex-wrap gap-3 justify-start md:justify-end">
                {["SDG 1 · No Poverty", "SDG 8 · Decent Work", "SDG 10 · Reduced Inequality"].map(
                  (sdg) => (
                    <div
                      key={sdg}
                      style={{
                        background: "rgba(255,255,255,0.06)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: 10,
                        padding: "8px 14px",
                        color: "#94a3b8",
                        fontSize: "0.78rem",
                        fontWeight: 500,
                      }}
                    >
                      {sdg}
                    </div>
                  )
                )}
                <div
                  style={{
                    background: "rgba(239,68,68,0.1)",
                    border: "1px solid rgba(239,68,68,0.2)",
                    borderRadius: 10,
                    padding: "8px 14px",
                    color: "#fca5a5",
                    fontSize: "0.78rem",
                    fontWeight: 500,
                  }}
                >
                  Prototype only — not lending advice
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── Bottom CTA ─────────────────────────────── */}
      <section
        style={{
          background: "#f0f4f8",
          paddingTop: 16,
          paddingBottom: 80,
        }}
      >
        <div className="max-w-5xl mx-auto px-5 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2
              style={{
                color: "#0f172a",
                fontSize: "clamp(1.4rem, 3vw, 2rem)",
                fontWeight: 800,
                marginBottom: 12,
                lineHeight: 1.2,
              }}
            >
              Ready to check your loan offer?
            </h2>
            <p
              style={{
                color: "#64748b",
                fontSize: "1rem",
                marginBottom: 24,
                maxWidth: 440,
                marginLeft: "auto",
                marginRight: "auto",
              }}
            >
              No sign-up, no data stored, no catches. Just honest math
              about your next loan.
            </p>
            <Button
              onClick={onStartTest}
              size="lg"
              style={{
                background:
                  "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
                color: "white",
                padding: "14px 36px",
                fontSize: "1rem",
                fontWeight: 700,
                borderRadius: 12,
                boxShadow:
                  "0 4px 14px rgba(59,130,246,0.4), 0 0 0 1px rgba(59,130,246,0.1)",
                border: "none",
              }}
            >
              Start free test
              <ArrowRight size={18} />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* ─── Footer ──────────────────────────────────── */}
      <footer
        style={{
          background: "#0f172a",
          borderTop: "1px solid #1e293b",
          padding: "24px 0",
        }}
      >
        <div className="max-w-5xl mx-auto px-5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Shield size={16} style={{ color: "#3b82f6" }} />
            <span
              style={{
                color: "#64748b",
                fontSize: "0.82rem",
              }}
            >
              LoanWise — FinTech for Change
            </span>
          </div>
          <span
            style={{
              color: "#475569",
              fontSize: "0.75rem",
            }}
          >
            Prototype only • Not financial advice
          </span>
        </div>
      </footer>
    </div>
  );
}
