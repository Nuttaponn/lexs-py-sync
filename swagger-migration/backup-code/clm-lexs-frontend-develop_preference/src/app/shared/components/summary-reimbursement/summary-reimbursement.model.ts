import {
  FinancialCreditNote,
  FinancialCreditNoteResponse,
  FinancialCustomerSummaryDetailDto,
  FinancialCustomerSummaryDto,
  FinancialLitigationSummaryDetailDto,
  FinancialLitigationSummaryDto,
  FinancialMemoTransaction,
  FinancialSummaryTransactionDto,
  FinancialTransactionSummaryDashboard,
} from '@lexs/lexs-client';

export interface IFinancialLitigationSummaryDto extends FinancialLitigationSummaryDto {
  litigationTransactionDashboard?: IFinancialTransactionSummaryDashboard;
}

export interface IFinancialLitigationSummaryDetailDto extends FinancialLitigationSummaryDetailDto {
  litigationCaseTransactionDashboard?: IFinancialTransactionSummaryDashboard;
}

export interface IFinancialTransactionSummaryDashboard extends FinancialTransactionSummaryDashboard {
  financialSummaryTransactionList?: Array<IFinancialSummaryTransactionDto>;
}

export interface IFinancialSummaryTransactionDto extends FinancialSummaryTransactionDto {
  seq?: number;
  expanded?: boolean;
  financialMemoTransaction?: FinancialMemoTransaction;
}

export interface IFinancialCreditNoteResponse extends FinancialCreditNoteResponse {
  financialCreditNoteList?: Array<IFinancialCreditNote>;
}

export interface IFinancialCreditNote extends FinancialCreditNote {
  seq?: number;
  expanded?: boolean;
}

// ### tab 2-1 ##
export interface IFinancialCustomerSummaryDto extends FinancialCustomerSummaryDto {
  customerTransactionDashboard?: IFinancialTransactionSummaryDashboard;
  financialCustomerSummaryDetailList?: Array<IFinancialCustomerSummaryDetailDto>;
}

export interface IFinancialCustomerSummaryDetailDto extends FinancialCustomerSummaryDetailDto {
  litigationTransactionDashboard?: IFinancialTransactionSummaryDashboard;
}
