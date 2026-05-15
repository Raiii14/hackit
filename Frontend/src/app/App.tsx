import { useMemo, useState } from "react";
import { theme } from "../lib/theme";
import { AppNavbar } from "./components/AppNavbar";
import { LandingPage } from "./components/LandingPage";
import { StepIndicator } from "./components/StepIndicator";
import { StepBaseline } from "./components/StepBaseline";
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
    setCurrentStep(3);
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
    if (step === 2) return baselineEvaluation !== null;
    if (step === 3) return savedEvaluations.length > 0;
    return false;
  };

  const goToHistory = () => {
    if (savedEvaluations.length > 0) {
      setCurrentStep(3);
    } else {
      setCurrentStep(1);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (currentStep === 0) {
    return (
      <LandingPage
        onStartTest={() => {
          setCurrentStep(1);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        onUseAccount={goToHistory}
        savedCount={savedEvaluations.length}
      />
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: theme.canvas }}>
      <section style={{ background: theme.ink, color: theme.canvas }}>
        <div className="max-w-6xl mx-auto px-5">
          <AppNavbar
            onLogoClick={() => {
              setCurrentStep(0);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            savedCount={savedEvaluations.length}
            onHistoryClick={() => {
              setCurrentStep(3);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            onAccountClick={goToHistory}
            showHistory={currentStep !== 3}
          />
        </div>
      </section>

      <StepIndicator
        currentStep={currentStep}
        canNavigate={canNavigate}
        onStepClick={setCurrentStep}
      />

      <main className="max-w-4xl mx-auto px-4 py-6 pb-12">
        {currentStep === 1 && (
          <StepBaseline inputs={inputs} onNext={handleEvaluate} />
        )}

        {currentStep === 2 && stressedEvaluation && baselineEvaluation && (
          <StepStressTest
            inputs={inputs}
            result={stressedEvaluation}
            baselineResult={baselineEvaluation}
            stressLevel={stressLevel}
            onStressChange={setStressLevel}
            onBack={() => setCurrentStep(1)}
            onSave={handleSave}
          />
        )}

        {currentStep === 3 && (
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
