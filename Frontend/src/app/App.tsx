import { useState } from "react";
import { Shield, History } from "lucide-react";
import { LandingPage } from "./components/LandingPage";
import { StepIndicator } from "./components/StepIndicator";
import { StepBaseline } from "./components/StepBaseline";
import { StepEvaluation } from "./components/StepEvaluation";
import { StepStressTest } from "./components/StepStressTest";
import { StepHistory } from "./components/StepHistory";

export interface LoanInputs {
  loanAmount: number;
  repaymentAmount: number;
  dueDate: string;
  loanPurpose: string;
  normalCashAfter: number;
  badDayCashAfter: number;
  minCashBuffer: number;
}

export interface EvaluationResult {
  healthScore: number;
  healthStatus: "green" | "yellow" | "red";
  cashAfterNormal: number;
  cashAfterBad: number;
  normalMargin: number;
  badMargin: number;
  trueCost: number;
  effectiveRate: number;
  dailyCost: number;
  daysUntilDue: number;
  breakingPoint: number;
  saferLoanAmount: number;
  saferRepaymentAmount: number;
}

export interface SavedEvaluation {
  id: string;
  savedAt: string;
  label: string;
  inputs: LoanInputs;
  result: EvaluationResult;
  peakStressLevel: number;
}

export function calculateEvaluation(inputs: LoanInputs): EvaluationResult {
  const {
    loanAmount,
    repaymentAmount,
    dueDate,
    normalCashAfter,
    badDayCashAfter,
    minCashBuffer,
  } = inputs;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(dueDate + "T00:00:00");
  const daysUntilDue = Math.max(1, Math.ceil((due.getTime() - today.getTime()) / 86400000));

  const cashAfterNormal = normalCashAfter - repaymentAmount;
  const cashAfterBad = badDayCashAfter - repaymentAmount;
  const normalMargin = cashAfterNormal - minCashBuffer;
  const badMargin = cashAfterBad - minCashBuffer;

  const trueCost = Math.max(0, repaymentAmount - loanAmount);
  const effectiveRate = loanAmount > 0 ? (trueCost / loanAmount) * 100 : 0;
  const dailyCost = trueCost / daysUntilDue;

  // Health score: 0–100, weighted toward bad-day scenario
  const weightedMargin = normalMargin * 0.35 + badMargin * 0.65;
  const refAmount = Math.max(normalCashAfter, 100);
  const rawScore = 50 + (weightedMargin / refAmount) * 50;
  const healthScore = Math.max(0, Math.min(100, rawScore));

  let healthStatus: "green" | "yellow" | "red";
  if (badMargin < 0 || healthScore < 33) {
    healthStatus = "red";
  } else if (healthScore < 66) {
    healthStatus = "yellow";
  } else {
    healthStatus = "green";
  }

  // Breaking point: % income drop where bad day cash falls below buffer
  let breakingPoint = 100;
  if (badDayCashAfter > 0) {
    const needed = repaymentAmount + minCashBuffer;
    if (needed >= badDayCashAfter) {
      breakingPoint = 0;
    } else {
      breakingPoint = (1 - needed / badDayCashAfter) * 100;
    }
  }

  // Safer amounts: repayment that keeps bad-day cash above buffer
  const saferRepaymentAmount = Math.max(0, badDayCashAfter - minCashBuffer * 1.25);
  const saferLoanAmount =
    repaymentAmount > 0
      ? Math.max(0, loanAmount * (saferRepaymentAmount / repaymentAmount))
      : 0;

  return {
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
    breakingPoint,
    saferLoanAmount,
    saferRepaymentAmount,
  };
}

const makeDefaultDueDate = () => {
  const d = new Date();
  d.setDate(d.getDate() + 14);
  return d.toISOString().split("T")[0];
};

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
  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null);
  const [stressLevel, setStressLevel] = useState(0);
  const [savedEvaluations, setSavedEvaluations] = useState<SavedEvaluation[]>([]);

  const handleEvaluate = (newInputs: LoanInputs) => {
    setInputs(newInputs);
    setEvaluation(calculateEvaluation(newInputs));
    setStressLevel(0);
    setCurrentStep(2);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSave = (peakStress: number) => {
    if (!evaluation) return;
    const saved: SavedEvaluation = {
      id: Date.now().toString(),
      savedAt: new Date().toISOString(),
      label: inputs.loanPurpose || `₱${inputs.loanAmount.toLocaleString()} Loan`,
      inputs,
      result: evaluation,
      peakStressLevel: peakStress,
    };
    setSavedEvaluations((prev) => [saved, ...prev]);
    setCurrentStep(4);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNew = () => {
    setCurrentStep(1);
    setInputs(DEFAULT_INPUTS);
    setEvaluation(null);
    setStressLevel(0);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleLoad = (saved: SavedEvaluation) => {
    setInputs(saved.inputs);
    setEvaluation(saved.result);
    setStressLevel(saved.peakStressLevel);
    setCurrentStep(2);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = (id: string) => {
    setSavedEvaluations((prev) => prev.filter((e) => e.id !== id));
  };

  const canNavigate = (step: number) => {
    if (step === 1) return true;
    if (step === 2 || step === 3) return evaluation !== null;
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

        {currentStep === 2 && evaluation && (
          <StepEvaluation
            inputs={inputs}
            result={evaluation}
            onBack={() => setCurrentStep(1)}
            onNext={() => setCurrentStep(3)}
          />
        )}

        {currentStep === 3 && evaluation && (
          <StepStressTest
            inputs={inputs}
            result={evaluation}
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
