/**
 * KTB Backend for Frontend APIs.
 *
 * Contact: 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
import { AccountDto } from './accountDto';
import { CommitmentDto } from './commitmentDto';


export interface AccountInfo { 
    accounts?: Array<AccountDto>;
    commitmentAccounts?: Array<CommitmentDto>;
    summaryAll?: number;
    totalOutstandingPrincipal?: number;
    totalOutstandingAccruedInterest?: number;
    totalInterestNonBook?: number;
    totalLateChargeAmount?: number;
    summaryDebt?: number;
    totalBadOutstandingPrincipal?: number;
    totalBadOutstandingAccruedInterest?: number;
    totalBadInterestNonBook?: number;
    totalBadLateChargeAmount?: number;
    summaryBadDebt?: number;
}

