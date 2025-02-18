import { AccountList, AccountSummary, BatchDataDto, DelinquencyOptions, InqOutStandingReportDto, InterestChangeSummary, InterestSummary, LoanAccountInterest, LoanAccountInterestDetails, PaymentRecord, PaymentSummary, ProfileDirectResponse, RateDetermination, TfsOutstandingReportDto } from "@lexs/lexs-client";

const mockAccountList: AccountList = {
  accountDetail: "1234567890",
  accountDetailType: "Checking",
  creditLimit: 10000,
  ledgerBalance: 5000,
  marketCode: "US"
};

// export const mockAccountListReport: AccountListReportDto = {
//   accountList: [mockAccountList],
//   customerDetail: "John Doe",
//   dataDateTime: "2023-04-19T15:30:00Z",
//   viewerDetail: "Jane Smith"
// };

const mockAccountSummary: AccountSummary = {
  accountNumber: "1234567890",
  accountStatus: "Active",
  cclassAging: "30 days",
  cclassCondition: "Current",
  creditLimit: 10000,
  firstDisbursementDate: "2023-01-01",
  lastPaymentDate: "2023-04-15",
  ledgerBalance: 5000,
  legalStatus: "Current",
  marketCode: "US",
  maturityDate: "2024-01-01",
  openAccountDate: "2022-01-01",
  payoffAmount: 5500,
  productType: "Credit Card",
  subAccountOptions: "None"
};

const mockDelinquencyOptions: DelinquencyOptions = {
  asOfDate: "2023-04-19",
  index: "LIBOR",
  lateChargeActionDate: "2023-05-01",
  lateChargeEffectiveDate: "2023-04-20",
  penaltyIndex: "Prime",
  penaltyRate: 0.02,
  penaltySpread: 0.005,
  percentageOfBaseOverride: 0.8,
  rate: 0.05,
  spread: 0.01
};

const mockInterestChangeSummary: InterestChangeSummary = {
  date: "2023-04-19",
  interestRate: 0.03,
  principalBalance: 10000
};

const mockInterestSummary: InterestSummary = {
  accrualInterest: 100,
  currentRate: 0.03,
  fixedRateDifferential: "0.01",
  interestIndex: "LIBOR",
  // interestSpread: 0.005,
  lastAmountAccrued: 50,
  lateCharge: 25,
  miscCharge: 10,
  relatedDeposit: "1234567890"
};

const mockLoanAccountInterestDetails: LoanAccountInterestDetails = {
  balance: 10000,
  calInterest: 500,
  calLateCharge: 25,
  fromDate: "2023-03-01",
  intBalance: 9500,
  intRate: 0.04,
  lateCharge: 10,
  penaltyRate: 0.02,
  toDate: "2023-04-01"
};

const mockLoanAccountInterest: LoanAccountInterest = {
  defaultInterestPaymentDate: "2023-05-01",
  interestPaymentStartDate: "2023-04-01",
  loanAccountInterestDetails: [mockLoanAccountInterestDetails]
};

const mockPaymentRecord: PaymentRecord = {
  dueDate: "2023-05-01",
  total: 500,
  unpaid: 250,
  unpaidInterest: 50,
  unpaidPrincipal: 200
};

const mockPaymentSummary: PaymentSummary = {
  calculateMethod: 1,
  frequency: "Monthly",
  nextDueDate: "2023-05-01",
  principalInterest: 500
};

const mockRateDetermination: RateDetermination = {
  asOfDate: "2023-04-19",
  index: "LIBOR",
  interestChangeFrequency: "Monthly",
  interestIndex: "Prime",
  interestRate: 0.03,
  // interestSpread: 0.005,
  lastInterestRateChangeDate: "2023-01-01",
  nextInterestRateChangeDate: "2023-07-01",
  originalIndexValue: 2,
  originalInterestRate: 0.05,
  rate: 0.06,
  rateChangeMthod: "Fixed",
  spread: 0.01
};

// export const accountDetailDto: AccountDetailDto = {
//   accountName: 'John Doe',
//   accountSummary: mockAccountSummary,
//   customerDetails: '123 Main St, Anytown USA',
//   dataDate: '2023-04-19',
//   delinquencyOptions: mockDelinquencyOptions,
//   interestChangeSummaries: [mockInterestChangeSummary],
//   interestSummary: mockInterestSummary,
//   loanAccountInterest: mockLoanAccountInterest,
//   paymentRecords: [mockPaymentRecord],
//   paymentSummary: mockPaymentSummary,
//   period: 'Monthly',
//   rateDetermination: mockRateDetermination,
//   viewer: 'Jane Smith'
// };

export const profileDirectResponse: ProfileDirectResponse = {
  accountDetailDto: {
    accountName: 'John Doe',
    accountSummary: mockAccountSummary,
    customerDetails: '123 Main St, Anytown USA',
    dataDate: '2023-04-19',
    delinquencyOptions: mockDelinquencyOptions,
    interestChangeSummaries: [mockInterestChangeSummary],
    interestSummary: mockInterestSummary,
    loanAccountInterest: mockLoanAccountInterest,
    paymentRecords: [mockPaymentRecord],
    paymentSummary: mockPaymentSummary,
    period: 'Monthly',
    rateDetermination: mockRateDetermination,
    viewer: 'Jane Smith'
  },
  accountListReportDto: {
    accountList: [mockAccountList],
    customerDetail: 'John Doe',
    dataDateTime: '2023-04-19T12:00:00Z',
    viewerDetail: 'Jane Smith'
  }
};

