import { FinancialCreditNote, FinancialCreditNoteResponse, FinancialCustomerSummaryDetailDto, FinancialCustomerSummaryDto, FinancialLitigationSummaryDetailDto, FinancialLitigationSummaryDto, FinancialMemoTransaction, FinancialSummaryTransactionDto, FinancialTransactionSummaryDashboard } from "@lexs/lexs-client";

const financialSummaryTransactionList: Array<FinancialSummaryTransactionDto> = [
  {
    accountCode: "12345",
    accountId: "67890",
    amount: 1000.0,
    cancelAmount: 0.0,
    expenseAmount: 500.0,
    g10AdvanceAmount: 0.0,
    g12AdvanceAmount: 0.0,
    g13AdvanceAmount: 0.0,
    g14AdvanceAmount: 0.0,
    g15AdvanceAmount: 0.0,
    interfaceName: "API",
    invoiceDate: "2022-03-10",
    organizationCode: "ORG01",
    organizationName: "Organization 1",
    outstandingBalanceAmount: 500.0,
    receiveAmount: 500.0,
    referenceObjectType: "Transaction",
    referenceTransactionId: 12345,
    totalAmount: 1000.0,
    transactionGroupId: 1,
    transactionId: 54321,
    typeCode: "R01",
    typeName: "Revenue",
    userId: "johndoe"
  },
  {
    accountCode: "67890",
    accountId: "12345",
    amount: 500.0,
    cancelAmount: 0.0,
    expenseAmount: 250.0,
    g10AdvanceAmount: 0.0,
    g12AdvanceAmount: 0.0,
    g13AdvanceAmount: 0.0,
    g14AdvanceAmount: 0.0,
    g15AdvanceAmount: 0.0,
    interfaceName: "API",
    invoiceDate: "2022-03-10",
    organizationCode: "ORG02",
    organizationName: "Organization 2",
    outstandingBalanceAmount: 250.0,
    receiveAmount: 250.0,
    referenceObjectType: "Transaction",
    referenceTransactionId: 67890,
    totalAmount: 500.0,
    transactionGroupId: 2,
    transactionId: 98765,
    typeCode: "E01",
    typeName: "Expense",
    userId: "janedoe"
  }
];

const litigationCaseTransactionDashboard: FinancialTransactionSummaryDashboard = {
  sumAmount: 5000.0,
  sumCancelAmount: 1000.0,
  sumExpenseAmount: 2500.0,
  sumG10AdvanceAmount: 0.0,
  sumG12AdvanceAmount: 0.0,
  sumG13AdvanceAmount: 0.0,
  sumG14AdvanceAmount: 0.0,
  sumG15AdvanceAmount: 0.0,
  sumOutstandingBalanceAmount: 1500.0,
  sumReceiveAmount: 3500.0,
  sumTotalAmount: 4000.0,
  financialSummaryTransactionList: [...financialSummaryTransactionList]
};

const financialLitigationSummaryDetail: FinancialLitigationSummaryDetailDto =
{
  blackCaseNo: "1234/2565",
  // courtType: "Civil",
  // courtTypeName: "ศาลแพ่ง",
  caseType: "Civil",
  caseTypeName: "ศาลแพ่ง",
  redCaseNo: "5678/2565",
  litigationCaseTransactionDashboard: { ...litigationCaseTransactionDashboard },
};

const financialSummaryTransaction: FinancialSummaryTransactionDto = {
  accountCode: "123456",
  accountId: "987654",
  amount: 1000.0,
  cancelAmount: 0.0,
  expenseAmount: 500.0,
  g10AdvanceAmount: 0.0,
  g12AdvanceAmount: 0.0,
  g13AdvanceAmount: 0.0,
  g14AdvanceAmount: 0.0,
  g15AdvanceAmount: 0.0,
  interfaceName: "API",
  invoiceDate: "2022-03-10",
  organizationCode: "ORG01",
  organizationName: "Organization 1",
  outstandingBalanceAmount: 500.0,
  receiveAmount: 500.0,
  referenceObjectType: "Transaction",
  referenceTransactionId: 12345,
  totalAmount: 1000.0,
  transactionGroupId: 1,
  transactionId: 54321,
  typeCode: "R01",
  typeName: "Revenue",
  userId: "johndoe"
};

const financialLitigationSummaryDetailArray: FinancialLitigationSummaryDetailDto[] = [
  {
    ...financialLitigationSummaryDetail,
    blackCaseNo: 'AAAA',
  },
  { ...financialLitigationSummaryDetail, blackCaseNo: 'BBB', },
  { ...financialLitigationSummaryDetail, blackCaseNo: 'CCC', },
];

