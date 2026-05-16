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
  baselineProjectedCash: number,
): number {
  // Red zone: projected cash is negative
  if (projectedCash < 0) {
    const scale = Math.max(1, baselineProjectedCash);
    return Math.round(32 * clamp((projectedCash + scale) / scale, 0, 1));
  }

  // Yellow zone: below buffer but still positive
  if (projectedCash < minimumBuffer) {
    const bufferScale = Math.max(1, minimumBuffer);
    return Math.round(33 + 32 * clamp(projectedCash / bufferScale, 0, 1));
  }

  // Green zone: score = how much of baseline cash do you retain?
  // baseline is the natural ceiling — stressed / baseline gives a 0–1 ratio
  const scale = Math.max(1, baselineProjectedCash);
  return Math.round(66 + 34 * clamp(projectedCash / scale, 0, 1));
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
  // Apply stress to bad-day cash so the bad-day row updates with the slider
  const stressedBadDayLogic = customDrop > 0
    ? { ...logic, badDayCashLeft: logic.badDayCashLeft * (1 - customDrop / 100) }
    : logic;
  const badDay = simulateLoan(stressedBadDayLogic, badDayMode, 0);
  const saferRepaymentAmount = Math.max(
    0,
    ui.badDayCashAfter * sim.daysUntilDue - ui.minCashBuffer,
  );

  return {
    healthScore: cashPositionToHealthScore(
      sim.projectedCash,
      ui.minCashBuffer,
      baseline.projectedCash,
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
