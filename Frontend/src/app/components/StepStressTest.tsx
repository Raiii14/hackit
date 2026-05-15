import { useMemo, useState } from "react";
import { Button } from "./ui/button";
import { CashHealthGauge } from "./CashHealthGauge";
import { DangerZoneCalendar } from "./DangerZoneCalendar";
import { LoanWiseChat } from "./LoanWiseChat";
import {
  ArrowLeft,
  Save,
  AlertTriangle,
  TrendingDown,
  BookOpen,
  ChevronDown,
  ChevronUp,
  Zap,
  RotateCcw,
  CloudRain,
  Thermometer,
  Truck,
  Home,
  SlidersHorizontal,
  CheckCircle,
  XCircle,
  Clock,
  Percent,
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
import type { LucideIcon } from "lucide-react";
import { theme, cardFlat, pillButton, pillButtonOutline, statusColors } from "../../lib/theme";
import { StepHeader } from "./StepHeader";

interface Props {
  inputs: LoanInputs;
  result: EvaluationResult;
  baselineResult: EvaluationResult;
  stressLevel: number;
  onStressChange: (v: number) => void;
  onBack: () => void;
  onSave: (peakStress: number) => void;
}

function MetricRow({
  label,
  value,
  sub,
  color,
}: {
  label: string;
  value: string;
  sub?: string;
  color?: string;
}) {
  return (
    <div className="flex items-center justify-between py-2.5" style={{ borderBottom: `1px solid ${theme.line}` }}>
      <span style={{ color: theme.slate, fontSize: "0.85rem" }}>{label}</span>
      <div className="text-right">
        <span style={{ color: color || "#111827", fontWeight: 600, fontSize: "0.9rem" }}>
          {value}
        </span>
        {sub && <div style={{ color: theme.slate, fontSize: "0.72rem" }}>{sub}</div>}
      </div>
    </div>
  );
}

function CashRow({
  label,
  available,
  afterRepay,
  margin,
  bufferLabel,
  isBad,
}: {
  label: string;
  available: number;
  afterRepay: number;
  margin: number;
  bufferLabel: string;
  isBad?: boolean;
}) {
  const isNeg = afterRepay < 0;
  const marginBad = margin < 0;

  return (
    <div
      className="rounded-xl p-4"
      style={{
        backgroundColor: isNeg || marginBad ? "#fef2f2" : "#f0fdf4",
        border: `1.5px solid ${isNeg || marginBad ? "#fecaca" : "#bbf7d0"}`,
      }}
    >
      <div className="flex items-center justify-between mb-3">
        <span style={{ fontWeight: 600, color: theme.charcoal, fontSize: "0.85rem" }}>
          {isBad ? "Bad day" : "Normal day"}
        </span>
        {isNeg || marginBad ? (
          <XCircle size={16} color="#dc2626" />
        ) : (
          <CheckCircle size={16} color="#16a34a" />
        )}
      </div>
      <div className="space-y-1.5">
        <div className="flex justify-between">
          <span style={{ fontSize: "0.78rem", color: theme.slate }}>{label}</span>
          <span style={{ fontSize: "0.78rem", fontWeight: 600, color: theme.charcoal }}>
            PHP {fmt(available)}
          </span>
        </div>
        <div className="flex justify-between">
          <span style={{ fontSize: "0.78rem", color: theme.slate }}>After repayment</span>
          <span
            style={{
              fontSize: "0.78rem",
              fontWeight: 700,
              color: afterRepay < 0 ? "#dc2626" : "#374151",
            }}
          >
            {afterRepay < 0 ? "-" : ""}PHP {fmt(Math.abs(afterRepay))}
          </span>
        </div>
        <div className="flex justify-between">
          <span style={{ fontSize: "0.78rem", color: theme.slate }}>vs. buffer</span>
          <span
            style={{
              fontSize: "0.78rem",
              fontWeight: 700,
              color: marginBad ? "#dc2626" : "#16a34a",
            }}
          >
            {margin >= 0 ? "+" : ""}PHP {fmt(margin)} {bufferLabel}
          </span>
        </div>
      </div>
    </div>
  );
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

type StressScenario = {
  id: string;
  label: string;
  detail: string;
  level: number;
  icon: LucideIcon;
  color: string;
  bg: string;
  border: string;
};

const STRESS_SCENARIOS: StressScenario[] = [
  {
    id: "baseline",
    label: "Baseline",
    detail: "0% drop",
    level: 0,
    icon: RotateCcw,
    color: theme.ink,
    bg: "#EFEAE5",
    border: theme.line,
  },
  {
    id: "slow-sales",
    label: "Slow Sales",
    detail: "10% drop",
    level: 10,
    icon: TrendingDown,
    color: "#7c3aed",
    bg: "#f5f3ff",
    border: "#ddd6fe",
  },
  {
    id: "typhoon",
    label: "Typhoon",
    detail: "30% drop",
    level: 30,
    icon: CloudRain,
    color: "#0369a1",
    bg: "#f0f9ff",
    border: "#bae6fd",
  },
  {
    id: "supply",
    label: "Supply Delay",
    detail: "60% drop",
    level: 60,
    icon: Truck,
    color: "#c2410c",
    bg: "#fff7ed",
    border: "#fed7aa",
  },
  {
    id: "sickness",
    label: "Sickness",
    detail: "100% drop",
    level: 100,
    icon: Thermometer,
    color: "#dc2626",
    bg: "#fef2f2",
    border: "#fecaca",
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
  const [selectedScenarioId, setSelectedScenarioId] = useState("baseline");
  const [stressLow, setStressLow] = useState(0);

  const daysUntilDue = result.daysUntilDue;
  const {
    healthStatus,
    cashAfterNormal,
    cashAfterBad,
    normalMargin,
    badMargin,
    trueCost,
    effectiveRate,
    dailyCost,
  } = baselineResult;

  // Chart: projected cash at due date across income drops (term formula)
  const chartData = useMemo(() => {
    return Array.from({ length: 101 }, (_, i) => {
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
  const stressHigh = Math.max(stressLow, stressLevel);
  const badDayScenarioLevel = Math.min(100, Math.max(0, Math.round(baselineResult.badDayDropPercent)));
  const scenarioButtons = useMemo(
    () => [
      ...STRESS_SCENARIOS,
      {
        id: "family-emergency",
        label: "Family Emergency",
        detail: "Bad-day input",
        level: badDayScenarioLevel,
        icon: Home,
        color: "#be123c",
        bg: "#fff1f2",
        border: "#fecdd3",
      },
    ],
    [badDayScenarioLevel],
  );
  const activeScenario =
    scenarioButtons.find(
      (scenario) => scenario.id === selectedScenarioId && scenario.level === stressLevel,
    ) ?? scenarioButtons.find((scenario) => scenario.level === stressLevel);

  const saferSuggestion = result.saferLoanAmount;
  const canSuggestSafer = saferSuggestion < inputs.loanAmount * 0.95 && saferSuggestion > 0;
  const statusCfg = statusColors[healthStatus];
  const statusMsg = {
    green: "The baseline looks manageable. Use the stress controls below to test whether it survives a bad month.",
    yellow: "The baseline is already tight. Stress testing shows how quickly the cash buffer can break.",
    red: "High risk detected. The baseline repayment already threatens your minimum cash buffer.",
  }[healthStatus];
  const StatusIcon = healthStatus === "green" ? CheckCircle : AlertTriangle;
  const annualizedRate =
    daysUntilDue > 0
      ? (Math.pow(1 + trueCost / Math.max(inputs.loanAmount, 1), 365 / daysUntilDue) - 1) * 100
      : effectiveRate;

  return (
    <div className="space-y-5">
      <StepHeader
        eyebrow="Step 2"
        title="Verdict"
        description={statusMsg}
        action={
          <div className="flex flex-col items-end gap-2 shrink-0">
            <span
              className="inline-flex items-center gap-1.5"
              style={{
                background: statusCfg.bg,
                border: `1px solid ${statusCfg.border}`,
                color: statusCfg.text,
                borderRadius: 999,
                fontSize: "0.76rem",
                fontWeight: 700,
                padding: "6px 12px",
              }}
            >
              <StatusIcon size={14} />
              {healthStatus === "green" ? "Manageable" : healthStatus === "yellow" ? "Caution" : "High risk"}
            </span>
            <LoanWiseChat inputs={inputs} result={result} contextLabel="stressed verdict" />
          </div>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div
          className="p-5 flex flex-col items-center"
          style={cardFlat}
        >
          <h3 style={{ color: theme.ink, marginBottom: 2, alignSelf: "flex-start" }}>
            Baseline cash health
          </h3>
          <p style={{ color: theme.slate, fontSize: "0.78rem", marginBottom: 12, alignSelf: "flex-start" }}>
            Before stress is applied
          </p>
          <CashHealthGauge score={baselineResult.healthScore} size={230} />
        </div>

        <div
          className="p-5" style={cardFlat}
        >
          <div className="flex items-center gap-2 mb-4">
            <TrendingDown size={16} color="#6b7280" />
            <h3 style={{ color: theme.ink }}>True Cost of Borrowing</h3>
          </div>
          <MetricRow label="You borrow" value={`PHP ${fmt(inputs.loanAmount)}`} />
          <MetricRow label="You repay" value={`PHP ${fmt(inputs.repaymentAmount)}`} />
          <MetricRow
            label="Interest + fees"
            value={`PHP ${fmt(trueCost)}`}
            color={trueCost > 0 ? "#dc2626" : "#16a34a"}
          />
          <MetricRow label="Effective rate" value={`${effectiveRate.toFixed(1)}%`} sub="on this loan" color="#d97706" />
          <MetricRow label="Est. APR" value={`${Math.min(annualizedRate, 9999).toFixed(0)}%`} sub="annualized" color="#d97706" />
          <MetricRow label="Days until due" value={`${daysUntilDue} days`} />
          <MetricRow label="Daily cost" value={`PHP ${dailyCost.toFixed(2)}/day`} sub="true cost per day held" />
          <div
            className="mt-4 flex items-center gap-2 p-3 rounded-xl"
            style={{ backgroundColor: "#fef9c3", border: "1px solid #fde047" }}
          >
            <Percent size={13} color="#854d0e" />
            <p style={{ color: "#854d0e", fontSize: "0.75rem" }}>
              That {effectiveRate.toFixed(1)}% fee becomes about{" "}
              <strong>{Math.min(annualizedRate, 9999).toFixed(0)}% APR</strong> when annualized.
            </p>
          </div>
        </div>
      </div>

      <div
        className="p-5" style={cardFlat}
      >
        <div className="flex items-center gap-2 mb-4">
          <Clock size={16} color="#6b7280" />
          <h3 style={{ color: theme.ink }}>Baseline Cash Flow After Repayment</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <CashRow
            label="Cash available"
            available={inputs.normalCashAfter}
            afterRepay={cashAfterNormal}
            margin={normalMargin}
            bufferLabel={normalMargin >= 0 ? "above buffer" : "below buffer"}
          />
          <CashRow
            label="Cash available"
            available={inputs.badDayCashAfter}
            afterRepay={cashAfterBad}
            margin={badMargin}
            bufferLabel={badMargin >= 0 ? "above buffer" : "below buffer"}
            isBad
          />
        </div>
      </div>

      {/* Scenario buttons + Slider + Live Gauge */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div
          className="p-5" style={cardFlat}
        >
          <div className="flex items-center gap-2 mb-2">
            <Zap size={16} color={theme.rust} />
            <h3 style={{ color: theme.ink }}>Income Drop Simulator</h3>
          </div>
          <p style={{ color: theme.slate, fontSize: "0.78rem", marginBottom: 14 }}>
            Choose a scenario or set a manual income drop.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-5">
            {scenarioButtons.map((scenario) => {
              const Icon = scenario.icon;
              const active = activeScenario?.id === scenario.id;

              return (
                <button
                  key={scenario.id}
                  onClick={() => {
                    setSelectedScenarioId(scenario.id);
                    setStressLow(0);
                    onStressChange(scenario.level);
                  }}
                  className="rounded-xl p-3 text-left transition-all"
                  style={{
                    backgroundColor: active ? scenario.bg : "#ffffff",
                    border: `1.5px solid ${active ? scenario.border : "#e5e7eb"}`,
                    cursor: "pointer",
                    minHeight: 86,
                    boxShadow: active ? "0 8px 18px rgba(15, 23, 42, 0.08)" : "none",
                  }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: scenario.bg }}
                    >
                      <Icon size={15} color={scenario.color} />
                    </div>
                    <span
                      style={{
                        color: active ? scenario.color : "#374151",
                        fontWeight: 800,
                        fontSize: "0.78rem",
                      }}
                    >
                      {scenario.label}
                    </span>
                  </div>
                  <div style={{ color: active ? scenario.color : "#6b7280", fontSize: "0.72rem" }}>
                    {scenario.detail}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Slider */}
          <div className="mb-5">
            <div className="flex justify-between mb-2">
              <span style={{ fontSize: "0.8rem", color: theme.slate }}>Low {stressLow}%</span>
              <span
                style={{
                  fontSize: "1.1rem",
                  fontWeight: 700,
                  color: isPastBreaking ? "#dc2626" : "#374151",
                }}
              >
                {stressLow}% - {stressHigh}% drop
              </span>
              <span style={{ fontSize: "0.8rem", color: theme.slate }}>High {stressHigh}%</span>
            </div>

            <div className="space-y-3">
              <div
                className="rounded-xl p-3"
                style={{ backgroundColor: "#f8fafc", border: "1px solid #e2e8f0" }}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span style={{ fontSize: "0.74rem", fontWeight: 700, color: theme.slate }}>
                    Low drop
                  </span>
                  <span style={{ fontSize: "0.76rem", fontWeight: 800, color: "#7c3aed" }}>
                    {stressLow}%
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  step={1}
                  value={stressLow}
                  onChange={(e) => {
                    setSelectedScenarioId("manual");
                    const next = Math.min(Number(e.target.value), stressHigh);
                    setStressLow(next);
                  }}
                  aria-label="Manual low stress percentage"
                  style={{ width: "100%", accentColor: "#a78bfa" }}
                />
              </div>

              <div
                className="rounded-xl p-3"
                style={{ backgroundColor: isPastBreaking ? "#fef2f2" : "#f5f3ff", border: `1px solid ${isPastBreaking ? "#fecaca" : "#ddd6fe"}` }}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span style={{ fontSize: "0.74rem", fontWeight: 700, color: theme.slate }}>
                    High drop used for live result
                  </span>
                  <span style={{ fontSize: "0.76rem", fontWeight: 800, color: isPastBreaking ? "#dc2626" : "#7c3aed" }}>
                    {stressHigh}%
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  step={1}
                  value={stressHigh}
                  onChange={(e) => {
                    setSelectedScenarioId("manual");
                    const next = Math.max(Number(e.target.value), stressLow);
                    onStressChange(next);
                  }}
                  aria-label="Manual high stress percentage"
                  style={{ width: "100%", accentColor: isPastBreaking ? "#dc2626" : "#7c3aed" }}
                />
              </div>
            </div>

            <div className="mt-3 grid grid-cols-[1fr_96px] gap-3 items-center">
              <div
                className="flex items-center gap-2 p-2.5 rounded-lg"
                style={{ backgroundColor: "#f8fafc", border: "1px solid #e2e8f0" }}
              >
                <SlidersHorizontal size={14} color="#6b7280" />
                <span style={{ fontSize: "0.74rem", color: theme.slate }}>
                  {activeScenario
                    ? `${activeScenario.label} applied`
                    : "Manual range applied"}; live score uses high drop.
                </span>
              </div>
              <input
                type="number"
                min={stressLow}
                max={100}
                value={stressHigh}
                onChange={(event) => {
                  const next = Math.min(100, Math.max(stressLow, Number(event.target.value) || 0));
                  setSelectedScenarioId("manual");
                  onStressChange(next);
                }}
                aria-label="Manual high stress percentage"
                style={{
                  width: "100%",
                  border: "1px solid #d1d5db",
                  borderRadius: 8,
                  padding: "8px 10px",
                  color: theme.charcoal,
                  fontWeight: 700,
                  fontSize: "0.82rem",
                }}
              />
            </div>
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
                <span style={{ fontSize: "0.78rem", color: theme.slate }}>{label}</span>
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
                    <div style={{ fontSize: "0.68rem", color: theme.slate }}>
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
          className="p-5 flex flex-col items-center" style={cardFlat}
        >
          <h3 style={{ color: theme.ink, marginBottom: 4, alignSelf: "flex-start" }}>
            Live Health Score
          </h3>
          <p style={{ color: theme.slate, fontSize: "0.78rem", marginBottom: 8, alignSelf: "flex-start" }}>
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
              <p style={{ fontSize: "0.72rem", color: theme.slate }}>
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
        className="p-5" style={cardFlat}
      >
        <h3 style={{ color: theme.ink, marginBottom: 4 }}>Cash After Repayment vs. Income Drop</h3>
        <p style={{ color: theme.slate, fontSize: "0.78rem", marginBottom: 16 }}>
          Dashed line shows your minimum cash buffer
        </p>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={chartData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="normalGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={theme.ink} stopOpacity={0.2} />
                <stop offset="95%" stopColor={theme.ink} stopOpacity={0} />
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
            {stressLow > 0 && stressLow !== stressHigh && (
              <ReferenceLine
                x={stressLow}
                stroke="#a78bfa"
                strokeDasharray="4 2"
                label={{ value: `${stressLow}% low`, position: "top", fontSize: 9, fill: "#7c3aed" }}
              />
            )}
            {stressHigh > 0 && (
              <ReferenceLine
                x={stressHigh}
                stroke="#7c3aed"
                strokeDasharray="4 2"
                label={{ value: `${stressHigh}% high`, position: "top", fontSize: 9, fill: "#7c3aed" }}
              />
            )}
            <Area
              type="monotone"
              dataKey="normal"
              stroke={theme.ink}
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
            { color: theme.ink, label: "Normal Day cash" },
            { color: "#ef4444", label: "Bad Day cash" },
            { color: "#dc2626", label: "Min. buffer line" },
          ].map(({ color, label }) => (
            <div key={label} className="flex items-center gap-1.5">
              <div style={{ width: 12, height: 3, backgroundColor: color, borderRadius: 2 }} />
              <span style={{ fontSize: "0.7rem", color: theme.slate }}>{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Danger Zone Calendar + Safer Borrowing */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div
          className="p-5" style={cardFlat}
        >
          <h3 style={{ color: theme.ink, marginBottom: 16 }}>⚠️ Danger Zone Calendar</h3>
          <DangerZoneCalendar
            dueDate={inputs.dueDate}
            breakingPoint={bp}
          />
        </div>

        <div
          className="p-5" style={cardFlat}
        >
          <h3 style={{ color: theme.ink, marginBottom: 12 }}>💡 Safer Borrowing Suggestions</h3>

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
        className="p-5" style={cardFlat}
      >
        <div className="flex items-center gap-2 mb-4">
          <BookOpen size={16} color="#374151" />
          <h3 style={{ color: theme.ink }}>Financial Micro-Lessons</h3>
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
                  <span style={{ fontWeight: 600, color: theme.charcoal, fontSize: "0.85rem" }}>
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
        <Button variant="outline" onClick={onBack} size="lg" style={pillButtonOutline}>
          <ArrowLeft size={18} />
          Back
        </Button>
        <Button
          onClick={() => onSave(stressLevel)}
          size="lg"
          style={pillButton}
        >
          <Save size={18} />
          Save Evaluation
        </Button>
      </div>
    </div>
  );
}
