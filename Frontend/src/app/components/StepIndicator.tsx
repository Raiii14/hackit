import { Check } from "lucide-react";

interface StepIndicatorProps {
  currentStep: number;
  canNavigate: (step: number) => boolean;
  onStepClick: (step: number) => void;
}

const STEPS = [
  { num: 1, label: "Baseline Inputs" },
  { num: 2, label: "Offer Evaluation" },
  { num: 3, label: "Stress Test" },
  { num: 4, label: "History" },
];

export function StepIndicator({ currentStep, canNavigate, onStepClick }: StepIndicatorProps) {
  return (
    <div style={{ backgroundColor: "#1e293b", borderBottom: "1px solid #334155" }}>
      <div className="max-w-4xl mx-auto px-4 py-3">
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
                  style={{ background: "none", border: "none", cursor: clickable ? "pointer" : "default", padding: 0 }}
                >
                  {/* Step circle */}
                  <div
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      backgroundColor: isActive
                        ? "#3b82f6"
                        : isCompleted
                        ? "#22c55e"
                        : "#334155",
                      color: isActive || isCompleted ? "white" : "#64748b",
                      transition: "background-color 0.2s",
                      fontSize: "0.8rem",
                      fontWeight: 700,
                    }}
                  >
                    {isCompleted ? <Check size={14} /> : step.num}
                  </div>

                  {/* Label (hidden on small screens) */}
                  <span
                    className="hidden sm:inline truncate"
                    style={{
                      color: isActive ? "white" : isCompleted ? "#86efac" : "#64748b",
                      fontSize: "0.78rem",
                      fontWeight: isActive ? 600 : 400,
                      transition: "color 0.2s",
                    }}
                  >
                    {step.label}
                  </span>
                </button>

                {/* Connector */}
                {i < STEPS.length - 1 && (
                  <div
                    className="flex-1 h-px mx-2 min-w-[8px]"
                    style={{
                      backgroundColor: currentStep > step.num ? "#22c55e" : "#334155",
                      transition: "background-color 0.3s",
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
