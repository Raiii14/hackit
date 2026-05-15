import { toLogicInputs, type UiLoanInputs } from './loanAdapter';
import { simulateLoan, stressModes } from './loanLogic';
import type { RiskStatus, StressMode } from './loanTypes';

export type EvaluationResult = {
  healthScore: number;
  healthStatus: RiskStatus;
  projectedCash: number;
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
  shortfall: number;
  costPerHundred: number;
  badDayDropPercent: number;
  stressLabel: string;
  recommendedTerm: number;
};

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function cashPositionToHealthScore(
  projectedCash: number,
  minimumBuffer: number,
  totalRepayment: number,
): number {
  const repaymentScale = Math.max(1, totalRepayment);

  if (projectedCash < 0) {
    return Math.round(32 * clamp((projectedCash + repaymentScale) / repaymentScale, 0, 1));
  }

  if (projectedCash < minimumBuffer) {
    const bufferScale = Math.max(1, minimumBuffer);
    return Math.round(33 + 32 * clamp(projectedCash / bufferScale, 0, 1));
  }

  const surplusScale = Math.max(1, minimumBuffer, totalRepayment);
  const surplus = projectedCash - minimumBuffer;
  return Math.round(66 + 34 * clamp(surplus / surplusScale, 0, 1));
}

const badDayMode = stressModes.find((mode) => mode.kind === 'bad-day')!;
const baselineMode = stressModes[0];

export function resolveStressMode(stressLevel: number): { mode: StressMode; drop: number } {
  if (stressLevel <= 0) {
    return { mode: baselineMode, drop: 0 };
  }

  const preset = stressModes.find(
    (mode) => mode.kind === 'drop' && mode.drop === stressLevel,
  );
  if (preset) {
    return { mode: preset, drop: stressLevel };
  }

  return {
    mode: {
      label: `Custom drop - ${stressLevel}%`,
      shortLabel: `${stressLevel}% drop`,
      kind: 'drop',
      drop: stressLevel,
      durationDays: null,
    },
    drop: stressLevel,
  };
}

export function evaluateLoan(
  ui: UiLoanInputs,
  stressMode: StressMode,
  customDrop: number,
): EvaluationResult {
  const logic = toLogicInputs(ui);
  const sim = simulateLoan(logic, stressMode, customDrop);
  const baseline = simulateLoan(logic, baselineMode, 0);
  const badDay = simulateLoan(logic, badDayMode, 0);
  const saferRepaymentAmount = Math.max(
    0,
    ui.badDayCashAfter * sim.daysUntilDue - ui.minCashBuffer,
  );

  return {
    healthScore: cashPositionToHealthScore(
      sim.projectedCash,
      ui.minCashBuffer,
      ui.repaymentAmount,
    ),
    healthStatus: sim.status,
    projectedCash: sim.projectedCash,
    cashAfterNormal: baseline.projectedCash,
    cashAfterBad: badDay.projectedCash,
    normalMargin: baseline.projectedCash - ui.minCashBuffer,
    badMargin: badDay.projectedCash - ui.minCashBuffer,
    trueCost: sim.interestCost,
    effectiveRate: sim.costPerHundred,
    dailyCost: sim.dailyInterestCost,
    daysUntilDue: sim.daysUntilDue,
    breakingPoint: sim.breakpointDrop,
    saferLoanAmount: sim.recommendedAmount,
    saferRepaymentAmount,
    shortfall: sim.shortfall,
    costPerHundred: sim.costPerHundred,
    badDayDropPercent: sim.badDayDrop,
    stressLabel: sim.stressLabel,
    recommendedTerm: sim.recommendedTerm,
  };
}

export function evaluateLoanAtStressLevel(
  ui: UiLoanInputs,
  stressLevel: number,
): EvaluationResult {
  const { mode, drop } = resolveStressMode(stressLevel);
  return evaluateLoan(ui, mode, drop);
}
