import { Button } from "./ui/button";
import { CashHealthGauge } from "./CashHealthGauge";
import {
  ArrowLeft,
  ArrowRight,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Percent,
} from "lucide-react";
import type { LoanInputs, EvaluationResult } from "../App";

interface Props {
  inputs: LoanInputs;
  result: EvaluationResult;
  onBack: () => void;
  onNext: () => void;
}

function fmt(n: number) {
  return n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
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
    <div className="flex items-center justify-between py-2.5" style={{ borderBottom: "1px solid #f3f4f6" }}>
      <span style={{ color: "#6b7280", fontSize: "0.85rem" }}>{label}</span>
      <div className="text-right">
        <span style={{ color: color || "#111827", fontWeight: 600, fontSize: "0.9rem" }}>
          {value}
        </span>
        {sub && (
          <div style={{ color: "#9ca3af", fontSize: "0.72rem" }}>{sub}</div>
        )}
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
        <span style={{ fontWeight: 600, color: "#374151", fontSize: "0.85rem" }}>
          {isBad ? "☁️" : "☀️"} {label}
        </span>
        {isNeg || marginBad ? (
          <XCircle size={16} color="#dc2626" />
        ) : (
          <CheckCircle size={16} color="#16a34a" />
        )}
      </div>
      <div className="space-y-1.5">
        <div className="flex justify-between">
          <span style={{ fontSize: "0.78rem", color: "#6b7280" }}>Cash available</span>
          <span style={{ fontSize: "0.78rem", fontWeight: 600, color: "#374151" }}>
            ₱{fmt(available)}
          </span>
        </div>
        <div className="flex justify-between">
          <span style={{ fontSize: "0.78rem", color: "#6b7280" }}>After repayment</span>
          <span
            style={{
              fontSize: "0.78rem",
              fontWeight: 700,
              color: afterRepay < 0 ? "#dc2626" : "#374151",
            }}
          >
            {afterRepay < 0 ? "-" : ""}₱{fmt(Math.abs(afterRepay))}
          </span>
        </div>
        <div className="flex justify-between">
          <span style={{ fontSize: "0.78rem", color: "#6b7280" }}>vs. buffer</span>
          <span
            style={{
              fontSize: "0.78rem",
              fontWeight: 700,
              color: marginBad ? "#dc2626" : "#16a34a",
            }}
          >
            {margin >= 0 ? "+" : ""}₱{fmt(margin)} {bufferLabel}
          </span>
        </div>
      </div>
    </div>
  );
}

