import {
  AdvancePaymentMasterDto,
  AdvancePaymentStatusDto,
  BatchDataDto,
  CaseCreatorDto,
  CourtDto,
  CustomerStatusDto,
  DebtorDto,
  DebtTransferToDto,
  DoneByDto,
  ExpenseMasterDto,
  ExpenseStatusDto,
  ExpenseStepType,
  FinancialAccountCodeDto,
  FinancialAccountTypeDto,
  FinancialObjectTypeDto,
  KcorpTransferStatusDto,
  KtbOrgDto,
  LegalStatusDto,
  LexsUserOption,
  LitigationCloseStatusDto,
  LoanTypeDto,
  NameValuePair,
  ReceiveStatusDto,
  ReceiveTypeDto,
  SamFlagDto,
  ScopeDto,
  TamcFlagDto,
  TaskStatusDto,
  TaskTypeDto,
  WashAccountMasterDto,
  WriteOffStatusDto,
} from '@lexs/lexs-client';

export interface SearchConditionRequest {
  accountNo?: string;
  amdUnit?: string;
  billNo?: string;
  amountOfLitigation?: string;
  blackCaseId?: string;
  caseCreator?: string;
  caseStatus?: string;
  citizenId?: string;
  collateralType?: string;
  collateralSubType?: string;
  collateralSubTypeCode?: string;
  collateralTypeCode?: string;
  court?: SearchConditionRequest.CourtEnum | SearchConditionRequest.NAEnum;
  customerId?: string;
  customerName?: string;
  customerStatus?: SearchConditionRequest.StatusEnum | SearchConditionRequest.NAEnum;
  // legalStatus?: SearchConditionRequest.StatusEnum | SearchConditionRequest.NAEnum,
  customerSurname?: string;
  dashboard?: string;
  debtTransferTo?: Array<string>;
  lawyer?: string;
  debtor?: string;
  famFlag?: string;
  kbdId?: string;
  ledId?: string;
  legalStatus?: string;
  litigationCloseStatus?: string;
  litigationId?: string;
  loanType?: Array<string>;
  orgCode?: string;
  ownerId?: string;
  redCaseId?: string;
  responseUnit?: string;
  roomNo?: string;
  searchMode?: SearchConditionRequest.ModeEnum;
  searchScope?: string;
  searchString?: string;
  samFlag?: string;
  tamcFlag?: string;
  taskStatus?: string;
  taskType?: string;
  writeOffStatus?: string;
  tab?: SearchConditionRequest.TabEnum;
  size?: number;
  sortBy?: Array<string>;
  sortOrder?: string;
  page?: number;
  keyword?: string;
  status?: string;
  type?: string;
  observe?: string;
  reportProgress?: boolean;
  deferDashboard?: string;
  deferExecDashboard?: string;
  statusDashboard?: string;
  accountDocumentStatusDashboard?: string;
  collateralLexsStatusDashboard?: string;
  tabExpense?: SearchConditionRequest.TabExpenseEnum;
}

export interface ExpenseSearchConditionRequest {
  assigneeId?: Array<string>;
  createdBy?: Array<string>;
  expenseDashboard?: string;
  expenseNo?: string;
  expenseStatus?: string;
  litigationStatus?: string;
  page?: number;
  searchString?: string;
  size?: number;
  sortBy?: Array<string>;
  sortOrder?: string;
  tab?: SearchConditionRequest.TabEnum;
  successPaymentDate?: string;
}

export interface ReceiptSearchConditionRequest {
  beginCreateDate?: string;
  endCreateDate?: string;
  page?: number;
  receiveNo?: string;
  receiveStatus?: string;
  receiveType?: string;
  searchString?: string;
  size?: number;
  sortBy?: Array<string>;
  sortOrder?: string;
  tab?: string;
}

export interface AdvanceSearchConditionRequest {
  advnancePaymentNo?: string;
  advancePaymentStatus?: string;
  page?: number;
  searchString?: string;
  size?: number;
  sortBy?: Array<string>;
  sortOrder?: string;
  user?: string;
  tab?: string;
}

export interface ReceiptKcorpSearchConditionRequest {
  beginTransferMonth?: string;
  endTransferMonth?: string;
  page?: number;
  referenceNo?: string;
  size?: number;
  sortBy?: Array<string>;
  sortOrder?: string;
  transferStatus?: string;
  washAccountNo?: string;
  searchString?: string;
}

