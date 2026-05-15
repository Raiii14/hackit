import { useMemo, useState } from "react";
import { Shield, History } from "lucide-react";
import { LandingPage } from "./components/LandingPage";
import { StepIndicator } from "./components/StepIndicator";
import { StepBaseline } from "./components/StepBaseline";
import { StepEvaluation } from "./components/StepEvaluation";
import { StepStressTest } from "./components/StepStressTest";
import { StepHistory } from "./components/StepHistory";
import type { UiLoanInputs } from "../lib/loanAdapter";
import {
  evaluateLoanAtStressLevel,
  type EvaluationResult,
} from "../lib/evaluation";

export type LoanInputs = UiLoanInputs;
export type { EvaluationResult };

export interface SavedEvaluation {
  id: string;
  savedAt: string;
  label: string;
  inputs: LoanInputs;
  result: EvaluationResult;
  peakStressLevel: number;
}

const DEFAULT_INPUTS: LoanInputs = {
  loanAmount: 0,
  repaymentAmount: 0,
  dueDate: "",
  loanPurpose: "",
  normalCashAfter: 0,
  badDayCashAfter: 0,
  minCashBuffer: 0,
};

export default function App() {
  const [currentStep, setCurrentStep] = useState(0);
  const [inputs, setInputs] = useState<LoanInputs>(DEFAULT_INPUTS);
  const [stressLevel, setStressLevel] = useState(0);
  const [savedEvaluations, setSavedEvaluations] = useState<SavedEvaluation[]>([]);

  const baselineEvaluation = useMemo(() => {
    if (!inputs.dueDate) return null;
    return evaluateLoanAtStressLevel(inputs, 0);
  }, [inputs]);

  const stressedEvaluation = useMemo(() => {
    if (!inputs.dueDate) return null;
    return evaluateLoanAtStressLevel(inputs, stressLevel);
  }, [inputs, stressLevel]);

  const handleEvaluate = (newInputs: LoanInputs) => {
    setInputs(newInputs);
    setStressLevel(0);
    setCurrentStep(2);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSave = (peakStress: number) => {
    const result = evaluateLoanAtStressLevel(inputs, peakStress);
    if (!result) return;

    const saved: SavedEvaluation = {
      id: Date.now().toString(),
      savedAt: new Date().toISOString(),
      label: inputs.loanPurpose || `₱${inputs.loanAmount.toLocaleString()} Loan`,
      inputs,
      result,
      peakStressLevel: peakStress,
    };
    setSavedEvaluations((prev) => [saved, ...prev]);
    setCurrentStep(4);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNew = () => {
    setCurrentStep(1);
    setInputs(DEFAULT_INPUTS);
    setStressLevel(0);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleLoad = (saved: SavedEvaluation) => {
    setInputs(saved.inputs);
    setStressLevel(saved.peakStressLevel);
    setCurrentStep(2);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = (id: string) => {
    setSavedEvaluations((prev) => prev.filter((e) => e.id !== id));
  };

  const canNavigate = (step: number) => {
    if (step === 1) return true;
    if (step === 2 || step === 3) return baselineEvaluation !== null;
    if (step === 4) return savedEvaluations.length > 0;
    return false;
  };

  // Landing page (step 0) — entry screen per system flow
  if (currentStep === 0) {
    return (
      <LandingPage
        onStartTest={() => {
          setCurrentStep(1);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        onUseAccount={() => {
          if (savedEvaluations.length > 0) {
            setCurrentStep(4);
          } else {
            setCurrentStep(1);
          }
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        savedCount={savedEvaluations.length}
      />
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#f0f4f8" }}>
      {/* Header */}
      <header
        className="sticky top-0 z-50 shadow-lg"
        style={{ backgroundColor: "#0f172a" }}
      >
        <div className="max-w-4xl mx-auto px-4 py-3.5 flex items-center justify-between">
          <button
            onClick={() => setCurrentStep(0)}
            className="flex items-center gap-3"
            style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
          >
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center shadow-inner"
              style={{ backgroundColor: "#3b82f6" }}
            >
              <Shield size={18} color="white" />
            </div>
            <div style={{ textAlign: "left" }}>
              <div
                style={{
                  color: "white",
                  fontWeight: 800,
                  fontSize: "1.15rem",
                  lineHeight: 1.2,
                  letterSpacing: "-0.01em",
                }}
              >
                LoanWise
              </div>
              <div
                style={{
                  color: "#93c5fd",
                  fontSize: "0.68rem",
                  lineHeight: 1,
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                }}
              >
                Repayment Stress Simulator
              </div>
            </div>
          </button>

          {savedEvaluations.length > 0 && currentStep !== 4 && (
            <button
              onClick={() => setCurrentStep(4)}
              className="flex items-center gap-1.5"
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "#93c5fd",
                fontSize: "0.82rem",
              }}
            >
              <History size={15} />
              History ({savedEvaluations.length})
            </button>
          )}
        </div>
      </header>

      {/* Step Indicator */}
      <StepIndicator
        currentStep={currentStep}
        canNavigate={canNavigate}
        onStepClick={setCurrentStep}
      />

      {/* Main content */}
      <main className="max-w-4xl mx-auto px-4 py-6 pb-12">
        {currentStep === 1 && (
          <StepBaseline inputs={inputs} onNext={handleEvaluate} />
        )}

        {currentStep === 2 && baselineEvaluation && (
          <StepEvaluation
            inputs={inputs}
            result={baselineEvaluation}
            onBack={() => setCurrentStep(1)}
            onNext={() => setCurrentStep(3)}
          />
        )}

        {currentStep === 3 && stressedEvaluation && baselineEvaluation && (
          <StepStressTest
            inputs={inputs}
            result={stressedEvaluation}
            baselineResult={baselineEvaluation}
            stressLevel={stressLevel}
            onStressChange={setStressLevel}
            onBack={() => setCurrentStep(2)}
            onSave={handleSave}
          />
        )}

        {currentStep === 4 && (
          <StepHistory
            evaluations={savedEvaluations}
            onNew={handleNew}
            onLoad={handleLoad}
            onDelete={handleDelete}
          />
        )}
      </main>
    </div>
  );
}
