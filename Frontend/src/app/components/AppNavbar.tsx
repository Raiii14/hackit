import { Shield, BookmarkCheck, Lock } from "lucide-react";
import { theme } from "../../lib/theme";

interface AppNavbarProps {
  onLogoClick: () => void;
  savedCount: number;
  onHistoryClick: () => void;
  onAccountClick: () => void;
  showHistory?: boolean;
}

export function AppNavbar({
  onLogoClick,
  savedCount,
  onHistoryClick,
  onAccountClick,
  showHistory = true,
}: AppNavbarProps) {
  return (
    <header
      className="flex items-center justify-between gap-4"
      style={{
        padding: "24px 0 20px",
        borderBottom: "1px solid rgba(243,240,238,0.16)",
      }}
    >
      <button
        onClick={onLogoClick}
        className="flex items-center gap-3"
        style={{
          background: "transparent",
          border: 0,
          color: theme.canvas,
          cursor: "pointer",
          padding: 0,
        }}
      >
        <span
          className="w-10 h-10 rounded-full flex items-center justify-center"
          style={{
            background: theme.canvas,
            color: theme.ink,
          }}
        >
          <Shield size={18} />
        </span>
        <span style={{ textAlign: "left" }}>
          <span
            style={{
              display: "block",
              color: theme.canvas,
              fontSize: "1.12rem",
              fontWeight: 700,
              lineHeight: 1,
              letterSpacing: 0,
            }}
          >
            LoanWise
          </span>
          <span
            style={{
              display: "block",
              color: "rgba(243,240,238,0.62)",
              fontSize: "0.66rem",
              lineHeight: 1.2,
              marginTop: 4,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
            }}
          >
            Repayment Stress Simulator
          </span>
        </span>
      </button>

      <nav className="flex items-center gap-5" aria-label="Main navigation">
        {showHistory && savedCount > 0 && (
          <button
            onClick={onHistoryClick}
            className="hidden sm:flex items-center gap-1.5"
            style={{
              background: "transparent",
              border: 0,
              color: "rgba(243,240,238,0.72)",
              cursor: "pointer",
              fontSize: "0.92rem",
              fontWeight: 500,
              padding: 0,
            }}
          >
            <BookmarkCheck size={15} />
            History ({savedCount})
          </button>
        )}
        <button
          onClick={onAccountClick}
          className="flex items-center gap-1.5"
          style={{
            background: "transparent",
            border: 0,
            color: theme.canvas,
            cursor: "pointer",
            fontSize: "0.92rem",
            fontWeight: 500,
            padding: 0,
          }}
        >
          <Lock size={14} />
          Use account
        </button>
      </nav>
    </header>
  );
}
