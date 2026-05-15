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
import { theme } from "../../lib/theme";

interface DangerZoneCalendarProps {
  dueDate: string;
  breakingPoint: number;
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
        backgroundColor: theme.danger,
        color: theme.canvas,
        borderRadius: "50%",
        fontWeight: 700,
      };
    }
    if (isToday(day)) {
      return {
        backgroundColor: theme.ink,
        color: theme.canvas,
        borderRadius: "50%",
        fontWeight: 700,
      };
    }
    const diffFromDue = differenceInCalendarDays(due, day);
    if (diffFromDue > 0 && diffFromDue <= 3 && day >= today) {
      return {
        backgroundColor: "#FDECEC",
        color: theme.danger,
        borderRadius: "50%",
        fontWeight: 600,
      };
    }
    if (diffFromDue > 3 && diffFromDue <= 7 && day >= today) {
      return {
        backgroundColor: "#FFF6E8",
        color: theme.rust,
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
            className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{ border: `1px solid ${theme.line}`, backgroundColor: theme.white, cursor: "pointer" }}
          >
            <ChevronLeft size={15} color={theme.slate} />
          </button>
          <button
            onClick={() => setVisibleMonth(startOfMonth(due))}
            className="px-3 h-8 rounded-full flex items-center gap-2"
            style={{
              border: `1px solid ${theme.line}`,
              backgroundColor: isSameMonth(visibleMonth, due) ? "#EFEAE5" : theme.white,
              cursor: "pointer",
              color: isSameMonth(visibleMonth, due) ? theme.ink : theme.charcoal,
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
            className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{ border: `1px solid ${theme.line}`, backgroundColor: theme.white, cursor: "pointer" }}
          >
            <ChevronRight size={15} color={theme.slate} />
          </button>
        </div>
        <span
          style={{
            fontSize: "0.72rem",
            fontWeight: 600,
            padding: "4px 10px",
            borderRadius: 999,
            backgroundColor: isHighRisk ? "#FDECEC" : isMediumRisk ? "#FFF6E8" : "#E7F3EA",
            color: isHighRisk ? theme.danger : isMediumRisk ? theme.amber : theme.green,
          }}
        >
          {daysUntilDue > 0
            ? `Due in ${daysUntilDue} day${daysUntilDue === 1 ? "" : "s"}`
            : daysUntilDue === 0
              ? "Due today"
              : "Overdue"}
        </span>
      </div>

      <div className="grid grid-cols-7 gap-0.5 mb-1">
        {DAYS.map((d) => (
          <div
            key={d}
            style={{
              textAlign: "center",
              fontSize: "0.65rem",
              fontWeight: 600,
              color: theme.slate,
              paddingBottom: 4,
            }}
          >
            {d}
          </div>
        ))}
      </div>

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

      <div className="flex flex-wrap gap-3 mt-3">
        {[
          { color: theme.ink, label: "Today" },
          { color: theme.danger, label: "Due date" },
          { color: theme.orange, label: "Danger days (within 7 days)" },
        ].map(({ color, label }) => (
          <div key={label} className="flex items-center gap-1">
            <div style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: color }} />
            <span style={{ fontSize: "0.65rem", color: theme.slate }}>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
