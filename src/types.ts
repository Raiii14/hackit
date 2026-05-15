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

export type CalendarDay = {
  date: Date;
  dayIndex: number;
  dailyCash: number;
  cumulativeCash: number;
  cashAfterRepayment: number;
  isStressed: boolean;
  isDueDate: boolean;
  status: RiskStatus;
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
  calendar: CalendarDay[];
};

export type LoanRecord = LoanInputs &
  SimulationResult & {
    id: string;
    createdAt: string;
    stressDrop: number;
    stressKind: 'drop' | 'bad-day';
  };
