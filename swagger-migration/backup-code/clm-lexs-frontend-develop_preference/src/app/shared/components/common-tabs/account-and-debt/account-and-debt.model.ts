export interface AccountAndDebtInfo {
  accountAndDebtDetails: AccountAndDebtDetail[];
  debtSummary: DebtSummary;
}

export interface AccountAndDebtDetail {
  no?: number;
  id: string;
  column1: string;
  column2: string;
  column3: string;
  column4: string;
  column5: string;
  column6: number;
  column7: string;
  column8: string;
}

export interface DebtSummary {
  debtSummaryRow1: DebtSummaryDetail;
  debtSummaryRow2: DebtSummaryDetail;
  debtSummaryRow3: DebtSummaryDetail;
  debtSummaryRow4: DebtSummaryDetail;
  debtSummaryRow5: DebtSummaryDetail;
}

export interface DebtSummaryDetail {
  accountDebt: number;
  badDebt: number;
}

export interface DebtSummaryDataSource {
  debtPayload: string;
  accountDebt: number;
  badDebt: number;
}
