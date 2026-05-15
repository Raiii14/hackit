import { useMemo, useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import {
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  ChevronsUpDown,
  Clock,
  FileSpreadsheet,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import { format } from "date-fns";
import type { SavedEvaluation } from "../App";

interface Props {
  evaluations: SavedEvaluation[];
  onNew: () => void;
  onLoad: (ev: SavedEvaluation) => void;
  onDelete: (id: string) => void;
}

type StatusFilter = "all" | "green" | "yellow" | "red";
type SortKey = "savedAt" | "label" | "status" | "loanAmount" | "healthScore" | "dueDate";
type SortDirection = "asc" | "desc";

const STATUS_CONFIG = {
  green: { bg: "#f0fdf4", border: "#bbf7d0", dot: "#22c55e", label: "Safe", textColor: "#15803d" },
  yellow: { bg: "#fffbeb", border: "#fde68a", dot: "#f59e0b", label: "Caution", textColor: "#92400e" },
  red: { bg: "#fef2f2", border: "#fca5a5", dot: "#ef4444", label: "Danger", textColor: "#991b1b" },
};

const REPORT_COLUMNS = [
  "Saved",
  "Evaluation",
  "Status",
  "Loan Amount",
  "Repayment Amount",
  "Due Date",
  "Health Score",
  "Cash After Normal",
  "Cash After Bad Day",
  "True Cost",
  "Effective Rate",
  "Breaking Point",
  "Peak Stress",
];

function fmt(n: number) {
  return n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function fmtMoney(n: number) {
  return `PHP ${fmt(n)}`;
}

function fmtPercent(n: number) {
  return `${n.toFixed(1)}%`;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function getReportRows(rows: SavedEvaluation[]) {
  return rows.map((ev) => {
    const cfg = STATUS_CONFIG[ev.result.healthStatus];
    return [
      format(new Date(ev.savedAt), "MMM d, yyyy h:mm a"),
      ev.label,
      cfg.label,
      fmtMoney(ev.inputs.loanAmount),
      fmtMoney(ev.inputs.repaymentAmount),
      format(new Date(ev.inputs.dueDate + "T00:00:00"), "MMM d, yyyy"),
      `${Math.round(ev.result.healthScore)}/100`,
      fmtMoney(ev.result.cashAfterNormal),
      fmtMoney(ev.result.cashAfterBad),
      fmtMoney(ev.result.trueCost),
      fmtPercent(ev.result.effectiveRate),
      fmtPercent(ev.result.breakingPoint),
      fmtPercent(ev.peakStressLevel),
    ];
  });
}

function buildReportHtml(rows: SavedEvaluation[], title: string) {
  const reportRows = getReportRows(rows);
  const generatedAt = format(new Date(), "MMM d, yyyy h:mm a");

  return `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <title>${escapeHtml(title)}</title>
  <style>
    body { font-family: Arial, sans-serif; color: #111827; margin: 28px; }
    h1 { font-size: 22px; margin: 0 0 4px; }
    p { color: #4b5563; margin: 0 0 18px; font-size: 12px; }
    table { border-collapse: collapse; width: 100%; font-size: 11px; }
    th { background: #0f172a; color: white; text-align: left; padding: 8px; border: 1px solid #334155; }
    td { padding: 7px 8px; border: 1px solid #d1d5db; vertical-align: top; }
    tr:nth-child(even) td { background: #f8fafc; }
    .meta { display: flex; justify-content: space-between; gap: 16px; margin-bottom: 16px; }
    @media print {
      body { margin: 16px; }
      button { display: none; }
    }
  </style>
</head>
<body>
  <h1>${escapeHtml(title)}</h1>
  <div class="meta">
    <p>Generated: ${escapeHtml(generatedAt)}</p>
    <p>Total evaluations: ${rows.length}</p>
  </div>
  <table>
    <thead>
      <tr>${REPORT_COLUMNS.map((col) => `<th>${escapeHtml(col)}</th>`).join("")}</tr>
    </thead>
    <tbody>
      ${reportRows
        .map((row) => `<tr>${row.map((cell) => `<td>${escapeHtml(cell)}</td>`).join("")}</tr>`)
        .join("")}
    </tbody>
  </table>
</body>
</html>`;
}

function downloadFile(content: string, filename: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function SortButton({
  children,
  sortKey,
  activeKey,
  direction,
  onSort,
}: {
  children: string;
  sortKey: SortKey;
  activeKey: SortKey;
  direction: SortDirection;
  onSort: (key: SortKey) => void;
}) {
  const active = activeKey === sortKey;

  return (
    <button
      onClick={() => onSort(sortKey)}
      className="inline-flex items-center gap-1"
      style={{
        background: "none",
        border: "none",
        color: active ? "#111827" : "#6b7280",
        cursor: "pointer",
        fontSize: "0.72rem",
        fontWeight: 700,
        padding: 0,
      }}
    >
      {children}
      <ChevronsUpDown size={12} opacity={active ? 1 : 0.45} />
      {active && (
        <span style={{ fontSize: "0.65rem", color: "#9ca3af" }}>
          {direction === "asc" ? "A-Z" : "Z-A"}
        </span>
      )}
    </button>
  );
}

export function StepHistory({ evaluations, onNew, onLoad, onDelete }: Props) {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [sortKey, setSortKey] = useState<SortKey>("savedAt");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [pageSize, setPageSize] = useState(5);
  const [currentPage, setCurrentPage] = useState(0);

  const summary = {
    green: evaluations.filter((e) => e.result.healthStatus === "green").length,
    yellow: evaluations.filter((e) => e.result.healthStatus === "yellow").length,
    red: evaluations.filter((e) => e.result.healthStatus === "red").length,
  };

  const filteredEvaluations = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return evaluations
      .filter((ev) => {
        const cfg = STATUS_CONFIG[ev.result.healthStatus];
        const matchesStatus = statusFilter === "all" || ev.result.healthStatus === statusFilter;
        const searchText = [
          ev.label,
          ev.inputs.loanPurpose,
          cfg.label,
          ev.inputs.dueDate,
          fmtMoney(ev.inputs.loanAmount),
          fmtMoney(ev.inputs.repaymentAmount),
        ]
          .join(" ")
          .toLowerCase();

        return matchesStatus && (!normalizedQuery || searchText.includes(normalizedQuery));
      })
      .sort((a, b) => {
        const direction = sortDirection === "asc" ? 1 : -1;
        const statusRank = { green: 3, yellow: 2, red: 1 };

        const getValue = (ev: SavedEvaluation) => {
          switch (sortKey) {
            case "label":
              return ev.label.toLowerCase();
            case "status":
              return statusRank[ev.result.healthStatus];
            case "loanAmount":
              return ev.inputs.loanAmount;
            case "healthScore":
              return ev.result.healthScore;
            case "dueDate":
              return new Date(ev.inputs.dueDate + "T00:00:00").getTime();
            case "savedAt":
            default:
              return new Date(ev.savedAt).getTime();
          }
        };

        const av = getValue(a);
        const bv = getValue(b);
        if (av < bv) return -1 * direction;
        if (av > bv) return 1 * direction;
        return 0;
      });
  }, [evaluations, pageSize, query, sortDirection, sortKey, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredEvaluations.length / pageSize));
  const pageIndex = Math.min(currentPage, totalPages - 1);
  const startIndex = pageIndex * pageSize;
  const visibleEvaluations = filteredEvaluations.slice(startIndex, startIndex + pageSize);
  const hasRows = filteredEvaluations.length > 0;

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDirection(key === "label" ? "asc" : "desc");
    }
    setCurrentPage(0);
  };

  // PDF/print export removed per Step 4 process request. Excel export remains.

  const handleExcelExport = (rows: SavedEvaluation[]) => {
    const worksheet = buildReportHtml(rows, "LoanWise Evaluation History Excel Export");
    const filename = `loanwise-evaluation-history-${format(new Date(), "yyyy-MM-dd-HHmm")}.xls`;
    downloadFile(
      worksheet,
      filename,
      "application/vnd.ms-excel;charset=utf-8",
    );
  };

  const handleFilterChange = (value: StatusFilter) => {
    setStatusFilter(value);
    setCurrentPage(0);
  };

  const handlePageSizeChange = (value: string) => {
    setPageSize(Number(value));
    setCurrentPage(0);
  };

  return (
    <div className="space-y-5">
      <div
        className="rounded-2xl p-5 flex items-start justify-between gap-4"
        style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)" }}
      >
        <div>
          <h1 style={{ color: "white", marginBottom: 4 }}>Evaluation History</h1>
          <p style={{ color: "#94a3b8", fontSize: "0.87rem" }}>
            Browse saved loan stress tests, compare results, and export reports.
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
        <div
          className="bg-white rounded-2xl shadow-sm overflow-hidden"
          style={{ border: "1px solid #f1f5f9" }}
        >
          <div
            className="p-4 flex flex-col gap-3"
            style={{ borderBottom: "1px solid #f1f5f9" }}
          >
            <div className="grid grid-cols-1 md:grid-cols-[1fr_150px_120px] gap-3">
              <div className="relative">
                <Search
                  size={15}
                  color="#9ca3af"
                  style={{ position: "absolute", left: 11, top: 10 }}
                />
                <Input
                  value={query}
                  onChange={(event) => {
                    setQuery(event.target.value);
                    setCurrentPage(0);
                  }}
                  placeholder="Search evaluations, purpose, status, or amount"
                  className="pl-9"
                />
              </div>

              <Select value={statusFilter} onValueChange={(value) => handleFilterChange(value as StatusFilter)}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  <SelectItem value="green">Safe</SelectItem>
                  <SelectItem value="yellow">Caution</SelectItem>
                  <SelectItem value="red">Danger</SelectItem>
                </SelectContent>
              </Select>

              <Select value={String(pageSize)} onValueChange={handlePageSizeChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Rows" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5 rows</SelectItem>
                  <SelectItem value="10">10 rows</SelectItem>
                  <SelectItem value="20">20 rows</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3">
              <p style={{ color: "#6b7280", fontSize: "0.78rem" }}>
                Showing {hasRows ? startIndex + 1 : 0}-
                {Math.min(startIndex + pageSize, filteredEvaluations.length)} of{" "}
                {filteredEvaluations.length} saved evaluations
              </p>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" onClick={() => handleExcelExport(evaluations)} disabled={evaluations.length === 0}>
                  <FileSpreadsheet size={15} />
                  Excel
                </Button>
              </div>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow style={{ backgroundColor: "#f8fafc" }}>
                <TableHead>
                  <SortButton sortKey="label" activeKey={sortKey} direction={sortDirection} onSort={handleSort}>
                    Evaluation
                  </SortButton>
                </TableHead>
                <TableHead>
                  <SortButton sortKey="status" activeKey={sortKey} direction={sortDirection} onSort={handleSort}>
                    Status
                  </SortButton>
                </TableHead>
                <TableHead>
                  <SortButton sortKey="loanAmount" activeKey={sortKey} direction={sortDirection} onSort={handleSort}>
                    Loan
                  </SortButton>
                </TableHead>
                <TableHead>
                  <SortButton sortKey="healthScore" activeKey={sortKey} direction={sortDirection} onSort={handleSort}>
                    Score
                  </SortButton>
                </TableHead>
                <TableHead>
                  <SortButton sortKey="dueDate" activeKey={sortKey} direction={sortDirection} onSort={handleSort}>
                    Due
                  </SortButton>
                </TableHead>
                <TableHead>Stress</TableHead>
                <TableHead>
                  <SortButton sortKey="savedAt" activeKey={sortKey} direction={sortDirection} onSort={handleSort}>
                    Saved
                  </SortButton>
                </TableHead>
                <TableHead style={{ textAlign: "right" }}>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {visibleEvaluations.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8}>
                    <div className="py-10 text-center">
                      <p style={{ color: "#374151", fontWeight: 700, marginBottom: 4 }}>
                        No matching evaluations
                      </p>
                      <p style={{ color: "#9ca3af", fontSize: "0.82rem" }}>
                        Try clearing the search field or changing the status filter.
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                visibleEvaluations.map((ev) => {
                  const cfg = STATUS_CONFIG[ev.result.healthStatus];
                  const dueDate = new Date(ev.inputs.dueDate + "T00:00:00");

                  return (
                    <TableRow key={ev.id}>
                      <TableCell>
                        <div style={{ minWidth: 160 }}>
                          <div style={{ color: "#111827", fontWeight: 700, fontSize: "0.84rem" }}>
                            {ev.label}
                          </div>
                          <div style={{ color: "#9ca3af", fontSize: "0.72rem" }}>
                            Repay {fmtMoney(ev.inputs.repaymentAmount)}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span
                          className="inline-flex items-center gap-1.5"
                          style={{
                            fontSize: "0.72rem",
                            fontWeight: 700,
                            padding: "4px 9px",
                            borderRadius: 999,
                            backgroundColor: cfg.bg,
                            color: cfg.textColor,
                            border: `1px solid ${cfg.border}`,
                          }}
                        >
                          <span
                            style={{
                              width: 7,
                              height: 7,
                              borderRadius: "50%",
                              backgroundColor: cfg.dot,
                            }}
                          />
                          {cfg.label}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div style={{ color: "#374151", fontWeight: 700 }}>
                          {fmtMoney(ev.inputs.loanAmount)}
                        </div>
                        <div style={{ color: "#9ca3af", fontSize: "0.7rem" }}>
                          Cost {fmtMoney(ev.result.trueCost)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div style={{ color: cfg.textColor, fontWeight: 800 }}>
                          {Math.round(ev.result.healthScore)}/100
                        </div>
                        <div style={{ color: "#9ca3af", fontSize: "0.7rem" }}>
                          {fmtPercent(ev.result.effectiveRate)} rate
                        </div>
                      </TableCell>
                      <TableCell>
                        <div style={{ color: "#374151", fontWeight: 700 }}>
                          {format(dueDate, "MMM d")}
                        </div>
                        <div style={{ color: "#9ca3af", fontSize: "0.7rem" }}>
                          {ev.result.daysUntilDue} days
                        </div>
                      </TableCell>
                      <TableCell>
                        <div style={{ color: "#374151", fontWeight: 700 }}>
                          {fmtPercent(ev.peakStressLevel)}
                        </div>
                        <div style={{ color: "#9ca3af", fontSize: "0.7rem" }}>
                          peak tested
                        </div>
                      </TableCell>
                      <TableCell>
                        <div style={{ color: "#374151", fontWeight: 700 }}>
                          {format(new Date(ev.savedAt), "MMM d")}
                        </div>
                        <div style={{ color: "#9ca3af", fontSize: "0.7rem" }}>
                          {format(new Date(ev.savedAt), "h:mm a")}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onLoad(ev)}
                            style={{ fontSize: "0.76rem" }}
                          >
                            Load
                            <ArrowUpRight size={13} />
                          </Button>
                          <button
                            onClick={() => onDelete(ev.id)}
                            aria-label={`Delete ${ev.label}`}
                            style={{
                              background: "none",
                              border: "none",
                              cursor: "pointer",
                              padding: "7px",
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
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>

          <div
            className="p-4 flex flex-col sm:flex-row items-center justify-between gap-3"
            style={{ borderTop: "1px solid #f1f5f9" }}
          >
            <p style={{ color: "#6b7280", fontSize: "0.78rem" }}>
              Page {hasRows ? pageIndex + 1 : 0} of {hasRows ? totalPages : 0}
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(0, prev - 1))}
                disabled={pageIndex === 0 || !hasRows}
              >
                <ChevronLeft size={15} />
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.min(totalPages - 1, prev + 1))}
                disabled={pageIndex >= totalPages - 1 || !hasRows}
              >
                Next
                <ChevronRight size={15} />
              </Button>
            </div>
          </div>
        </div>
      )}

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
