import { useMemo, useState } from "react";
import { Button } from "./ui/button";
import { CashHealthGauge } from "./CashHealthGauge";
import { DangerZoneCalendar } from "./DangerZoneCalendar";
import {
  ArrowLeft,
  Save,
  AlertTriangle,
  TrendingDown,
  BookOpen,
  ChevronDown,
  ChevronUp,
  Zap,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
} from "recharts";
import type { LoanInputs, EvaluationResult } from "../App";

interface Props {
  inputs: LoanInputs;
  result: EvaluationResult;
  baselineResult: EvaluationResult;
  stressLevel: number;
  onStressChange: (v: number) => void;
  onBack: () => void;
  onSave: (peakStress: number) => void;
}

const LESSONS = [
  {
    title: "The True Cost Trap",
    icon: "💸",
    body: `Lenders advertise "flat fees" or "processing charges" to obscure sky-high APRs.
    A $75 fee on a $500 two-week loan equals a ~390% APR. Always compare the annualized rate
    before signing — most alternatives (credit unions, buy-now-pay-later, friends & family)
    cost a fraction of this.`,
  },
  {
    title: "Why Your Bad Day Number Matters Most",
    icon: "☁️",
    body: `Your 'bad day' cash flow is the number lenders never ask about — but it's the one
    that determines if this loan will hurt you. Income arrives late, clients don't pay,
    unexpected bills appear. If you can't repay on a bad day, you'll face a dangerous shortfall.`,
  },
  {
    title: "The Buffer Rule",
    icon: "🛡️",
    body: `Your minimum cash buffer is your financial immune system. Going below it doesn't just feel
    uncomfortable — it typically triggers cascading problems: overdraft fees, missed utility
    payments, and the need for another loan. The buffer is a red line, not a suggestion.`,
  },
  {
    title: "The Debt Spiral Warning",
    icon: "🌀",
    body: `When repayment leaves you short, people often take out another loan to cover the gap.
    This is how debt spirals start. Each new loan adds another repayment, tightening the noose.
    If this loan puts you in the red zone, negotiate a smaller amount — or don't take it.`,
  },
  {
    title: "Breaking Point Awareness",
    icon: "📉",
    body: `Your breaking point is the % income drop that causes this loan to fail. If it's
    below 20%, you're exposed to normal life volatility. Freelancers, gig workers, and
    commission-based earners should target a breaking point above 30% for safety.`,
  },
  {
    title: "Timing: When Does Your Income Land?",
    icon: "📅",
    body: `If your income typically arrives after this loan's due date, you must pre-fund
    the repayment from existing savings — raising your real risk level. Always align
    loan due dates with income receipt dates whenever possible.`,
  },
];

