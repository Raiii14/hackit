import type { CalendarDay, LoanInputs, RiskStatus, SimulationResult, StressMode } from './loanTypes';

export const stressModes: StressMode[] = [
  {
    label: 'Normal baseline',
    shortLabel: 'Baseline',
    kind: 'drop',
    drop: 0,
    durationDays: null,
  },
  {
    label: 'Moderate drop - 10%',
    shortLabel: '10% drop',
    kind: 'drop',
    drop: 10,
    durationDays: null,
  },
  {
    label: 'Hard week - 30%',
    shortLabel: '30% drop',
    kind: 'drop',
    drop: 30,
    durationDays: null,
  },
  {
    label: 'Major disruption - 60%',
    shortLabel: '60% drop',
    kind: 'drop',
    drop: 60,
    durationDays: null,
  },
  {
    label: 'Zero income - 100%',
    shortLabel: '100% drop',
    kind: 'drop',
    drop: 100,
    durationDays: null,
  },
  {
    label: 'My bad day',
    shortLabel: 'Bad day',
    kind: 'bad-day',
    drop: 0,
    durationDays: null,
  },
];

const DAY_MS = 24 * 60 * 60 * 1000;

export function currency(value: number): string {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    maximumFractionDigits: 0,
  }).format(Math.round(value || 0));
}

export function percent(value: number): string {
  return `${Math.round(value)}%`;
}

export function getDaysUntilDue(dueDate: string): number {
  if (!dueDate) return 1;

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const due = new Date(`${dueDate}T00:00:00`);
  const diff = Math.ceil((due.getTime() - today.getTime()) / DAY_MS);

  return Math.max(1, diff);
}

export function getStatus(projectedCash: number, minimumBuffer: number): RiskStatus {
  if (projectedCash < 0) return 'red';
  if (projectedCash < minimumBuffer) return 'yellow';
  return 'green';
}

function buildCalendar(
  inputs: LoanInputs,
  stressMode: StressMode,
  customDrop: number,
  daysUntilDue: number,
): CalendarDay[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const calendar: CalendarDay[] = [];

  const stressDays = stressMode.durationDays ?? daysUntilDue;

  for (let i = 1; i <= daysUntilDue; i++) {
    const date = new Date(today.getTime() + i * DAY_MS);
    const isStressed = i <= stressDays;

    let dailyCash: number;
    if (stressMode.kind === 'bad-day') {
      dailyCash = inputs.badDayCashLeft;
    } else if (isStressed) {
      dailyCash = inputs.normalCashLeft * (1 - customDrop / 100);
    } else {
      dailyCash = inputs.normalCashLeft;
    }

    const prevCumulative = i === 1 ? 0 : calendar[i - 2].cumulativeCash;
    const cumulativeCash = prevCumulative + dailyCash;
    const cashAfterRepayment = cumulativeCash - inputs.totalRepayment;
    const isDueDate = i === daysUntilDue;

    calendar.push({
      date,
      dayIndex: i,
      dailyCash,
      cumulativeCash,
      cashAfterRepayment,
      isStressed: stressMode.kind === 'bad-day' || (isStressed && customDrop > 0),
      isDueDate,
      status: getStatus(cashAfterRepayment, inputs.minimumBuffer),
    });
  }

  return calendar;
}

export function simulateLoan(
  inputs: LoanInputs,
  stressMode: StressMode,
  customDrop: number,
): SimulationResult {
  const daysUntilDue = getDaysUntilDue(inputs.dueDate);
  const stressDrop = stressMode.kind === 'bad-day' ? 0 : customDrop;
  const stressCashLeft =
    stressMode.kind === 'bad-day'
      ? inputs.badDayCashLeft
      : inputs.normalCashLeft * (1 - stressDrop / 100);
  const stressDays = stressMode.durationDays ?? daysUntilDue;
  const normalDays = Math.max(0, daysUntilDue - stressDays);
  const projectedCash =
    stressMode.durationDays === null
      ? stressCashLeft * daysUntilDue - inputs.totalRepayment
      : stressCashLeft * stressDays +
        inputs.normalCashLeft * normalDays -
        inputs.totalRepayment;
  const interestCost = Math.max(0, inputs.totalRepayment - inputs.amountBorrowed);
  const costPerHundred =
    inputs.amountBorrowed > 0 ? (interestCost / inputs.amountBorrowed) * 100 : 0;
  const dailyInterestCost = interestCost / daysUntilDue;
  const requiredDaily = (inputs.totalRepayment + inputs.minimumBuffer) / daysUntilDue;
  const breakpointDrop =
    inputs.normalCashLeft > 0
      ? Math.max(0, Math.min(100, (1 - requiredDaily / inputs.normalCashLeft) * 100))
      : 0;
  const badDayDrop =
    inputs.normalCashLeft > 0
      ? Math.max(0, Math.min(100, (1 - inputs.badDayCashLeft / inputs.normalCashLeft) * 100))
      : 0;
  const status = getStatus(projectedCash, inputs.minimumBuffer);
  const repaymentRatio =
    inputs.totalRepayment > 0 && inputs.amountBorrowed > 0
      ? inputs.totalRepayment / inputs.amountBorrowed
      : 1;
  const saferRepaymentCapacity = Math.max(
    0,
    inputs.normalCashLeft * daysUntilDue - inputs.minimumBuffer,
  );
  const recommendedAmount =
    repaymentRatio > 0
      ? Math.min(inputs.amountBorrowed, saferRepaymentCapacity / repaymentRatio)
      : inputs.amountBorrowed;
  const recommendedTerm =
    inputs.normalCashLeft > 0
      ? Math.ceil((inputs.totalRepayment + inputs.minimumBuffer) / inputs.normalCashLeft)
      : daysUntilDue;

  const calendar = buildCalendar(inputs, stressMode, customDrop, daysUntilDue);

  return {
    daysUntilDue,
    stressCashLeft,
    stressLabel: stressMode.shortLabel,
    projectedCash,
    status,
    interestCost,
    costPerHundred,
    dailyInterestCost,
    breakpointDrop,
    recommendedAmount,
    recommendedTerm: Math.max(daysUntilDue + 1, recommendedTerm),
    badDayDrop,
    shortfall: Math.max(0, inputs.minimumBuffer - projectedCash),
    calendar,
  };
}
