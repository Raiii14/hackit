import { useEffect, useState } from "react";
import type { CSSProperties } from "react";
import {
  addMonths,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  getDay,
  format,
  isSameDay,
  isToday,
  isSameMonth,
  subMonths,
  differenceInCalendarDays,
} from "date-fns";
import { ChevronLeft, ChevronRight, CalendarDays } from "lucide-react";

interface DangerZoneCalendarProps {
  dueDate: string; // "YYYY-MM-DD"
  breakingPoint: number; // % income drop where cash fails
}

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function DangerZoneCalendar({ dueDate, breakingPoint }: DangerZoneCalendarProps) {
  const due = new Date(dueDate + "T00:00:00");
  const [visibleMonth, setVisibleMonth] = useState(() => startOfMonth(due));
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  useEffect(() => {
    setVisibleMonth(startOfMonth(due));
  }, [dueDate]);

  const monthStart = startOfMonth(visibleMonth);
  const visibleMonthEnd = endOfMonth(visibleMonth);
  const days = eachDayOfInterval({ start: monthStart, end: visibleMonthEnd });
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
        <div className="flex items-center gap-2">
          <button
            onClick={() => setVisibleMonth((current) => subMonths(current, 1))}
            aria-label="Previous month"
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ border: "1px solid #e5e7eb", backgroundColor: "white", cursor: "pointer" }}
          >
            <ChevronLeft size={15} color="#6b7280" />
          </button>
          <button
            onClick={() => setVisibleMonth(startOfMonth(due))}
            className="px-3 h-8 rounded-lg flex items-center gap-2"
            style={{
              border: "1px solid #e5e7eb",
              backgroundColor: isSameMonth(visibleMonth, due) ? "#eff6ff" : "white",
              cursor: "pointer",
              color: isSameMonth(visibleMonth, due) ? "#1d4ed8" : "#374151",
              fontWeight: 700,
              fontSize: "0.78rem",
            }}
          >
            <CalendarDays size={14} />
            {format(visibleMonth, "MMM yyyy")}
          </button>
          <button
            onClick={() => setVisibleMonth((current) => addMonths(current, 1))}
            aria-label="Next month"
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ border: "1px solid #e5e7eb", backgroundColor: "white", cursor: "pointer" }}
          >
            <ChevronRight size={15} color="#6b7280" />
          </button>
        </div>
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
