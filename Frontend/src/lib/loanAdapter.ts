import type { LoanInputs as LogicLoanInputs } from './loanTypes';

/** UI-facing loan inputs (Frontend components). */
export type UiLoanInputs = {
  loanAmount: number;
  repaymentAmount: number;
  dueDate: string;
  loanPurpose: string;
  normalCashAfter: number;
  badDayCashAfter: number;
  minCashBuffer: number;
};

export function toLogicInputs(ui: UiLoanInputs): LogicLoanInputs {
  return {
    amountBorrowed: ui.loanAmount,
    totalRepayment: ui.repaymentAmount,
    dueDate: ui.dueDate,
    normalCashLeft: ui.normalCashAfter,
    badDayCashLeft: ui.badDayCashAfter,
    minimumBuffer: ui.minCashBuffer,
  };
}
