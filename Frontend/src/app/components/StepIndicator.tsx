import { Check } from "lucide-react";
import { theme } from "../../lib/theme";

interface StepIndicatorProps {
  currentStep: number;
  canNavigate: (step: number) => boolean;
  onStepClick: (step: number) => void;
}

const STEPS = [
  { num: 1, label: "Baseline Inputs" },
  { num: 2, label: "Verdict" },
  { num: 3, label: "History" },
];

export function StepIndicator({ currentStep, canNavigate, onStepClick }: StepIndicatorProps) {
  return (
    <div style={{ backgroundColor: theme.paper, borderBottom: `1px solid ${theme.line}` }}>
      <div className="max-w-4xl mx-auto px-4 py-4">
        <div className="flex items-center">
          {STEPS.map((step, i) => {
            const isActive = currentStep === step.num;
            const isCompleted = currentStep > step.num;
            const clickable = canNavigate(step.num) && !isActive;

            return (
              <div key={step.num} className="flex items-center flex-1 min-w-0">
                <button
                  disabled={!clickable}
                  onClick={() => clickable && onStepClick(step.num)}
                  className="flex items-center gap-2 min-w-0"
                  style={{
                    background: "none",
                    border: "none",
                    cursor: clickable ? "pointer" : "default",
                    padding: 0,
                  }}
                >
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      backgroundColor: isActive
                        ? theme.ink
                        : isCompleted
                          ? theme.green
                          : theme.line,
                      color: isActive || isCompleted ? theme.canvas : theme.slate,
                      fontSize: "0.8rem",
                      fontWeight: 700,
                    }}
                  >
                    {isCompleted ? <Check size={14} /> : step.num}
                  </div>

                  <span
                    className="hidden sm:inline truncate"
                    style={{
                      color: isActive ? theme.ink : isCompleted ? theme.green : theme.slate,
                      fontSize: "0.78rem",
                      fontWeight: isActive ? 600 : 450,
                    }}
                  >
                    {step.label}
                  </span>
                </button>

                {i < STEPS.length - 1 && (
                  <div
                    className="flex-1 h-px mx-2 min-w-[8px]"
                    style={{
                      backgroundColor: currentStep > step.num ? theme.green : theme.line,
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