export function StepEvaluation({ inputs, result, onBack, onNext }: Props) {
  const {
    healthScore,
    healthStatus,
    cashAfterNormal,
    cashAfterBad,
    normalMargin,
    badMargin,
    trueCost,
    effectiveRate,
    dailyCost,
    daysUntilDue,
  } = result;

  const statusBannerBg = {
    green: "linear-gradient(135deg, #14532d 0%, #15803d 100%)",
    yellow: "linear-gradient(135deg, #78350f 0%, #92400e 100%)",
    red: "linear-gradient(135deg, #7f1d1d 0%, #991b1b 100%)",
  }[healthStatus];

  const statusMsg = {
    green: "This loan appears manageable based on your cash flow. You have a healthy cushion above your buffer.",
    yellow: "Proceed with caution. This loan is tight — a bad income day could push you below your buffer.",
    red: "High risk detected. On a bad day, this repayment would leave you below your minimum buffer.",
  }[healthStatus];

  const StatusIcon = healthStatus === "green" ? CheckCircle : AlertTriangle;
  const annualizedRate =
    daysUntilDue > 0
      ? (Math.pow(1 + trueCost / Math.max(inputs.loanAmount, 1), 365 / daysUntilDue) - 1) * 100
      : effectiveRate;

  return (
    <div className="space-y-5">
      {/* Status banner */}
      <div
        className="rounded-2xl p-5 flex items-start gap-4"
        style={{ background: statusBannerBg }}
      >
        <StatusIcon size={24} color="white" style={{ flexShrink: 0, marginTop: 2 }} />
        <div>
          <h2 style={{ color: "white", marginBottom: 4 }}>Step 2: Offer Evaluation</h2>
          <p style={{ color: "rgba(255,255,255,0.8)", fontSize: "0.87rem" }}>{statusMsg}</p>
        </div>
      </div>

      {/* Gauge + Cost Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Gauge */}
        <div
          className="bg-white rounded-2xl p-5 shadow-sm flex flex-col items-center"
          style={{ border: "1px solid #f1f5f9" }}
        >
          <h3 style={{ color: "#111827", marginBottom: 2, alignSelf: "flex-start" }}>
            Cash Health Score
          </h3>
          <p style={{ color: "#6b7280", fontSize: "0.78rem", marginBottom: 12, alignSelf: "flex-start" }}>
            Based on worst-case (bad day) scenario
          </p>
          <CashHealthGauge score={healthScore} size={260} />
        </div>

        {/* True Cost */}
        <div
          className="bg-white rounded-2xl p-5 shadow-sm"
          style={{ border: "1px solid #f1f5f9" }}
        >
          <div className="flex items-center gap-2 mb-4">
            <TrendingDown size={16} color="#6b7280" />
            <h3 style={{ color: "#111827" }}>True Cost of Borrowing</h3>
          </div>

          <MetricRow label="You borrow" value={`₱${fmt(inputs.loanAmount)}`} />
          <MetricRow label="You repay" value={`₱${fmt(inputs.repaymentAmount)}`} />
          <MetricRow
            label="Interest + Fees"
            value={`₱${fmt(trueCost)}`}
            color={trueCost > 0 ? "#dc2626" : "#16a34a"}
          />
          <MetricRow
            label="Effective rate"
            value={`${effectiveRate.toFixed(1)}%`}
            sub="on this loan"
            color="#d97706"
          />
          <MetricRow
            label="Est. APR"
            value={`${Math.min(annualizedRate, 9999).toFixed(0)}%`}
            sub="annualized"
            color="#d97706"
          />
          <MetricRow
            label="Days until due"
            value={`${daysUntilDue} days`}
          />
          <MetricRow
            label="Daily cost"
            value={`₱${dailyCost.toFixed(2)}/day`}
            sub="true cost per day held"
          />

          {/* Insight pill */}
          <div
            className="mt-4 flex items-center gap-2 p-3 rounded-xl"
            style={{ backgroundColor: "#fef9c3", border: "1px solid #fde047" }}
          >
            <Percent size={13} color="#854d0e" />
            <p style={{ color: "#854d0e", fontSize: "0.75rem" }}>
              That {effectiveRate.toFixed(1)}% fee equates to a{" "}
              <strong>{Math.min(annualizedRate, 9999).toFixed(0)}% APR</strong>. Most credit
              cards charge 18–29%.
            </p>
          </div>
        </div>
      </div>

      {/* Cash Flow Projections */}
      <div
        className="bg-white rounded-2xl p-5 shadow-sm"
        style={{ border: "1px solid #f1f5f9" }}
      >
        <div className="flex items-center gap-2 mb-4">
          <Clock size={16} color="#6b7280" />
          <h3 style={{ color: "#111827" }}>Cash Flow After Repayment</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <CashRow
            label="Normal Day"
            available={inputs.normalCashAfter}
            afterRepay={cashAfterNormal}
            margin={normalMargin}
            bufferLabel={normalMargin >= 0 ? "above buffer" : "below buffer"}
          />
          <CashRow
            label="Bad Day"
            available={inputs.badDayCashAfter}
            afterRepay={cashAfterBad}
            margin={badMargin}
            bufferLabel={badMargin >= 0 ? "above buffer" : "below buffer"}
            isBad
          />
        </div>
        <div
          className="mt-3 p-3 rounded-xl flex items-center gap-2"
          style={{ backgroundColor: "#f8fafc", border: "1px solid #e2e8f0" }}
        >
          <p style={{ color: "#6b7280", fontSize: "0.75rem" }}>
            Your minimum cash buffer is{" "}
            <strong style={{ color: "#374151" }}>₱{fmt(inputs.minCashBuffer)}</strong>. This is
            the floor we protect — going below it typically triggers financial cascades.
          </p>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={onBack} size="lg">
          <ArrowLeft size={18} />
          Back
        </Button>
        <Button
          onClick={onNext}
          size="lg"
          style={{ backgroundColor: "#3b82f6", color: "white" }}
        >
          Run Stress Test
          <ArrowRight size={18} />
        </Button>
      </div>
    </div>
  );
}
