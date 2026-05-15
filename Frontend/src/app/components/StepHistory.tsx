import { Button } from "./ui/button";
import { Plus, Trash2, ArrowUpRight, Clock, TrendingDown } from "lucide-react";
import { format } from "date-fns";
import type { SavedEvaluation } from "../App";

interface Props {
  evaluations: SavedEvaluation[];
  onNew: () => void;
  onLoad: (ev: SavedEvaluation) => void;
  onDelete: (id: string) => void;
}

const STATUS_CONFIG = {
  green: { bg: "#f0fdf4", border: "#bbf7d0", dot: "#22c55e", label: "Safe", textColor: "#15803d" },
  yellow: { bg: "#fffbeb", border: "#fde68a", dot: "#f59e0b", label: "Caution", textColor: "#92400e" },
  red: { bg: "#fef2f2", border: "#fca5a5", dot: "#ef4444", label: "Danger", textColor: "#991b1b" },
};

function fmt(n: number) {
  return n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function StepHistory({ evaluations, onNew, onLoad, onDelete }: Props) {
  const summary = {
    green: evaluations.filter((e) => e.result.healthStatus === "green").length,
    yellow: evaluations.filter((e) => e.result.healthStatus === "yellow").length,
    red: evaluations.filter((e) => e.result.healthStatus === "red").length,
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div
        className="rounded-2xl p-5 flex items-start justify-between gap-4"
        style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)" }}
      >
        <div>
          <h1 style={{ color: "white", marginBottom: 4 }}>Evaluation History</h1>
          <p style={{ color: "#94a3b8", fontSize: "0.87rem" }}>
            Review, compare, and track your past loan evaluations.
          </p>
        </div>
        <Button
          onClick={onNew}
          style={{ backgroundColor: "#3b82f6", color: "white", flexShrink: 0 }}
          size="sm"
        >
          <Plus size={16} />
          New
        </Button>
      </div>

      {/* Summary bar */}
      {evaluations.length > 0 && (
        <div
          className="bg-white rounded-2xl p-4 shadow-sm grid grid-cols-3 gap-3"
          style={{ border: "1px solid #f1f5f9" }}
        >
          {(["green", "yellow", "red"] as const).map((s) => {
            const cfg = STATUS_CONFIG[s];
            return (
              <div
                key={s}
                className="rounded-xl p-3 flex flex-col items-center"
                style={{ backgroundColor: cfg.bg, border: `1px solid ${cfg.border}` }}
              >
                <div style={{ fontSize: "1.5rem", fontWeight: 800, color: cfg.textColor }}>
                  {summary[s]}
                </div>
                <div style={{ fontSize: "0.72rem", fontWeight: 600, color: cfg.textColor }}>
                  {cfg.label}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Evaluation list */}
      {evaluations.length === 0 ? (
        <div
          className="bg-white rounded-2xl p-12 shadow-sm flex flex-col items-center gap-4"
          style={{ border: "1px solid #f1f5f9" }}
        >
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center"
            style={{ backgroundColor: "#f8fafc" }}
          >
            <Clock size={28} color="#9ca3af" />
          </div>
          <div className="text-center">
            <p style={{ fontWeight: 600, color: "#374151", marginBottom: 4 }}>
              No saved evaluations yet
            </p>
            <p style={{ color: "#9ca3af", fontSize: "0.85rem" }}>
              Complete a stress test and save your evaluation to see it here.
            </p>
          </div>
          <Button
            onClick={onNew}
            style={{ backgroundColor: "#3b82f6", color: "white" }}
          >
            <Plus size={16} />
            Start First Evaluation
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {evaluations.map((ev) => {
            const cfg = STATUS_CONFIG[ev.result.healthStatus];
            const dueDate = new Date(ev.inputs.dueDate + "T00:00:00");
            return (
              <div
                key={ev.id}
                className="bg-white rounded-2xl p-5 shadow-sm"
                style={{ border: `1.5px solid ${cfg.border}` }}
              >
                <div className="flex items-start justify-between gap-3 mb-4">
                  {/* Status + title */}
                  <div className="flex items-start gap-3 min-w-0">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                      style={{ backgroundColor: cfg.bg }}
                    >
                      <div
                        style={{
                          width: 10,
                          height: 10,
                          borderRadius: "50%",
                          backgroundColor: cfg.dot,
                        }}
                      />
                    </div>
                    <div className="min-w-0">
                      <h4 style={{ color: "#111827", marginBottom: 2 }} className="truncate">
                        {ev.label}
                      </h4>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          style={{
                            fontSize: "0.72rem",
                            fontWeight: 600,
                            padding: "2px 8px",
                            borderRadius: 999,
                            backgroundColor: cfg.bg,
                            color: cfg.textColor,
                            border: `1px solid ${cfg.border}`,
                          }}
                        >
                          {cfg.label}
                        </span>
                        <span style={{ fontSize: "0.72rem", color: "#9ca3af" }}>
                          Saved {format(new Date(ev.savedAt), "MMM d, yyyy h:mm a")}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onLoad(ev)}
                      style={{ fontSize: "0.78rem" }}
                    >
                      Load
                      <ArrowUpRight size={13} />
                    </Button>
                    <button
                      onClick={() => onDelete(ev.id)}
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        padding: "6px",
                        borderRadius: 6,
                        color: "#9ca3af",
                        display: "flex",
                        alignItems: "center",
                      }}
                      className="hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>

                {/* Metrics grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    {
                      label: "Loan Amount",
                      value: `₱${ev.inputs.loanAmount.toLocaleString()}`,
                      sub: `repay ₱${ev.inputs.repaymentAmount.toLocaleString()}`,
                    },
                    {
                      label: "Health Score",
                      value: `${Math.round(ev.result.healthScore)}/100`,
                      sub: cfg.label,
                      color: cfg.textColor,
                    },
                    {
                      label: "Breaking Point",
                      value: `${ev.result.breakingPoint.toFixed(1)}%`,
                      sub: "income drop",
                      color: ev.result.breakingPoint < 15 ? "#dc2626" : ev.result.breakingPoint < 30 ? "#d97706" : "#16a34a",
                    },
                    {
                      label: "Due Date",
                      value: format(dueDate, "MMM d"),
                      sub: format(dueDate, "yyyy"),
                    },
                  ].map(({ label, value, sub, color }) => (
                    <div
                      key={label}
                      className="rounded-lg p-3"
                      style={{ backgroundColor: "#f8fafc", border: "1px solid #f1f5f9" }}
                    >
                      <div style={{ fontSize: "0.68rem", color: "#9ca3af", marginBottom: 2 }}>
                        {label}
                      </div>
                      <div
                        style={{
                          fontWeight: 700,
                          color: color || "#374151",
                          fontSize: "0.9rem",
                        }}
                      >
                        {value}
                      </div>
                      {sub && (
                        <div style={{ fontSize: "0.68rem", color: "#9ca3af" }}>{sub}</div>
                      )}
                    </div>
                  ))}
                </div>

                {/* True cost highlight */}
                <div
                  className="mt-3 flex items-center gap-2 p-2.5 rounded-lg"
                  style={{ backgroundColor: "#fef9c3", border: "1px solid #fde047" }}
                >
                  <TrendingDown size={13} color="#854d0e" />
                  <p style={{ fontSize: "0.72rem", color: "#854d0e" }}>
                    True cost:{" "}
                    <strong>₱{fmt(ev.result.trueCost)}</strong> ({ev.result.effectiveRate.toFixed(1)}%
                    rate) over <strong>{ev.result.daysUntilDue} days</strong>
                    {ev.peakStressLevel > 0 && (
                      <>
                        {" "}· Peak stress tested:{" "}
                        <strong>{ev.peakStressLevel}% income drop</strong>
                      </>
                    )}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Start new evaluation */}
      {evaluations.length > 0 && (
        <div className="flex justify-center">
          <Button
            onClick={onNew}
            variant="outline"
            size="lg"
          >
            <Plus size={18} />
            New Evaluation
          </Button>
        </div>
      )}
    </div>
  );
}
