import { Component, Input } from '@angular/core';
import { AccountDetailDto, AccountListReportDto, BatchDataDto, TfsOutstandingReportDto } from '@lexs/lexs-client';

@Component({
  selector: 'app-profile-direct-real-time',
  templateUrl: './profile-direct-real-time.component.html',
  styleUrls: ['./profile-direct-real-time.component.scss'],
})
export class ProfileDirectRealTimeComponent {
  @Input() accountDataType!: BatchDataDto.ProfileDirectTypeEnum;
  @Input() accountListReportDto!: AccountListReportDto;
  @Input() accountDetailDto!: AccountDetailDto;
  @Input() tfsOutstandingReportDto!: TfsOutstandingReportDto;

  // Type
  // Account
  // Credit Limit
  // Ledger Balance
  // Market Code
  displayedColumns0: string[] = ['type', 'account', 'creditLimit', 'ledgerBalance', 'marketCode'];

  // Due Date
  // Total
  // Unpaid
  // Unpaid Interest
  // Unpaid Principal
  displayedColumns1: string[] = ['dueDate', 'total', 'unpaid', 'unpaidInterest', 'unpaidPrincipal'];

  // From
  // To
  // Balance
  // Int Rate
  // Cal. Interest
  // Int Balance
  // Cal. Late Charge
  // Penalty Rate
  // Late Charge
  displayedColumns1_2: string[] = [
    'from',
    'to',
    'balance',
    'intRate',
    'calInterest',
    'intBalance',
    'calLateCharge',
    'penaltyRate',
    'lateCharge',
  ];

  displayedColumnsOutstandingTable = [
    'product',
    'ccy',
    'reference',
    'referRef',
    'balanceAmt',
    'midRate',
    'thbEquivalent',
    'customerReference',
    'valueDate',
    'dueDate',
    'days',
    'intRate',
    'lastIntDate',
    'intAccrualAmtCcy',
  ];

  constructor() {}
}