// const financialSummaryTransactionArray: FinancialSummaryTransactionDto[] = [
//   { ...financialSummaryTransaction },
//   { ...financialSummaryTransaction },
//   { ...financialSummaryTransaction },
// ];
const financialSummaryTransactionArray: FinancialSummaryTransactionDto[] = [...financialSummaryTransactionList]

const financialTransactionSummaryDashboardData: FinancialTransactionSummaryDashboard = {
  sumAmount: 10000.0,
  sumCancelAmount: 2000.0,
  sumExpenseAmount: 5000.0,
  sumG10AdvanceAmount: 0.0,
  sumG12AdvanceAmount: 0.0,
  sumG13AdvanceAmount: 0.0,
  sumG14AdvanceAmount: 0.0,
  sumG15AdvanceAmount: 0.0,
  sumOutstandingBalanceAmount: 2500.0,
  sumReceiveAmount: 7500.0,
  sumTotalAmount: 8000.0,
  financialSummaryTransactionList: [...financialSummaryTransactionArray]
}

export const financialLitigationSummaryData: FinancialLitigationSummaryDto = {
  branchCode: 'BR123',
  branchName: 'Krungthai Bank',
  customerId: 'C1234',
  customerName: 'John Doe',
  litigationId: 'L123',
  responseUnitCode: 'RU001',
  responseUnitName: 'Response Unit 1',
  financialLitigationSummaryDetailList: [...financialLitigationSummaryDetailArray],
  litigationTransactionDashboard: { ...financialTransactionSummaryDashboardData },
};

const financialCustomerSummaryDetailDtoData: FinancialCustomerSummaryDetailDto = {
  litigationId: 'LG1234567890',
  litigationTransactionDashboard: financialTransactionSummaryDashboardData
};

export const financialCustomerSummaryDto: FinancialCustomerSummaryDto = {
  customerId: 'CUST1234567890',
  customerTransactionDashboard: { ...financialTransactionSummaryDashboardData },
  financialCustomerSummaryDetailList: [
    { ...financialCustomerSummaryDetailDtoData },
    { ...financialCustomerSummaryDetailDtoData },
  ],
}

const financialCreditNoteData: FinancialCreditNote = {
  "approveDate": "2022-03-10",
  "branchCode": "KTBBKK",
  "branchName": "KTB Bangkok",
  "creditNoteDescription": "Credit note for cancelled transaction",
  "creditNoteReceiverOrgCode": "KTBOrg123",
  "creditNoteReceiverOrgName": "KTB Organization",
  "legalStatus": "Pending",
  "litigationCaseId": 123456,
  "litigationId": "Litigation123",
  "receiveNo": "R123456789",
  "receiveStatus": "SUCCESS",
  "receiveStatusName": "Success",
  "refBranchAccount": "KTBBKK001",
  "responseUnitCode": "KTBRU123",
  "responseUnitName": "KTB Response Unit",
  "sendAmount": 5000,
  "transferredBranchCode": "KTBBKK002",
  "transferredBranchName": "KTB Bangkok 2"
};

export const financialCreditNoteResponse: FinancialCreditNoteResponse = {
  financialCreditNoteList: [
    { ...financialCreditNoteData },
    { ...financialCreditNoteData },
    { ...financialCreditNoteData },
  ]
}

export const realMockFinancialLitigationSummaryDto: FinancialLitigationSummaryDto = {}

// memo array
export const financialMemoTransactionArray: FinancialMemoTransaction[] = [
  {
    memoList: [
      {
        createdBy: "john.doe@example.com",
        createdByName: "John Doe",
        createdDate: "2022-03-13T10:30:00Z",
        expenseTransactionId: 12345,
        id: 1,
        note: "This is a sample note",
        objectType: "expense_report",
        roleCode: "employee",
        roleName: "Employee",
        subRoleCode: "manager",
        subRoleName: "Manager"
      },
      {
        createdBy: "jane.doe@example.com",
        createdByName: "Jane Doe",
        createdDate: "2022-03-12T15:45:00Z",
        expenseTransactionId: 67890,
        id: 2,
        note: "Another sample note",
        objectType: "expense_report",
        roleCode: "manager",
        roleName: "Manager",
        subRoleCode: "manager",
        subRoleName: "Manager"
      }
    ],
    // referenceObjectId: 123,
    referenceObjectType: "invoice",
    transactionId: 98765
  },
  {
    memoList: [
      {
        createdBy: "john.smith@example.com",
        createdByName: "John Smith",
        createdDate: "2022-03-11T14:00:00Z",
        expenseTransactionId: 45678,
        id: 3,
        note: "Yet another sample note",
        objectType: "expense_report",
        roleCode: "employee",
        roleName: "Employee",
        subRoleCode: "supervisor",
        subRoleName: "Supervisor"
      }
    ],
    // referenceObjectId: 456,
    referenceObjectType: "purchase_order",
    transactionId: 54321
  }
  // Add more objects as needed
];

