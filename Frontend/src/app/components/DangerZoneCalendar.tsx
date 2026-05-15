import type { CSSProperties } from "react";
import {
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  getDay,
  format,
  isSameDay,
  isToday,
  differenceInCalendarDays,
} from "date-fns";

interface DangerZoneCalendarProps {
  dueDate: string; // "YYYY-MM-DD"
  breakingPoint: number; // % income drop where cash fails
}

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function DangerZoneCalendar({ dueDate, breakingPoint }: DangerZoneCalendarProps) {
  const due = new Date(dueDate + "T00:00:00");
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const monthStart = startOfMonth(due);
  const monthEnd = endOfMonth(due);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const startPad = getDay(monthStart);

  const daysUntilDue = differenceInCalendarDays(due, today);
  const isHighRisk = breakingPoint < 15;
  const isMediumRisk = breakingPoint >= 15 && breakingPoint < 30;

  function getDayStyle(day: Date): CSSProperties {
    if (isSameDay(day, due)) {
      return {
        backgroundColor: "#dc2626",
        color: "white",
        borderRadius: "50%",
        fontWeight: 700,
      };
    }
    if (isToday(day)) {
      return {
        backgroundColor: "#2563eb",
        color: "white",
        borderRadius: "50%",
        fontWeight: 700,
      };
    }
    const diffFromDue = differenceInCalendarDays(due, day);
    if (diffFromDue > 0 && diffFromDue <= 3 && day >= today) {
      return {
        backgroundColor: "#fef2f2",
        color: "#dc2626",
        borderRadius: "50%",
        fontWeight: 600,
      };
    }
    if (diffFromDue > 3 && diffFromDue <= 7 && day >= today) {
      return {
        backgroundColor: "#fff7ed",
        color: "#c2410c",
        borderRadius: "50%",
      };
    }
    return {};
  }

  function getDayLabel(day: Date): string | null {
    if (isSameDay(day, due)) return "DUE";
    if (isToday(day)) return "NOW";
    return null;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <span style={{ fontWeight: 600, color: "#374151" }}>
          {format(due, "MMMM yyyy")}
        </span>
        <span
          style={{
            fontSize: "0.72rem",
            fontWeight: 600,
            padding: "2px 8px",
            borderRadius: 999,
            backgroundColor: isHighRisk ? "#fee2e2" : isMediumRisk ? "#fef3c7" : "#dcfce7",
            color: isHighRisk ? "#dc2626" : isMediumRisk ? "#92400e" : "#15803d",
          }}
        >
          {daysUntilDue > 0
            ? `Due in ${daysUntilDue} day${daysUntilDue === 1 ? "" : "s"}`
            : daysUntilDue === 0
            ? "Due Today!"
            : "Overdue"}
        </span>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 gap-0.5 mb-1">
        {DAYS.map((d) => (
          <div
            key={d}
            style={{
              textAlign: "center",
              fontSize: "0.65rem",
              fontWeight: 600,
              color: "#9ca3af",
              paddingBottom: 4,
            }}
          >
            {d}
          </div>
        ))}
      </div>

      {/* Day grid */}
      <div className="grid grid-cols-7 gap-0.5">
        {Array.from({ length: startPad }).map((_, i) => (
          <div key={`pad-${i}`} />
        ))}
        {days.map((day) => {
          const label = getDayLabel(day);
          const dayStyle = getDayStyle(day);
          return (
            <div
              key={day.toISOString()}
              className="flex flex-col items-center justify-center"
              style={{ aspectRatio: "1", padding: 1 }}
            >
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  ...dayStyle,
                  fontSize: "0.7rem",
                  lineHeight: 1.1,
                }}
              >
                <span>{format(day, "d")}</span>
                {label && (
                  <span style={{ fontSize: "0.55rem", fontWeight: 700, letterSpacing: 0 }}>
                    {label}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 mt-3">
        {[
          { color: "#2563eb", label: "Today" },
          { color: "#dc2626", label: "Due Date" },
          { color: "#f97316", label: "Danger Days (within 7 days)" },
        ].map(({ color, label }) => (
          <div key={label} className="flex items-center gap-1">
            <div style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: color }} />
            <span style={{ fontSize: "0.65rem", color: "#6b7280" }}>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
