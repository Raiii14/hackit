export type RiskStatus = 'green' | 'yellow' | 'red';

export type StressMode = {
  label: string;
  shortLabel: string;
  kind: 'drop' | 'bad-day';
  drop: number;
  durationDays: number | null;
};

export type LoanInputs = {
  amountBorrowed: number;
  totalRepayment: number;
  dueDate: string;
  normalCashLeft: number;
  badDayCashLeft: number;
  minimumBuffer: number;
};

export type SimulationResult = {
  daysUntilDue: number;
  stressCashLeft: number;
  stressLabel: string;
  projectedCash: number;
  status: RiskStatus;
  interestCost: number;
  costPerHundred: number;
  dailyInterestCost: number;
  breakpointDrop: number;
  recommendedAmount: number;
  recommendedTerm: number;
  badDayDrop: number;
  shortfall: number;
};

export type LoanRecord = LoanInputs &
  SimulationResult & {
    id: string;
    createdAt: string;
  };