export interface AdvanceSearchOption {
  bcOrg?: KtbOrgDto;
  ktbOrg?: KtbOrgDto;
  amdOrg?: KtbOrgDto;
  customerStatus?: CustomerStatusDto;
  scope?: ScopeDto;
  loanType?: LoanTypeDto;
  debtor?: DebtorDto;
  samFlag?: SamFlagDto;
  tamcFlag?: TamcFlagDto;
  writeOffStatus?: WriteOffStatusDto;
  debtTransferTo?: DebtTransferToDto;
  caseCreator?: CaseCreatorDto;
  court?: CourtDto;
  legalStatus?: LegalStatusDto;
  litigationCloseStatus?: LitigationCloseStatusDto;
  doneBy?: DoneByDto;
  taskType?: TaskTypeDto;
  taskStatus?: TaskStatusDto;
}

export interface ExpenseSearchOption {
  expenseNoOptions?: ExpenseMasterDto;
  expenseStatusOptions?: ExpenseStatusDto;
  userOptions?: LexsUserOption[];
}

export interface ReceiptSearchOption {
  receiveStatusOptions?: ReceiveStatusDto;
  receiveTypeOptions?: ReceiveTypeDto;
  washAccountOptions?: WashAccountMasterDto;
  transferStatusOptions?: KcorpTransferStatusDto;
}

export interface AdvancePaymentSearchOption {
  advancePaymentNoOptions?: AdvancePaymentMasterDto;
  advancePaymentStatusOptions?: AdvancePaymentStatusDto;
  userOptions?: LexsUserOption[];
}

export interface SummaryRiemburstmentSearchOption {
  financialObjectTypeDto?: FinancialObjectTypeDto;
  financialAccountTypeDto?: FinancialAccountTypeDto;
  expenseStepTypes?: ExpenseStepType[];
  financialAccountCodeDto?: FinancialAccountCodeDto;
  financialAccountTypeExpenseDto?: FinancialAccountTypeDto;
}

export namespace SearchConditionRequest {
  export type TabEnum = 'CLOSED' | 'ORG' | 'TEAM' | 'USER' | 'DASHBOARD';
  export const TabEnum = {
    CLOSED: 'CLOSED' as TabEnum,
    ORG: 'ORG' as TabEnum,
    TEAM: 'TEAM' as TabEnum,
    USER: 'USER' as TabEnum,
  };

  export type TabExpenseEnum = 'EXP' | 'EXP_COMPLETED';
  export const TabExpenseEnum = {
    EXP: 'EXP' as TabExpenseEnum,
    EXP_COMPLETED: 'EXP_COMPLETED' as TabExpenseEnum,
  };

  export type TypeEnum =
    | 'BY_TASK'
    | 'BY_CUSTOMER'
    | 'BY_LAWSUIT'
    | 'BY_LAWSUIT_LED'
    | 'BY_FINANCE_EXPENSE'
    | 'BY_FINANCE_RECEIPT'
    | 'BY_FINANCE_DASHBOARD'
    | 'BY_FINANCE_RECEIPT_KCORP'
    | 'BY_FINANCE_ADVANCE'
    | 'BY_REIMBURSE_TYPE_1'
    | 'BY_REIMBURSE_TYPE_2'
    | 'BY_PROFILE_DIRECT_TYPE_1'
    | 'BY_PROFILE_DIRECT_TYPE_2'
    | 'BY_PROFILE_DIRECT_TYPE_3'
    | 'BY_COLLATERAL';
  export const TypeEnum = {
    BY_TASK: 'BY_TASK' as TypeEnum,
    BY_CUSTOMER: 'BY_CUSTOMER' as TypeEnum,
    BY_LAWSUIT: 'BY_LAWSUIT' as TypeEnum,
    BY_LAWSUIT_LED: 'BY_LAWSUIT_LED' as TypeEnum,
    BY_FINANCE_EXPENSE: 'BY_FINANCE_EXPENSE' as TypeEnum,
    BY_FINANCE_DASHBOARD: 'BY_FINANCE_DASHBOARD' as TypeEnum,
    BY_FINANCE_RECEIPT: 'BY_FINANCE_RECEIPT' as TypeEnum,
    BY_FINANCE_RECEIPT_KCORP: 'BY_FINANCE_RECEIPT_KCORP' as TypeEnum,
    BY_FINANCE_ADVANCE: 'BY_FINANCE_ADVANCE' as TypeEnum,
    BY_REIMBURSE_TYPE_1: 'BY_REIMBURSE_TYPE_1' as TypeEnum,
    BY_REIMBURSE_TYPE_2: 'BY_REIMBURSE_TYPE_2' as TypeEnum,
    BY_PROFILE_DIRECT_TYPE_1: 'BY_PROFILE_DIRECT_TYPE_1' as TypeEnum,
    BY_PROFILE_DIRECT_TYPE_2: 'BY_PROFILE_DIRECT_TYPE_2' as TypeEnum,
  };