export const mockBatchDataDto: BatchDataDto = {
  accountNo: '1234567890',
  createdBy: 'Jane Smith',
  createdDate: '2023-04-19',
  fromDate: '2023-04-01',
  index: 1,
  profileDirectType: BatchDataDto.ProfileDirectTypeEnum.AccountList,
  status: 'Complete',
  toDate: '2023-04-30'
};

export const mockBatchDataDtos: BatchDataDto[] = [mockBatchDataDto];

export interface AccountTemp {
  accountId: string;
  accountName: string;
  accountNo: string;
  accountNote: string;
  accountStatus: string;
  accountType: "OTHER" | "FCS" | "FLEET_CARD" | "OD" | "PN" | "SUNDRY_FOREIGN_EXCHANGE" | "SUNDRY_ACCEPTANCE" | "SUNDRY_AVAL" | "SUNDRY_INSURANCE" | "SUNDRY_LG" | "SUNDRY_OTHER" | "SUNDRY_TCG" | "TL" | "TFS" | "LBD" | "HOME_LOAN" | "PERSONAL_LOAN" | "HOME_FOR_CASH";
  amountInArrears: number;
  billNo: string;
  bookingCode: string;
  cfinal: string;
  closeDate: string;
  commitmentAccountNo: string;
  contractDate: string;
  customerId: string;
  deliquencyDate: string;
  directDebitAccountNumber: string;
  dpd: number;
  estimatePrescriptionFlag: boolean;
  expiryDate: string;
  firstDisbursementDate: string;
  fleetCardAccount: string;
  insertFlag: boolean;
  isClosed: boolean;
  lastDisburseDate: string;
  lastPaidDate: string;
  lastTransactionDate: string;
  lastUpdate: string;
  lateChargeAmount: number;
  lgAccountName: string;
  lgAccountNumber: string;
  limitAmount: number;
  litigationDate: string;
  litigationId: string;
  marketCode: string;
  marketDescription: string;
  miscCharge: number;
  openDate: string;
  outstandingAccruedInterest: number;
  outstandingBalance: number;
  outstandingInterestNonBook: number;
  partialWriteOffFlag: string;
  partialWriteOffStatus: string;
  prescriptionDate: string;
  primaryAccountNumber: string;
  productType: string;
  projectName: string;
  responseBranchCode: string;
  samFlag: string;
  sourceSystem: string;
  stageFinal: string;
  subAccount: boolean;
  subAccountOption: string;
  subAccountType: string;
  tamcFlag: string;
  tdrContractDate: string;
  tdrStatus: string;
  tdrTrackingResult: string;
  writeDate: string;
  writeOffStatus: string;
}

const mockedInqOutStandingReportDto: InqOutStandingReportDto = {
  inqOutStandingReportRes: [
    {
      balanceAmt: 10000,
      ccy: 'USD',
      customerRef: 'ABC123',
      days: 30,
      dueExpiry: '2023-07-14',
      eventDate: '2023-06-14',
      intAmt: 500,
      intRate: 0.05,
      lastIntDate: '2023-06-01',
      midRateBot: 0.9,
      prodName: 'Product XYZ',
      prodType: 'Type A',
      referRef: 'DEF456',
      referenceNo: '123456789',
      thbEquivalent: 300000,
    },
    // Add more InqOutStandingReportRes objects if needed
  ],
  summaryByProdType: [
    {
      balanceAmtByCcy: [
        { amount: 1000, ccy: 'USD' },
        { amount: 2000, ccy: 'EUR' },
        { amount: 500, ccy: 'GBP' },
      ],
      prodType: 'Type A',
      thbEquivalentByCcy: [
        { amount: 300000, ccy: 'USD' },
        { amount: 250000, ccy: 'EUR' },
        { amount: 200000, ccy: 'GBP' },
      ],
      thbEquivalentByprodType: 750000,
      totalTxnByCcy: [
        { amount: 10, ccy: 'USD' },
        { amount: 15, ccy: 'EUR' },
        { amount: 5, ccy: 'GBP' },
      ],
      totalTxnByProdType: 30,
    },
    // Add more SummaryByProdType objects if needed
  ],
  totalThbEquivalent: 1000000,
  totalTxn: 50,
};

const mockedTfsOutstandingReportDto: TfsOutstandingReportDto = {
  billNoAndCustomerName: "Bill123 - John Doe",
  createdBy: "John Smith",
  customerCifAndName: "CIF123 - John Doe",
  inqOutStandingReportDto: mockedInqOutStandingReportDto,
  reportDate: "2023-06-14",
};

export const mockedProfileDirectResponse: ProfileDirectResponse = {
  tfsOutstandingReportDto: mockedTfsOutstandingReportDto
};