function fmt(n: number) {
  return n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function StepStressTest({
  inputs,
  result,
  baselineResult,
  stressLevel,
  onStressChange,
  onBack,
  onSave,
}: Props) {
  const [openLesson, setOpenLesson] = useState<number | null>(null);

  const daysUntilDue = result.daysUntilDue;

  // Chart: projected cash at due date across income drops (term formula)
  const chartData = useMemo(() => {
    return Array.from({ length: 91 }, (_, i) => {
      const factor = 1 - i / 100;
      return {
        drop: i,
        normal: +(
          inputs.normalCashAfter * factor * daysUntilDue -
          inputs.repaymentAmount
        ).toFixed(2),
        bad: +(
          inputs.badDayCashAfter * factor * daysUntilDue - inputs.repaymentAmount
        ).toFixed(2),
      };
    });
  }, [inputs, daysUntilDue]);

  const bp = baselineResult.breakingPoint;
  const isPastBreaking = stressLevel > bp;

  const saferSuggestion = result.saferLoanAmount;
  const canSuggestSafer = saferSuggestion < inputs.loanAmount * 0.95 && saferSuggestion > 0;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div
        className="rounded-2xl p-5"
        style={{ background: "linear-gradient(135deg, #4c1d95 0%, #6d28d9 100%)" }}
      >
        <h2 style={{ color: "white", marginBottom: 4 }}>Step 3: Stress Test</h2>
        <p style={{ color: "#ddd6fe", fontSize: "0.87rem" }}>
          Simulate income drops to find your exact financial breaking point. Drag the
          slider to see how your cash health changes in real-time.
        </p>
      </div>

      {/* Slider + Live Gauge */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div
          className="bg-white rounded-2xl p-5 shadow-sm"
          style={{ border: "1px solid #f1f5f9" }}
        >
          <div className="flex items-center gap-2 mb-2">
            <Zap size={16} color="#7c3aed" />
            <h3 style={{ color: "#111827" }}>Income Drop Simulator</h3>
          </div>
          <p style={{ color: "#6b7280", fontSize: "0.78rem", marginBottom: 20 }}>
            Drag to simulate an income drop
          </p>

          {/* Slider */}
          <div className="mb-5">
            <div className="flex justify-between mb-2">
              <span style={{ fontSize: "0.8rem", color: "#6b7280" }}>No Drop (0%)</span>
              <span
                style={{
                  fontSize: "1.1rem",
                  fontWeight: 700,
                  color: isPastBreaking ? "#dc2626" : "#374151",
                }}
              >
                {stressLevel}% drop
              </span>
              <span style={{ fontSize: "0.8rem", color: "#6b7280" }}>Severe (90%)</span>
            </div>
            <input
              type="range"
              min={0}
              max={90}
              value={stressLevel}
              onChange={(e) => onStressChange(Number(e.target.value))}
              style={{ width: "100%", accentColor: isPastBreaking ? "#dc2626" : "#7c3aed" }}
            />
          </div>

          {/* Breaking point banner */}
          <div
            className="rounded-xl p-4 mb-4"
            style={{
              backgroundColor: isPastBreaking ? "#fef2f2" : "#f5f3ff",
              border: `1.5px solid ${isPastBreaking ? "#fca5a5" : "#c4b5fd"}`,
            }}
          >
            <div className="flex items-center gap-2 mb-1">
              <AlertTriangle size={14} color={isPastBreaking ? "#dc2626" : "#7c3aed"} />
              <span
                style={{
                  fontWeight: 700,
                  fontSize: "0.8rem",
                  color: isPastBreaking ? "#dc2626" : "#7c3aed",
                }}
              >
                Breaking Point: {bp.toFixed(1)}% income drop
              </span>
            </div>
            <p style={{ fontSize: "0.75rem", color: isPastBreaking ? "#991b1b" : "#4c1d95" }}>
              {isPastBreaking
                ? `⚠️ You've passed your breaking point! At ${stressLevel}% drop, your bad-day cash falls below your minimum buffer.`
                : `You can handle up to a ${bp.toFixed(1)}% income drop before your bad-day cash dips below your buffer.`}
            </p>
          </div>

          {/* Stressed cash metrics */}
          <div className="space-y-2">
            {[
              {
                label: "Projected cash (stressed)",
                val: result.projectedCash,
                orig: baselineResult.projectedCash,
              },
              {
                label: "Bad-day scenario (full term)",
                val: result.cashAfterBad,
                orig: baselineResult.cashAfterBad,
              },
            ].map(({ label, val, orig }) => (
              <div
                key={label}
                className="flex items-center justify-between py-2 px-3 rounded-lg"
                style={{
                  backgroundColor: val < inputs.minCashBuffer ? "#fef2f2" : "#f9fafb",
                  border: `1px solid ${val < inputs.minCashBuffer ? "#fca5a5" : "#f3f4f6"}`,
                }}
              >
                <span style={{ fontSize: "0.78rem", color: "#6b7280" }}>{label}</span>
                <div className="text-right">
                  <span
                    style={{
                      fontSize: "0.82rem",
                      fontWeight: 700,
                      color: val < inputs.minCashBuffer ? "#dc2626" : "#374151",
                    }}
                  >
                    ₱{fmt(val)}
                  </span>
                  {stressLevel > 0 && (
                    <div style={{ fontSize: "0.68rem", color: "#9ca3af" }}>
                      was ₱{fmt(orig)}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Gauge */}
        <div
          className="bg-white rounded-2xl p-5 shadow-sm flex flex-col items-center"
          style={{ border: "1px solid #f1f5f9" }}
        >
          <h3 style={{ color: "#111827", marginBottom: 4, alignSelf: "flex-start" }}>
            Live Health Score
          </h3>
          <p style={{ color: "#6b7280", fontSize: "0.78rem", marginBottom: 8, alignSelf: "flex-start" }}>
            {stressLevel > 0
              ? `At ${stressLevel}% income drop`
              : "Baseline (no income drop)"}
          </p>
          <CashHealthGauge score={result.healthScore} size={250} />
          {stressLevel > 0 && (
            <div
              className="w-full mt-2 flex items-center gap-2 p-2.5 rounded-xl"
              style={{ backgroundColor: "#f8fafc", border: "1px solid #e2e8f0" }}
            >
              <TrendingDown size={13} color="#6b7280" />
              <p style={{ fontSize: "0.72rem", color: "#6b7280" }}>
                Baseline score: <strong>{Math.round(baselineResult.healthScore)}</strong> →{" "}
                Stressed score:{" "}
                <strong
                  style={{
                    color:
                      result.healthStatus === "red"
                        ? "#dc2626"
                        : result.healthStatus === "yellow"
                          ? "#d97706"
                          : "#16a34a",
                  }}
                >
                  {Math.round(result.healthScore)}
                </strong>
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Recharts stress line chart */}
      <div
        className="bg-white rounded-2xl p-5 shadow-sm"
        style={{ border: "1px solid #f1f5f9" }}
      >
        <h3 style={{ color: "#111827", marginBottom: 4 }}>Cash After Repayment vs. Income Drop</h3>
        <p style={{ color: "#6b7280", fontSize: "0.78rem", marginBottom: 16 }}>
          Dashed line shows your minimum cash buffer
        </p>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={chartData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="normalGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="badGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.18} />
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
            <XAxis
              dataKey="drop"
              tickFormatter={(v) => `${v}%`}
              tick={{ fontSize: 10, fill: "#9ca3af" }}
              label={{ value: "Income Drop %", position: "insideBottom", offset: -2, fontSize: 10, fill: "#9ca3af" }}
            />
            <YAxis
              tickFormatter={(v) => `₱${v}`}
              tick={{ fontSize: 10, fill: "#9ca3af" }}
              width={60}
            />
            <Tooltip
              formatter={(v: number, name: string) => [
                `₱${fmt(v)}`,
                name === "normal" ? "Normal Day" : "Bad Day",
              ]}
              labelFormatter={(l) => `${l}% income drop`}
              contentStyle={{ fontSize: "0.75rem" }}
            />
            <ReferenceLine
              y={inputs.minCashBuffer}
              stroke="#dc2626"
              strokeDasharray="5 3"
              label={{ value: "Buffer", position: "right", fontSize: 9, fill: "#dc2626" }}
            />
            {stressLevel > 0 && (
              <ReferenceLine
                x={stressLevel}
                stroke="#7c3aed"
                strokeDasharray="4 2"
                label={{ value: `${stressLevel}%`, position: "top", fontSize: 9, fill: "#7c3aed" }}
              />
            )}
            <Area
              type="monotone"
              dataKey="normal"
              stroke="#3b82f6"
              strokeWidth={2}
              fill="url(#normalGrad)"
              dot={false}
            />
            <Area
              type="monotone"
              dataKey="bad"
              stroke="#ef4444"
              strokeWidth={2}
              fill="url(#badGrad)"
              dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
        <div className="flex gap-4 mt-2">
          {[
            { color: "#3b82f6", label: "Normal Day cash" },
            { color: "#ef4444", label: "Bad Day cash" },
            { color: "#dc2626", label: "Min. buffer line" },
          ].map(({ color, label }) => (
            <div key={label} className="flex items-center gap-1.5">
              <div style={{ width: 12, height: 3, backgroundColor: color, borderRadius: 2 }} />
              <span style={{ fontSize: "0.7rem", color: "#6b7280" }}>{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Danger Zone Calendar + Safer Borrowing */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div
          className="bg-white rounded-2xl p-5 shadow-sm"
          style={{ border: "1px solid #f1f5f9" }}
        >
          <h3 style={{ color: "#111827", marginBottom: 16 }}>⚠️ Danger Zone Calendar</h3>
          <DangerZoneCalendar
            dueDate={inputs.dueDate}
            breakingPoint={bp}
          />
        </div>

        <div
          className="bg-white rounded-2xl p-5 shadow-sm"
          style={{ border: "1px solid #f1f5f9" }}
        >
          <h3 style={{ color: "#111827", marginBottom: 12 }}>💡 Safer Borrowing Suggestions</h3>

          {canSuggestSafer ? (
            <div className="space-y-3">
              <div
                className="p-4 rounded-xl"
                style={{ backgroundColor: "#f0fdf4", border: "1.5px solid #bbf7d0" }}
              >
                <p style={{ fontWeight: 600, color: "#14532d", fontSize: "0.85rem", marginBottom: 4 }}>
                  Safer Loan Amount
                </p>
                <p style={{ fontSize: "0.78rem", color: "#15803d" }}>
                  Borrowing <strong>₱{Math.floor(saferSuggestion).toLocaleString()}</strong> instead
                  of ₱{inputs.loanAmount.toLocaleString()} would keep you above your buffer even on
                  a bad day.
                </p>
              </div>

              <div
                className="p-4 rounded-xl"
                style={{ backgroundColor: "#eff6ff", border: "1.5px solid #bfdbfe" }}
              >
                <p style={{ fontWeight: 600, color: "#1e3a8a", fontSize: "0.85rem", marginBottom: 4 }}>
                  Max Safe Repayment
                </p>
                <p style={{ fontSize: "0.78rem", color: "#1d4ed8" }}>
                  Your bad-day cash can safely handle up to{" "}
                  <strong>₱{Math.floor(result.saferRepaymentAmount).toLocaleString()}</strong> in
                  total repayment while staying above your buffer.
                </p>
              </div>

              <div
                className="p-4 rounded-xl"
                style={{ backgroundColor: "#faf5ff", border: "1.5px solid #e9d5ff" }}
              >
                <p style={{ fontWeight: 600, color: "#581c87", fontSize: "0.85rem", marginBottom: 4 }}>
                  Alternative: Ask for More Time
                </p>
                <p style={{ fontSize: "0.78rem", color: "#6b21a8" }}>
                  A longer repayment window doesn't reduce fees, but it shifts the due date away
                  from your most vulnerable cash flow period.
                </p>
              </div>
            </div>
          ) : (
            <div
              className="p-4 rounded-xl"
              style={{ backgroundColor: "#f0fdf4", border: "1.5px solid #bbf7d0" }}
            >
              <p style={{ fontWeight: 600, color: "#14532d", fontSize: "0.85rem", marginBottom: 4 }}>
                ✅ This loan amount looks safe
              </p>
              <p style={{ fontSize: "0.78rem", color: "#15803d" }}>
                Based on your cash flow, this loan amount leaves you above your minimum buffer even
                on a bad day. Your breaking point is{" "}
                <strong>{bp.toFixed(1)}%</strong> income drop.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Financial Micro-Lessons */}
      <div
        className="bg-white rounded-2xl p-5 shadow-sm"
        style={{ border: "1px solid #f1f5f9" }}
      >
        <div className="flex items-center gap-2 mb-4">
          <BookOpen size={16} color="#374151" />
          <h3 style={{ color: "#111827" }}>Financial Micro-Lessons</h3>
        </div>
        <div className="space-y-2">
          {LESSONS.map((lesson, i) => (
            <div
              key={i}
              className="rounded-xl overflow-hidden"
              style={{ border: "1px solid #f3f4f6" }}
            >
              <button
                onClick={() => setOpenLesson(openLesson === i ? null : i)}
                className="w-full flex items-center justify-between p-3.5"
                style={{
                  background: openLesson === i ? "#f8fafc" : "white",
                  border: "none",
                  cursor: "pointer",
                  textAlign: "left",
                }}
              >
                <div className="flex items-center gap-2.5">
                  <span style={{ fontSize: "1.1rem" }}>{lesson.icon}</span>
                  <span style={{ fontWeight: 600, color: "#374151", fontSize: "0.85rem" }}>
                    {lesson.title}
                  </span>
                </div>
                {openLesson === i ? (
                  <ChevronUp size={15} color="#9ca3af" />
                ) : (
                  <ChevronDown size={15} color="#9ca3af" />
                )}
              </button>
              {openLesson === i && (
                <div className="px-4 pb-4" style={{ backgroundColor: "#f8fafc" }}>
                  <p style={{ color: "#4b5563", fontSize: "0.82rem", lineHeight: 1.6 }}>
                    {lesson.body}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={onBack} size="lg">
          <ArrowLeft size={18} />
          Back
        </Button>
        <Button
          onClick={() => onSave(stressLevel)}
          size="lg"
          style={{ backgroundColor: "#7c3aed", color: "white" }}
        >
          <Save size={18} />
          Save Evaluation
        </Button>
      </div>
    </div>
  );
}