  export type ModeEnum = 'ADVANCE' | 'BASIC' | 'LIST';
  export const ModeEnum = {
    Advance: 'ADVANCE' as ModeEnum,
    Basic: 'BASIC' as ModeEnum,
    List: 'LIST' as ModeEnum,
  };

  export type CourtEnum = 'APPEAL' | 'CIVIL' | 'SUPREME';
  export const CourtEnum = {
    APPEAL: 'APPEAL' as CourtEnum,
    CIVIL: 'CIVIL' as CourtEnum,
    SUPREME: 'SUPREME' as CourtEnum,
  };

  export type StatusEnum = 'DEFAULT_PAYMENT' | 'LITIGATION_PROCESS' | 'NORMAL' | 'NOTICE_LETTER_PROCESS';
  export const StatusEnum = {
    DEFAULT_PAYMENT: 'DEFAULT_PAYMENT' as StatusEnum,
    LITIGATION_PROCESS: 'LITIGATION_PROCESS' as StatusEnum,
    NORMAL: 'NORMAL' as StatusEnum,
    NOTICE_LETTER_PROCESS: 'NOTICE_LETTER_PROCESS' as StatusEnum,
  };

  export type NAEnum = 'N/A';
  export const NAEnum = {
    NAEnum: 'N/A' as NAEnum,
  };
}

export type SearchTemplate =
  | 'FINANCE_EXPENSE'
  | 'FINANCE_RECEIPT'
  | 'FINANCE_DASHBOARD'
  | 'FINANCE_RECEIPT_KCORP'
  | 'FINANCE_ADVANCE'
  | 'SUMMARY_REIMBURSE_TYPE_1'
  | 'SUMMARY_REIMBURSE_TYPE_2'
  | 'PROFILE_DIRECT_TYPE_1'
  | 'NORMAL';
export const SearchMode = {
  FINANCE_EXPENSE: 'FINANCE_EXPENSE' as SearchTemplate,
  FINANCE_RECEIPT: 'FINANCE_RECEIPT' as SearchTemplate,
  FINANCE_RECEIPT_KCORP: 'FINANCE_RECEIPT_KCORP' as SearchTemplate,
  FINANCE_ADVANCE: 'FINANCE_ADVANCE' as SearchTemplate,
  SUMMARY_REIMBURSE_TYPE_1: 'SUMMARY_REIMBURSE_TYPE_1' as SearchTemplate,
  SUMMARY_REIMBURSE_TYPE_2: 'SUMMARY_REIMBURSE_TYPE_2' as SearchTemplate,
  PROFILE_DIRECT_TYPE_1: 'PROFILE_DIRECT_TYPE_1' as SearchTemplate,
  NORMAL: 'NORMAL' as SearchTemplate,
};

export interface SummaryReimburseType1SearchConditionRequest {
  caseType?: string;
  financialObjectType?: string;
  financialAccountType?: (NameValuePair | string)[];
  financialAccountCode?: string;
  startDate?: string;
  endDate?: string;
  minAmount?: number;
  maxAmount?: number;
}

export interface SummaryReimburseType2SearchConditionRequest {
  lgId?: string;
  financialAccountTypeExpense?: (NameValuePair | string)[];
  financialAccountCode?: string;
}

export interface ProfileDirectSearchConditionRequest {
  accountDataType?: BatchDataDto.ProfileDirectTypeEnum;
  accountNo?: string;
  startDate?: string;
  endDate?: string;
}
